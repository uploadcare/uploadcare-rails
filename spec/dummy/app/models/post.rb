class Post < ActiveRecord::Base
  attr_accessible :content, :title, :file
  is_uploadcare_file :file
end
