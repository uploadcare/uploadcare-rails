# uploadcare-rails Modernization Analysis for `gem-rewrite-3`

## Purpose

This document is the implementation guide for moving `uploadcare-rails` onto the rewritten `uploadcare-ruby` API on the `gem-rewrite-3` branch, while also simplifying the Rails gem itself.

It is intentionally opinionated:

- `uploadcare-ruby` should be treated as the source of truth for Uploadcare API access.
- `uploadcare-rails` should become a thin Rails integration layer on top of `Uploadcare::Client`.
- multi-account support must be explicit and correct for manual usage, model mounts, background jobs, and Active Storage.
- Rails-facing names and behavior should become smaller, clearer, and more idiomatic.

Important dependency note for the follow-up implementation:

- use the GitHub `uploadcare-ruby` `gem-rewrite-3` branch as the dependency target
- do not depend on the local path copy, even though it is available for inspection

## Executive Summary

The current gem already claims alignment with `uploadcare-ruby` 5.x, but the codebase is still structured around an older surface and older calling style.

The central mismatch is architectural, not just syntactic:

- `uploadcare-ruby` `gem-rewrite-3` is centered on explicit `Uploadcare::Client` instances and domain accessors like `client.files`, `client.groups`, `client.webhooks`, and `client.conversions`.
- `uploadcare-rails` still exposes and internally relies on a second layer of wrapper classes such as `Uploadcare::FileApi`, `Uploadcare::GroupApi`, `Uploadcare::UploadApi`, and direct transport-era classes like `Uploadcare::Uploader`, `Uploadcare::UploadClient`, `Uploadcare::VideoConverter`, and `Uploadcare::DocumentConverter`.
- the Rails gem still passes around mutable config objects and global state where the rewritten SDK expects client-scoped behavior.

If we only rename method calls, we will keep the biggest current problems:

- inconsistent multi-account behavior
- Active Storage operations that silently fall back to global credentials
- a duplicated API surface that will drift again
- Rails wrappers that are more complex than the SDK they wrap

The right move is:

1. make `Uploadcare::Client` the internal center of the gem
2. rewrite all integrations to resolve a client, not a config
3. preserve feature parity, not legacy wrapper shape
4. simplify Rails-specific abstractions so they only add Rails value

## Evidence in the Current Repo

### Dependency and documentation drift

- [`uploadcare-rails.gemspec`](../uploadcare-rails.gemspec) says the gem depends on `uploadcare-ruby >= 5.0.0`.
- [`Gemfile`](../Gemfile) still points development to a local path or the old `v2-rewrite-2` branch.
- [`MIGRATING_V5.md`](../MIGRATING_V5.md) says the gem is aligned with rewritten `uploadcare-ruby` 5.x.

This means the public promise and the actual development target are currently out of sync.

### The rewritten SDK’s actual center of gravity

In `uploadcare-ruby` `gem-rewrite-3`, the intended public layer is:

- `Uploadcare::Client`
- `client.files`
- `client.groups`
- `client.uploads`
- `client.project`
- `client.webhooks`
- `client.file_metadata`
- `client.addons`
- `client.conversions`
- `client.api.rest`
- `client.api.upload`

Relevant files:

- `/Users/sward/work/contrib/uploadcare/uploadcare-ruby/lib/uploadcare.rb`
- `/Users/sward/work/contrib/uploadcare/uploadcare-ruby/lib/uploadcare/client.rb`
- `/Users/sward/work/contrib/uploadcare/uploadcare-ruby/README.md`
- `/Users/sward/work/contrib/uploadcare/uploadcare-ruby/MIGRATING_V5.md`

### The Rails gem still centers the old wrapper layer

Current entrypoints loaded by the gem:

