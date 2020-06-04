Rails.application.routes.draw do
  # get 'react_homepage/index'
  # resources :articles
  # root 'pages#hello'
  # get 'pages/about'
  # get 'pages/video'

  root 'pages#index'
  # Delegate all other routes to frontend router
  match '*path', to: 'pages#index', via: :all

end
