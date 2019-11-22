
require 'net/ldap'
require 'devise/strategies/authenticatable'

module Devise
	module Strategies
		class LdapAuthenticatable < Authenticatable
			def authenticate!
				if params[:user]
					ldap = Net::LDAP.new
					ldap.host = ENV.fetch('CCMLDAPSERVER')
					ldap.port = 389
					ldap.auth ENV.fetch('CCMLDAPUSER'), ENV.fetch('CCMLDAPPASSWORD')

					if ldap.bind
						user = User.find_or_create_by(email: email)
						success!(user)
					else
						return fail(:invalid_login)
					end
				end
			end

			def email
				params[:user][:email]
			end

			def password
				params[:user][:password]
			end

		end
	end
end

Warden::Strategies.add(:ldap_authenticatable, Devise::Strategies::LdapAuthenticatable)