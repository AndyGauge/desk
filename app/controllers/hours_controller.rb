class HoursController < ApplicationController

  before_action :set_tech

  def index

  end

  def create
    HoursSaver.new(params, current_user.initials)
    render 'index'
  end
  def update
    hour_start = params[:start] ? Time.new(1899,12,30,*params[:start].split(':')) : nil
    if params[:end] && params[:start]
      hour_end = Time.new(1899,12,30,*params[:end].split(':'))
      hours = (hour_end - hour_start) / 3600.0
    else
      hour_end = nil
      hours = nil
    end
    hour = Hour[params[:id]]
    hour.update(workorder: params[:workorder],
                             start: hour_start,
                             end: hour_end,
                             activity: params[:activity],
                             status: params[:status],
                             notes: params[:notes],
                             hours: hours,
                timestamp: "#{hour.timestamp.split('m:')[0]}m:#{@tech[1..2].downcase} #{Time.new.strftime("%H:%M")}")

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
