require 'sidekiq-scheduler'

class BroadcastAlertsJob < ApplicationJob
  queue_as :default
  include KaseyaApi

  def perform(*args)
    ActionCable.server.broadcast 'alerts_channel', message: {kaseya_alerts: KaseyaAlert.new.process_alerts}
  end
end
