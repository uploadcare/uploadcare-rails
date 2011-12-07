namespace :uploadcare do
  desc "Generate configuration template to config/uploadcare.yml"
  task :configuration => :environment do
    UploadCare::Rails.install unless UploadCare::Rails.installed?
  end
end