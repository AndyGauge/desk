module Api
  module V1
    class SynnexSubscriptionController < ApiV1Controller
      include SynnexApi
      def index

      end
      def show
        @subscription = MicrosoftLicense.find(synnex_id: params[:id])
	      render json: @subscription.to_json
      end
      def update
        unless params[:qty] && params[:qty].to_i > 0
          render json: {error: "No Quantity provided"} and return
        end
        @subscription = MicrosoftLicense.find(synnex_id: params[:id])
        description = "before: #{@subscription.to_log}\r\n"
        status = @subscription.adjust_quantity(params[:qty])
        description += "#{(status == true) ? 'Success' : status} \r\n"
        @subscription.query_and_update
        description += "after: #{@subscription.to_log}"
        Cdesk::Log.create(source: 'Synnex API',
                          description: description,
                          userid: User.authenticate_by_jwt(params[:jwt]).employee.id,
                          customerid: @subscription.customer.id)
        render json: {status: status}
      end
    end
  end
end
