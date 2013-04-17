Dummy::Application.routes.draw do
  resources :posts


  root :to => 'welcome#index'
  resources :resume
end
