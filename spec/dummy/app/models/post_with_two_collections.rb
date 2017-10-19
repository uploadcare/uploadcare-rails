class PostWithTwoCollections < ActiveRecord::Base
  has_uploadcare_group :group_1
  has_uploadcare_group :group_2
end
