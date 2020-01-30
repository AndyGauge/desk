class HoursController < ApplicationController

  def index
    @tech = current_user.tech
  end
  def dated
    render json: cleanup_binary_data(TechDate.lookup(params[:tech], Date.parse(params[:date])).hours)
  end

  private

end
