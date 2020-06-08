class ConnectionsController < ApplicationController

  def update
    connection = Connection[params[:id]]
    connection.set_from_params params[:connection]
    connection.save_changes
    render json: connection
  end

  def create
    connection = Connection.new
    connection.set_from_params params[:connection]
    connection.save_changes
    render json: connection
  end

end
