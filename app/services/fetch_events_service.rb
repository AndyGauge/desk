class FetchEventsService < FetchFromCdeskService
 def by_incident(incident_id)
	 incident_id = incident_id.to_i # Sanitize the input
 	 c_desk_client = TinyTds::Client.new @@c_desk_sql
	 events = c_desk_client.execute %Q(SELECT [ID]
      ,CONVERT(varchar, [Call Time], 23) AS CallTime
      ,[Action]
      ,[Notes]
      ,[Minutes]
      ,[NoCharge] AS IsNoCharge
      ,[cdTech]
  		FROM [cDesk_SQLData].[dbo].[Calls]
			WHERE CaseNum = #{incident_id}
		  ORDER BY CallTime DESC
)
	 events.each do |event|
		 event
	 end
 end
end