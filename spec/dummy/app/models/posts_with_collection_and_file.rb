class PostsWithCollectionAndFile < ActiveRecord::Base
  has_uploadcare_file :file
  has_uploadcare_group :group
end
