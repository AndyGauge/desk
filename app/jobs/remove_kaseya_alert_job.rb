require 'sidekiq-scheduler'

class RemoveKaseyaAlertJob < ApplicationJob
  queue_as :default
  include KaseyaApi

  def perform(*args)
    args.each do |alert_id|
      KaseyaAlert.remove(alert_id)
    end

  end
end
