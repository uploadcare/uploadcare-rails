# Uploadcare Rails

![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)
[![Build Status][actions-img]][actions-badge]

[actions-badge]: https://github.com/uploadcare/uploadcare-rails/actions/workflows/test.yml
[actions-img]: https://github.com/uploadcare/uploadcare-rails/actions/workflows/test.yml/badge.svg

A Ruby on Rails plugin for [Uploadcare](https://uploadcare.com) service.
Based on [uploadcare-ruby](https://github.com/uploadcare/uploadcare-ruby) gem (general purpose wrapper for Uploadcare API)

Version `5.x` is a major update aligned with `uploadcare-ruby` 5.x.
Migration guide: [MIGRATING_V5.md](./MIGRATING_V5.md).

## Table of Contents

* [Requirements](#requirements)
* [Upgrading to 5.0](#upgrading-to-50)
* [Installation](#installation)
  * [Using Gemfile](#using-gemfile)
  * [Using command line](#using-command-line)
* [Usage](#usage)
  * [Configuration](#configuration)
  * [Uploadcare File Uploader](#uploadcare-file-uploader)
    * [Widget](#widget)
      * [Using CDN](#using-cdn)
      * [Using NPM](#using-npm)
    * [Input](#input)
  * [Using the File Uploader with Rails models](#using-the-file-uploader-with-rails-models)
    * [Form data](#form-data)
    * [File and Group wrappers](#file-and-group-wrappers)
  * [Image Transformation](#image-transformation)
  * [Active Storage](#active-storage)
  * [Uploadcare API interfaces](#uploadcare-api-interfaces)
    * [Upload Api](#upload-api)
    * [File Api](#file-api)
    * [Group Api](#group-api)
    * [Project Api](#project-api)
    * [Webhook Api](#webhook-api)
    * [Conversion Api](#conversion-api)
    * [File Metadata Api](#file-metadata-api)
    * [Add-Ons Api](#add-ons-api)
* [Useful links](#useful-links)

## Requirements
* ruby 3.3+
* Ruby on Rails 7.0+

## Upgrading to 5.0

Read the migration guide before upgrading:

* [MIGRATING_V5.md](./MIGRATING_V5.md)
* [CHANGELOG.md](./CHANGELOG.md)

## Installation

### Using Gemfile

Add this line to your application's Gemfile:

```ruby
gem "uploadcare-rails"
```

And then execute:

```console
$ bundle install
```

### Using command line

```console
$ gem install uploadcare-rails
```

## Usage

### Configuration

To start using Uploadcare API you just need to set your [API keys](https://app.uploadcare.com/projects/-/api-keys/) (public key and secret key).
These keys can be set as ENV variables using the `export` directive:

```console
$ export UPLOADCARE_PUBLIC_KEY=your_public_key
$ export UPLOADCARE_SECRET_KEY=your_private_key
```
Or you can use popular gems like `dotenv-rails` for setting ENV variables.
You must set the gem before `uploadcare-rails` like this :
```ruby
gem "dotenv-rails", require: "dotenv/rails-now", groups: [:development, :test]
gem "uploadcare-rails"
```
:warning: `require: "dotenv/rails-now"` is very important!

Run the config generator command to generate a configuration file:

```console
$ rails g uploadcare_config
```

The generator will create a new file in `config/initializers/uploadcare.rb`.

The public key must be specified in `config/initializers/uploadcare.rb` to use Uploadcare file upload.
This step is done automatically in the initializer if you set the ENV variable `UPLOADCARE_PUBLIC_KEY` earlier.

```ruby
...
Uploadcare::Rails.configure do |config|
  # Sets your Uploadcare public key.
  config.public_key = ENV.fetch("UPLOADCARE_PUBLIC_KEY", "your_public_key")
  ...
end
```

There are also some options set by default:

```ruby
...
# Deletes files from Uploadcare servers after object destroy.
config.delete_files_after_destroy = true

# Sets caching for Uploadcare files
config.cache_files = true

# Available locales currently are:
# ar az ca cs da de el en es et fr he it ja ko lv nb nl pl pt ro ru sk sr sv tr uk vi zhTW zh
config.locale = "en"

# If true, inputs on your page are initialized automatically, see the article for details -
# https://uploadcare.com/docs/file-uploader-api/widget-initialization/
config.live = true

# If true, input initialization is invoked manually.
# See https://uploadcare.com/docs/file-uploader-api/widget-initialization/).
config.manual_start = false
```

Then you can configure all global variables such as files storing/caching, deleting files, etc.
Full list of available options is listed in the file itself. Just uncomment an option and set the value.

In examples we’re going to use `ucarecdn.com` domain. Check your project's subdomain in the [Dashboard](https://app.uploadcare.com/projects/-/settings/#delivery).
For multi-tenant/multi-project setups (different keys in the same process), build dedicated SDK configs and pass them to API wrappers:

```ruby
tenant_config = Uploadcare::Rails.client_config(
  public_key: "tenant_public_key",
  secret_key: "tenant_secret_key"
)

Uploadcare::FileApi.get_file("7b2b35b4-125b-4c1e-9305-12e8da8916eb", config: tenant_config)
```

### Uploadcare File Uploader

### Widget

#### Using CDN

The fastest way to start using file uploading is to add the Uploadcare widget to the html-page.
There is a view helper that can do it with two strings of code:

Add this string to your `<head>` html-tag

```erb
<!DOCTYPE html>
<html>
<head>
  <title>RailsApp</title>
  <%= uploadcare_include_tag %>
  <!--
    results in:
    <script src="https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js"></script>
    <script>
      //<![CDATA[
      UPLOADCARE_PUBLIC_KEY = "your_public_key";
      UPLOADCARE_LOCALE = "en";
      UPLOADCARE_LIVE = true;
      UPLOADCARE_MANUAL_START = false;
      //]]>
    </script>
  -->
</head>
...
```
This helper uses a CDN-url for the widget bundle and supports three options:

- **version** — version of the Uploadcare widget. Default is "3.x".
- **bundle** — bundle name. Available names are "full", "default", "api", "ie8" and "lang.en".
               Default bundle is "full" — a full bundle with built-in jQuery.
               More info about bundles [here](https://uploadcare.com/docs/uploads/file-uploader/#bundles).
- **min** — bool value detecting if the bundle must be minified.

The `<head>` tag then also includes the `<script>` with widget global settings set in `config/initializers/uploadcare.rb`. You can override them later in an individual widget.


#### Using asset pipeline

Download and append widget manually to your asset pipeline. You may download (e.g. https://ucarecdn.com/libs/widget/3.x/uploadcare.full.min.js) and serve the widget yourself along with your other assets.

#### Using NPM

Installing via NPM instructions can be found [here](https://uploadcare.com/docs/uploads/file-uploader/#npm).

### Input

When the widget is on a html-page, you want to add an input to your view that will be used by the File Uploader:

```erb
...
<%= uploadcare_uploader_field :object, :attribute %>
<!--
  results in:
  <input role="uploadcare-uploader" type="hidden" name="object[attribute]" id="object_attribute">
-->
...
```

- **object** — object name;
- **attribute** — object attribute name.

### Using the File Uploader with Rails models

View helpers are good to be used for Rails models.
First, you need to mount uploadcare file or group to the model attribute.
For example you have a database table like this and model `Post`:
```
# DB table "posts"
---------------------
title       | String
---------------------
picture     | String
---------------------
attachments | String
---------------------
```

### Form data

#### Uploadcare File

```ruby
# app/models/post.rb
class Post < ApplicationRecord
  mount_uploadcare_file :picture
end
```

For multi-tenant setups, you can bind a non-default Uploadcare config:

```ruby
class Post < ApplicationRecord
  mount_uploadcare_file :picture, uploadcare_config: -> {
    Uploadcare::Rails.client_config(
      public_key: tenant_uploadcare_public_key,
      secret_key: tenant_uploadcare_secret_key
    )
  }
end
```

```erb
<!-- app/views/posts/new.html.erb -->
<h1> NEW POST </h1>

<%= form_tag("/posts", method: :post) do %>
  <%= uploadcare_uploader_field :post, :picture %>
  <!--
    results in:
    <input role="uploadcare-uploader" multiple="false" type="hidden" name="post[picture]" id="post_picture">
  -->
  <div>
    <%= submit_tag "Save" %>
  </div>
<% end %>
```

#### Uploadcare File Group

```ruby
# app/models/post.rb
class Post < ApplicationRecord
  mount_uploadcare_file_group :attachments
end
```

`mount_uploadcare_file_group` also supports `uploadcare_config:` in the same way.

```erb
<!-- app/views/posts/new.html.erb -->
<h1> NEW POST </h1>

<%= form_tag("/posts", method: :post) do %>
  <%= uploadcare_uploader_field :post, :attachments %>
  <!--
    results in:
    <input role="uploadcare-uploader" multiple="true" type="hidden" name="post[attachments]" id="post_attachments">
  -->
  <div>
    <%= submit_tag "Save" %>
  </div>
<% end %>
```

The input will have a `value` property set to CDN-urls when you will select files to upload in the widget.

```erb
<input role="uploadcare-uploader" type="hidden" name="post[picture]" id="post_picture" value="https://ucarecdn.com/8355c2c5-f108-4d74-963d-703d48020f83/">
```

So, you get CDN-urls as a value of the attribute in the controller on form submit.
The value will be available in the controller by `params[:post][:picture]`.

The helper is detecting the value of the `multiple` property based on the mount type in your model.

### Caching issues with Turbolinks/Hotwire

If you are facing issue, with multiple input elements being rendered due to turbolinks caching you can append this fix in the `app/javascript/application.js` to overcome this:

```
document.addEventListener('turbolinks:before-cache', function() {
    const dialogClose = document.querySelector('.uploadcare--dialog__close');
    if (dialogClose) {
        dialogClose.dispatchEvent(new Event('click'));
    }

    const dialog = document.querySelector('.uploadcare--dialog');
    if (dialog) {
        dialog.remove();
    }

    const widgets = document.querySelectorAll('.uploadcare--widget');
    widgets.forEach(widget => {
        widget.remove();
    });
});
```

Similarly if you are using [Hotwire](https://hotwired.dev/) then use can you use below code:

```
document.addEventListener('turbo:before-cache', function() {
    const dialogClose = document.querySelector('.uploadcare--dialog__close');
    if (dialogClose) {
        dialogClose.dispatchEvent(new Event('click'));
    }

    const dialog = document.querySelector('.uploadcare--dialog');
    if (dialog) {
        dialog.remove();
    }

    const widgets = document.querySelectorAll('.uploadcare--widget');
    widgets.forEach(widget => {
        widget.remove();
    });
});
```

### File and Group wrappers

When you mount either Uploadcare File or Group to an attribute, this attribute is getting wrapped with
a Uploadcare object. This feature adds some useful methods to the attribute.

Note: Supports ActiveRecord, ActiveModel and Mongoid models.

#### Uploadcare File

Say, you have such model in your Rails app:

```ruby
# app/models/post.rb
class Post < ApplicationRecord
  mount_uploadcare_file :picture
end
```

And then you create a new Post object specifying a CDN-url for your previously uploaded Uploadcare file:

```ruby
post = Post.create(picture: "https://ucarecdn.com/2d33999d-c74a-4ff9-99ea-abc23496b052/")
```

Now the `post.picture` is an Uploadcare::Rails::File. Following methods are supported:

```ruby
# Store the file on an Uploadcare server permanently:
post.picture.store
#   => #<Uploadcare::Rails::File ...>

#
# Delete the file from an Uploadcare server permanently:
post.picture.delete
#   => #<Uploadcare::File ...>

# Get CDN-url of an object attribute:
post.picture.to_s
#   => "https://ucarecdn.com/2d33999d-c74a-4ff9-99ea-abc23496b052/"

# Load object (send a GET request to the server to get all the file's data)
# This data will be cached if the cache_files option is set to true
# Default data (without asking an Uploadcare server) for each file contains cdn_url and uuid only:
post.picture.load
#   => #<Uploadcare::Rails::File ...>

# Check if an attribute loaded from the server.
# Will return false unless the :load or the :store methods are called:
post.picture.loaded?
#   => true

# More about image transformations below.
# Transform a CDN-url to get a new transformed image's source. Works for images only:
post.picture.transform_url(quality: "better")
#   => "https://ucarecdn.com/2d33999d-c74a-4ff9-99ea-abc23496b052/-/quality/better/"
```

#### Uploadcare File Group

Groups work similar to the File but have some differences though.

```ruby
# app/models/post.rb
class Post < ApplicationRecord
  mount_uploadcare_file_group :attachments
end
```

Creating a new `post` with the Group mounted:

```ruby
post = Post.create(attachments: "https://ucarecdn.com/dbc4e868-b7a6-43ff-a35f-2ebef935dc1b~1/")
```

Now the `post.attachments` is an Uploadcare::Rails::Group. Following methods are supported:

```ruby
# Store the file group on an Uploadcare server permanently:
post.attachments.store
#   => #<Uploadcare::Group ...>

#
# Delete the file group from an Uploadcare server permanently:
post.attachments.delete
#   => #<direct SDK response payload>

# Get CDN-url of an object attribute:
post.attachments.to_s
#   => "https://ucarecdn.com/dbc4e868-b7a6-43ff-a35f-2ebef935dc1b~1/"

# Load object — works the same way as for the File:
post.attachments.load
#   => #<Uploadcare::Rails::Group ...>

# Check if an attribute loaded from the server:
post.attachments.loaded?
#   => true

# As we don't want to show (on the html-page) a file group itself,
# we can get CDN-urls for file that the group contains. No loading group or files needed.
# This works for images only:
post.attachments.transform_file_urls(quality: "better")
#   => ["https://ucarecdn.com/dbc4e868-b7a6-43ff-a35f-2ebef935dc1b~1/nth/0/-/quality/better/"]

# If you want to get non-transformed file urls, use:
post.attachments.file_urls
#   => ["https://ucarecdn.com/dbc4e868-b7a6-43ff-a35f-2ebef935dc1b~1/nth/0/"]
```


### Image Transformation

Uploadcare provides a way to transform images stored on Uploadcare services specifying a list of operations.
If an operation has just one option, you can specify it like key-value:

```ruby
post.picture.transform_url(quality: "better")
#   => "https://ucarecdn.com/ebbb9929-eb92-4f52-a212-eecfdb19d27d/-/quality/better/"
```

and if an operation supports several options — just set them as a Hash:

```ruby
post.picture.transform_url(crop: { dimensions: "300x500", coords: "50, 50", alignment: "center" })
#   => "https://ucarecdn.com/ebbb9929-eb92-4f52-a212-eecfdb19d27d/-/crop/300x500/50,50/center/"
```

Full list of operations and valid values can be found [here](https://uploadcare.com/docs/transformations/image/).

### Active Storage

`uploadcare-rails` provides `ActiveStorage::Service::UploadcareService`.

Configure it in `config/storage.yml`:

```yml
uploadcare:
  service: Uploadcare
  public_key: <%= ENV.fetch("UPLOADCARE_PUBLIC_KEY") %>
  secret_key: <%= ENV.fetch("UPLOADCARE_SECRET_KEY") %>
```

Then enable it in your environment config:

```ruby
config.active_storage.service = :uploadcare
```

Current limitations:

* direct uploads are not supported yet (`url_for_direct_upload` raises `NotImplementedError`)
* adapter stores Uploadcare UUID mapping in `ActiveStorage::Blob#metadata["uploadcare_uuid"]`

Built-in Active Storage integrations:

* Uploadcare PDF previewer (`Uploadcare::Rails::ActiveStorage::UploadcarePreviewer`) is auto-registered.
  This allows standard Rails preview calls like:

```ruby
url_for(record.file.preview(resize_to_limit: [320, 320]))
```

* Uploadcare remote variant processing is prepended into `ActiveStorage::Variant`.
  Standard Rails variant helpers keep working while transformations are executed through Uploadcare CDN:

```ruby
image_tag(record.image.variant(resize_to_limit: [320, 320], quality: "smart"))
image_tag(record.image.variant(resize_to_fill: [200, 120]))
image_tag(record.image.variant(resize_to_fit: [640, 480]))
```

### Uploadcare API interfaces

Uploadcare provides [APIs](https://uploadcare.com/docs/start/api/) to manage files, group, projects, webhooks, video and documents conversion and file uploads. The gem has unified interfaces to use Uploadcare APIs in RailsApp.

`uploadcare-rails` 5.x returns native `uploadcare-ruby` v5 objects/results from wrappers.
Examples:

* `Uploadcare::FileApi.get_file` -> `Uploadcare::File`
* `Uploadcare::FileApi.get_files` -> `Uploadcare::PaginatedCollection`
* `Uploadcare::GroupApi.get_group` -> `Uploadcare::Group`
* `Uploadcare::ProjectApi.get_project` -> `Uploadcare::Project`
* `Uploadcare::WebhookApi.get_webhooks` -> `Array<Uploadcare::Webhook>`

### Upload API

[Upload Api](https://uploadcare.com/api-refs/upload-api/) provides methods to upload files in many ways.

#### Upload a single file

```ruby
# Load a file
file = File.open("kitten.png")
#   => #<File:kitten.png>

# Upload file to Uploadcare
uploadcare_file = Uploadcare::UploadApi.upload_file(file)
#   => #<Uploadcare::File ...>
```

This method supports single file uploading and uploading files from an URL (depending on the type of first argument - can be either String (i.e. URL) or File).

```ruby
# Upload file from URL
url = "https://ucarecdn.com/80b807be-faad-4f01-bbbe-0bbde172b9de/1secVIDEO.mp4"
uploadcare_file = Uploadcare::UploadApi.upload_file(url)
#   => #<Uploadcare::File ...>
```


#### Upload several files

```ruby
# Load a file
file = File.open("kitten.png")
#   => #<File:kitten.png>
# Upload several files to Uploadcare
uploadcare_file = Uploadcare::UploadApi.upload_files([file])
#   => [#<Uploadcare::File ...>]
```


### File API

FileApi provides an interface to manage single files, stored on Uploadcare Servers.

#### Get files

```ruby
# Valid options:
# removed: [true|false]
# stored: [true|false]
# limit: (1..1000)
# ordering: ["datetime_uploaded"|"-datetime_uploaded"]
# from: A starting point for filtering files. The value depends on your ordering parameter value.
Uploadcare::FileApi.get_files(ordering: "datetime_uploaded", limit: 10)
#   => #<Uploadcare::PaginatedCollection ...>
```


#### Get a file by UUID

```ruby
$ Uploadcare::FileApi.get_file("7b2b35b4-125b-4c1e-9305-12e8da8916eb")
#   => #<Uploadcare::File ...>
```


#### Copy a file to default storage. Source can be UID or full CDN link

```ruby
# Valid options:
# stored: [true|false]
Uploadcare::FileApi.local_copy_file("2d33999d-c74a-4ff9-99ea-abc23496b052", store: false)
#   => {
#         "uuid"=>"f486132c-2fa5-454e-9e70-93c5e01a7e04",
#          ...other file data...
#      }
```

#### Copy a file to custom storage. Source can be UID or full CDN link

```ruby
# Valid options:
# make_public: [true|false]
Uploadcare::FileApi.remote_copy_file("2d33999d-c74a-4ff9-99ea-abc23496b052", "mytarget", make_public: false)
#   => {
#         "uuid"=>"f486132c-2fa5-454e-9e70-93c5e01a7e04",
#          ...other file data...
#      }
```


#### Store a file by UUID

```ruby
Uploadcare::FileApi.store_file("2d33999d-c74a-4ff9-99ea-abc23496b052")
#   => #<Uploadcare::File ...>
```


#### Store several files by UUIDs

```ruby
Uploadcare::FileApi.store_files(["f486132c-2fa5-454e-9e70-93c5e01a7e04"])
#   => #<Uploadcare::BatchFileResult ...>
```


#### Delete a file by UUID

```ruby
Uploadcare::FileApi.delete_file("2d33999d-c74a-4ff9-99ea-abc23496b052")
#   => #<Uploadcare::File ...>
```


#### Delete several files by UUIDs

```ruby
Uploadcare::FileApi.delete_files(["f486132c-2fa5-454e-9e70-93c5e01a7e04"])
#   => #<Uploadcare::BatchFileResult ...>
```


### Group API

GroupApi provides an interface to manage file groups stored on Uploadcare Servers.

#### Get file groups

```ruby
# Valid options:
# limit: (1..1000)
# ordering: ["datetime_created"|"-datetime_created"]
# from: A starting point for filtering group lists. MUST be a datetime value with T used as a separator.
#   example: "2015-01-02T10:00:00"
Uploadcare::GroupApi.get_groups(ordering: "datetime_uploaded", limit: 10)
#   => #<Uploadcare::PaginatedCollection ...>
```


#### Get a single file group by a group ID

```ruby
Uploadcare::GroupApi.get_group("d476f4c9-44a9-4670-88a5-c3cf5d26a6c2~20")
#   => #<Uploadcare::Group ...>
```


#### Store files of a group by a group ID

```ruby
Uploadcare::GroupApi.store_group("d476f4c9-44a9-4670-88a5-c3cf5d26a6c2~20")
#   => #<Uploadcare::Group ...>
```


#### Create a new group by file's uuids

It is possible to specify transformed URLs with UUIDs of files OR just UUIDs.

```
  NOTE: Be sure to add a trailing slash "/" to the URL in case of specifying transformed URLs.
```

```ruby
Uploadcare::GroupApi.create_group(["e08dec9e-7e25-49c5-810e-4c360d86bbae/-/resize/300x500/"])
#   => #<Uploadcare::Group ...>
```


#### Delete a file group by its ID

```ruby
Uploadcare::GroupApi.delete_group("90c93e96-965b-4dd2-b323-39d9bd5f492c~1")
#   => "200 OK"
```


### Project API

ProjectApi interface provides just one method - to get a configuration of your Uploadcare project.

```ruby
Uploadcare::ProjectApi.get_project
#   => #<Uploadcare::Project ...>
```


### Webhook API

WebhookApi allows to manage Uploadcare webhooks.

#### Get all webhooks

This method returns a non-paginated list of webhooks set in your project

```ruby
Uploadcare::WebhookApi.get_webhooks
#   => [#<Uploadcare::Webhook ...>]
```


#### Create a new webhook

This method requires an URL that is triggered by an event, for example, a file upload. A target URL MUST be unique for each project — event type combination.

Each webhook payload can be signed with a secret (the `signing_secret` option) to ensure that the request comes from the expected sender.
More info about secure webhooks [here](https://uploadcare.com/docs/security/secure-webhooks/).

```ruby
# Valid options:
# event: ["file.uploaded"]
# is_active: [true|false]
Uploadcare::WebhookApi.create_webhook("https://example.com", event: "file.uploaded", is_active: true, signing_secret: "some-secret")
#   => #<Uploadcare::Webhook ...>
```


#### Update an existing webhook by ID

Updating a webhook is available if webhook ID is known. The ID is returned in a response on creating or listing webhooks. Setting a signing secret is supported when updating a webhook as well.

```ruby
# Valid options:
# event: Presently, we only support the "file.uploaded" event
# is_active: [true|false]
Uploadcare::WebhookApi.update_webhook("webhook_id", target_url: "https://example1.com", event: "file.uploaded", is_active: false, signing_secret: "some-secret")
#   => #<Uploadcare::Webhook ...>
```


#### Delete an existing webhook by a target_url

```ruby
Uploadcare::WebhookApi.delete_webhook("https://example1.com")
#   => ""
```

### Conversion API

ConversionApi provides methods to manage video and documents conversion.

#### Convert a document

This method requires an UUID of a previously uploaded to Uploadcare file and target format.
If using an image format, you can also specify a page number that must be converted for a document containing pages.
More info about document conversion can be found [here](https://uploadcare.com/docs/transformations/document-conversion/).

```ruby
Uploadcare::ConversionApi.convert_document(
  { uuid: "466740dd-cfad-4de4-9218-1ddc0edf7aa6", format: "png", page: 1 },
  store: false
)
#   => {"result"=>[{"token"=>21316034, "uuid"=>"db6e52b8-cc03-4174-a07a-012be43b144e"}], "problems"=>{}}
```


#### Get a document conversion job status

This method requires a token obtained in a response to the [convert_document](#convert-a-document) method.

```ruby
Uploadcare::ConversionApi.get_document_conversion_status(21316034)
#   => #<Uploadcare::DocumentConverter ...>
```


#### Convert a video

Such as the document conversion method, this method requires an UUID of a previously uploaded to Uploadcare file.
Also you have several options to control the way a video will be converted. All of them are optional.
Description of valid options and other info about video conversion can be found [here](https://uploadcare.com/docs/transformations/video-encoding/).

```ruby
Uploadcare::ConversionApi.convert_video(
  {
    uuid: "466740dd-cfad-4de4-9218-1ddc0edf7aa6",
    format: "ogg",
    quality: "best",
    cut: { start_time: "0:0:0.0", length: "0:0:1.0" },
    thumbs: { N: 2, number: 1 }
  },
  store: false
)
#   => #<Uploadcare::VideoConverter ...>
```


#### Get a video conversion job status

This method requires a token obtained in a response to the [convert_video](#convert-a-video) method.

```ruby
Uploadcare::ConversionApi.get_video_conversion_status(916090555)
#   => #<Uploadcare::VideoConverter ...>
```


### File Metadata Api

File metadata is additional, arbitrary data, associated with uploaded file.
As an example, you could store unique file identifier from your system.
Metadata is key-value data.

#### Get file's metadata keys and values

```ruby
Uploadcare::FileMetadataApi.file_metadata('f757ea10-8b1a-4361-9a7c-56bfa5d45176')
#   => {:"sample-key"=>"sample-value"}
```

#### Get the value of a single metadata key

```ruby
Uploadcare::FileMetadataApi.file_metadata_value('f757ea10-8b1a-4361-9a7c-56bfa5d45176', 'sample-key')
#   => "sample-value"
```

#### Update the value of a single metadata key

If the key does not exist, it will be created.

```ruby
Uploadcare::FileMetadataApi.update_file_metadata('f757ea10-8b1a-4361-9a7c-56bfa5d45176', 'sample-key', 'new-value')
#   => "new-value"
```

#### Delete a file's metadata key

```ruby
Uploadcare::FileMetadataApi.delete_file_metadata('f757ea10-8b1a-4361-9a7c-56bfa5d45176', 'sample-key')
#   => "200 OK"
```


### Add-Ons Api

An Add-On is an application implemented by Uploadcare that accepts uploaded files as an input and can produce other files and/or appdata as an output.

#### Execute AWS Rekognition Add-On for a given target to detect labels in an image

```
  Note: Detected labels are stored in the file's appdata.
```

```ruby
Uploadcare::AddonsApi.rekognition_detect_labels('f757ea10-8b1a-4361-9a7c-56bfa5d45176')
#   => {"request_id"=>"dfeaf81c-5c0d-49d5-8ed4-ac09bac7998e"}
```

#### Check the status of an Add-On execution request that had been started using the Execute Add-On operation

```ruby
Uploadcare::AddonsApi.rekognition_detect_labels_status('dfeaf81c-5c0d-49d5-8ed4-ac09bac7998e')
#   => {"status"=>"done"}
```

#### Execute AWS Rekognition Moderation Add-On for a given target to detect moderation labels in an image
```
  Note: Detected labels are stored in the file's appdata.
```

```ruby
Uploadcare::AddonsApi.rekognition_detect_moderation_labels('f757ea10-8b1a-4361-9a7c-56bfa5d45176')
#   => {"request_id"=>"dfeaf81c-5c0d-49d5-8ed4-ac09bac7998e"}
```

# Check the status of an AWS Rekognition Moderation Add-On execution request that had been started using the Execute Add-On operation

```ruby
Uploadcare::AddonsApi.rekognition_detect_moderation_labels_status('dfeaf81c-5c0d-49d5-8ed4-ac09bac7998e')
#   => {"status"=>"done"}
```



#### Execute ClamAV virus checking Add-On for a given target

```ruby
Uploadcare::AddonsApi.virus_scan('dfeaf81c-5c0d-49d5-8ed4-ac09bac7998e')
#   => {"request_id"=>"1b0126de-ace6-455b-82e2-25f4aa33fc6f"}
```

#### Check the status of an Add-On execution request that had been started using the Execute Add-On operation

```ruby
Uploadcare::AddonsApi.virus_scan_status('1b0126de-ace6-455b-82e2-25f4aa33fc6f')
#   => {"status"=>"done"}
```

#### Execute remove.bg background image removal Add-On for a given target

```ruby
Uploadcare::AddonsApi.remove_bg('f757ea10-8b1a-4361-9a7c-56bfa5d45176')
#   => {"request_id"=>"6d26a7d5-0955-4aeb-a9b1-c9776c83aa4c"}
```

#### Check the status of an Add-On execution request that had been started using the Execute Add-On operation

```ruby
Uploadcare::AddonsApi.remove_bg_status('6d26a7d5-0955-4aeb-a9b1-c9776c83aa4c')
#   => {"status"=>"done", "result"=>{"file_id"=>"8f0a2a28-3ed7-481e-b415-ee3cce982aaa"}}
```


## Useful links
* [Uploadcare documentation](https://uploadcare.com/docs/?utm_source=github&utm_medium=referral&utm_campaign=uploadcare-rails)
* [Upload API reference](https://uploadcare.com/api-refs/upload-api/?utm_source=github&utm_medium=referral&utm_campaign=uploadcare-rails)
* [REST API reference](https://uploadcare.com/api-refs/rest-api/?utm_source=github&utm_medium=referral&utm_campaign=uploadcare-rails)
* [Migration guide (v5)](./MIGRATING_V5.md)
* [Changelog](./CHANGELOG.md)
* [Contributing guide](https://github.com/uploadcare/.github/blob/master/CONTRIBUTING.md)
* [Security policy](https://github.com/uploadcare/uploadcare-rails/security/policy)
* [Support](https://github.com/uploadcare/.github/blob/master/SUPPORT.md)
