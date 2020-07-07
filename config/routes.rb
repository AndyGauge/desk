Rails.application.routes.draw do
  resources :customers do
    member do
      get :contacts, :connections, :incidents, :sites
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
	  end
	end
  resources :connections
  resources :contacts
	devise_for :users do
		get 'sign_out' => 'devise/sessions#destroy'
	end
  root 'hours#index'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
