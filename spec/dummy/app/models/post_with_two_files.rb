class PostWithTwoFiles < ActiveRecord::Base
  has_uploadcare_file :file_1
  has_uploadcare_file :file_2
end
