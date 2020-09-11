class User < ApplicationRecord
  require 'net/smtp'

  devise :two_factor_authenticatable, :ldap_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :timeoutable

  has_one_time_password(encrypted: true)

  validates :username, presence: true, uniqueness: true

  validates_each :tech do |record, attr, value|
    record.errors.add(attr, 'Must belong to Capture Tech Table') unless Tech[value]
  end

  # use ldap uid as primary key
  before_validation do
    employee = Employee.where("E-Mail Address".to_sym => self.email).first
    tech = Tech.where(:emailAddr => self.email).first
    self.username=email.split('@').first
    self.employee_id = employee.id if employee
    self.tech = tech.tech_code.strip
  end

  def cell
    Tech[tech].alternateaddr || email
  end

  def initials
    #if cap_user= Desk::DataSource.capture[:users].where(userid: 'agauger').first
    #  return cap_user[:initials].strip
    #end
    username[0..1]
  end

  def authenticatable_salt
    Digest::SHA1.hexdigest(email)[0,29]
  end

  def employee
    Employee[employee_id]
  end

  def timeout_in
    30.days
  end

  def need_two_factor_authentication?(request)

    employee_id
  end

  def send_two_factor_authentication_code(code)

    message = <<EOM
From: The Desk <centraldesk@ccmaint.com>
To: #{name} <#{cell}>
Subject: Central Desk Two Factor Code

#{code} is your two-factor authentication code for The Desk.
EOM
    if cell != email
      message = <<EOM
From: The Desk <centraldesk@ccmaint.com>
To: #{name} <#{cell}>

#{code} is your two-factor authentication code for The Desk.
EOM

    end
    Net::SMTP.start(ENV['SMTP_SERVER'], 25, 'desk.ccmaint.com' ) do |mail_server|
      mail_server.send_message message, 'centraldesk@ccmaint.com', cell
    end
  end

  def name
    "User"
  end

end
