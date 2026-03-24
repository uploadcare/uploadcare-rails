# Migrating to uploadcare-rails 5.0

This guide covers migration from the older `uploadcare-rails` surface to the rewritten, client-first API released in `5.0.0.rc1`.

The short version:

- compatibility aliases are gone
- manual API usage now goes through `Uploadcare::Rails.client` or `Uploadcare::Client`
- model macros use `has_uploadcare_file` and `has_uploadcare_files`
- uploader helpers use `uploadcare_file_field` and `uploadcare_files_field`
- wrapper objects are `Uploadcare::Rails::AttachedFile` and `Uploadcare::Rails::AttachedFiles`

## What changed

The rewrite stops treating `uploadcare-rails` as a second Uploadcare SDK.

Instead:

- Rails concerns stay in this gem
- Uploadcare API access goes through `Uploadcare::Client`
- multi-account behavior is explicit
- the public API is smaller and more Rails-like

Configuration also moved closer to normal Rails conventions:

- `rails g uploadcare_config` now creates `config/uploadcare.yml`
- the engine loads `config.uploadcare` from that file when present
- Uploadcare credentials can come from `Rails.application.credentials`
- `Uploadcare::Rails.configure` still works as a convenience layer

## Breaking changes

### Old model macro names are removed

Replace:

```ruby
mount_uploadcare_file :picture
mount_uploadcare_file_group :attachments
```

With:

```ruby
has_uploadcare_file :picture
has_uploadcare_files :attachments
```

### `do_not_store` is replaced by `store_files_after_save`

The rewrite removes the old `do_not_store:` option. If you previously deferred storage, switch to the positive `store_files_after_save` setting and configure it explicitly.

Before:

```ruby
class Post < ApplicationRecord
  mount_uploadcare_file :picture, do_not_store: true
end
```

After:

```ruby
class Post < ApplicationRecord
  has_uploadcare_file :picture
end

Uploadcare::Rails.configure do |config|
  config.store_files_after_save = false
end
```

Set `store_files_after_save = true` if you want the rewritten macros to store files automatically after save.

### Old field helper names are removed

Replace:

```erb
<%= uploadcare_uploader_field :post, :picture %>
<%= uploadcare_uploader_field_tag :picture %>
```

With:

```erb
<%= uploadcare_file_field :post, :picture %>
<%= uploadcare_file_field_tag :picture %>
```

For group-backed attributes, use the plural helper:

```erb
<%= uploadcare_files_field :post, :attachments %>
<%= uploadcare_files_field_tag :attachments %>
```

### Old FormBuilder helper names are removed

Replace:

```erb
<%= f.uploadcare_file :picture %>
```

With:

```erb
<%= f.uploadcare_file_field :picture %>
```

And for groups:

```erb
<%= f.uploadcare_files_field :attachments %>
```

### Old wrapper constant names are removed

Replace:

```ruby
Uploadcare::Rails::File
Uploadcare::Rails::Group
```

With:

```ruby
Uploadcare::Rails::AttachedFile
Uploadcare::Rails::AttachedFiles
```

### Old manual API wrapper classes are no longer the public path

If your application code used wrapper classes such as:

- `Uploadcare::UploadApi`
- `Uploadcare::FileApi`
- `Uploadcare::GroupApi`
- `Uploadcare::ProjectApi`
- `Uploadcare::WebhookApi`
- `Uploadcare::ConversionApi`
- `Uploadcare::FileMetadataApi`
- `Uploadcare::AddonsApi`

Move that code to `Uploadcare::Rails.client` or explicit `Uploadcare::Client` instances.

## Replacement table

| Old surface | New surface |
| --- | --- |
| `mount_uploadcare_file :picture` | `has_uploadcare_file :picture` |
| `mount_uploadcare_file_group :attachments` | `has_uploadcare_files :attachments` |
| `uploadcare_uploader_field` | `uploadcare_file_field` |
| `uploadcare_uploader_field_tag` | `uploadcare_file_field_tag` |
| `f.uploadcare_file` | `f.uploadcare_file_field` |
| `Uploadcare::Rails::File` | `Uploadcare::Rails::AttachedFile` |
| `Uploadcare::Rails::Group` | `Uploadcare::Rails::AttachedFiles` |
| `uploadcare_config:` | `uploadcare_client:` |
| `Uploadcare::FileApi.get_file(...)` | `Uploadcare::Rails.client.files.find(...)` |
| `Uploadcare::FileApi.get_files(...)` | `Uploadcare::Rails.client.files.list(...)` |
| `Uploadcare::FileApi.store_files(...)` | `Uploadcare::Rails.client.files.batch_store(...)` |
| `Uploadcare::FileApi.delete_files(...)` | `Uploadcare::Rails.client.files.batch_delete(...)` |
| `Uploadcare::GroupApi.get_group(...)` | `Uploadcare::Rails.client.groups.find(...)` |
| `Uploadcare::GroupApi.get_groups(...)` | `Uploadcare::Rails.client.groups.list(...)` |
| `Uploadcare::GroupApi.create_group(...)` | `Uploadcare::Rails.client.groups.create(...)` |
| `Uploadcare::ProjectApi.get_project` | `Uploadcare::Rails.client.project.current` |
| `Uploadcare::WebhookApi.get_webhooks` | `Uploadcare::Rails.client.webhooks.list` |
| `Uploadcare::UploadApi.upload_file(io)` | `Uploadcare::Rails.client.uploads.upload(io)` |

