class Hour < Sequel::Model(Desk::DataSource.capture[:hoursdetail])
	set_primary_key :detailid
	many_to_one :tech_date, key: :techheader
	dataset_module do
	  def tech_authorized_scope
			exclude(:activity => ['Sick', 'Vacation'])
		end
	end

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
