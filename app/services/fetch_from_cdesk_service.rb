class FetchFromCdeskService
	require 'tiny_tds'

	@@c_desk_sql = {
			:adapter  => 'tinytds',
			:host     => ENV.fetch("CDESKSQL"),
			:database => ENV.fetch('CDESKDB'),
			:username => ENV.fetch("CDESKUSERNAME"),
			:password => ENV.fetch("CDESKPASSWORD")
	}
end