module Api
  module V1
    module Kaseya
      class AlertsController < ApiV1Controller
        include KaseyaApi

        def index
          render json: KaseyaAlert.new.process_alerts
        end
        def new
          render json: vsa.alarms.new_alarms.to_json
        end
        def show
          render json:vsa.logs.alarms_by_agent(params[:id]).to_json
        end
        def destroy
          if params[:machine_group] && params[:agent]
            count = KaseyaAlert.new.process_alerts[params[:machine_group]][params[:agent]]
                        .collect { |alert| RemoveKaseyaAlertJob.perform_later alert[:alarm_id]}.count
            render json: {status: "ok", count: count}
          else
            render json: vsa.alarms.close(params[:id]).to_json
          end
        end
        def agent

        end
        def create
          title = "Monitoring: " + JSON.parse(params[:alarm])["Event"]
          machine_group = JSON.parse(params[:alerts]).first['MachineGroup'].split('.').last
          customer = Customer.find(kaseyaname: machine_group)
          incident = Incident.new
          incident['Title']= title
          incident['Opened Date']= Time.now
          incident['Customer']= customer.id
          incident['problem Code']='Monitoring'
          incident['Problem Description']='Agent Monitoring Alarm'
          incident['Status']= 'Active'
          incident['Source']= 'Mobile'
          incident['Assigned To']=Incident::UNASSIGNED
          incident.save
        end
      end
    end
  end
end
