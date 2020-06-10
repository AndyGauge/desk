class Customer < Sequel::Model(Desk::DataSource.cdesk[:customers].order(Sequel.asc(:company)).select(:id, :company, :"customer number", :entitlement, :"included minutes", :"hourly rate", :billingfrequency, :"last name", :"first name", :"e-mail address", :"job title", :"business phone", :"home phone", :"mobile phone", :"fax number", :address, :city, :"state/province", :"zip/postal code", :"country/region", :"web page", :notes, :attachments, :propakhw, :propakmon, :propakpatch, :propaksecure, :propak_esecure, :propakcd, :propakitadv, :mc_asp, :mc_ccm, :skyline, :propakitadvnote, :mas90monthly, :propakversion, :propakav, :propakas, :propakasa, :emailreport, :ccreport, :propakperimeter, :notepop, :kaseyaname, :attachcount, :ereporttype, :propakrestore, :propakcontinue, :backupdevices, :propakam, :propakencrypt, :propak365, :propak365notes, :archive))
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
		self[:"Business Phone"]
	end
	def state
		self[:"State/Province"]
	end
end
