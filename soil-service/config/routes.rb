Rails.application.routes.draw do
  resources :fields, only: [:index] do
    post :humus_balance, on: :collection
  end

  resources :crops, only: [:index]
end
