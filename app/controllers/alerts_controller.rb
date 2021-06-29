class AlertsController < ApplicationController

  def index
    @jwt = current_user.employee.jwt
  end
end