- [`lib/uploadcare-rails.rb`](../lib/uploadcare-rails.rb)
- [`lib/uploadcare/rails/api/rest/file_api.rb`](../lib/uploadcare/rails/api/rest/file_api.rb)
- [`lib/uploadcare/rails/api/rest/group_api.rb`](../lib/uploadcare/rails/api/rest/group_api.rb)
- [`lib/uploadcare/rails/api/rest/project_api.rb`](../lib/uploadcare/rails/api/rest/project_api.rb)
- [`lib/uploadcare/rails/api/rest/webhook_api.rb`](../lib/uploadcare/rails/api/rest/webhook_api.rb)
- [`lib/uploadcare/rails/api/rest/conversion_api.rb`](../lib/uploadcare/rails/api/rest/conversion_api.rb)
- [`lib/uploadcare/rails/api/rest/file_metadata_api.rb`](../lib/uploadcare/rails/api/rest/file_metadata_api.rb)
- [`lib/uploadcare/rails/api/rest/addons_api.rb`](../lib/uploadcare/rails/api/rest/addons_api.rb)
- [`lib/uploadcare/rails/api/upload/upload_api.rb`](../lib/uploadcare/rails/api/upload/upload_api.rb)

Those wrappers are still written in the older shape:

- `get_` prefixes
- global config defaults
- direct use of transport or resource class methods
- direct use of SDK internals that are no longer the preferred public surface

## What Breaks Against `gem-rewrite-3`

### Removed or no-longer-primary call sites

The following current internal calls are tied to the pre-client API shape and should be considered migration targets:

- `Uploadcare::Uploader.upload`
- `Uploadcare::Uploader.upload_file`
- `Uploadcare::UploadClient.new(...).group_info`
- `Uploadcare::VideoConverter.convert`
- `Uploadcare::VideoConverter#fetch_status`
- `Uploadcare::DocumentConverter.convert_document`
- `Uploadcare::DocumentConverter#info`
- `Uploadcare::DocumentConverter#fetch_status`
- `Uploadcare::Addons.*`

These appear in:

- [`lib/uploadcare/rails/api/upload/upload_api.rb`](../lib/uploadcare/rails/api/upload/upload_api.rb)
- [`lib/uploadcare/rails/api/rest/group_api.rb`](../lib/uploadcare/rails/api/rest/group_api.rb)
- [`lib/uploadcare/rails/api/rest/conversion_api.rb`](../lib/uploadcare/rails/api/rest/conversion_api.rb)
- [`lib/uploadcare/rails/api/rest/addons_api.rb`](../lib/uploadcare/rails/api/rest/addons_api.rb)
- [`lib/active_storage/service/uploadcare_service.rb`](../lib/active_storage/service/uploadcare_service.rb)

### Multi-account bugs that already exist today

These are not theoretical. The current code already loses tenant/account context in multiple paths.

#### 1. Mounted wrappers mutate config instead of binding a client

The model mount code does this:

- build a wrapper object without account context
- later assign `file.config = ...` or `group.config = ...`

That pattern is fragile now and incompatible with the rewritten SDK direction, where resources retain client context.

Relevant files:

- [`lib/uploadcare/rails/active_record/mount_uploadcare_file.rb`](../lib/uploadcare/rails/active_record/mount_uploadcare_file.rb)
- [`lib/uploadcare/rails/active_record/mount_uploadcare_file_group.rb`](../lib/uploadcare/rails/active_record/mount_uploadcare_file_group.rb)
- [`lib/uploadcare/rails/mongoid/mount_uploadcare_file.rb`](../lib/uploadcare/rails/mongoid/mount_uploadcare_file.rb)
- [`lib/uploadcare/rails/mongoid/mount_uploadcare_file_group.rb`](../lib/uploadcare/rails/mongoid/mount_uploadcare_file_group.rb)

#### 2. `Uploadcare::Rails::File` ignores per-model config on instance operations

`Uploadcare::Rails::File#store`, `#delete`, and `#load` call `Uploadcare::FileApi` without passing the mounted object’s account context.

Relevant file:

- [`lib/uploadcare/rails/objects/file.rb`](../lib/uploadcare/rails/objects/file.rb)

This means a record mounted with tenant A credentials can still perform instance operations through global credentials.

#### 3. Webhook wrappers ignore config entirely

