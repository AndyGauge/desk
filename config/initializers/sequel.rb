require 'logger'

module Desk
	class DataSource
		class << self
			def capture
				@@capture
			end
			def cdesk
				@@cdesk
			end

			def connect_sequel
				@@capture ||= Sequel.connect({adapter: 'tinytds',
																		host: ENV.fetch('CDESKSQL'),
																	 	port: 1433,
																	 	database: ENV.fetch('CAPTUREDB'),
																	 	user: ENV.fetch('CDESKUSERNAME'),
																	 	password: ENV.fetch('CDESKPASSWORD'),
																	 	loggers: [Logger.new($stdout)]})
				@@cdesk ||=   Sequel.connect({adapter: 'tinytds',
																		host: ENV.fetch('CDESKSQL'),
																	 	port: 1433,
																		database: ENV.fetch('CDESKDB'),
																		user: ENV.fetch('CDESKUSERNAME'),
																		password: ENV.fetch('CDESKPASSWORD'),
																		loggers: [Logger.new($stdout)]})
				self
			end
		end
	end
end
Desk::DataSource.connect_sequel