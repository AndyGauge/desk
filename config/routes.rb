Rails.application.routes.draw do
  resources :customers do
    member do
      get :contacts, :connections, :incidents, :sites, :machines
    end
	end
	resources :incidents do
	  member do
	    get :events
	  end
	end
	get '/hours/:tech/dated/:date', to: 'hours#dated', as: 'hours'
	resources :hours do
	  collection do
	    post :action
      get :timetable, :calendar
    end

	end
  resources :connections
  resources :contacts
  resources :workorders
  resources :alerts
	devise_for :users do
		get 'sign_out' => 'devise/sessions#destroy'
  end
  namespace :api, defaults: {format: :json} do
    namespace :v1 do
      resources :synnex
      resources :synnex_subscription
      namespace :kaseya do
        resources :alerts
      end
    end
  end
  mount ActionCable.server => '/cable'

  root 'hours#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
