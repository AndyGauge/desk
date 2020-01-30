require 'logger'

DB = Sequel.connect(adapter: 'tinytds',
										host: ENV.fetch('CDESKSQL'),
										database: ENV.fetch('CAPTUREDB'),
										user: ENV.fetch('CDESKUSERNAME'),
										password: ENV.fetch('CDESKPASSWORD'),
										loggers: [Logger.new($stdout)])
