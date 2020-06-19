class Call < Sequel::Model(Desk::DataSource.cdesk[:calls].select(:id, :action, :notes, :casenum, :minutes, :cdTech, :"Call Time"))
	set_primary_key :id
	many_to_one :incident, key: :casenum

	def set_from_params(params)
		params.each do |attribute, value|
			self[attribute.to_sym] = value
		end
	end

end