`Uploadcare::WebhookApi` methods do not accept or forward `config:` at all.

Relevant file:

- [`lib/uploadcare/rails/api/rest/webhook_api.rb`](../lib/uploadcare/rails/api/rest/webhook_api.rb)

This makes webhooks effectively global-only.

#### 4. Active Storage preview and variant paths fall back to global behavior

The previewer and variant processor build Uploadcare file objects without the service’s client or config.

Relevant files:

- [`lib/uploadcare/rails/active_storage/uploadcare_previewer.rb`](../lib/uploadcare/rails/active_storage/uploadcare_previewer.rb)
- [`lib/uploadcare/rails/active_storage/variant_remote_processing.rb`](../lib/uploadcare/rails/active_storage/variant_remote_processing.rb)

This is the most serious account-isolation problem in the Active Storage integration.

### Configuration drift and duplicated truth

The Rails gem currently keeps two separate configuration concepts:

- `Uploadcare::Rails::Configuration`
- `Uploadcare::Configuration`

Problems with the current arrangement:

- the bridge only copies `public_key` and `secret_key`
- other SDK-relevant settings can drift
- `CLIENT_CONFIG_ATTRIBUTES` duplicates SDK configuration knowledge manually
- the mount callbacks still reference `do_not_store`, but that is not a real configured attribute in the current Rails config object

Relevant files:

- [`lib/uploadcare-rails.rb`](../lib/uploadcare-rails.rb)
- [`lib/uploadcare/rails/configuration.rb`](../lib/uploadcare/rails/configuration.rb)
- [`lib/uploadcare/rails/active_record/mount_uploadcare_file.rb`](../lib/uploadcare/rails/active_record/mount_uploadcare_file.rb)
- [`lib/uploadcare/rails/mongoid/mount_uploadcare_file.rb`](../lib/uploadcare/rails/mongoid/mount_uploadcare_file.rb)

## API Mapping We Should Adopt

The Rails gem should internally rewrite all method calls to the `Uploadcare::Client` accessors below.

| Current Rails/Internal Call | `gem-rewrite-3` Target | Notes |
| --- | --- | --- |
| `Uploadcare::Uploader.upload(object: file, ...)` | `client.uploads.upload(file, ...)` or `client.files.upload(file, ...)` | prefer `client.uploads.upload` for generic routing |
| `Uploadcare::Uploader.upload_file(file: io, ...)` | `client.files.upload(io, ...)` | Active Storage should use a client instance |
| `Uploadcare::File.info(uuid: uuid, config: config)` | `client.files.find(uuid: uuid)` | retain client context |
| `Uploadcare::File.list(options: opts, config: config)` | `client.files.list(**opts)` | thin shim possible |
| `Uploadcare::File.batch_store(uuids: uuids, config: config)` | `client.files.batch_store(uuids: uuids)` | |
| `Uploadcare::File.batch_delete(uuids: uuids, config: config)` | `client.files.batch_delete(uuids: uuids)` | |
| `Uploadcare::File.local_copy(...)` | `client.files.copy_to_local(...)` | |
| `Uploadcare::File.remote_copy(...)` | `client.files.copy_to_remote(...)` | |
| `Uploadcare::Group.list(params: opts, config: config)` | `client.groups.list(**opts)` | |
| `Uploadcare::UploadClient#group_info` | `client.groups.find(group_id: group_id)` | use convenience layer unless raw parity is specifically needed |
| `Uploadcare::Group.create(uuids: files, config: config)` | `client.groups.create(uuids: files)` | |
| `Uploadcare::Project.show(config: config)` | `client.project.current` | |
| `Uploadcare::Webhook.list` | `client.webhooks.list` | must be client-scoped |
| `Uploadcare::Webhook.create(...)` | `client.webhooks.create(...)` | must be client-scoped |
| `Uploadcare::Webhook.update(...)` | `client.webhooks.update(...)` | must be client-scoped |
| `Uploadcare::Webhook.delete(...)` | `client.webhooks.delete(...)` | must be client-scoped |
| `Uploadcare::FileMetadata.index/show/update/delete` | `client.file_metadata.index/show/update/delete` | |
| `Uploadcare::Addons.*` | `client.addons.*` | |
| `Uploadcare::VideoConverter.*` | `client.conversions.videos.*` | |
| `Uploadcare::DocumentConverter.*` | `client.conversions.documents.*` | |

