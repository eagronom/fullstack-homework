Rails.application.routes.draw do
  resources :fields, only: [:index]
  resources :crops, only: [:index]
  get 'humus-balance', to: 'humus_balance#index', as: :humus_balance
end
