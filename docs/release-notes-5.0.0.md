# uploadcare-rails 5.0.0 release notes

Release v5.0.0: stable rewrite on `uploadcare-ruby` 5.x.

Must: publish `uploadcare-ruby` 5.0.0 first. CI/install will fail otherwise.

Before tagging:

- Verify CI: Rails 7.2, 8.0, 8.1 plus Active Storage.
- Smoke-test one 4.x to 5.0 migration using [MIGRATING_V5.md](../MIGRATING_V5.md).
- Tag and publish `uploadcare-rails` 5.0.0.

Migration priority: test in this order.

- Manual API wrappers: `Uploadcare::FileApi`, `Uploadcare::GroupApi`, `Uploadcare::UploadApi`
- `mount_uploadcare_file` or `mount_uploadcare_file_group`
- Removed uploader helper aliases
- Active Storage

Quick scan:

```sh
git grep -n "mount_uploadcare_file\|Uploadcare::FileApi\|Uploadcare::GroupApi\|Uploadcare::UploadApi\|uploadcare_uploader_field"
```

No API changes since `5.0.0.rc1`. Applications moving from 4.x or older should
follow [MIGRATING_V5.md](../MIGRATING_V5.md).

## Highlights

- Client-first API: `Uploadcare::Rails.client` and `Uploadcare::Client`
- Model macros: `has_uploadcare_file` and `has_uploadcare_files`
- Uploader helpers: `uploadcare_file_field`, `uploadcare_files_field`, and FormBuilder equivalents
- Wrapper objects: `Uploadcare::Rails::AttachedFile` and `Uploadcare::Rails::AttachedFiles`
- Active Storage service: `ActiveStorage::Service::UploadcareService`
- Active Storage preview and remote variant processing for Uploadcare-backed blobs
- Rails 7.2+ and Ruby 3.3+ runtime baseline

## Breaking changes

- `mount_uploadcare_file` and `mount_uploadcare_file_group` are removed. Use `has_uploadcare_file` and `has_uploadcare_files`.
- `uploadcare_uploader_field`, `uploadcare_uploader_field_tag`, and `f.uploadcare_file` are removed. Use `uploadcare_file_field`, `uploadcare_files_field`, `f.uploadcare_file_field`, and `f.uploadcare_files_field`.
- `Uploadcare::Rails::File` and `Uploadcare::Rails::Group` are replaced by `Uploadcare::Rails::AttachedFile` and `Uploadcare::Rails::AttachedFiles`.
- Manual API wrappers such as `Uploadcare::FileApi`, `Uploadcare::GroupApi`, and `Uploadcare::UploadApi` are no longer the public path. Use `Uploadcare::Rails.client` or explicit `Uploadcare::Client` instances.
- `do_not_store:` is replaced by the positive `store_files_after_save` configuration.

## Upgrade examples

Model macros:

```ruby
class Post < ApplicationRecord
  has_uploadcare_file :picture
  has_uploadcare_files :attachments
end
```

Uploader fields:

```erb
<%= form_with model: @post do |f| %>
  <%= f.uploadcare_file_field :picture %>
  <%= f.uploadcare_files_field :attachments, solution: "inline" %>
  <%= f.submit %>
<% end %>
```

Manual API usage:

```ruby
client = Uploadcare::Rails.client

file = client.files.find(uuid: "2d33999d-c74a-4ff9-99ea-abc23496b052")
group = client.groups.find(group_id: "dbc4e868-b7a6-43ff-a35f-2ebef935dc1b~2")
project = client.project.current
```

Multi-account usage:

```ruby
client = Uploadcare::Client.new(
  public_key: account.uploadcare_public_key,
  secret_key: account.uploadcare_secret_key
)

client.files.find(uuid: "2d33999d-c74a-4ff9-99ea-abc23496b052")
```

Active Storage:

```yml
uploadcare:
  service: Uploadcare
  public_key: <%= ENV.fetch("UPLOADCARE_PUBLIC_KEY") %>
  secret_key: <%= ENV.fetch("UPLOADCARE_SECRET_KEY") %>
  public: true
```

```ruby
config.active_storage.service = :uploadcare
```

## Operator notes

- Must: publish `uploadcare-ruby` 5.0.0 first. CI/install will fail otherwise.
- Verify: Rails 7.2, 8.0, 8.1 plus Active Storage specs are green before tagging.
- Risk: `UploadcareService` does not support direct uploads or signed private URLs. Private blobs and direct client uploads will break.
- Mitigation before tagging:
  - Set service `public: true` for affected apps.
  - Prefer uploader field helpers, not direct service calls.
  - Smoke-test previews and remote variants end-to-end.
- Per-tenant clients: use `uploadcare_client:` for mounted objects and synchronous callbacks. Async callbacks use `Uploadcare::Rails.client`.
- Migration priority: test apps that use manual API wrappers, `mount_*` macros, uploader helper aliases, or Active Storage first.

## Release checklist

Do not skip:

1. `bundle install` resolves `uploadcare-ruby (= 5.0.0)`.
2. CI green: Rails 7.2, 8.0, 8.1 plus Active Storage specs.
3. Tag: `git tag -a v5.0.0 -m "uploadcare-rails v5.0.0" && git push origin v5.0.0`.
4. Publish: confirm the `Publish Gem` workflow uploads `uploadcare-rails-5.0.0.gem`.
5. Post-release: smoke test a migrated app and verify Active Storage blobs, previews, and variants.

Rollback policy:

- If RubyGems rejects the gem before publish, delete the failed tag, fix, and retag.
- If the gem is published, do not reuse the tag. Ship a patch release.
