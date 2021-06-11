class Incident < Sequel::Model(Desk::DataSource.cdesk[:incidents].select(:id, :customer, :title, "Assigned To".to_sym, "problem Code".to_sym, "Problem Description".to_sym, "solution code".to_sym, "Solution Description".to_sym, :status, 'Opened Date'.to_sym, :newlyassigned))
	set_primary_key :id
  one_to_many :calls, key: :casenum

	plugin :validation_helpers
	# The Unassigned tech
	UNASSIGNED = 41


	def set_from_params(params)
		['Title', 'Customer', 'Contact', 'problem Code', 'Problem Description', 'solution code', 'Solution Description', 'Status', 'Opened Date'].each do |attribute|
			self[attribute.to_sym] = params[attribute] if params[attribute]
		end
		self['Source'] = 'Mobile'
		if params['Assigned To'].to_i > 0
			self['Assigned To'] = params['Assigned To']
		else
			self['Assigned To'] = Incident::UNASSIGNED
		end
	end

end
