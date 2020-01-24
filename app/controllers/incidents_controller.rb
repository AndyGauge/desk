class IncidentsController < ApplicationController

  def events
    render json: FetchEventsService.new.by_incident(params[:id])
  end

  private

end
