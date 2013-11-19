class Post < ActiveRecord::Base
  has_uploadcare_file :file
end
