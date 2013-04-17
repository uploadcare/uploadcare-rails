Uploadcare::Rails::Engine.configure do
  config.uploadcare.upload_url_base = 'https://upload.uploadcare.com'
  config.uploadcare.api_url_base = 'https://api.uploadcare.com'
  config.uploadcare.static_url_base = 'https://ucarecdn.com'
  config.uploadcare.public_key = 'demopublickey'
  config.uploadcare.private_key = 'demoprivatekey'
end
