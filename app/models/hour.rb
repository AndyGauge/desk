class Hour < Sequel::Model(:hoursdetail)
	set_primary_key :detailid
	many_to_one :tech_date, key: :techheader
end
