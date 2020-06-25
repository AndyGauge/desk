class Employee < Sequel::Model(Desk::DataSource.cdesk[:employees].select(:id, "E-mail Address".to_sym, "Country/Region".to_sym, :techid, Sequel.join(["First Name".to_sym, ' ', "Last Name".to_sym]).as(:name)).where(allowlogin: true))
	set_primary_key :id

end
