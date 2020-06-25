class IncidentsController < ApplicationController
  before_action :whitelisted
  before_action :cdesk_authorized

  def events
    render json: Incident[params[:id]].calls
  end

  def create
    incident = Incident.new
    incident.set_from_params params[:incident]
    incident.newlyassigned = true
    incident.save_changes
    call = Call.new(incident: incident)
    call.set_from_params params[:call]
    call["Call Time"] = Time.now
    call[:cdTech] = current_user.tech
    call.save_changes
    render json: incident
  end

  private

end
