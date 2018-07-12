Rails.application.routes.draw do
  resources :scores, only: [:create, :index]
  get 'race/start'
  get 'home/index'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root to: 'home#index'
end
