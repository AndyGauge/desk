class HoursSaver
  def initialize(params)
    params["hour"].keys.select { |k| /\A\d+\z/ === k}.each do |id|
      hour = Hour.with_pk!(id)   #raises exception if not found
      hour.set params["hour"][id]
      hour.save_changes
    end
    create_hour(params['hour'])
  end

  private
  def create_hour(hour_hash)
    hour = Hour.new whitelist_hour_params(hour_hash)
    hour.save
  end

  def whitelist_hour_params(hour_hash)
    hour_hash.slice('workorder', 'start', 'end', 'activity', 'status', 'techheader')
  end
end
