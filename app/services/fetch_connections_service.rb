class FetchConnectionsService < FetchFromCdeskService
 def by_customer(customer_id)
	 customer_id = customer_id.to_i # Sanitize the input
 	 c_desk_client = TinyTds::Client.new @@c_desk_sql
	 connections = c_desk_client.execute("SELECT [ID], [Device Type] as Type,[Description],[User ID] as UserId,[Password],[Address],[Notes],[Archived] FROM Connections WHERE CustomerID = #{customer_id}")
	 connections.each do |connection|
		 connection["Address"]=add_protocol(connection["Address"])
		 connection
	 end
 end

	private
	def add_protocol(url)
		begin
			u = URI.parse(url)
			rescue
				return url
			end
		if !u.scheme
			return "http://#{url}"
		end
		url
	end
end