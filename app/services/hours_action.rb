class HoursAction

  def initialize(action, workorder, tech)
    @action = action
    @workorder = workorder
    #@tech = tech
    @header = TechDate.lookup(tech)
    @last_hour = @header.hours.last
    now = Time.now
    @now = Time.new(1899,12,30,now.hour, now.min)
    @initials = tech[1..2].downcase
  end

  def save
    case @action
    when 'Start Depot'
      new_hour(activity: 'Depot')
      end_last
    when 'Complete'
      end_last
    when 'Returning'
      end_last(status: "Returning")
    when 'Travel to site'
      new_hour(activity: 'Travel', status: 'On Way')
    when 'At Shop'
      end_last(status: 'To Shop', update_status: true)
    when 'On Site'
      new_hour(activity: 'On-site')
      end_last(update_status: true)
    when 'Back On Site'
      new_hour(activity: 'On-site')
    when 'Remain On Site'
      new_hour(activity: 'On-site')
      end_last
    when 'Travel to Shop'
      new_hour(activity: 'Travel', status: 'To Shop')
      end_last
    when 'Travel to Shop Returning'
      new_hour(activity: 'Travel', status: 'To Shop')
      end_last(status: 'Returning')
    when 'Lunch'
      end_last(status: "Returning", notes: "Lunch")
    end
  end

  private

  def new_hour(status: '', activity: '')
    hour = Hour.new({
                techheader: @header.id,
                workorder: @workorder,
                start: @now,
                status: status,
                activity: activity,
                timestamp: timestamp,
                mobile: true,
                hours: nil
             }).save

  end

  def end_last(status: "Complete", notes: '', update_status: false)
    if @last_hour && (@last_hour.status == '' || update_status)
       @last_hour.update({end: @now, status: status, hours: (@now - @last_hour.start) / 3600.0, notes: notes})
    end
  end

  def timestamp(stamp = "c:#{@initials} - #{Time.new.strftime("%H:%M")} ")
    "#{stamp.split('m:')[0]}m:#{@initials} #{Time.new.strftime("%H:%M")}"
  end

end
