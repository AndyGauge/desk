require 'base64'
class Machine < Sequel::Model(Desk::DataSource.cdesk[:kaseyapull].select(:agentguid, :machname, :groupname, :lastloginname, :ostype))
	set_primary_key :agentguid

	def live_connect
		connect = %(
			{
					"homePageUrl": "https://propak.ccmaint.com/liveconnect/",
					"payload": {
							"agentId": "#{self.agentguid}",
							"navId": "dashboard"
					}
			}
		)
		"kaseyaliveconnect://#{Base64.strict_encode64(connect)}"
	end

end
