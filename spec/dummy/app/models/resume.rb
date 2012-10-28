class Resume < ActiveRecord::Base
  attr_accessible :attachment, :description, :name
  is_uploadcare_file :attachment
end
