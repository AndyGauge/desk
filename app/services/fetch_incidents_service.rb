class FetchIncidentsService < FetchFromCdeskService
 def by_customer(customer_id, limit=50)
	 customer_id = customer_id.to_i # Sanitize the input
 	 c_desk_client = TinyTds::Client.new @@c_desk_sql
	 incidents = c_desk_client.execute %Q(SELECT TOP (#{limit}) Incidents.[Id]
      ,[Title]
	    ,CONCAT([Employees].[First Name], ' ', [Employees].[Last Name]) AS Tech
      ,CONVERT(varchar,[Opened Date],23) AS OpenedDate
			,(select sum(c.minutes) from (Select minutes from Calls where casenum=incidents.id) c) AS Total
      ,[Contact]
      ,[Problem Description] AS Problem
			,[problem Code] AS pcode
      ,[Solution Description] AS Solution
			,[solution Code] as scode
      ,[Status]
      ,[Source]
      ,[Priority]
      ,[Description]
      ,[Internal Comments] AS Internal
      ,CONVERT(varchar,[Resolved Date],23) AS ClosedDate
      ,[No Charge] AS IsNoCharge
      ,[WO Number] AS WONumber
  		FROM [cDesk_SQLData].[dbo].[Incidents]
  		JOIN [dbo].Employees ON [Assigned To] = Employees.ID
			WHERE Incidents.Customer = #{customer_id} AND Source <> 'Recurring'
		  ORDER BY Incidents.[Opened Date] DESC
)
	 incidents.each do |incident|
		 incident
	 end
 end
end