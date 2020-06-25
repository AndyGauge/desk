require 'uri'

class Customer < Sequel::Model(Desk::DataSource.cdesk[:customers].order(Sequel.asc(:company)).select(:id, :company, :"customer number", :entitlement, :"included minutes", :"hourly rate", :billingfrequency, :"last name", :"first name", :"e-mail address", :"job title", :"Business Phone", :"home phone", :"mobile phone", :"fax number", :address, :city, :"state/province", :"zip/postal code", :"country/region", :"web page", :notes, :attachments, :propakhw, :propakmon, :propakpatch, :propaksecure, :propak_esecure, :propakcd, :propakitadv, :mc_asp, :mc_ccm, :skyline, :propakitadvnote, :mas90monthly, :propakversion, :propakav, :propakas, :propakasa, :emailreport, :ccreport, :propakperimeter, :notepop, :kaseyaname, :attachcount, :ereporttype, :propakrestore, :propakcontinue, :backupdevices, :propakam, :propakencrypt, :propak365, :propak365notes, :archive).where(archive: false))
	one_to_many :connections, key: :customerid
	one_to_many :contacts, key: :customerid
	one_to_many :incidents, key: :customer

	def first
		self[:"first name"]
	end
	def last
		self[:"last name"]
	end
	def contact
		"#{first} #{last}"
	end
	def phone
		self[:"business phone"]
	end
	def state
		self[:"state/province"]
	end

	def map_link
		"https://www.google.com/maps/search/?api=1&query=#{URI.escape("#{self[:address]} #{self[:city]}, #{self.state}")}"
	end

	def machines
		Machine.grep(:groupname, "%#{self.kaseyaname.strip}") if self.kaseyaname
	end
end
