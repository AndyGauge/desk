module Api
  module V1
    module Kaseya
      class AlertsController < ApiV1Controller
        include KaseyaApi

        def show
          render json:Machine.find(agentguid: )
        end
      end
    end
  end
end
