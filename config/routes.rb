Rails.application.routes.draw do
  resources :customers do
    member do
      get :contacts, :connections, :incidents
    end
	end
	resources :incidents do
	  member do
	    get :events
	  end
	end
	get '/hours/:tech/dated/:date', to: 'hours#dated', as: 'hours'
	resources :hours
  resources :connections
	devise_for :users
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
