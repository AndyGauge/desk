class QueryLdapProperties
  require 'net/ldap'

  @@ldap = Net::LDAP.new ({host:  ENV.fetch('CCMLDAPSERVER'),
      port: 389,
      auth: {
          method: :simple,
          username: ENV.fetch('CCMLDAPUSERNAME'),
          password: ENV.fetch('CCMLDAPPASSWORD')
      },
    })

  def initialize(user)
    @user = user
    @user_filter = Net::LDAP::Filter.eq("sAMAccountName", @user)
  end

  def tech
    @@ldap.search(filter: @user_filter, base: ENV.fetch('CCMLDAPBASE'), attributes: ['Description']).first[:description][0] rescue nil
  end


end
