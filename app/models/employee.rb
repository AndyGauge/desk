class Employee < Sequel::Model(Desk::DataSource.cdesk[:employees].select(:id, "E-mail Address".to_sym, "Country/Region".to_sym, :techid ))
	set_primary_key :id

end
