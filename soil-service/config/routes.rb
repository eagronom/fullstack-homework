Rails.application.routes.draw do
  resources :fields, only: [:index]
  resource :field, only: [:show] do
    post 'humus_balance'
  end
  resources :crops, only: [:index]
end
