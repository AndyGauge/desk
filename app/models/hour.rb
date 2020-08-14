class Hour < Sequel::Model(:hoursdetail)
	set_primary_key :detailid
	many_to_one :tech_date, key: :techheader

	plugin :validation_helpers
	def validate
		super
		validates_presence :workorder
		validates_presence :techheader
	end
	def workorder_detail
		Workorder.where(workorder: workorder).first
	end

end
