module Cdesk
	class Log < Sequel::Model(Desk::DataSource.cdesk[:transactionlog])
		set_primary_key :auditid

	end
end

