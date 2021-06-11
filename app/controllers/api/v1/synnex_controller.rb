module Api
  module V1
    class SynnexController < ApiV1Controller
      include SynnexApi
      def index
        customers= msp.customers.each do |synnex_customer|
          customer = Customer.find_by_synnex_number(synnex_customer.snx_eu_no)
          synnex_customer.subscriptions.each do |subscription|
            ms_subscription = MicrosoftLicense.find_or_create(synnex_id: subscription.id)
            ms_subscription.update(
                service_name: subscription.service_name,
                sku:          subscription.snx_sku_no,
                quantity:     subscription.quantity,
                status:       subscription.status,
                price:        subscription.price,
                msrp:         subscription.msrp,
                customer_id:  customer.id
                                )
          end
        end
        render json: {status: 'OK'}.to_json
      end
      def show
        @customer = Customer.find(id: params[:id])
	      render json: msp.find_customer(@customer.synnex_number).users.to_json
      end

    end
  end
end
