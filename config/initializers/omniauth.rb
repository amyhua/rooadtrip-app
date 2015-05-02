Rails.application.config.middleware.use OmniAuth::Builder do
  if !Rails.env.production?
    CLIENT_ID = 'F7yoyoOJh8Zo7IExarIyw'
    CLIENT_SECRET = 'wyCRVKII33SO7HQKz6kYUJQZ21zgtHpeJXwrziuKk'
  end
  provider :yammer, CLIENT_ID, CLIENT_SECRET
end