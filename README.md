# Uploadcare ruby gem

## Trivia

### What is it?

`uploadcare-rails` is a Ruby gem to use [Uploadcare service] with [careful-uploaders] library in your Rails projects with ease.

### What it can do?

It handles your uploads utilizing Uploadcare REST API and stores uploaded file UUIDs for future use.
Also, it can validate your uploads by size, presence etc.

### Disclaimer

At this moment gem is not covered with test, so __use it at your own risk__. On the other hand, it's pretty simple to work just fine without any problems.

## Installing

### Rails 2

Since version 0.1.0, `uploadcare-rails` doesn't support Rails 2. See branch `gem-0.0.2` for installation instructions.

### Rails 3

Add gem to your Gemfile:

```ruby
gem "uploadcare-rails", ">= 0.1.0"
```

And then run `bundle install`.

## Using with Rails application

### Preparations

You must complete following steps:

* Generate (and run) a migration to add a text field that will be used to store UUIDs of your uploaded files:

```
~$ rails generate migration AddFileFieldToOrders file:string
~$ bundle exec rake db:migrate
```

* Add one line to your model:

```ruby
class Order < ActiveRecord::Base
  # somewhere around validators
  has_uploadcare_file :file
end
```

* Put a form helper into your views:

```erb
<%- form_for(@order) do |f| %>
  ...
  <%= f.uploadcare_field :file %>
  ...
<%- end %>
```

* Require a widget library in your `application.js` file:

```javascript
//= require jquery
//= require jquery_ujs
//= require_tree .
//= require uploadcare.min
```

* (Re)start your application and modify `config/uploadcare.yml` file in accordance with your access keys and widget type.

That's all. 

### Configuration files

On first application run (after gem installation) a `config/uploadcare.yml` file will be created. Just modify it to match your Uploadcare data.

### Available validators

```ruby
class BlogPost < ActiveRecord::Base
  has_uploadcare_file :upload # You can use :autokeep option to define whether keep upload automatically or manually
  
  validates_upload_presence :upload 
  validates_upload_presence :photo, :message => "must be selected"
end
```

### Available configuration

* `:autokeep`. Defines whether uploaded file will be kept forcibly. Must be a boolean.
* `:file_column`. By default, gem will be trying to use first passed parameter (e.g. `:upload` if you look at upper example) as table column. Pass `:file_column => :your_column` to override this behaviour and to set your custom column. Can be string or symbol.

### Controllers 

Gem designed to be clear as much as possible, so it doesn't affect controllers code:

```ruby
class BlogPostsController < ApplicationController
  def create
    @blog_post = BlogPost.new(params[:blog_post])
    if @blog_post.save
      # call blog_post.upload.keep if you set :autokeep to false and need to save file.
      redirect_to :action => :index
    else
      render :action => :new
    end
  end
end
```

### Accessing uploaded file 

```ruby
record = BlogPost.find(5)
record.upload # => #<Uploadcare::Rails::Upload:0x....>
record.upload.kept? # => true (because of :auto_keep => true)
record.upload.file_info # => {"size"=>127893, "upload_date"=>"2012-07-09T03:38:38.613"...}
record.upload.url
record.upload.resized_url("640x480")
record.upload.resized_url("640x")
record.upload.resized_url("x480")
record.upload.crop_url("640x480")
record.upload.size
record.upload.image?
record.upload.removed?
record.upload.keep # to force keep or to keep it manually with delayed_job etc.
```

## Roadmap

We're looking into possibility to drop third preparation step to save you from messing with views, but it will be done a bit later.

## Contributing

Fork a repo, make changes, create pull request. Just like everywhere else.

## Questions?

Don't hesitate to contact me via e-mail, specified in my GitHub profile, or write a letter to az@uploadcare.com, and I will reply you for sure.

Good luck!

[Uploadcare service]: http://uploadcare.com
[careful-uploaders]: https://github.com/uploadcare/careful-uploaders
