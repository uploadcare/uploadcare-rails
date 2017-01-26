# uploadcare-rails

[![Build Status][travis_status_icon]][travis_status]

An awesome Rails plugin for [Uploadcare](https://uploadcare.com).
Based on [uploadcare-ruby](https://github.com/uploadcare/uploadcare-ruby)
gem, a general purpose wrapper for Uploadcare API.

Check out our [demo app](https://uploadcare-rails.herokuapp.com).


## Installation

There are two common methods to install `uploadcare-rails`.

The **first** is performed in two steps and starts with
adding the line to your application's Gemfile:

```ruby
gem 'uploadcare-rails', "~> 1.0"
```

Then, execute this:

```shell
$ bundle install
```

The **second** method here is a manual install:

```shell
$ gem install uploadcare-rails -v 1.0.0
```


## Configuration

Uploadcare *requires* all related config to be stored in a single `yml` file.
To do so, please create `uploadcare.yml` in your `config` folder. Just run:

```shell
$ bundle exec rails g uploadcare_config
```
Again, you can create the file yourself. It should contain something like:

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

Only the two config settings are required: `public_key` and `private_key`.
Where `private_key` stands for a [secret key][kb_uc_keys]
of your Uploadcare project. A complete list of available options can be
found [here](https://uploadcare.com/documentation/widget/).
When you let Rails generate a config file, it will contain a complete list
of options with their respective default values.
Please note, global settings are used for internal API calls and as the default
config for the widget. Alternatively, any instanse of the widget can have its
separate config that will override app-wide settings.


## Adding and configuring widgets

Adding Uploadcare Widget to a page can be done in two ways:

* Loading the widget from our CDN (recommended)
* Manual widget download followed by adding it to your pipeline

### Loading the widget from CDN

Just call helper in the head section of your application layout
(or anywhere else if needed):

```erb
<!DOCTYPE html>
<html>
<head>
  <title>Dummy</title>
  <%= stylesheet_link_tag    "application", media: "all" %>
  <%= javascript_include_tag "application" %>
  <%= csrf_meta_tags %>
  <%= include_uploadcare_widget_from_cdn version: "2.x", min: true %>
  <!--
    results in:
    <script src="https://ucarecdn.com/libs/widget/2.x/uploadcare.full.min.js"></script>
  -->
</head>
```
### Manual widget download

You may want to manually [download][widget_download] the widget and to
serve it along with your other assets.

### Widget configuration

Next step involves adding application-wide settings to your page.
Just call the `:uploadcare_settings` helper in the head section of
your layout:

```erb
<!DOCTYPE html>
<html>
<head>
  <title>Dummy</title>
  <%= stylesheet_link_tag    "application", media: "all" %>
  <%= javascript_include_tag "application" %>
  <%= csrf_meta_tags %>
  <%= include_uploadcare_widget_from_cdn version: "2.x", min: true %>
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

[Here](https://uploadcare.com/documentation/widget/) you can find a lot more info
about configuring Uploadcare Widget.


## Using the widget

### Basic tag

Basic usage of the Uploadcare gem is quite plain. The uploader returns a simple
string containing CDN URL of a file or a group.

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

This tag will result in the following:

```ruby
params[:post][:file]
# => http://www.ucarecdn.com/19cde26d-e41b-4cf5-923e-f58729c0522a/
```

### Form tags

We've got smart and fancy form builder helpers for you.

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

As a result of this, you'll get the Uploadcare uploader with either single
or multiple file uploader (`file` or `group` attribute respectively).
Please note, groups and single files have different behavior so you shouldn't
intermix those (at least, when using the version 1.0).

You can also use the universal builder helper:

```ruby
# simple uploadcare uploader with no smart suggestions about the type of resulting object:
f.uploadcare_uploader :file

# you can set multiple options as you want:
f.uploadcare_uploader :file, :data => {:multiple => true}

# also, there is uploadcare namespace for options
# note that this namespace will be translated into data- attributes
f.uploadcare_uploader :file, :uploadcare => {:multiple => true}
# => will result in "data-multiple"="true"

# uploadcare namespace has a higher priority and will override data- attributes
f.uploadcare_uploader :file, :data => {:multiple => true}, :uploadcare => {:multiple => false}
# => will result in "data-multiple"="false"
```

Or the two other helpers:

```ruby
# force-set "data-multiple" to false
f.uploadcare_single_uploader_field :file

# force-set "data-multiple" to false
f.uploadcare_multiple_uploader_field :file
```

What options are avaliable with the `uploadcare` namespace for our uploader?
Things is, the version 1.0 has no validation and all options from the
namespace are translated into `data-` attributes.
A good list of valid widget options you can be found [here][widget_adv_conf].


## Output

Both `:has_uploadcare_file` and `:has_uploadcare_group` defined for the model will
return either `Uploadcare::Rails::File` or `Uploadcare::Rails::Group` objects.
Both are derived from `Uploadcare::File` and `Uploadcare::Group` respectively,
with some helpers to fit the Rails enviroment.

### File object

Basicly, it has similar methods to `Uploadcare::File`, with several additions.
Mainly, string representation of a file is CDN URL.

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

Again, it's pretty much the same as `Uploadcare::Group`.

```ruby
# calling group (or whatever attribute name you choose) in the template
post.group
# => 19cde26d-e41b-4cf5-923e-f58729c0522a~2

```

Note that explicit loading of `group` is required to gain access to its files:

```ruby
# calling group (or whatever attribute name you choose) in the template
@group = @post.group.load
@group.files
# => [#<Uploadcare::Rails::File ...]
```

Once it's loaded, you can iterate through files:

```erb
<ul>
  <% @group.files.each do |file|%>
    <li>
      <%= image_tag(file.cdn_url) %>
    </li>
  <% end %>
</ul>
```

However, you can get links to images without any API calls.

```erb
<ul>
  <%- @post.group.urls.each do |url|%>
    <li>
      <%= image_tag(url) %>
    </li>
  <% end %>
</ul>
```


## Operations

This topic is well covered in our [docs][cdn_operations], check those out
to find out more about on-the-fly operations.

Operations supported by gem:

* `format: (jpeg|png)`
* `quality: (normal|better|best|lighter|lightest)`
* `progressive: (yes|no)`
* `preview: (200x150)`
* `resize: (150x|x200|150x200)`
* `inline:` [documentation][cdn_op_inline]

For a single file, you can pass additional arguments when calling its URL:

  * ```@post.file.url(preview: '300x300')```
  * ```@post.file.url(quality: :normal)```
  * ```@post.file.url(resize: '150x')```

You can also combine existing operation helpers with inline operations found
in our [docs][cdn_img_op].

```ruby
  @post.file.url(
    preview: '900x900',
    resize: '150x',
    inline: "/progressive/yes/"
  )
```

Or you might want to pass operations to all images in a group:

```erb
<ul>
  <%- @post.group.urls(resize: '150x').each do |url|%>
    <li>
      <%= image_tag(url) %>
    </li>
  <% end %>
</ul>
```

## Future releases:

We have extensive plans for the future:

* Form helpers for Formastic and Simple Forms
* Widget localizations directly from Rails i18n
* More render and output helpers for HTML pages and API responses

[Stay tuned!][subscribe]

## Contributing

This is open source. Fork, hack, request a pull — receive a discount!

Here's the list of `uploadcare-rails` contributors:

- [@romanonthego](https://github.com/romanonthego)
- [@dmitry-mukhin](https://github.com/dmitry-mukhin)
- [@renius](https://github.com/renius)
- [@Zmoki](https://github.com/Zmoki)
- [@maksimgm](https://github.com/maksimgm)
- [@zenati](https://github.com/zenati)

## Security issues

If you think you ran into something in Uploadcare libraries
which might have security implications, please hit us up at
[bugbounty@uploadcare.com](mailto:bugbounty@uploadcare.com)
or Hackerone.

We'll contact you personally in a short time to fix an issue
through co-op and prior to any public disclosure.

[travis_status_icon]: https://secure.travis-ci.org/uploadcare/uploadcare-rails.png?branch=master
[travis_status]: http://travis-ci.org/uploadcare/uploadcare-rails
[kb_uc_keys]: http://kb.uploadcare.com/article/187-what-is-a-public-and-private-key-and-where-do-i-find-them
[widget_download]: https://ucarecdn.com/libs/widget/2.x/uploadcare.full.min.js
[widget_adv_conf]: https://uploadcare.com/documentation/widget/#advanced-configuration
[cdn_operations]: https://uploadcare.com/documentation/cdn/#operations
[cdn_op_inline]: https://uploadcare.com/documentation/cdn/#operation-inline
[cdn_img_op]: https://uploadcare.com/documentation/cdn/#image-operations
[subscribe]: http://sendy.uploadcare.com/subscription?f=3Oq6mt2QQfdKa9vykYrYRWYCJ11NCBzUypV5PiMvsTWQWLC5fpzg78UgFCQbepMh
