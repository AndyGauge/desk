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
        status = @subscription.adjust_quantity(params[:qty])
        @subscription.query_and_update
        render json: {status: status}
      end
    end
  end
end
