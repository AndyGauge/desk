class Connection < Sequel::Model(Desk::DataSource.cdesk[:connections].select(:id, :customerid, :"device type", :description, :"user id", :password, :address, :notes, :archived))
	set_primary_key :id
	many_to_one :customer, key: :customerid

	plugin :validation_helpers
	def validate
		super
		validates_presence :customerid
	end

end
