json.extract! customer, :id, :company, :contact, :phone, :address, :city, :state, :cdeskid, :created_at, :updated_at
json.url customer_url(customer, format: :json)
