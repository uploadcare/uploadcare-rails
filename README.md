# UploadCare Ruby gem

## Trivia

### What is it?

`uploadcare-rails` is a Ruby gem to use [UploadCare service] with [careful-upload] library in your Rails projects with ease.

### What it can do?

It handles your UploadCare uploads using UploadCare API and store all the required information about uploaded file.
Also, it can validate uploads by size, mime type or type groups.

### Compatibility 

At the moment, gem only compatible with Rails 2.3.* but we're working on compatibility with Rails 3 and Sinatra.
It will be ready in December.

### Testing

Currently the gem is not covered with test, so __use this gem at your own risk__. On the other hand, it's pretty simple to work just fine without any problems.

## Installing

### Rails 2.3.*

Include the gem to your dependencies.
In `config/environment.rb`:
```ruby
Rails::Initializer.run do |config|
  config.gem 'uploadcare', :version => '0.1.0'
  config.gem 'uploadcare-rails', :version => '0.0.1'
end
```
And then run `rake gems:install`.

Or, if your project uses `bundler`, put this code in your `Gemfile`:
```ruby
gem "uploadcare", "~> 0.1.0"
gem "uploadcare-rails", "~> 0.0.1"
```

And then run `bundle install`.

## Using with Rails

### Preparations
At first, run a generator to create some fields for model that will keep the information about uploads:
```
script/generate uploadcare_rails BlogPost
```

It will create two fields — `uploadcare_file_uuid` and `uploadcare_file_info`. The first one handles file id to access to file instance via API. 
The second one respectively stores file information to avoid frequent remote API calls.

Run pending migration with `rake db:migrate` and follow the next step.

### Configuration files



```
sudo add-apt-repository ppa:chris-lea/node.js
sudo add-apt-repository ppa:gias-kay-lee/npm
sudo apt-get update
sudo apt-get install nodejs npm
```

Next to install NPM dependencies run in project dir:

```
npm install
```

To build CSS styles for widget you need [Compass]. For example, for Ubuntu:

```
sudo apt-get install ruby1.9.1 ruby1.9.1-dev
sudo gem1.9.1 install compass --no-user-install --bindir /usr/bin
```

[Node.js]: http://nodejs.org/
[npm]: http://npmjs.org/
[Compass]: http://compass-style.org/

### Testing

There are 2 types of tests for widgets:

* Unit tests. To run it just call `./node_modules/.bin/cake test` in project dir
  and open <http://localhost:8124/> in browser.
* Integration tests. To run it just call `./node_modules/.bin/cake watch`
  in project dir and test HTML in browser.

### Build

To build production ready JS files of widgets just call in project dir:

```
./node_modules/.bin/cake build
```
