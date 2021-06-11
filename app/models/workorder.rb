class Workorder < Sequel::Model(:workorders)
	set_primary_key :id


	dataset_module do
		def all_open
			where(state: 'open')
		end

	  def for_tech(tech_id)
			where(tech: ['', tech_id]).
			order(Sequel.desc(:tech), Sequel.desc(:workorder))
		end
	end
end
