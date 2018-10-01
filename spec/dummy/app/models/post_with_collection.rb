class PostWithCollection < ActiveRecord::Base
  has_uploadcare_group :file
  has_uploadcare_group :other_file
end
