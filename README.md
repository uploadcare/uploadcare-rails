[![Build Status](https://secure.travis-ci.org/uploadcare/uploadcare-rails.png?branch=master)](http://travis-ci.org/uploadcare/uploadcare-rails)

An awesome Rails plugin for [Uploadcare](https://uploadcare.com) service.
Based on [uploadcare-ruby](https://github.com/uploadcare/uploadcare-ruby) gem (general purpose wrapper for Uploadcare API)

# Installation
Add this line to your application's Gemfile:

```ruby
gem 'uploadcare-rails', "~> 1.0"
```

And then execute:

```shell
$ bundle install
```

Or install it yourself:

```shell
$ gem install uploadcare-rails -v 1.0.0
```

# Configuration
Uploadcare *requires* to store all related config in one single yml file.
You should create **uploadcare.yml** in your **config** folder. Just run

```shell
$ bundle exec rails g uploadcare_config
```
Or create it yourself - it should contain something like:

```yaml
# config/uploadcare.yml
defaults: &defaults
  public_key: "demopublickey"
  private_key: "demoprivatekey"

development:
  <<: *defaults

test:
  <<: *defaults
  autostore: false

production:
  <<: *defaults
```

Only two config settings are required: public and private keys. All other posible options are listed [here](https://uploadcare.com/documentation/widget/). Config file created by generator also contains a list of all options with default values. Note that global settings are used for internal API calls and as default config for widget. Any instanse of widget can have separate set of config that will override app-wide settings if needed.


# Including widgets and widget configuration
First you should add Uploadcare widget to the page. There are two way of doing that:

### Load widget from our CDN
Just call helper in head of application layout (or anywhere else if needed):

```erb
<!DOCTYPE html>
<html>
<head>
  <title>Dummy</title>
  <%= stylesheet_link_tag    "application", media: "all" %>
  <%= javascript_include_tag "application" %>
  <%= csrf_meta_tags %>
  <%= include_uploadcare_widget_from_cdn version: "1.5.5", min: true %>
  <!--
    results in:
    <script src="https://ucarecdn.com/widget/1.5.5/uploadcare/uploadcare-1.5.5.min.js"></script>
  -->
</head>
```

### Include widget with assets pipeline
In case you don't want to use cdn-stored version for any reason - you could easily use local widget script from you assets pipeline:

```js
// in assets/javascripts/application.js

//= require ./uploadcare
```
Note that only last and stable version of widget is published with gem.
If you need an older (or newer) version for some reason you can
download it and put somewhere in
`assets/javascripts/vendor` and include it via assets pipeline.

### Widget configuration
Next step is including application-wide settings in page.
Just call `:uploadcare_settings` helper in head of layout:

```erb
<!DOCTYPE html>
<html>
<head>
  <title>Dummy</title>
  <%= stylesheet_link_tag    "application", media: "all" %>
  <%= javascript_include_tag "application" %>
  <%= csrf_meta_tags %>
  <%= include_uploadcare_widget_from_cdn version: "1.5.5", min: true %>
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
Basic usage of Uploadcare gem is very simple. Remember that uploader returns you a simple string with cdn url of a file or group.

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

This wil result in Uploadcare uploader with ethier single file uploader (if model has uploadcare file attribute) or multiple uploader (if model has uploadcare group attribute). Note that groups and single files behave differently, so you can not mix one with another (in version 1.0 anyway).

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

# uploadcare namespace have a higher priority and will override data- attributes
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

What options are avaliable with `uploadcare` namespace for uploader?
Well, honestly there is no validation in version 1.0 and all options
from that namespace are simply translated into `data-` attributes.
More on valid options you can read in [widget docs](https://uploadcare.com/documentation/widget/#advanced-configuration).


## Output
Both `:has_uploadcare_file` and `:has_uploadcare_group` defined for model will
return an either `Uploadcare::Rails::File` or `Uploadcare::Rails::Group` objects.
Both are derrived from `Uploadcare::File` and `Uploadcare::Group` respectively,
with some helpers to fit in Rails enviroment.

### File object
Basicly it has same methods as `Uploadcare::File` object, with several additions.
Firstly, string representation of file is cdn url.

```ruby
# calling the object in templates will respond with cdn_url string
# instead of object serialization
# in the template call:
post.file
# => http://www.ucarecdn.com/19cde26d-e41b-4cf5-923e-f58729c0522a/

# so
image_tag(post.file)
# is a perfectly valid usage
# => <img src="http://www.ucarecdn.com/19cde26d-e41b-4cf5-923e-f58729c0522a/">
```

### Group object
What is different? Not much.

```ruby
# calling group (or whatever attribute name you choose) in the template
post.group
# => 19cde26d-e41b-4cf5-923e-f58729c0522a~2

```
Note that explicit loading of group is required for getting access for group files:

```ruby
# calling group (or whatever attribute name you choose) in the template
@group = @post.group.load
@group.files
# => [#<Uploadcare::Rails::File ...]
```
Then you can iterate through files:

```erb
<ul>
  <% @group.files.each do |file|%>
    <li>
      <%= image_tag(file.cdn_url) %>
    </li>
  <% end %>
</ul>
```


# Future releases:
We have big plans for future:
* Form helpers for Formastic and Simple Forms;
* Localizations for widget directly from rails i18n;
* Smart caching for loaded groups and files;
* More render and output helpers for html pages and api responses;

So stay tuned!

#Contributing

This is open source, fork, hack, request a pull, receive a discount)
