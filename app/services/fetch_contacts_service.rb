class FetchContactsService < FetchFromCdeskService
 def by_customer(customer_id)
	 customer_id = customer_id.to_i # Sanitize the input
 	 c_desk_client = TinyTds::Client.new @@c_desk_sql
	 contacts = c_desk_client.execute("SELECT Id, ContactName, [Office Phone] as OfficePhone, [Office Extension] as OfficeExtension, [Cell Phone] as CellPhone, [e-mail] as EMail FROM CONTACTS WHERE CustomerID = #{customer_id}")
	 contacts.each do |contact|
		 contact
	 end
 end
end