## Modernization Principles for `uploadcare-rails`

These are the principles the implementation should follow.

### 1. The Rails gem should not be a second SDK

The Rails gem should integrate the SDK into Rails. It should not re-invent the SDK’s public surface.

That means:

- keep Rails-only helpers
- keep model mount behavior
- keep Active Storage integration
- keep uploader view helpers
- stop duplicating Uploadcare API domain objects and transport naming unless compatibility requires a thin shim

### 2. Resolve a client once, then carry it through

Everything that touches Uploadcare should operate with an explicit `Uploadcare::Client` instance.

That includes:

- mounted attributes
- background jobs
- manual API usage
- Active Storage services
- previewers
- variant processors

This is the single most important architectural change.

### 3. Prefer explicit account context over hidden globals

Global configuration is acceptable as a default.

It should not be the only correct path.

The gem should support:

- a default global client for the common single-account case
- explicit client construction for manual multi-account usage
- proc-based client resolution for model-level per-record account selection
- multiple Active Storage service instances, each with its own client

### 4. Favor Rails-ish, Ruby-ish naming

Names should be smaller and less transport-shaped.

Recommended direction:

- avoid `get_` prefixes in primary APIs
- prefer `current` over `get_project`
- prefer `find`, `list`, `create`, `delete`, `update`
- avoid naming things after low-level transport classes

Compatibility aliases can remain, but they should be secondary.

### 5. Prioritize feature parity over wrapper compatibility

The goal is not to preserve the old wrapper layer for its own sake.

The goal is:

- keep the same capabilities users rely on
- keep the Rails integrations that matter
- feel free to rename, remove, or collapse outdated wrapper APIs

Feature parity matters. Shape parity does not.

## If We Optimized for Rails-Style Simplicity

If this gem were being designed in a more Rails-core-shaped way, the public API would likely be smaller than what we have now.

The main simplification would be this:

- expose app-facing concepts
- hide Uploadcare transport concepts
- keep low-level building blocks internal unless they unlock a real advanced use case

### Public API the app should actually see

There are four surfaces worth exposing publicly:

- configuration
- model macros
- form/view helpers
- the underlying `Uploadcare::Client` for manual API usage

Everything else should either be internal or treated as an advanced escape hatch.

### 1. Manual API usage should expose the SDK, not a Rails-specific wrapper SDK

For application code that wants to call Uploadcare directly, the public story should be:

```ruby
client = Uploadcare::Rails.client
client.files.find(uuid: params[:uuid])
client.groups.create(uuids: uuids)
client.webhooks.list
```

Not:

```ruby
Uploadcare::FileApi.get_file(...)
Uploadcare::GroupApi.create_group(...)
Uploadcare::WebhookApi.get_webhooks
```

That is more in line with how Rails usually integrates external systems:

- Rails adds setup and integration
- the underlying client remains the domain API

### 2. Model macros should hide Uploadcare jargon where possible

The current `mount_uploadcare_file` and `mount_uploadcare_file_group` naming comes from an older uploader-gem style.

If we optimize for Rails simplicity, the public model API would likely look more like:

- `has_uploadcare_file :avatar`
- `has_uploadcare_files :photos`

instead of:

- `mount_uploadcare_file :avatar`
- `mount_uploadcare_file_group :photos`

Reasoning:

- `mount_` feels pre-Rails-5 uploader-gem specific
- `file_group` is Uploadcare terminology, not app terminology
- app authors usually think in singular and plural attachments, not in Uploadcare group IDs

Internally, the plural macro can still use Uploadcare groups.

The public API does not need to expose that.

### 3. Form helpers should be field helpers first, uploader-component helpers second

