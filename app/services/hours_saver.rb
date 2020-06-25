class HoursSaver

  def initialize(params, initials)
    @initials = initials || 'on'
    params["hour"].keys.select { |k| /\A\d+\z/ === k}.each do |id| # 'hour' => ['123' => {...attributes}]
      hour = Hour.with_pk!(id)   #raises exception if not found
      hour.set params["hour"][id]
      save hour
    end
    create_hour(params['hour'])
  end

  private
  def create_hour(hour_hash)
    return true if hour_hash[:workorder].nil? # Don't create an hour record when we are only updating another record
    hour = Hour.new whitelist_hour_params(hour_hash)
    save hour
  end

  def whitelist_hour_params(hour_hash)
    hour_hash.slice('workorder', 'start', 'end', 'activity', 'status', 'techheader', 'notes')
  end

  def save(hour)
    hour.mobile = true
    hour.start = Time.parse("1899-12-30 #{hour.start.strftime("%H:%M")}") if hour.start
    hour.end   = Time.parse("1899-12-30 #{hour.end.strftime("%H:%M")}") if hour.end
    if hour.start && hour.end && hour.end > hour.start
      hour.hours = (hour.end - hour.start) / 3600.0
    else
      hour.hours = nil
    end
    hour.timestamp ||= "c:#{@initials} - #{Time.new.strftime("%H:%M")} "
    hour.timestamp = "#{hour.timestamp.split('m:')[0]}m:#{@initials} #{Time.new.strftime("%H:%M")}"
    hour.save_changes
  end

end
