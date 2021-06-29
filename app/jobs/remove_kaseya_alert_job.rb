require 'sidekiq-scheduler'

class RemoveKaseyaAlertJob < ApplicationJob
  queue_as :default
  include KaseyaApi

  def perform(*args)
    args.each do |alert_id|
      vsa.alarms.close(alert_id)
    end

  end
end
