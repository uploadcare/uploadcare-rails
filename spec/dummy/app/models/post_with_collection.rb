class PostWithCollection < ActiveRecord::Base
  has_uploadcare_group :group
end
