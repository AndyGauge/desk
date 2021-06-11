module SynnexApi
  extend ActiveSupport::Concern

  def msp
    @msp ||= Synnex::Msp.new(user_name: ENV.fetch("SYNNEX_USER_NAME"), password: ENV.fetch("SYNNEX_PASSWORD"), reseller: ENV.fetch("SYNNEX_RESELLER"), endpoint: "production")
  end
end