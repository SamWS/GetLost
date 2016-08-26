Rails.application.routes.draw do
  resources :users
  resources :usersevents
  resources :events
  resources :hobbies

  root :to => 'events#index'

  get 'welcome/index', to: 'welcome#index'

  get "api/events", to: "api/events#list_within"

  get "api/hobbies", to: "api/hobbies#list_hobbies"

  get "/api/events/recent", to: "api/events#list_recent"

  post '/api/usersevents', to: 'api/usersevents#create'

  namespace :api do
    resources :usersevents
  end

    # getting the login form
  get '/login', to: 'session#new'
  # creating a session / logging in
  post '/session', to: 'session#create'
  # destroying a session / logging out
  delete '/session', to: 'session#destroy'


end
