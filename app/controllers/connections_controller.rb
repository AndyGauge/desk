class ConnectionsController < ApplicationController

  def update
    connection = Connection[params[:id]]
    connection.set_from_params params[:connection]
    connection.save_changes
  end

end
