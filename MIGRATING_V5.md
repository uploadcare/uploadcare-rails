# Migrating to uploadcare-rails 5.0

This guide covers migration from `uploadcare-rails` 3.x/4.x to 5.0.

`uploadcare-rails` 5.0 is aligned with the rewritten `uploadcare-ruby` 5.x API.

## Breaking changes

### Ruby version

- Minimum supported Ruby is now `3.3+`.

### Rails version

- Minimum supported Rails is now `7.0+`.

### Dependency baseline

- `uploadcare-ruby` 5.x is now required.

### Configuration bridge

The Rails wrapper now writes credentials to `Uploadcare.configuration` (v5 API), not `Uploadcare.config`.

```ruby
# v4 style (old)
Uploadcare.config.public_key

# v5 style (new)
Uploadcare.configuration.public_key
```

### REST wrapper return types are now native SDK objects

Methods in `Uploadcare::*Api` wrappers now return `uploadcare-ruby` v5 objects/results directly.

- `Uploadcare::FileApi.get_files` -> `Uploadcare::PaginatedCollection`
- `Uploadcare::FileApi.get_file` -> `Uploadcare::File`
- `Uploadcare::FileApi.store_file` -> `Uploadcare::File`
- `Uploadcare::FileApi.delete_file` -> `Uploadcare::File`
- `Uploadcare::FileApi.store_files` -> `Uploadcare::BatchFileResult`
- `Uploadcare::FileApi.delete_files` -> `Uploadcare::BatchFileResult`
- `Uploadcare::GroupApi.get_groups` -> `Uploadcare::PaginatedCollection`
- `Uploadcare::GroupApi.get_group` -> `Uploadcare::Group`
- `Uploadcare::GroupApi.store_group` -> `Uploadcare::Group`
- `Uploadcare::GroupApi.create_group` -> `Uploadcare::Group`
- `Uploadcare::ProjectApi.get_project` -> `Uploadcare::Project`
- `Uploadcare::WebhookApi.get_webhooks` -> `Array<Uploadcare::Webhook>`
- `Uploadcare::WebhookApi.create_webhook` -> `Uploadcare::Webhook`
- `Uploadcare::WebhookApi.update_webhook` -> `Uploadcare::Webhook`

`Uploadcare::WebhookApi.delete_webhook` returns the direct SDK response payload.

### Wrapper object return contract

Mounted wrappers still work, but now return v5-native objects:

- `post.picture.store` -> `Uploadcare::Rails::File`
- `post.picture.delete` -> `Uploadcare::File`
- `post.picture.load` -> `Uploadcare::Rails::File`
- `post.attachments.store` -> `Uploadcare::Group`
- `post.attachments.load` -> `Uploadcare::Rails::Group`

### Conversion API return contract

`Uploadcare::ConversionApi` no longer uses `dry-monads` style `Success(...)`/`Failure(...)` wrappers.
It now returns direct v5 SDK values:

- `convert_video` -> `Uploadcare::VideoConverter`
- `get_video_conversion_status` -> `Uploadcare::VideoConverter`
- `convert_document` -> `Hash`
- `get_document_conversion_status` -> `Uploadcare::DocumentConverter`
- `get_document_conversion_formats_info` -> `Uploadcare::DocumentConverter`

## New in 5.0

### Per-model Uploadcare config selection

`mount_uploadcare_file` and `mount_uploadcare_file_group` now accept `uploadcare_config:`.
You can pass either an `Uploadcare::Configuration` instance or a proc.

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

When async store/delete jobs are enabled, this configuration is serialized and passed into jobs automatically.

### Active Storage integration

`ActiveStorage::Service::UploadcareService` is available in `5.0`.

Current limitation:

- Direct upload URL flow is not implemented yet (`url_for_direct_upload` raises `NotImplementedError`).

## Migration checklist

1. Upgrade Ruby to `3.3+`.
2. Upgrade Rails to `7.0+`.
3. Upgrade to `uploadcare-rails` 5.x.
4. Replace any `Uploadcare.config` usage with `Uploadcare.configuration`.
5. Update integrations that expected Hash/monad responses from wrapper APIs.
6. If you use per-tenant keys, move mounts/API calls to explicit `uploadcare_config:` / `config:` usage.
7. If you use Active Storage direct upload flow, keep your existing service until this is implemented.
8. Run your full application and test suite.
