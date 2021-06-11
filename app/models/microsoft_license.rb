class MicrosoftLicense < Sequel::Model(Desk::DataSource.cdesk[:microsoft_licenses].select(:id, :synnex_id, :service_name, :sku, :quantity, :status, :price, :msrp, :customer_id, :id))
	include SynnexApi
  set_primary_key :id
  one_to_many :customer, key: :customer_id

  def adjust_quantity(qty)
    msp.find_subscription(synnex_id).change_quantity(qty.to_i)
  end

  def query_and_update
    subscription = msp.find_subscription(synnex_id)
    update(
        service_name: subscription.service_name,
        sku:          subscription.snx_sku_no,
        quantity:     subscription.quantity,
        status:       subscription.status,
        price:        subscription.price,
        msrp:         subscription.msrp
    )
  end
end
