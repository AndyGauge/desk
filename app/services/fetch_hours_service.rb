class FetchHoursService < FetchFromCdeskService
	def initialize(tech_id)
		@tech_id = tech_id
	end
 def by_date(date)
	 return nil unless @tech_id
 	 c_desk_client = TinyTds::Client.new @@c_desk_sql
	 hours = c_desk_client.execute %Q(SELECT TOP (1000) [DetailID] AS Id
      ,[Tech Header].TechID AS TechId
	    ,CONVERT(varchar, [Tech Header].WorkDate, 23) AS WorkDate
      ,[WorkOrder]
      ,CONVERT(varchar, [Start], 24) AS StartTime
      ,CONVERT(varchar, [End], 24) AS EndTime
      ,[Hours]
      ,[Activity]
      ,[Status]
      ,[Notes]
  FROM [Capture-SQL].[dbo].[HoursDetail]
  JOIN [Capture-SQL].[dbo].[Tech Header] ON HoursDetail.TechHeader = [Tech Header].id
  WHERE [Tech Header].TechID = '#{@tech_id}' AND [Tech Header].WorkDate = '#{date}'
)
	 hours.each do |hour|
		 hour
	 end
 end
end