The current helper surface is very implementation-shaped:

- `uploadcare_uploader_field`
- `uploadcare_uploader_field_tag`
- `uploadcare_uploader`
- `uploadcare_config_tag`
- `uploadcare_uploader_tag`
- `uploadcare_ctx_provider_tag`
- `uploadcare_form_input_tag`

That is too much public surface for what is essentially one form field.

A Rails-core-shaped public API would more likely expose:

- `f.uploadcare_file_field :avatar`
- `f.uploadcare_files_field :photos`
- `uploadcare_file_field_tag`
- `uploadcare_files_field_tag`
- one asset/setup helper if still needed

And it would keep the lower-level component assembly helpers private or undocumented.

The rule should be:

- if the helper exists because of web-component internals, do not make it part of the main public API
- if the helper maps to something app developers already think of as a form field, make that the public API

### 4. Asset/setup exposure should probably be one high-level entrypoint

`uploadcare_include_tag` is a reasonable high-level helper today, but the rest of the low-level component helpers make the setup story feel more like wiring than Rails.

The more Rails-like direction is:

- one install/setup path for JS
- one high-level assets helper if the gem still needs to own CDN inclusion
- field helpers for views
- no need for users to manually compose config tags and context provider tags in common usage

### 5. Active Storage should feel native, not special

If the app uses Active Storage, the public API should mostly be standard Active Storage API plus a configured Uploadcare service.

That means the gem should not invent a second public abstraction for that workflow.

The Rails-style story is:

- configure Uploadcare-backed services in `storage.yml`
- attach files using normal Active Storage patterns
- let the gem handle Uploadcare-specific service behavior internally

This is consistent with how Rails usually exposes integrations:

- configuration in the standard Rails place
- behavior through the standard Rails abstraction
- provider-specific mechanics behind the scenes

### 6. Public API should be layered by audience

The cleanest exposure model is:

- app developers get a small, friendly API
- advanced users can still reach `Uploadcare::Client`
- internal helpers stay internal

Recommended layering:

- primary public API: `Uploadcare::Rails.configure`, model macros, field helpers, `Uploadcare::Rails.client`
- secondary advanced API: `Uploadcare::Client`
- internal/private API: wrapper constants, component assembly helpers, cache helpers, config-serialization helpers

## Recommended Target Architecture

### A. Make client resolution a first-class Rails concern

Add a single internal client resolution path, for example:

```ruby
Uploadcare::Rails.client
Uploadcare::Rails.client(public_key: ..., secret_key: ...)
Uploadcare::Rails.resolve_client(client_or_config = nil, **options)
```

Rules:

- if given a client, return it
- if given a config, build a client from it
- if given overrides, derive from the default config
- otherwise use the default global client

Internally, the gem should pass clients, not mutable config objects.

### B. Keep Rails configuration focused on Rails concerns

`Uploadcare::Rails::Configuration` should stop trying to mirror the entire SDK configuration surface manually.

Recommended shape:

- Rails-only settings
- uploader component defaults
- caching settings
- model callback settings
- default Uploadcare client options or default SDK config

At minimum, the implementation should stop hard-coding `CLIENT_CONFIG_ATTRIBUTES` and instead serialize SDK configuration via `Uploadcare::Configuration#to_h`.

### C. Remove wrapper APIs that no longer earn their keep

We do not need to preserve the old top-level API client constants if they are only duplicating the rewritten SDK.

That means these should be evaluated for removal rather than preservation:

- `Uploadcare::UploadApi`
- `Uploadcare::FileApi`
- `Uploadcare::GroupApi`
- `Uploadcare::ProjectApi`
- `Uploadcare::WebhookApi`
- `Uploadcare::FileMetadataApi`
- `Uploadcare::AddonsApi`
- `Uploadcare::ConversionApi`

Recommended rule:

- if an abstraction only rewords the SDK, remove it
- if an abstraction adds real Rails value, keep it

### D. Stop subclassing SDK resources as the primary abstraction

Current Rails wrappers subclass SDK resources:

