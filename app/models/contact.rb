class Contact < Sequel::Model(Desk::DataSource.cdesk[:contacts].select(:id, :customerid, "ContactName".to_sym, "Office Phone".to_sym, "Office Extension".to_sym, "Cell Phone".to_sym, "e-mail".to_sym))
	set_primary_key :id
	many_to_one :customer, key: :customerid

	plugin :validation_helpers
	def validate
		super
		validates_presence :customerid
	end

	def set_from_params(params)
		['ContactName', 'Office Phone', 'Office Extension', 'Cell Phone', 'e-mail', 'customerid'].each do |attribute|
			self[attribute.to_sym] = params[attribute] if params[attribute]
		end
	end

end
