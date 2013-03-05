[![Build Status](https://secure.travis-ci.org/uploadcare/uploadcare-rails.png)](http://travis-ci.org/uploadcare/uploadcare-rails)

# Installation

This is a Rails gem for using the [Uploadcare.com](https://uploadcare.com) service. To install it, add it in your Gemfile: `gem 'uploadcare-rails'`, then run:

    bundle install

# Usage

This gem provides ability to attach Uploadcare files to your models. To do that, you need a string field in your model, which is going to hold an Uploadcare file's UUID.

The first thing is to configure stuff for Uploadcare. Create a file `config/initializers/uploadcare.rb`:

```ruby
Uploadcare::Rails::Engine.configure do
  config.uploadcare.public_key = 'demopublickey'
  config.uploadcare.private_key = 'demoprivatekey'
end
```

(These are our *demo* keys. You can use them to try things out. Don't forget to change them to your own keys before building anything serious). 

Add such an attribute to your model. First, create and run a migration:

    rails generate migration AddFileToPost file:string
    rake db:migrate

Edit your model to indicate that this field is used for Uploadcare files:

```ruby
class Post < ActiveRecord::Base
  attr_accessible :content, :name, :title, :file  # don't forget to make this attribute accessible
  is_uploadcare_file :file                        # this is the line you want to add
end
```

To display nice widgets for file upload, include the script for desired widget version (here we use 0.6.4.2) in your layout.

```erb
<%= uploadcare_include_tag '0.6.4.2' %>
```

Now we can use the Uploadcare widget in our forms:

```erb
<%= f.uploadcare_uploader_field :file %>
    
# or, if you use `simple_form`
<%= form.input :file, as: :uploadcare_uploader %>
```

Uploadcare-rails gem takes care of storing files when saving a model, so as soon as you add a field to your form, everything should work, and you'll be able to show an image just like that:

```erb
<%= image_tag @post.file.public_url("scale_crop/500x200", "effect/grayscale/") %>
```