- [`lib/uploadcare/rails/objects/file.rb`](../lib/uploadcare/rails/objects/file.rb)
- [`lib/uploadcare/rails/objects/group.rb`](../lib/uploadcare/rails/objects/group.rb)

That is now awkward because the rewritten SDK resources already carry client context and behavior.

Recommended direction:

- either keep the existing wrapper names but make them lightweight decorators around SDK resources
- or replace them with clearer Rails-specific names like `AttachedFile` and `AttachedGroup`

The important rule is:

- Rails wrappers should add Rails behavior
- SDK resources should own API behavior

The Rails-specific additions are:

- string-backed model attribute behavior
- caching
- transformation helpers for already-uploaded files
- form/model integration semantics

## Manual Multi-Account Support: Recommended Shape

This should become a first-class documented workflow.

Recommended public usage:

```ruby
default_client = Uploadcare::Rails.client

tenant_client = Uploadcare::Rails.client(
  public_key: tenant.uploadcare_public_key,
  secret_key: tenant.uploadcare_secret_key
)

tenant_client.files.find(uuid: params[:uuid])
tenant_client.groups.create(uuids: uuids)
```

The Rails gem should treat this as the normal explicit style, not as an edge case.

### Model mounts

Model mounts should accept explicit client resolution, not just config resolution.

Recommended API:

```ruby
has_uploadcare_file :picture, uploadcare_client: -> {
  Uploadcare::Rails.client(
    public_key: tenant_uploadcare_public_key,
    secret_key: tenant_uploadcare_secret_key
  )
}
```

Backward compatibility is not a requirement here.

Recommended direction:

- prefer `has_uploadcare_file` / `has_uploadcare_files` as the new public API if we are willing to rename
- replace `uploadcare_config:` with `uploadcare_client:` if that yields a cleaner API
- keep `uploadcare_config:` only if it materially reduces migration cost without complicating the internals

Mounted objects returned by the accessor must retain client context, so that:

- `post.picture.store`
- `post.picture.delete`
- `post.picture.load`
- `post.attachments.store`
- `post.attachments.load`

all operate against the same tenant/account that built the object.

### Jobs

Jobs should receive serialized client options and reconstruct a client inside `perform`.

Do not pass live client objects through job serialization.

Recommended pattern:

- serialize `client.config.to_h`
- reconstruct with `Uploadcare::Client.new(**options.symbolize_keys)`
- execute against that client

## Active Storage Support: Recommended Shape

The Active Storage integration should be rebuilt around service-owned clients.

### A. The service should own `@client`

Current service code stores `@client_config`.

It should instead build and hold:

```ruby
@client = Uploadcare::Client.new(public_key: ..., secret_key: ..., **options)
```

Then every service method should call `@client`.

Examples:

- `upload` -> `@client.files.upload(io, store: true, metadata: custom_metadata)`
- `download` / `exist?` -> `@client.files.find(uuid: uuid)`
- `delete` -> `@client.files.find(uuid: uuid).delete`

### B. Previewers and variants must use the blob service’s client

Today the previewer and variant processor recreate file access through global wrappers or config-less objects.

That must change.

Required direction:

- get the service from the blob
- use the service’s client or helper methods
- never fall back to global Uploadcare credentials for a blob that belongs to a specific Uploadcare service instance

This is required for multi-account correctness.

### C. Multiple Uploadcare services should be the official multi-account Active Storage story

The Rails-native approach here is to define multiple services in `storage.yml`, each with distinct Uploadcare credentials.

Then applications can choose the right service using standard Active Storage patterns.

That means the gem should guarantee correctness for:

- multiple named Uploadcare services in one app
- each service having isolated client/config state
- preview and variant processing staying bound to the same service

This is much more Rails-like than inventing a second per-request credential system inside the storage service layer.

### D. Direct upload support should be treated as a separate feature

Current limitation:

- `url_for_direct_upload` is not implemented

That should not block the rewrite migration, but the design should leave room for it.

For the first modernization pass, the priorities are:

