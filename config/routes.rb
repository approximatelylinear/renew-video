Rails.application.routes.draw do
  resources :articles
  root 'pages#hello'

  get 'pages/about'

  get 'pages/video'
end
