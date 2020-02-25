class Hour < Sequel::Model(:hoursdetail)
	set_primary_key :detailid
	many_to_one :tech_date, key: :techheader

	plugin :validation_helpers
	def validate
		super
		validates_presence :workorder
	end

	def before_save
		if self.start && self.end && self.end > self.start
			self.hours = (self.end - self.start) / 3600.0
		else
			self.hours = nil
		end
		self.start = Time.parse("1899-12-30 #{self.start.strftime("%H:%M")}") if self.start
		self.end   = Time.parse("1899-12-30 #{self.end.strftime("%H:%M")}") if self.end
		update_timestamp
		super
	end

	def update_timestamp
		self.timestamp = "c:on - #{Time.new.strftime("%H:%M")} " unless self.timestamp
		self.timestamp = "#{self.timestamp.split('m:')[0]} m:on #{Time.new.strftime("%H:%M")}"
	end
end
