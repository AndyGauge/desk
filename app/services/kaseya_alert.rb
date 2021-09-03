class KaseyaAlert
  OPEN_ALERTS = 'MonitorAlarmStateId eq 1M'
  include KaseyaApi


  def initialize
    begin
      @alerts = vsa.alarms.all(filter: OPEN_ALERTS)
    rescue Exception => e
      @alerts = []
      @error = e
    end
  end

  def process_alerts
    if @error
      { error: @error }
    else
      agent_alerts.each do |machine_group, agents|
        agents.each do |agent_name, alerts|
          process(alerts)
        end
      end
    end

  end

  private
  def agent_alerts
    @agents ||= @alerts.each.with_object({}) do |result, hash|
      hash[result["MachineGroup"]] ||= {}
      hash[result["MachineGroup"]][result["agentName"]] ||= []
      hash[result["MachineGroup"]][result["agentName"]] << { alarm_id: result["AlarmId"], subject: result["AlarmSubject"], agent: result["AgentId"] }
    end
  end
  def process(alerts)

    # When the agent goes online, auto-close all offline and online alerts in background
    if alerts.any?{ |alert| alert[:subject].match /is online/ }
      alerts
          .select{ |alert| alert[:subject].match /is (on|off)line/ }
          .collect{ |alert| RemoveKaseyaAlertJob.perform_later alert[:alarm_id] }
    end

    # Close duplicate alarms
    counter_alerts = alerts.select{ |alert| alert[:subject].match /Monitoring generated (Counter|SNMP) ALARM/ }
    counter_alerts.pop
    counter_alerts.collect{ |alert| RemoveKaseyaAlertJob.perform_later alert[:alarm_id] }

  end
end