- upload
- download
- delete
- existence checks
- preview
- remote variants
- multi-service correctness

## Specific Cleanup Recommendations

### 1. Fix the callback configuration naming

The gem currently references `do_not_store`, but the configuration object actually exposes `store_files_after_save`.

Recommended direction:

- remove `do_not_store`
- use positive names consistently
- align callback behavior to names like `store_files_after_save`, `store_files_async`, `delete_files_after_destroy`, and `delete_files_async`

This is clearer and more Rails-like.

### 2. Reduce monkey-patch surface where possible

The current engine eagerly includes helpers and model extensions into global frameworks, which is conventional for Rails gems, but the integration code should stay small and predictable.

Recommended direction:

- keep `on_load` hooks
- avoid adding more global extension points than necessary
- avoid hidden magic beyond the current mount/helper/service APIs

### 3. Treat uploader helper config as its own concern

The uploader helper config is currently flattened into the same configuration object as server-side callback and caching settings.

Recommended direction:

- keep uploader defaults grouped conceptually
- avoid mixing SDK client configuration and uploader web component configuration

The gem can still expose one block, but the internal model should distinguish those concerns.

### 4. Keep docs aligned with code

After the implementation:

- README examples should use the client-based style for manual API usage
- migration docs should stop promising more than the code actually implements
- Active Storage docs should explicitly explain multi-service usage

## Proposed Implementation Phases

### Phase 1: Dependency and internal API rewrite

- point development and CI to the GitHub `gem-rewrite-3` branch
- rewrite all internal Uploadcare calls to client-based accessors
- add a single internal client resolver
- delete wrapper layers that are only legacy aliases

Expected outcome:

- the gem runs cleanly on `gem-rewrite-3`
- old internal transport calls disappear

### Phase 2: Multi-account correctness

- make mounts resolve and store clients, not mutable configs
- make wrapper instance methods preserve account context
- make jobs reconstruct clients from serialized options
- make webhook, metadata, addons, and conversions wrappers client-aware everywhere

Expected outcome:

- no path silently falls back to global credentials when a specific account was selected

### Phase 3: Active Storage correctness

- convert the service to own a client
- route preview and variant logic through the service client
- verify multiple Uploadcare services in one Rails app
- document the recommended Active Storage multi-service usage

Expected outcome:

- Active Storage is safe for multi-account setups
- preview and variant behavior no longer leak global config assumptions

### Phase 4: Public API cleanup and deprecations

- decide which wrapper constants are removed outright
- add migration notes only where they help preserve feature parity
- consider introducing clearer Rails-facing names for mounted wrappers
- update README and migration docs

Expected outcome:

- the public surface is smaller and less confusing

## What I Recommend We Keep

- `Uploadcare::Rails.configure`
- high-level uploader field helpers
- model macros
- Active Storage service
- `Uploadcare::Rails.client`

## What I Recommend We Stop Building Around

- direct calls to transport-era SDK classes
- passing config objects around as the core runtime abstraction
- mutating resource config after object creation
- using global credentials as the fallback inside account-specific flows
- preserving legacy wrapper shapes that add no Rails value
- exposing web-component plumbing helpers as the main public API

## Suggested Success Criteria for the Follow-Up Implementation

The rewrite should be considered complete only when all of these are true:

- every Uploadcare operation inside the gem goes through a resolved `Uploadcare::Client`
- manual multi-account usage is documented and tested
- model mounts retain account context across reader methods, instance operations, and jobs
- Active Storage works with multiple named Uploadcare services without leaking global config
- all user-visible features from the previous gem remain available, even if the API shape changes
- README and migration docs match the code that actually ships

## Bottom Line

The gem should move from:

- Rails wrapper gem as a second Uploadcare client

to:

- Rails wrapper gem as a focused integration layer over `Uploadcare::Client`

That is the cleanest way to align with `gem-rewrite-3`, simplify the codebase, support multi-account setups correctly, and make the public API feel more like modern Rails and modern Ruby instead of a transport wrapper from an earlier generation of the SDK.
