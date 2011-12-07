# UploadCare Ruby gem

## Trivia

### What is it?

`uploadcare-rails` is a Ruby gem to use [UploadCare service] with [careful-uploaders] library in your Rails projects with ease.

### What it can do?

It handles your UploadCare uploads using UploadCare API and store all the required information about uploaded file.
Also, it can validate uploads by size.

### Compatibility 

At the moment, gem only compatible with Rails 2.3.* and 3.*. We're working on compatibility with Sinatra.

### Testing

Currently the gem is not covered with test, so __use this gem at your own risk__. On the other hand, it's pretty simple to work just fine without any problems.

## Installing

### Rails 2.3.*

Include the gem to your dependencies.
In `config/environment.rb`:

```ruby
Rails::Initializer.run do |config|
  config.gem 'uploadcare', :version => '0.1.0'
  config.gem 'uploadcare-rails', :version => '0.0.1'
end
```

And then run `rake gems:install`.

Or, if your project uses `bundler`, put this code in your `Gemfile`:

```ruby
gem "uploadcare", "~> 0.1.0"
gem "uploadcare-rails", "~> 0.0.1"
```

And then run `bundle install`.

## Using with Rails

### Preparations

At first, run a generator to create some fields for model that will keep the information about uploads:
```
script/generate uploadcare_rails BlogPost
```

It will create two fields — `uploadcare_file_uuid` and `uploadcare_file_info`. The first one handles file id to access to file instance via API. 
The second one respectively stores file information to avoid frequent remote API calls.

Run pending migration with `rake db:migrate` and follow the next step.

### Configuration files

On first run gem will create `config/uploadcare.yml` file. Just put your values for corresponding params.

### Models

```ruby
class BlogPost < ActiveRecord::Base
  has_uploadcare_file :upload # You can use :autokeep option to define whether keep upload automatically or manually
  
  validates_upload_presence :upload 
  validates_upload_size :upload, :max => 50000, :min => 123 # or you can simple use :in => 123..50000
end
```

### Views
```erb
<% form_for @blog_post do |f| %>
	<%= f.error_messages %>
	<%= f.uploadcare_field :upload %>
	<%= f.submit %>
<% end %>
```

### Controllers 
```ruby
class BlogPostsController < ApplicationController
  def create
    @blog_post = BlogPost.new(params[:blog_post])
    if @blog_post.save
      # call blog_post.upload.keep if you set :autokeep to false
      redirect_to :action => :index
    else
      render :action => :new
    end
  end
end
```

[UploadCare service]: http://uploadcare.com
[careful-uploaders]: https://github.com/uploadcare/careful-uploadersп
