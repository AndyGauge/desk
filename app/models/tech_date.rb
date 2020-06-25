class TechDate < Sequel::Model("Tech Header".to_sym)
	set_primary_key :id
	one_to_many :hours, key: :techheader, order: :start

	def self.lookup(tech, date=Date.today)
		self.where( techid: tech, workdate: date...date+1 ).first \
		    ||  self.create( techid: tech, workdate: date )
	end
end