## Model migration

### Single file

Before:

```ruby
class Post < ApplicationRecord
  mount_uploadcare_file :picture
end
```

After:

```ruby
class Post < ApplicationRecord
  has_uploadcare_file :picture
end
```

### File group

Before:

```ruby
class Post < ApplicationRecord
  mount_uploadcare_file_group :attachments
end
```

After:

```ruby
class Post < ApplicationRecord
  has_uploadcare_files :attachments
end
```

### Per-tenant Uploadcare account selection

Before:

```ruby
mount_uploadcare_file :picture, uploadcare_config: -> {
  Uploadcare::Rails.client_config(
    public_key: tenant_public_key,
    secret_key: tenant_secret_key
  )
}
```

After:

```ruby
has_uploadcare_file :picture, uploadcare_client: -> {
  Uploadcare::Client.new(
    public_key: tenant_public_key,
    secret_key: tenant_secret_key
  )
}
```

The rewrite expects explicit client objects, not mutable config wrappers.
Use tenant-specific clients with mounted objects and synchronous model callbacks. Async model callbacks use the default `Uploadcare::Rails.client`.

## View migration

### Single file field

Before:

```erb
<%= uploadcare_uploader_field :post, :picture %>
```

After:

```erb
<%= uploadcare_file_field :post, :picture %>
```

### Group field

Before:

```erb
<%= uploadcare_uploader_field :post, :attachments, multiple: true, group_output: true %>
```

After:

```erb
<%= uploadcare_files_field :post, :attachments %>
```

The plural helper now owns the correct defaults for group-backed attributes.

### FormBuilder

Before:

```erb
<%= form_with model: @post do |f| %>
  <%= f.uploadcare_file :picture %>
<% end %>
```

After:

```erb
<%= form_with model: @post do |f| %>
  <%= f.uploadcare_file_field :picture %>
<% end %>
```

## Wrapper object migration

Mounted objects still support the same high-level behavior:

- `load`
- `store`
- `delete`
- `to_s`
- transformation helpers

But the class names changed:

```ruby
post.picture.class
# => Uploadcare::Rails::AttachedFile

post.attachments.class
# => Uploadcare::Rails::AttachedFiles
```

## Manual API migration

### Default app client

Before:

```ruby
Uploadcare::FileApi.get_file("uuid")
Uploadcare::GroupApi.get_group("uuid~2")
Uploadcare::ProjectApi.get_project
```

After:

```ruby
client = Uploadcare::Rails.client

client.files.find(uuid: "uuid")
client.groups.find(group_id: "uuid~2")
client.project.current
```

### Explicit multi-account client

Before:

```ruby
Uploadcare::FileApi.get_file("uuid", config: other_config)
```

After:

```ruby
client = Uploadcare::Client.new(public_key: "other_pk", secret_key: "other_sk")
client.files.find(uuid: "uuid")
```

### Uploads

Before:

```ruby
Uploadcare::UploadApi.upload_file(file)
```

After:

```ruby
Uploadcare::Rails.client.uploads.upload(file, store: true)
```

### Raw API parity

If your code depended on low-level endpoint parity, use the raw client API directly:

```ruby
client = Uploadcare::Rails.client

client.api.rest.files.list(params: { limit: 10 })
client.api.upload.files.from_url(source_url: "https://example.com/image.jpg")
```

## Active Storage

The rewrite keeps `ActiveStorage::Service::UploadcareService`, but the internals are now client-based.

No special migration is needed if you already use the Uploadcare Active Storage service name in `storage.yml`.

What changed conceptually:

- the service owns an `Uploadcare::Client`
- previews and variants stay scoped to that service client
- multiple Uploadcare services can coexist safely

## Removed public helpers with no direct replacement

These older low-level helpers are not part of the new public API:

- `uploadcare_uploader`
- `uploadcare_config_tag`
- `uploadcare_uploader_tag`
- `uploadcare_ctx_provider_tag`
- `uploadcare_form_input_tag`

Use:

- `uploadcare_file_field`
- `uploadcare_files_field`
- `uploadcare_file_field_tag`
- `uploadcare_files_field_tag`

If you were composing uploader components manually, move that code back to the higher-level field helpers unless you have a very specific internal need.

## Migration checklist

1. Replace `mount_uploadcare_file` with `has_uploadcare_file`.
2. Replace `mount_uploadcare_file_group` with `has_uploadcare_files`.
3. Replace `uploadcare_uploader_field` with `uploadcare_file_field`.
4. Replace `uploadcare_uploader_field_tag` with `uploadcare_file_field_tag`.
5. Replace `f.uploadcare_file` with `f.uploadcare_file_field`.
6. Replace `Uploadcare::Rails::File` with `Uploadcare::Rails::AttachedFile`.
7. Replace `Uploadcare::Rails::Group` with `Uploadcare::Rails::AttachedFiles`.
8. Move manual Uploadcare API usage to `Uploadcare::Rails.client` or explicit `Uploadcare::Client` instances.
9. Replace `uploadcare_config:` with `uploadcare_client:` where you need tenant-specific credentials.
10. Replace `do_not_store:` with `store_files_after_save = false` in application configuration.
11. Run your full application test suite and exercise any upload forms, background jobs, and Active Storage flows that use Uploadcare.
