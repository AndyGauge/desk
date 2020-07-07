class Site < Sequel::Model(Desk::DataSource.cdesk[:sites].select(:sitekey, :cust_id, :primarysite, :sitename, :siteaddr1, :siteaddr2, :sitecity, :sitestate, :sitezip, :sitephone, :sitefax, :sitenotes))

	set_primary_key :sitekey
	many_to_one :customer, key: :cust_id

	def map_link
		"https://www.google.com/maps/search/?api=1&query=#{URI.escape("#{self[:siteaddr1]} #{self[:sitecity]}, #{self.sitestate}")}"
	end
end
