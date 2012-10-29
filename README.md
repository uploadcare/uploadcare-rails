Here is a rails gem for using uploadcare.com service.

* Add gem in your gemfile: `gem uploadcare-rails`
* Add string attribute in your model: 'rails g migration add_uploadcare_field_in_model <attribute>:string'
* Add in your model: `is_uploadcare_file :<attribute>`
* Write in your js and css:

        in css
        // = require uploadcare/widget
        
        in js
        // = require uploadcare/widget

* Add widget to your form

        / for regular form
        = form.uploadcare_uploader_field :<attribute>
        
        / form simple_form
        = form.input :<attribute> , as: :uploadcare_uploader

* Use attribute in your code:

        @my_model.attribute.public_url('crop/200x200')