Rails.application.routes.draw do
  resources :fields, only: %i[index update]
  resources :crops, only: [:index]
end
