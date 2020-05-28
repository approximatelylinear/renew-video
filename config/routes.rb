Rails.application.routes.draw do
  get 'react_homepage/index'
  resources :articles
  root 'pages#hello'

  get 'pages/about'

  get 'pages/video'
end
