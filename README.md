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
