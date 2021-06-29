module Api
  module V1
    module Kaseya
      class MachinesController < ApiV1Controller
        include KaseyaApi

        def show
          render json: Machine.find(agentguid: params[:id])
        end
      end
    end
  end
end
