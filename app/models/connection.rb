class Connection < Sequel::Model(Desk::DataSource.cdesk[:connections].select(:id, :customerid, :"device type", :description, :"user id", :password, :address, :notes, :archived))
	set_primary_key :id
	many_to_one :customer, key: :customerid

	plugin :validation_helpers
	def validate
		super
		validates_presence :customerid
	end

	def set_from_params(params)
		self['Device Type'] = params['Device Type'] if params['Device Type']
		self[:description] = params[:description] if params[:description]
		self['user id'] = params['user id'] if params['user id']
		self[:password] = params[:password] if params[:password]
		self[:address] = params[:address] if params[:address]
		self[:notes] = params[:notes] if params[:notes]
	end

end
