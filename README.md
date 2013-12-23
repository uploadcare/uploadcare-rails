[![Build Status](https://secure.travis-ci.org/uploadcare/uploadcare-rails.png?branch=master)](http://travis-ci.org/uploadcare/uploadcare-rails)

An awesome Rails plugin for Uploadcare service.
Based on uploadcare-ruby gem (general purpose wrapper for Uploadcare API)

# Installation
Add this line to your application's Gemfile:

```ruby
gem 'uploadcare-rails', "~> 1.0"
```

And then execute:

```shell
$ bundle install
```

Or install it yourself as:

```shell
$ gem install uploadcare-rails -v 1.0.0
```

# Configuration
Uploadcare *required* to store all related config in one single yml file.
You should create **uploadcare.yml** in your **config** folder. It should contain something like that:

```yaml
# config/uploadcare.yml
defaults: &defaults
  public_key: "demopublickey"
  private_key: "demoprivatekey"
  autostore: true

development:
  <<: *defaults

test:
  <<: *defaults
  autostore: false

production:
  <<: *defaults
```

Only two config are required for work: public and private key. All other posible options are listed here: https://uploadcare.com/documentation/widget/ . Note that it is global settings used for internal api calls and as default config for widget. Any instanse of widget can have separate set of config that will override app-wide settings if needed.

# Including widgets and widget configuration
First you should load our awesome widget to the page. There is two way of doing that:

### Load widget from our cdn
Just call helper in head of application layout (or anywhere else if needed):

```erb
<!DOCTYPE html>
<html>
<head>
  <title>Dummy</title>
  <%= stylesheet_link_tag    "application", media: "all" %>
  <%= javascript_include_tag "application" %>
  <%= csrf_meta_tags %>
  <%= include_uploadcare_widget_from_cdn {version: "0.15.3", min: true } %>
  <!-- 
    results in: 
    <script src="https://ucarecdn.com/widget/0.15.3/uploadcare/uploadcare-0.15.3.min.js"></script>
  -->
</head>
```

### Include widget with assets pipeline
In case you don't wont use cdn-stored version for any reason - you could easily use local widget script from you assets pipeline:

```js
// in assets/javascripts/application.js

// require ./uploadcare
```
Note that only last and stable version of widget is publised with gem. If you need old version for some reasone you could download it and put somewhere in assets/javascripts/vendor and include it via assets pipeline.

Next step is including application-wide settings in page. Just call **:uploadcare_settings** helper in head of layout:

```erb
<!DOCTYPE html>
<html>
<head>
  <title>Dummy</title>
  <%= stylesheet_link_tag    "application", media: "all" %>
  <%= javascript_include_tag "application" %>
  <%= csrf_meta_tags %>
  <%= include_uploadcare_widget_from_cdn {version: "0.15.3", min: true } %>
  <%= uploadcare_settings %>
  <!-- 
    results in:
    <script>
      //<![CDATA[
        UPLOADCARE_PUBLIC_KEY = "demopublickey";
        .... more settings ...
      //]]>
    </script>
   -->
</head>
```

# Using

## Basic tag
Basic usage of uploadcare gem is very simple. Remember that uploader returns you a simple string with cdn url of a file or group.

```erb
<%= uploadcare_uploader_field :post, :file %>
<!-- 
  results in:
  <input data-path-value="true" id="post_file" name="post[file]" role="uploadcare-uploader" type="hidden">
  <div class="uploadcare-widget" style="display: none;" data-status="ready">
      ....
  </div>
 -->
```

This tag will result in:

```ruby
params[:post][:file]
# => http://www.ucarecdn.com/19cde26d-e41b-4cf5-923e-f58729c0522a/
```

## Form tags
We have smart and fancy form builder helpers for you.


```erb
<%= form_for(@post) do |f| %>

  <div class="field">
    <%= f.label :title %><br>
    <%= f.text_field :title %>
  </div>
  <div class="field">
    <%= f.label :file %><br>
    <%= f.uploadcare_field :file %>
  </div>
  <div class="actions">
    <%= f.submit %>
  </div>
<% end %>
```

This wil result in uploadcare uploader with ethier single file uploader (if model has uploadcare file attribute) or multiple uploader (if model has uploadcare group attribute). Note that groups and single files behave very differently, so you can not mix one with another (in version 1.0 anyway).

You can also use universal builder helper:

```ruby
# simple uploadcare uploader with no smart suggestions about type of result object:
f.uploadcare_uploader :file

# you can set multiple options as you want:
f.uploadcare_uploader :file, :data => {:multiple => true}

# also there is uploadcare namespace for options
# note that this namespace will be translated into data- attributes
f.uploadcare_uploader :file, :uploadcare => {:multiple => true}
# => will result in "data-multiple"="true"

#uploadcare namespace have a higher priority and will override data- attributes
f.uploadcare_uploader :file, :data => {:multiple => true}, :uploadcare => {:multiple => false}
# => will result in "data-multiple"="false"
```

And two other helpers:

```ruby
# forse-set "data-multiple" to false
f.uploadcare_single_uploader_field :file

# forse-set "data-multiple" to false
f.uploadcare_multiple_uploader_field :file
```

What options are avaliable with *uploadcare* namespace for uploader? Well, honestly there is no validation in version 1.0 and all option from that namespace simple translated into data- attributes.
More on valid options you can read here https://uploadcare.com/documentation/widget/#advanced-configuration.


## Output
Both :has_uploadcare_file and :has_uploadcare_group defined for model will return an either Uploadcare::Rails::File or Uploadcare::Rails::Group objects. Both are derrivative from Uploadcare::File
and Uploadcare::Group respectfully, with some helpers to fit in Rails enviroment.

### File object
Basicly has the same methods as Uploadcare::File object, with several additions.
Firstly, string representation of file is cdn url.

```ruby
# calling the object in templates will respond with cdn_url string
# instead of object serialization
post.file
# => http://www.ucarecdn.com/19cde26d-e41b-4cf5-923e-f58729c0522a/

# so
image_tag(post.file)
# is a perfectly valid usage 
# => <img src="http://www.ucarecdn.com/19cde26d-e41b-4cf5-923e-f58729c0522a/">
```


