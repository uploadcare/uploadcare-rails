[![Build Status](https://secure.travis-ci.org/uploadcare/uploadcare-rails.png)](http://travis-ci.org/uploadcare/uploadcare-rails)

# Installation

Here is a rails gem for using uploadcare.com service. To install it, add it in your gemfile: `gem 'uploadcare-rails'`, then run:

    bundle install

# Usage

This gem provides ability to attach Uploadcare files to your models. To do that, you need a string field in your model, which is going to hold an Uploadcare file's id.

Add such an attribute to your model. First, create and run a migration:

    rails generate migration AddFileToPost file:string
    rake db:migrate

Edit your model to indicate what this field is used for Uploadcare files:


    class Post < ActiveRecord::Base
      attr_accessible :content, :name, :title, :file     # don't forget to make this attribute accessible

      is_uploadcare_file :file                           # this is a line you want to add
    end

To use a widget, its client-side code must be compiled along with all of your other code. Add `require` directives for that:

    # in application.css
    /*= require uploadcare/widget */
        
    # in application.js
    //= require uploadcare/widget

As the assets are here, we can use a widget in our forms:

    <%= f.uploadcare_uploader_field :file %>
        
    # or, if you use `simple_form`
    <%= form.input :file, as: :uploadcare_uploader %>

Uploadcare-rails gem takes care of storing files on saving a model, so as soon as you add a field to your form, everything should work, and you'll be able to show an image just like that:

    <%= image_tag @post.file.public_url("scale_crop/500x200", "effect/grayscale/") %>

