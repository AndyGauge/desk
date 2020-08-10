class WorkordersController < ApplicationController

  def index
    render json: Workorder.all_open.for_tech(current_user.tech)
  end

  private

end
