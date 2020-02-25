class User < ApplicationRecord
  require 'net/smtp'

  devise :two_factor_authenticatable, :ldap_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  has_one_time_password(encrypted: true)

  validates :username, presence: true, uniqueness: true

  # use ldap uid as primary key
  before_validation do
    self.username = email.split('@').first
    self.tech = QueryLdapProperties.new(username).tech
  end

  def authenticatable_salt
    Digest::SHA1.hexdigest(email)[0,29]
  end

  def need_two_factor_authentication?(request)
    true || false
    # TODO: only enforce technicians
  end

  def send_two_factor_authentication_code(code)
    message = <<EOM
From: The Desk <centraldesk@ccmaint.com>
To: #{name} <#{email}>
Subject: Central Desk Two Factor Code

#{code} is your two-factor authentication code for The Desk.
EOM
    Net::SMTP.start(ENV['SMTP_SERVER'], 25) do |mail_server|
      mail_server.send_message message, 'centraldesk@ccmaint.com', email
    end
  end

  def name
    "User"
  end

end
