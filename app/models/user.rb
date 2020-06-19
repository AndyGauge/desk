class User < ApplicationRecord
  require 'net/smtp'

  devise :two_factor_authenticatable, :ldap_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :timeoutable

  has_one_time_password(encrypted: true)

  validates :username, presence: true, uniqueness: true

  validates_each :employee_id do |record, attr, value|
    record.errors.add(attr, 'Must belong to Central Desk Employee Table') unless Employee[value]
  end

  # use ldap uid as primary key
  before_validation do
    employee = Employee.where("E-Mail Address".to_sym => self.email).first
    self.username=email.split('@').first
    self.employee_id = employee.id
    self.tech = employee.techid.strip
  end

  def cell
    employee["country/region".to_sym]
  end

  def authenticatable_salt
    Digest::SHA1.hexdigest(email)[0,29]
  end

  def employee
    Employee[employee_id]
  end

  def timeout_in
    30.minutes
  end

  def need_two_factor_authentication?(request)
    true || false
    # TODO: only enforce CDESK users
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
