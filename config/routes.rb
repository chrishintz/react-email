Rails.application.routes.draw do
  get   "/emails", to: "emails#index"
  post  "/emails", to: "emails#create"
end
