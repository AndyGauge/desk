class HoursController < ApplicationController

  before_action :set_tech

  def index

  end

  def create
    HoursSaver.new(params, current_user.initials)
    render 'index'
  end
  def update
    render 'index'
  end
  def action
    HoursAction.new(params[:act], params[:workorder], current_user.tech).save
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
