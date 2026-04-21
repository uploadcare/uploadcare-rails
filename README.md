# Uploadcare Rails

![license](https://img.shields.io/badge/license-MIT-brightgreen.svg)
[![Build Status][actions-img]][actions-badge]

[actions-badge]: https://github.com/uploadcare/uploadcare-rails/actions/workflows/test.yml
[actions-img]: https://github.com/uploadcare/uploadcare-rails/actions/workflows/test.yml/badge.svg

`uploadcare-rails` is a Rails integration for Uploadcare built on top of the rewritten `uploadcare-ruby` client API.

The current stable branch is shipping as the `5.0.0.rc1` release candidate line.

The gem is centered on:

- `Uploadcare::Rails.client` for the default app-level client
- explicit `Uploadcare::Client` instances for multi-account usage
- `has_uploadcare_file` and `has_uploadcare_files` for model-backed attributes
- `uploadcare_file_field` and `uploadcare_files_field` for uploader fields
- `ActiveStorage::Service::UploadcareService` for Active Storage integration

This version uses the new [Uploadcare File Uploader](https://uploadcare.com/docs/file-uploader/) based on Web Components.

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Uploader setup](#uploader-setup)
- [Uploader fields](#uploader-fields)
- [Model integration](#model-integration)
- [Attached objects](#attached-objects)
- [Manual API usage](#manual-api-usage)
- [Multi-account usage](#multi-account-usage)
- [Active Storage](#active-storage)
- [Image transformations](#image-transformations)
- [Useful links](#useful-links)

## Requirements

- Ruby 3.3+
- Rails 7.2+

## Installation

Add the gem to your Gemfile:

```ruby
gem "uploadcare-rails", "5.0.0.rc1"
```

Then install:

```bash
bundle install
```

If your application uses `api_struct`, replace it with `uploadcare-api_struct`:

```ruby
gem "uploadcare-api_struct"
```

You can also install the gem directly:

```bash
gem install uploadcare-rails --pre -v 5.0.0.rc1
```

## Configuration

Set your Uploadcare credentials with environment variables:

```bash
export UPLOADCARE_PUBLIC_KEY=your_public_key
export UPLOADCARE_SECRET_KEY=your_secret_key
```

Generate the config file:

```bash
rails g uploadcare_config
```

That creates `config/uploadcare.yml`.

Typical `config/uploadcare.yml`:

```yml
default: &default
  public_key: <%= Rails.application.credentials.dig(:uploadcare, :public_key) %>
  secret_key: <%= Rails.application.credentials.dig(:uploadcare, :secret_key) %>
  store_files_after_save: true
  delete_files_after_destroy: true
  store_files_async: false
  delete_files_async: false
  cache_files: true
  cache_expires_in: <%= 1.day.to_i %>
  locale: en

development:
  <<: *default

test:
  <<: *default

production:
  <<: *default
```

You can also configure the gem directly in Rails configuration or with the convenience block.

Using `config/application.rb`:

```ruby
config.uploadcare.public_key = ENV.fetch("UPLOADCARE_PUBLIC_KEY")
config.uploadcare.secret_key = ENV.fetch("UPLOADCARE_SECRET_KEY")
config.uploadcare.store_files_after_save = false
config.uploadcare.delete_files_after_destroy = true
```

Using `Uploadcare::Rails.configure`:

```ruby
Uploadcare::Rails.configure do |config|
  config.public_key = ENV.fetch("UPLOADCARE_PUBLIC_KEY")
  config.secret_key = ENV.fetch("UPLOADCARE_SECRET_KEY")

  config.store_files_after_save = false
  config.store_files_async = false
  config.delete_files_after_destroy = true
  config.delete_files_async = false

  config.cache_files = true
  config.cache_expires_in = 1.hour
  config.locale = "en"
end
```

`Uploadcare::Rails.configure` also syncs the default SDK configuration, so the default Rails client and the default SDK client stay aligned.

## Uploader setup

### CDN include tag

Add the uploader assets to your layout:

```erb
<head>
  <%= uploadcare_include_tag %>
</head>
```

That helper emits the stylesheet plus the JavaScript module import that registers the Uploadcare Web Components.

Options:

- `version:` uploader version, default `"v1"`
- `solution:` `"regular"`, `"inline"`, or `"minimal"`
- `min:` whether to use minified assets, default `true`
- `importmap:` emit only the stylesheet when JavaScript is loaded separately

Example:

```erb
<%= uploadcare_include_tag(solution: "inline", version: "v1") %>
```

### Import map

For Rails apps using `importmap-rails`:

```bash
rails g uploadcare_importmap
```

Then import the initializer:

```javascript
import "uploadcare"
```

And add the stylesheet to your layout:

```erb
<%= uploadcare_stylesheet_tag %>
```

### NPM or manual JavaScript setup

Install the uploader package:

```bash
npm install @uploadcare/file-uploader
```

Register the Web Components:

```javascript
import * as UC from "@uploadcare/file-uploader"

UC.defineComponents(UC)
```

Import the stylesheet:

```javascript
import "@uploadcare/file-uploader/web/uc-file-uploader-regular.min.css"
```

## Uploader fields

### Model-backed field helpers

Use `uploadcare_file_field` for single files:

```erb
<%= uploadcare_file_field :post, :picture %>
```

Use `uploadcare_files_field` for group-backed attributes:

```erb
<%= uploadcare_files_field :post, :attachments %>
```

`uploadcare_files_field` defaults `multiple: true` and `group_output: true`, so the submitted value is a single Uploadcare group URL that matches `has_uploadcare_files`.

Both helpers accept File Uploader configuration options such as:

- `solution:`
- `multiple:`
- `img_only:`
- `accept:`
- `source_list:`
- `metadata:`

Example:

```erb
<%= uploadcare_file_field :post, :picture, solution: "inline", img_only: true %>
```

### Standalone field helpers

When you are not binding the uploader to a model object:

```erb
<%= uploadcare_file_field_tag :picture %>
<%= uploadcare_files_field_tag :attachments %>
```

### FormBuilder integration

`form_with` and `form_for` use the same public naming:

```erb
<%= form_with model: @post do |f| %>
  <%= f.uploadcare_file_field :picture %>
  <%= f.uploadcare_files_field :attachments, solution: "inline" %>
  <%= f.submit %>
<% end %>
```

Validation errors are wrapped through Rails’ standard `field_error_proc`.

## Model integration

Use `has_uploadcare_file` for a single Uploadcare file URL stored in a string column:

```ruby
class Post < ApplicationRecord
  has_uploadcare_file :picture
end
```

Use `has_uploadcare_files` for a single Uploadcare group URL stored in a string column:

```ruby
class Post < ApplicationRecord
  has_uploadcare_files :attachments
end
```

Example schema:

```ruby
create_table :posts do |t|
  t.string :picture
  t.string :attachments
end
```

Example form:

```erb
<%= form_with model: @post do |f| %>
  <%= f.uploadcare_file_field :picture %>
  <%= f.uploadcare_files_field :attachments %>
  <%= f.submit %>
<% end %>
```

### Lifecycle behavior

The model macros add helper methods such as:

- `uploadcare_store_picture!`
- `uploadcare_delete_picture!`
- `uploadcare_store_attachments!`

You can also enable automatic behavior through configuration:

- `store_files_after_save`
- `store_files_async`
- `delete_files_after_destroy`
- `delete_files_async`

### Per-model clients

Model macros accept `uploadcare_client:` so records can resolve a tenant-specific client:

```ruby
class Asset < ApplicationRecord
  belongs_to :account

  has_uploadcare_file :file, uploadcare_client: -> {
    Uploadcare::Client.new(
      public_key: account.uploadcare_public_key,
      secret_key: account.uploadcare_secret_key
    )
  }
end
```

That client is used by mounted objects and synchronous model callbacks. Async model callbacks use the default `Uploadcare::Rails.client`, so tenant-specific `uploadcare_client:` values should stay synchronous.

## Attached objects

Mounted attributes return small wrapper objects that keep Rails-friendly behavior while delegating API work to the client-bound SDK resources.

### `Uploadcare::Rails::AttachedFile`

`has_uploadcare_file` returns `Uploadcare::Rails::AttachedFile`.

Example:

```ruby
post = Post.create!(picture: "https://ucarecdn.com/2d33999d-c74a-4ff9-99ea-abc23496b052/")

post.picture.uuid
post.picture.cdn_url
post.picture.to_s
post.picture.loaded?
post.picture.load
post.picture.store
post.picture.delete
```

### `Uploadcare::Rails::AttachedFiles`

`has_uploadcare_files` returns `Uploadcare::Rails::AttachedFiles`.

Example:

```ruby
post = Post.create!(attachments: "https://ucarecdn.com/dbc4e868-b7a6-43ff-a35f-2ebef935dc1b~2/")

post.attachments.id
post.attachments.files_count
post.attachments.file_urls
post.attachments.loaded?
post.attachments.load
post.attachments.store
post.attachments.delete
```

## Manual API usage

The Rails gem no longer provides a second API wrapper layer. For manual Uploadcare operations, use `Uploadcare::Rails.client` or build your own `Uploadcare::Client`.

### Default app client

```ruby
client = Uploadcare::Rails.client

file = client.files.find(uuid: "2d33999d-c74a-4ff9-99ea-abc23496b052")
group = client.groups.find(group_id: "dbc4e868-b7a6-43ff-a35f-2ebef935dc1b~2")
project = client.project.current
webhooks = client.webhooks.list
metadata = client.file_metadata.index(uuid: file.uuid)
```

### Uploads

```ruby
file = File.open("photo.jpg", "rb") do |io|
  Uploadcare::Rails.client.uploads.upload(io, store: true)
end

remote_file = Uploadcare::Rails.client.uploads.upload(
  "https://example.com/image.jpg",
  store: true
)
```

### Files and groups

```ruby
client = Uploadcare::Rails.client

file = client.files.find(uuid: "2d33999d-c74a-4ff9-99ea-abc23496b052")
files = client.files.list(limit: 10)

client.files.batch_store(uuids: [file.uuid])
client.files.batch_delete(uuids: [file.uuid])

group = client.groups.create(uuids: [file.uuid])
client.groups.find(group_id: group.id)
```

### Raw API access

Use the raw parity layer when you want endpoint-level control:

```ruby
client = Uploadcare::Rails.client

result = client.api.rest.files.list(params: { limit: 10 })
upload_result = client.api.upload.files.from_url(source_url: "https://example.com/image.jpg")
```

## Multi-account usage

For multiple Uploadcare projects in the same Rails process, build explicit clients:

```ruby
primary = Uploadcare::Client.new(public_key: "pk-1", secret_key: "sk-1")
secondary = Uploadcare::Client.new(public_key: "pk-2", secret_key: "sk-2")

primary_file = primary.files.find(uuid: "uuid-1")
secondary_file = secondary.files.find(uuid: "uuid-2")
```

`Uploadcare::Rails.client` is just the default client for the common single-account case.

You can also build scoped clients from configuration overrides:

```ruby
tenant_client = Uploadcare::Rails.client(public_key: tenant.public_key, secret_key: tenant.secret_key)
```

Use explicit clients for:

- per-tenant background work
- manual API usage on behalf of different projects
- model-level `uploadcare_client:` lambdas
- custom service objects

## Active Storage

The gem ships with `ActiveStorage::Service::UploadcareService`.

Example `storage.yml`:

```yml
uploadcare:
  service: Uploadcare
  public_key: <%= ENV.fetch("UPLOADCARE_PUBLIC_KEY") %>
  secret_key: <%= ENV.fetch("UPLOADCARE_SECRET_KEY") %>
  public: true
```

Then configure your environment:

```ruby
config.active_storage.service = :uploadcare
```

Private signed URLs are not supported by `UploadcareService`; configure the service with `public: true`.
`UploadcareService` defaults to `public: true`; keeping it explicit in `storage.yml` is recommended.
Active Storage direct uploads (`url_for_direct_upload`) are not supported by `UploadcareService`. Use `uploadcare_file_field` / `uploadcare_files_field` for direct uploads.
Download and redirect validation use a trusted-host allowlist. This is hostname-based validation and assumes trusted DNS control for those hosts.

The service:

- uploads through `client.uploads.upload`
- keeps blob-to-Uploadcare UUID mapping in blob metadata
- resolves downloads and URLs through the service client
- supports Uploadcare-backed previews for PDFs
- applies remote image transformations for variants when the blob is stored in Uploadcare

You continue using normal Active Storage APIs in your app:

```ruby
class User < ApplicationRecord
  has_one_attached :avatar
end
```

## Image transformations

`AttachedFile` and `AttachedFiles` expose transformation helpers that generate Uploadcare CDN URLs.

Single file:

```ruby
post.picture.transform_url(quality: "better")
post.picture.transform_url(crop: { dimensions: "300x500", coords: "50,50", alignment: "center" })
```

File group:

```ruby
post.attachments.file_urls
post.attachments.transform_file_urls(quality: "better")
```

See the Uploadcare transformation reference for the available operations:

https://uploadcare.com/docs/transformations/image/

Public utility constants:

- `Uploadcare::Rails::IdExtractor`
- `Uploadcare::Rails::Transformations::ImageTransformations`

## Useful links

- [Uploadcare File Uploader docs](https://uploadcare.com/docs/file-uploader/)
- [Uploadcare Ruby SDK](https://github.com/uploadcare/uploadcare-ruby)
- [Uploadcare API docs](https://uploadcare.com/docs/start/api/)
- [Uploadcare dashboard](https://app.uploadcare.com/)
