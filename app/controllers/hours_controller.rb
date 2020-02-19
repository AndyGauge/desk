class HoursController < ApplicationController

  before_action :set_tech

  def index

  end

  def create
    #HoursSaver.new(params)
    render 'index'
  end
  def update
    render 'index'
  end
  def dated
    techdate = TechDate.lookup(params[:tech], Date.parse(params[:date]))
    render json: { hours: cleanup_binary_data(techdate.hours), techheader: techdate.id }
  end

  private
  def set_tech
    @tech = current_user.tech
  end

end