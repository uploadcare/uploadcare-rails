class Post < ActiveRecord::Base
  has_uploadcare_file :file
  has_uploadcare_file :other_file
end
