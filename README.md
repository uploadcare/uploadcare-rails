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

```html
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

```html
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


## Simple uploader
You can always just put 
