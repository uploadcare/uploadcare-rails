/*
 * Copyright (c) 2011 UploadCare
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

;(function () {
"use strict";

window.UploadCare = {

    // Function, which are waiting UploadCare initializing.
    _readyCallbacks: [],

    // jQuery version for UploadCare.
    _jQueryMinVersion: [1, 5, 0],

    // URL to get jQuery from CDN.
    _jQueryCDN: 'http://ajax.googleapis.com/ajax/libs/' +
                'jquery/1.6.2/jquery.js',

    // Is UploadCare initialized.
    initialized: false,

    // jQuery object for UploadCare.
    jQuery: null,

    // API public key.
    publicKey: null,
    
    //Base URL
    uploadBaseUrl: "http://upload.uploadcare.com",
    
    //URLs for widget internals. Set before initialization.
    urls: {
        byIframe: {
            upload: "",
        },
        byUrl: {
            upload: "",
            status: ""
        },
        byXHR2: {
            upload: ""
        },
        fileInfo: ""
    },
    
    instances: {},

    // Call `callback`, when HTML is loaded.
    _domReady: function (callback) {
        var self     = this;
        var isLoaded = false;
        var unbind   = null;
        var loaded   = function () {
            if ( isLoaded ) {
                return;
            }
            isLoaded = true;
            unbind();
            callback.call(self)
        }

        if ( document.readyState === 'complete' ) {
            callback.call(this);
            return;
        } else if ( document.addEventListener ) {
            unbind = function () {
                document.removeEventListener('DOMContentLoaded', loaded, false);
            }
            document.addEventListener('DOMContentLoaded', loaded, false);
            window.addEventListener('load', loaded, false);
        } else {
            unbind = function () {
                document.detachEvent('onreadystatechange', loaded, false);
            }
            document.attachEvent('onreadystatechange', loaded, false);
            window.attachEvent('load', loaded, false);
        }
    },

    // Call all callbacks, which were added by `ready` method.
    _callReadyCallbacks: function () {
        this.initialized = true;
        for (var i = 0; i < this._readyCallbacks.length; i++) {
            this._readyCallbacks[i].call(this, this.jQuery);
        }
    },

    // Generate UUID for upload file ID.
    // Taken from http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/2117523#2117523
    _uuid: function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
            replace(/[xy]/g, function(c) {
                var r = Math.random() * 16|0,
                    v = (c == 'x' ? r : (r&0x3|0x8));
                return v.toString(16);
            });
    },

    // Check, that jQuery loaded and have correct version. `noCallback` will be
    // call, if page doesn’t have jQuery, `versionCallback` – if page have
    // wrong version of jQuery.
    _checkJQuery: function (jQuery, noCallback, versionCallback) {
        if ( !jQuery || typeof(jQuery) === "undefined" ) {
            noCallback.call(this);
            return;
        }
        var require, subversion, version = jQuery.fn.jquery.split('.');
        for (var i = 0; i < this._jQueryMinVersion.length; i++) {
            require    = this._jQueryMinVersion[i]
            subversion = parseInt(version[i]);
            if ( require > subversion ) {
                versionCallback.call(this);
                return;
            } else if ( require < subversion ) {
                this._getJQuery();
                return;
            }
        }
        this._getJQuery();
    },

    // Copy jQuery to UploadCare object and run all callbacks.
    _getJQuery: function () {
        if ( typeof(window.jQuery) !== "undefined" ) {
            this.jQuery = window.jQuery;
        }
        this._callReadyCallbacks();
    },

    // Load own jQuery for UploadCare.
    _loadJQuery: function () {
        var script = document.createElement('script');
        script.src = this._jQueryCDN;
        script.onload = script.onreadystatechange = function () {
            if ( typeof(window.jQuery) !== "undefined" ) {
                window.jQuery.noConflict();
                UploadCare.jQuery = window.jQuery;
                window.jQuery = UploadCare._originjQuery;
                delete UploadCare._originjQuery;
                UploadCare._callReadyCallbacks();
            }
        };

        var head = document.getElementsByTagName('head')[0];
        if ( !head ) {
            head = document.body;
        }
        
        if ( typeof(window.jQuery) !== "undefined" ) {
            this._originjQuery = window.jQuery;
        }
        
        head.appendChild(script);
    },

    // Get user public key from current script tag.
    // If no key presents, try to get public key from input tag.
    _getPublicKey: function () {
        var scripts = document.getElementsByTagName('script');
        var current = scripts[scripts.length - 1];
        this.publicKey = current.getAttribute('data-public-key');
        
        if ( UploadCare.publicKey === void 0 || UploadCare.publicKey === null ) {
            UploadCare.ready(function($) {
                $(document).ready(function() {
                    var input = $('input[data-public-key]');
                    UploadCare.publicKey = input.attr('data-public-key');
                });
            });
        }
    },

    // Return init method for widget. It will try to find inputs with some
    // `role` in DOM or jQuery node and call widget’s `enlive` method.
    _widgetInit: function (role) {
        return function (base) {
            var widget = this;
            UploadCare.ready(function ($) {
                var inputs = null;
                var $ = UploadCare.jQuery;
                if ( typeof(base.jquery) == 'undefined' ) {
                    if ( base.tagName == 'INPUT') {
                        inputs = $(base);
                    }
                } else {
                    if ( base.is('input') ) {
                        inputs = base;
                    }
                }
                if ( inputs === null ) {
                    inputs = $('[role~=' + role + ']', base);
                }

                inputs.each(function (_, input) {
                    var instanceId = UploadCare._id();
                    
                    if ( typeof(UploadCare.instances[instanceId]) === 'undefined' ) {
                        UploadCare.instances[instanceId] = {};
                    }
                    input.setAttribute('data-instance-id', instanceId);
                    
                    if ( input.getAttribute('data-upload-base-url') !== null ) {
                        UploadCare.instances[instanceId].uploadBaseUrl = input.getAttribute('data-upload-base-url');
                        UploadCare.setUrls(input.getAttribute('data-upload-base-url'));
                    } else {
                        UploadCare.instances[instanceId].uploadBaseUrl = UploadCare.uploadBaseUrl;
                    }
                    
                    UploadCare.instances[instanceId].urls = UploadCare.makeUrls( UploadCare.instances[instanceId].uploadBaseUrl );
                    
                    if( input.getAttribute('data-public-key') !== null ) {
                        UploadCare.instances[instanceId].publicKey = input.getAttribute('data-public-key');
                    } else {
                        UploadCare.instances[instanceId].publicKey = UploadCare.publicKey;
                    }
                    
                    if( input.getAttribute('data-override-style') !== null ) {
                        UploadCare.instances[instanceId].overrideStyle = input.getAttribute('data-override-style');
                    }
                    
                    if( input.getAttribute('data-only-images') !== null ) {
                        UploadCare.instances[instanceId].onlyImages = parseInt( input.getAttribute('data-only-images') );
                    }
                    
                    UploadCare._makeStateful(UploadCare.instances[instanceId]);
                    
                    widget.enlive(input);
                });
            });
        }
    },

    // Add `translation` in some `locale` as `widget` messages.
    //
    // Instead of replace `widget.messages` it will doesn’t change object link,
    // so you can copy `widget.messages` to `t` variable shortcut in
    // widget code, before add translation.
    //
    // Also it will set `messages.locale` with current locale code.
    _translate: function (widget, locale, translation) {
        widget.messages.locale = locale;
        for ( var name in translation ) {
            widget.messages[name] = translation[name];
        }
    },

    // Create Deferred promise object and add jQuery AJAX like proxy callbacks.
    _promise: function (deferred, extend) {
        if ( typeof(extend) == 'undefined' ) {
            extend = {
                progress: function () {}
            };
        }
        
        if ( typeof(deferred.state) == 'undefined' ) {
            deferred.state = function() {
                return deferred.isResolved() ? "resolved" : (deferred.isRejected() ? "rejected" : "pending");
            }
        }
        
        var promise = deferred.promise(extend);
        promise.success  = promise.done;
        promise.error    = promise.fail;
        promise.complete = promise.always;
        return promise;
    },

    // Return upload params by options hash.
    _params: function (options) {
        if ( typeof(options) == 'undefined' ) {
            options = { };
        }

        var params = {
            UPLOADCARE_PUB_KEY: options.publicKey || this.publicKey,
        };
        if ( options.meduim ) {
            params.UPLOADCARE_MEDIUM = options.meduim;
        }
        if ( options.instanceId ) {
            params.UPLOADCARE_INSTANCE_ID = options.instanceId;
        }

        return params;
    },
    
    _makeStateful: function(object) {
        object.state = {};
      
        var stateful = {
          current: 'idle',
          previous: null,
          callbacks: {},
          set: function(state) {
            this.previous = this.current;
            this.current = state;
            //console.log('State set to ' + state + ' from ' + this.previous);
            this.runCallbacks(state);
          },
          get: function() {
            return this.current;
          },
          setCallback: function(state, callback) {
            if ( typeof(this.callbacks[state]) == 'undefined' ) {
              this.callbacks[state] = [];
            }
            this.callbacks[state].push(callback);
            
            if ( this.get() == state ) {
              this.runCallbacks(state);
            }

            return this;
          },
          runCallbacks: function(state) {
            var $    = UploadCare.jQuery;
            var prev = this.previous;
            if ( typeof(this.callbacks[state]) !== 'undefined' && this.callbacks[state].length > 0 ) {
              var callbacks = this.callbacks[state];
              $(callbacks).each(function() {
                this($, prev);
              });
            }
          },
          clearCallbacks: function(state) {
            delete this.callbacks[state];
          }
        }
        
        object.state = stateful;
    },
    
    _id: function() {
        return 'id' + parseInt(Math.random() * (100000 - 1) + 1);
    },

    // Initialize jQuery object and call all function added by `ready`.
    init: function () {
        var _jq;
        
        if ( typeof(window.jQuery) !== "undefined" ) {
            _jq = window.jQuery;
        }
        
        this._checkJQuery(_jq,
            function () {
                this._domReady(function () {
                    this._checkJQuery(_jq,
                        this._loadJQuery, this._loadJQuery);
                });
            },
            this._loadJQuery);
    },

    // Call `callback` when UploadCare will be initialized. First argument will
    // by jQuery object.
    ready: function (callback) {
        if ( this.initialized ) {
            callback.call(this, this.jQuery);
        } else {
            this._readyCallbacks.push(callback)
        }
    },

    // Upload file to UploadCare and return jQuery Deferred promise.
    // UUID for uploaded file will be send to `done` callback.
    //
    // If `file` will be file input, `upload` will use iframe method to upload
    // file from user.
    //
    // If `file` will be string, `upload` will request UploadCare servers to
    // upload file from this URL. In this case promise will contain `progress`
    // function to add callbacks to uploading status.
    upload: function (file, options) {
        var params = this._params(options);

        if ( typeof(file) == 'string' ) {
            return this.byUrl.upload(file, params);
        } else {
            return this.byIframe.upload(file, params);
        }
    },

    makeUrls: function(uploadBaseUrl) {
        uploadBaseUrl = typeof(uploadBaseUrl) === "undefined" ? this.uploadBaseUrl : uploadBaseUrl;
        
        if ( uploadBaseUrl.slice(-1) === "/" ) {
            uploadBaseUrl = uploadBaseUrl.slice(0, -1);
        }
        
        var urls = {
            byUrl: {
                upload: "" + uploadBaseUrl + "/from_url/",
                status: "" + uploadBaseUrl + "/status/"
            },
            byIframe: {
                upload: "" + uploadBaseUrl + "/iframe/"
            },
            byXHR2: {
                upload: "" + uploadBaseUrl + "/iframe/"
            },
            fileInfo: "" + uploadBaseUrl + "/info/"
        }
        
        return urls;
    },
    
    setUrls: function(uploadBaseUrl) {
      this.urls = this.makeUrls(uploadBaseUrl);
    },
    
    getInstance: function(instanceId) {
      return UploadCare.instances[instanceId];
    },
    
    getInstanceOptions: function(instanceId) {
        var opts = { };
        if ( typeof(UploadCare.instances[instanceId]) !== 'undefined' ) {
            opts = UploadCare.instances[instanceId];
        }
        return opts;
    }
};

// Driver to upload file by iframe.
UploadCare.byIframe = {
    // ID counter to have unique iframe IDs.
    _lastIframeId: 0,

    // Create iframe to upload file by AJAX.
    _createIframe: function (instanceId) {
        this._lastIframeId += 1;
        var id = 'uploadcareIframe' + this._lastIframeId;
        var iframe = UploadCare.jQuery('<iframe />').attr({ id: id, name: id });
        iframe.css('position', 'absolute').css('top', '-9999px');
        
        if ( instanceId !== void(0) ) {
            iframe.addClass(instanceId);
        }
        
        iframe.appendTo('body');
        return iframe;
    },
    
    _getUploadUrl: function() {
        return UploadCare.urls.byIframe.upload;
    },

    // Create form, link it action to `iframe` and clone `file` inside.
    _createFormForIframe: function (iframe, file, instanceId) {
        var uploadUrl = this._getUploadUrl();
        
        if ( instanceId ) {
            uploadUrl = UploadCare.getInstanceOptions( instanceId ).urls.byIframe.upload;
        }
        
        var form = UploadCare.jQuery('<form />').attr({
            method:  'POST',
            action:  uploadUrl,
            enctype: 'multipart/form-data',
            target:  iframe.attr('id')
        });
        form.css('position', 'absolute').css('top', '-9999px');

        var next = file.clone(true);
        next.insertBefore(file);
        form.appendTo('body');       
        file.appendTo(form);

        return form;
    },

    // Upload file to UploadCare by iframe method and return jQuery Deferred.
    upload: function (file, params) {
        var id          = UploadCare._uuid();
        var instanceId  = null;
        var iframe      = null;
        var form        = null;
        var onlyImages  = false;
        
        if( typeof(params.UPLOADCARE_INSTANCE_ID) !== 'undefined' ) {
            instanceId = params.UPLOADCARE_INSTANCE_ID;
            delete params.UPLOADCARE_INSTANCE_ID;
        }
        
        iframe = this._createIframe(instanceId);
        form   = this._createFormForIframe(iframe, file, instanceId);
        
        if ( instanceId ) {
            params.UPLOADCARE_PUB_KEY = UploadCare.getInstanceOptions( instanceId ).publicKey;
        }
        
        params.UPLOADCARE_FILE_ID = id;
        for ( var name in params ) {
            UploadCare.jQuery('<input type="hidden" />').
                attr('name', name).val(params[name]).appendTo(form);
        }

        var deferred = UploadCare.jQuery.Deferred();
        var complete = function () {
            iframe.remove();
            form.remove();
        };
        
        var submit = function () {  
            iframe.bind('load', function (e) {
                e.preventDefault();
                deferred.resolve(id);
                complete();
            });
            iframe.bind('error', function () {
                deferred.reject();
                complete();
            });

            form.submit();
        };
        
        if ( instanceId ) {
            onlyImages = UploadCare.getInstanceOptions( instanceId ).onlyImages === 1 ? true : false;  
        }
        
        if ( onlyImages ) {
            if ( /(jpg|jpeg|bmp|gif|png)/.test( file.val().split('.')[1] ) === false ) {
                deferred.reject('onlyImages');
                complete();
            } else {
              submit();
            }
        } else {
            submit();
        }

        return UploadCare._promise(deferred);
    }
};

// Driver to upload file from Internet by URL.
UploadCare.byUrl = {
    // Period in miliseconds to check uploading progress.
    checkEvery: 1000,
    
    _getUploadUrl: function() {
        return UploadCare.urls.byUrl.upload;
    },
    
    _getStatusUrl: function() {
        return UploadCare.urls.byUrl.status;
    },

    // Send request to start uploading from Internet.
    upload: function (url, params) {
        var deferred = UploadCare.jQuery.Deferred();

        var watchers = [];
        var promise  = UploadCare._promise(deferred, {
            progress: function (callback) {
                watchers.push(callback);
                return this;
            }
        });
        
        var instanceId = null;
        var uploadUrl = this._getUploadUrl() + "?";
        var checking = null;
        var check = function (token) {
            UploadCare.byUrl.progress(token).
                success(function (data) {
                    if ( data.status == 'failure' ) {
                        deferred.reject();
                        return;
                    }
                    for ( var i = 0; i < watchers.length; i++ ) {
                        watchers[i](data);
                    }
                    if ( data.status == 'success' ) {
                        deferred.resolve(data.file_id);
                    }
                }).
                error(function () {
                    deferred.reject();
                })
        };
        
        if( typeof(params.UPLOADCARE_INSTANCE_ID) !== 'undefined' ) {
            instanceId = params.UPLOADCARE_INSTANCE_ID;
            delete params.UPLOADCARE_INSTANCE_ID;
        }

        params.pub_key = params.UPLOADCARE_PUB_KEY;
        params.source_url = url;
        
        if ( instanceId ) {
            uploadUrl = UploadCare.getInstanceOptions( instanceId ).urls.byUrl.upload + "?";
            params.pub_key = UploadCare.getInstanceOptions( instanceId ).publicKey;
        }
        
        delete params.UPLOADCARE_PUB_KEY;
        
        for ( var name in params ) {
            uploadUrl = "" + uploadUrl + "" + name + "=" + params[name] + "&";
        }
        
        uploadUrl = "" + uploadUrl + "jsoncallback=?";

        if ( url.length == 0 ) {
          deferred.reject('badFileUrl');
        } else {
          UploadCare.jQuery.ajax(uploadUrl, {dataType: "jsonp"}).
              success(function (data) {
                  checking = setInterval(function () {
                      check(data.token);
                  }, UploadCare.byUrl.checkEvery);
              }).
              error(function () {
                  deferred.reject();
              });
        }
        
        promise.complete(function() {
            clearInterval(checking);
        })
        return promise;
    },

    // Request UploadCare about uploading status and return AJAX promise.
    progress: function (token) {
        var statusUrl = "" + this._getStatusUrl() + "?token=" + token + "&jsoncallback=?";
        return UploadCare.jQuery.ajax(statusUrl, {dataType: "jsonp"});
    },
};

UploadCare._getPublicKey();
UploadCare.setUrls();
UploadCare.init();

})();
/*
 * Copyright (c) 2011 UploadCare
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

;(function () {
"use strict";

// Plain uploader widget without any style.
//
// It create simple file input before every hidden input with
// `uploadcare-plain-uploader` role. When user select file, widget will upload
// it by AJAX and set file ID to hidden input value.
//
// Widget will block form submit during file uploading.
//
// Don’t forget to add loading styles, when widget will upload files. Widget
// add `uploadcare-loading` to closes block with `uploadcare-container` role
// or to closest form.
//
// If you will add AJAX content and want to enlive new hidden inputs, call
// `UploadCare.Plain.init` with new content:
//
//     $.get('/next/page', function (html) {
//         var newContent = $(html).appendTo('.list');
//         UploadCare.Plain.init(newContent);
//     });
//
// You can add input for upload file from Internal by URL. Just set to hidden
// input `data-uploadcare-from-url` attribute with jQuery selector. On URL input
// you can set `data-uploadcare-submit` with selector to submit button.
// Or you can use `fromUrl` and `fromUrlSubmit` enlive’s options with jQuery
// objects.
UploadCare.Plain = {

    // Add widgets to inputs inside `base`. You can pass DOM node or jQuery
    // objects.
    init: UploadCare._widgetInit('uploadcare-plain-uploader'),

    // Add file input after hidden `input` to upload file to UploadCare.
    //
    // You can set widget name as `meduim` option.
    enlive: function (input, options) {
        var $ = UploadCare.jQuery;
        var instance, instanceId;

        if ( typeof(options) == 'undefined' ) {
            options = { };
        }
        
        instanceId = $(input).attr('data-instance-id');
        
        if ( instanceId ) {
            instance = UploadCare.getInstance( instanceId );
        }
        
        if ( instance ) {
            instance.state.set('startEnlive');
        }
        
        var hidden = $(input);
        var file = $('<input type="file" name="file" />');
        file.addClass('uploadcare-uploader');
        file.insertAfter(hidden);

        var upload = function (uploader) {
            var form    = uploader.closest('form');
            var contain = uploader.closest('[role~=uploadcare-container]');
            if ( contain.length == 0 ) {
                contain = form;
            }
            contain.addClass('uploadcare-loading');
            
            if ( instance ) {
                if ( instance.state.current.match(/fromUrlEnter/) ) {
                  instance.state.set('fromUrlBeforeUpload');
                } else {
                  instance.state.set('beforeUpload');
                }
                
            }

            var submitBlocking = false;
            form.bind('submit.uploadcare', function() {
                submitBlocking = true;
                return false;
            })

            var uploadOptions = { meduim: options.meduim || 'plain' };

            var publicKey = hidden.data('public-key');
            if ( publicKey ) {
                uploadOptions.publicKey = publicKey;
            }
            
            if ( instanceId ) {
                uploadOptions.instanceId = instanceId;
            }

            var uploadFrom = uploader;
            if ( !uploader.is(':file') ) {
                uploadFrom = uploader.val();
            }

            hidden.trigger('uploadcare-start');
            
            if ( instance ) {
                if ( instance.state.current.match(/fromUrl/) ) {
                  instance.state.set('fromUrlUpload');
                } else {
                  instance.state.set('upload');
                }
            }
            
            var uploading = UploadCare.upload(uploadFrom, uploadOptions);

            uploading.progress(function (data) {
                hidden.trigger('uploadcare-progress', data);
            });
            uploading.error(function (errorCode) {
                errorCode = (void 0 === errorCode || null === errorCode) ? 'network' : errorCode;
                hidden.trigger('uploadcare-error', errorCode);
                hidden.trigger('uploadcare-complete');
            });
            uploading.success(function (id) {
                if ( hidden.val() !== void(0) && hidden.val().length > 0 && hidden.attr('data-barebone') ) {
                  var vals = hidden.val().substr(1, hidden.val().length - 2).split(',');
                  vals.push(id);
                  hidden.val('[' + vals.join(',') + ']');
                } else {
                  if (hidden.attr('data-barebone')) {
                    hidden.val('['+id+']');
                  } else {
                    hidden.val(id);
                  }
                }
                
                hidden.trigger('uploadcare-success', id);
                hidden.trigger('uploadcare-complete');

                contain.removeClass('uploadcare-loading');
                
                if ( instance ) {
                    if ( instance.state.current.match(/fromUrl/) ) {
                      instance.state.set('fromUrlAfterUpload');
                    } else {
                      instance.state.set('afterUpload');
                    }
                    
                }

                form.unbind('submit.uploadcare');
                if ( submitBlocking ) {
                    form.submit();
                }
            });
        }

        var fromUrl = options.fromUrl;
        if ( !fromUrl && hidden.data('uploadcare-from-url') ) {
            var fromUrl = $(hidden.data('uploadcare-from-url'));
        }
        if ( fromUrl ) {
            fromUrl.keypress(function (e) {
                if ( e.keyCode == '13' ) { // Enter
                    upload(fromUrl);
                    e.preventDefault();
                }
            });

            var submit = options.fromUrlSubmit;
            if ( !submit && fromUrl.data('uploadcare-submit') ) {
                submit = $(fromUrl.data('uploadcare-submit'));
            }
            if ( submit ) {
                submit.click(function (e) {
                    upload(fromUrl);
                    e.preventDefault();
                });
            }
        }

        file.change(function () {
            var file = $(this);
            upload(file);
        });
        
        if ( instance ) {
            instance.state.set('endEnlive');
        }

        return file;
    }

};

})();
/*
 * Copyright (c) 2011 UploadCare
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

;(function () {
"use strict";

var $;

UploadCare.ready(function (jQuery) {
    $ = jQuery;

    // Animation easing from jQuery Easing plugin by George McGinley Smith.
    $.extend($.easing, {
        easeInOutQuad: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t + b;
            return -c/2 * ((--t)*(t-2) - 1) + b;
        },
        easeOutBounce: function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        }
    });
});

// Default one line upload widget.
//
// It create widget before every hidden input with `uploadcare-line-uploader`
// role. When user select file, widget will upload it by AJAX and set file ID
// to hidden input value.
//
// Widget will block form submit during file uploading.
//
// If you will add AJAX content and want to enlive new hidden inputs, call
// `UploadCare.Line.init` with new content:
//
//     $.get('/next/page', function (html) {
//         var newContent = $(html).appendTo('.list');
//         UploadCare.Line.init(newContent);
//     });
UploadCare.Line = {

    // Text messages. It will be set in translation, see `i18n/` dir.
    messages: { },

    // CSS for widget. Will be copied from `line-style.sass` by build script.
    style: '',

    // HTML structure of widget. Will be copied from `line-template.html`
    // by build script.
    html: '',
    
    //Stylesheet for IE support
    ie_css_url: 'http://static.uploadcare.com/assets/compat/stylesheets/ie.css',
    //ie_css_url: null,

    // Add widgets to inputs inside `base`. You can pass DOM node or jQuery
    // objects.
    init: UploadCare._widgetInit('uploadcare-line-uploader'),

    // Return transition by `path` in messages.
    message: function (path) {
        var node  = UploadCare.Line.messages;
        var names = path.split('.');
        for (var i = 0; i < names.length; i++) {
            node = node[names[i]];
            if ( typeof(node) == 'undefined' ) {
                throw('There is no translation for `' + path + '`');
            }
        }
        return node;
    },

    // Add widget after hidden `input` to upload file to UploadCare.
    enlive: function (input) {
        var hidden = $(input);
        
        if ( !($.support.opacity && $.support.htmlSerialize) && (/6.0/.test(navigator.userAgent) || /7.0/.test(navigator.userAgent)) ) {
            if ( this.ie_css_url != null) {
                var link = $('<link />').attr({
                    rel: "stylesheet",
                    type: "text/css",
                    href: this.ie_css_url
                });
                link.appendTo($('head'));
            }
            
            $('a.uploadcare-line-computer').click(function() {
                $('input.uploadcare-uploader').click();
            });
        }

        var html = this.html.replace(/{([^}]+)}/g, function (_, name) {
            if ( name == 'style' ) {
                return UploadCare.Line.style;
            } else if ( name == 'file' ) {
                return '<div data-replace="file"></div>';
            } else if ( name.match(/^t /) ) {
                return UploadCare.Line.message(name.substr(2));
            }
        });
        
        var widget = $(html).insertAfter(hidden);
        
        var instanceId = hidden.attr('data-instance-id');
        var instance;
        
        if ( instanceId ) {
            instance = UploadCare.getInstance( instanceId );
        }
        
        if ( instance ) {
            var toggleTab = function(blocks, positive) {
                var elems = [];
                $(blocks).each(function() {
                    elems = $.merge(elems, $('a', this));
                    elems = $.merge(elems, $('input', this));
                });
                
                if ( positive === void(0) ) {
                    positive = true;
                }
                
                $( elems ).each(function() {
                    var tab = $(this).attr('tabindex');
                    
                    if ( !tab ) {
                        tab = -1;
                    }
                    if ( tab && tab < 0 && positive ) {
                        $(this).attr('tabindex', '1');
                    } else {
                        $(this).attr('tabindex', '-1');
                    }
                });
            }
            
            var reset = function() {
                toggleTab(['.uploadcare-line-uploader'], false);
            }
          
            var mainWindow = function() {
                var blocks = ['.uploadcare-line-error-wrapper', '.uploadcare-line-uploading', '.uploadcare-line-filedata', '.uploadcare-line-from-url'];
                
                if ( widget ) {
                  widget.data('fromUrl', false);
                }
                
                toggleTab(['.uploadcare-line-upload']);
                toggleTab(blocks, false);
            };
            var fromUrlWindow = function() {
                reset();
                toggleTab(['.uploadcare-line-from-url']);
            };
            var uploadingWindow = function() {
                reset();
                toggleTab(['.uploadcare-line-uploading']);
            };
            var fileInfoWindow = function() {
                reset();
                toggleTab(['.uploadcare-line-filedata']);
            };
            var fromUrlExit = function($, prev) {
                var fromUrl = widget.data('fromUrl');
                if ( fromUrl ) {
                    instance.state.set('fromUrlEnter');
                } else {
                    instance.state.set('mainWindow');
                }
                widget.data('fromUrl', false);
            };
            var fromUrlUpload = function() {
              if ( widget ) {
                widget.data('fromUrl', true);
              }
            }
            
            widget.data('fromUrl', false);
            
            instance.state.setCallback('idle', reset);
            instance.state.setCallback('startEnlive', mainWindow).setCallback('mainWindow', mainWindow).setCallback('upload', uploadingWindow).setCallback('afterUpload', fileInfoWindow);
            instance.state.setCallback('fromUrlEnter', fromUrlWindow).setCallback('fromUrlUpload', uploadingWindow).setCallback('fromUrlAfterUpload', fileInfoWindow);
            instance.state.setCallback('fromUrlUpload', fromUrlUpload);
            instance.state.setCallback('reloadToBase', fromUrlExit);
        }
        
        var file   = UploadCare.Plain.enlive(hidden, {
            meduim:        'line',
            fromUrl:       $('.uploadcare-line-url', widget),
            fromUrlSubmit: $('.uploadcare-line-url-submit', widget)
        });
        file.detach().replaceAll($('[data-replace=file]', widget));
        
        widget.data('info_loaded', false);
        widget.data('instance', instance);
        widget.addClass(instanceId);

        $('a', widget).click(false);
        //$('a', widget).attr({ "tabindex": "-1" });
        //$('input', widget).attr({ "tabindex": "-1" });
        
        this.uploadingEvents(widget, hidden);
        this.fromUrlEvents(widget, hidden);

        hidden.bind('uploadcare-error', function (ev, errorCode) {
            var fixable = false;
            
            errorCode = (void 0 === errorCode || null === errorCode) ? 'network' : errorCode;
            fixable   = errorCode === 'onlyImages' ? true : false;
            UploadCare.Line.showError(widget, errorCode, fixable, function () {
                UploadCare.Line.hideUploading(widget);
            });
        });
        
        hidden.bind('uploadcare-success', function() {
            var promise = UploadCare.FileData.fetch(hidden.val(), instanceId);
            
            promise.success(function(data) {
              UploadCare.Line.showFileData(data);
            });
            promise.error(function(errorCode) {
              errorCode = (void 0 === errorCode || null === errorCode) ? 'network' : errorCode;
              hidden.trigger('uploadcare-error', errorCode);
            });
        });
        
        if ( hidden.attr('data-override-style') !== void 0 ) {
          var overrideStyle = hidden.attr('data-override-style');
          var styleTag = $('style', widget);
          var styleContent = styleTag.html();
          
          styleContent = "" + styleContent + "." + instanceId + "{" + overrideStyle + "}";
          styleTag.html(styleContent);
        }
        
        $(document).trigger('enlive');
    },

    // Add events for uploading status and animate progress bar.
    uploadingEvents: function (widget, hidden) {
        var progress = $('.uploadcare-line-progress div', widget);
        var end      = progress.parent().width() - progress.width();
        var toLeft   = function () {
            progress.animate({ left: -1 }, 800, 'easeInOutQuad', toRight);
        }
        var toRight  = function () {
            progress.animate({ left: end }, 800, 'easeInOutQuad', toLeft);
        }
        var instance = widget.data('instance');

        hidden.bind('uploadcare-start', function () {
            widget.addClass('uploadcare-uploading');
            widget.find('.uploadcare-line-slider').css({
              "margin-top": -30
            });
            toRight();
        });

        var total = $('.uploadcare-line-progress').outerWidth();
        
        progress.data('width', progress.width());
        hidden.bind('uploadcare-progress', function (e, data) {
            var percentage = data.done / data.total;
            progress.stop().css({ left: -1 });
            progress.width(total * percentage);
        });

        var uploading = $('.uploadcare-line-uploading', widget);
        var slider = $('.uploadcare-line-slider', widget);
        
        $('.uploadcare-line-cancel', uploading).click(function () {
            slider.css({
              "margin-top": 0
            });
            var iframe = $('iframe[class="' + hidden.attr('data-instance-id') + '"]');
            if ( iframe.length !== 0 ) {
              iframe.remove();
            }
            UploadCare.Line.hideUploading(widget);
        });
        
        var filedata = $('.uploadcare-line-filedata', widget);
        
        $('.uploadcare-line-filedata-close', filedata).click(function() {
            hidden.val('');
            filedata.css({
                top: 1
            });
            slider.css({
                "margin-top": 0
            });
            
            if ( instance ) {
                instance.state.set('reloadToBase');
            }
            
            UploadCare.Line.hideUploading(widget);
        });
        
    },

    fromUrlEvents: function (widget, hidden) {
        var instance, instanceId;
        
        if ( hidden ) {
            instanceId = hidden.attr('data-instance-id');
            instance   = UploadCare.getInstance(instanceId);
        };
        $('.uploadcare-line-web', widget).click(function () {
            if ( instance ) {
                instance.state.set('fromUrlEnter');
            }
            
            widget.addClass('uploadcare-from-url');
            setTimeout(function () {
                $('.uploadcare-line-url').focus();
            }, 300);
        });

        var fromUrl = $('.uploadcare-line-from-url', widget);
        $('.uploadcare-line-cancel', fromUrl).click(function () {
            if ( instance ) {
                instance.state.set('reloadToBase');
            }
            widget.removeClass('uploadcare-from-url');
            $('.uploadcare-line-url').val('');
        });
    },

    // Hide uploading status and move progress to start position.
    hideUploading: function (widget) {
        var progress = $('.uploadcare-line-progress div', widget);
        progress.stop().css({ left: -1, width: progress.data('width') });
        widget.removeClass('uploadcare-uploading');
    },

    // Show error with some `code` by widget. If you set `fixable` argument,
    // error message willn contain back button.
    //
    // Method will be get error text from translation by `code`.
    showError: function (widget, code, fixable, callback) {
        var text    = this.message('errors.' + code);
        var error   = $('.uploadcare-line-error', widget);
        $('.uploadcare-line-error-text', error).html(text);

        var wrapper = error.parent().show();
        var height  = error.show().outerHeight();
        error.css({ top: -height }).
            animate({ top: 0 }, 600, 'easeOutBounce', function () {
                widget.addClass('uploadcare-error');
                callback();
            });

        var back = $('.uploadcare-line-error-back', error).toggle(fixable);
        if ( fixable ) {
            var _this = this;
            back.one('click', function () {
                error.animate({ top: -height }, 400, 'easeInOutQuad',
                    function () {
                        wrapper.hide();
                        widget.removeClass('uploadcare-error');
                    });
                _this.hideUploading(widget);
                $('.uploadcare-line-slider', widget).css({ "margin-top": 0 });
            });
        }
    },
    
    showFileData: function(fileData) {
        var widget = $('input[value=' + fileData.file_id + ']').next();
        var uploadPane  = $('.uploadcare-line-slider', widget);
        var fileDataPane = $('.uploadcare-line-filedata', widget);
        var filename = $('.uploadcare-line-filedata-filename', widget);
        var filesize = $('.uploadcare-line-filedata-filesize', widget);
        var human_size = Math.ceil(fileData.size / 1024) + "kb";
        var human_filename = fileData.original_filename;
        
        if ( human_filename.length > 16 ) {
          human_filename = human_filename.slice(0, 8) + '...' + human_filename.slice(-8);
        }

        filename.html(human_filename);
        filename.innerHTML = human_filename;
        filesize.innerHTML = human_size;
        filesize.html(human_size);
        fileDataPane.animate({top: 0});
        uploadPane.css({ "margin-top": -60 });
        
        widget.data('info_loaded', true);     
    }

};

})();
;(function() {
  UploadCare.FileData = {
    timeout: 15000,
    
    fetch: function(uuid, instanceId) {
      var requestUrl = this._getRequestUrl();
      var pubKey = UploadCare.publicKey
      
      if ( instanceId ) {
        requestUrl = UploadCare.getInstanceOptions( instanceId ).urls.fileInfo;
        pubKey = UploadCare.getInstanceOptions( instanceId ).publicKey;
      }

      // Barebone support
      if ( uuid.indexOf('[') != -1 ) {
        console.log('here');
        var vals = uuid.substr(1, uuid.length - 2).split(',');
        uuid = vals[vals.length - 1];
      }
      
      requestUrl = "" + requestUrl + ("?pub_key=" + pubKey);

      if ( typeof uuid === void 0 ) {
        throw "UUID must be specified";
      }
      
      requestUrl = "" + requestUrl + "&file_id=" + uuid + "&jsoncallback=?";
      
      try {
        var $        = UploadCare.jQuery;
        var _$       = $(this);
        var deferred = $.Deferred();
        var xhr      = $.ajax( requestUrl, {
          dataType: "jsonp",
          global: true,
          beforeSend: function(jqXHR, settings) {
            _$.data('_xhr', jqXHR);
            
            jqXHR.state = function() { 
              return jqXHR.isResolved() ? "resolved" : (jqXHR.isRejected() ? "rejected" : "pending"); 
            }

            $(_$).bind('start-timeout', function(ev, t) {
              var tries = 0;
            
              t = ( t === void 0 || typeof(t) == "undefined" ) ? _$.timeout : t;
              
              if ( jqXHR.readyState != 4 && (void 0 === jqXHR.status || jqXHR.status >= 400) ) {
                var timer = setInterval(function() {
                  switch( jqXHR.state() ) {
                    case "resolved":
                    case "rejected":
                      void( 0 );
                      break;
                    case "pending":
                      if ( tries < 3 ) {
                        tries += 1;
                      } else {
                        clearInterval(timer);
                        jqXHR.abort();
                      }
                      break;
                  }
                }, t);
              }
            });
            
            return true;
          }
        }).success( function(data) {
          deferred.resolve(data);
        }).error( function(e) {
          deferred.reject('misconfiguration');
        });
      } catch( error ) {
        deferred.reject('misconfiguration');
      } finally {
        if ( !deferred.isResolved() ) {
          if ( !xhr || xhr === void 0 ) {
            xhr = _$.data('_xhr');
          }
          
          if ( !xhr.isResolved() ) {
            _$.triggerHandler('start-timeout', 1000);
          } else {
            deferred.resolve(xhr.data('response'));
          }
        }
      }

      return UploadCare._promise(deferred);
    },
    
    _getRequestUrl: function() {
      return UploadCare.urls.fileInfo;    
    }
  };
  
  UploadCare.ready(function(jQuery) {
    jQuery(document).ready(function() {
      UploadCare.jQuery.ajaxPrefilter( "script", function( s ) {
      	if ( s.cache === undefined ) {
      		s.cache = false;
      	}
      	if ( s.crossDomain ) {
      		s.type = "GET";
      		s.global = true;
      	}
      });
    });
  });
})();
;(function() {
  UploadCare.DragDrop = {
    useLargeDropZone: false,
    started: false,
    eventTimer: false,
    idle: true,
    
    selectors: {
      widget: 'div.uploadcare-line-uploader',
      cropper: 'div.uploadcare-line-cropper',
      slider: 'div.uploadcare-line-slider',
      filedata: 'div.uploadcare-line-filedata'
    },
    
    init: function () {
      return UploadCare.ready(function($) {
        try {
          if ( $(UploadCare.DragDrop.selectors.widget).length === 0 ) {
            throw "Widget block not found. Do you use inline version if widget?";
          }
          if ( 'draggable' in document.createElement('span') === false ) {
            throw "D&D not available, please use modern browser.";
          }
        } catch ( error ) {
          return;
        } finally {
          UploadCare.DragDrop.enlive($);
        }
      });
    },
    enlive: function ($) {
      var dragzone, dropzone, filedata, hidden, slider, upload, widget, dropbox;
      
      widget   = $(this.selectors.widget);
      hidden   = $(widget).prev();
      slider   = $(this.selectors.slider, widget);
      filedata = $(this.selectors.filedata, widget);
      dragzone = $('.uploadcare-line-thumb', slider).first();
      dropzone = this.createDropZone($, widget);
      dropbox  = $('div.uploadcare-line-thumb-empty', slider);
      
      this.dragDropEvents(dragzone, dropzone);
      
      //TODO: Move to separated method
      dropbox.css({
        cursor: 'pointer'
      }); 
      dropbox.mouseover(function(e) {
        UploadCare.DragDrop.onDragOver(e, dragzone, dropzone);
      });
      dropzone.mouseleave(function(e) {
        UploadCare.DragDrop.onDragLeave(e, dragzone, dropzone);
      }).click(function(e) {
        e.preventDefault();
        window.location = 'http://uploadcare.com';
      }).css({
        cursor: 'pointer'
      });
      
      upload = function (files) {
        var uploading;
        
        uploading = UploadCare.DragDrop.process(widget, hidden, files);
        uploading.success(function (id) {
          hidden.val(id);
          hidden.trigger('uploadcare-success', id);
          hidden.trigger('uploadcare-complete');
          
          UploadCare.DragDrop.idle = true;
        });
        
        uploading.error(function (errorNotReject) {
          errorNotReject = typeof errorNotReject === void 0 ? false : errorNotReject;
          
          if (errorNotReject) {
            UploadCare.Line.showError(widget, 'unknown', true, function() {
              UploadCare.Line.hideUploading(widget);
            });
          } else {
            filedata.css({
              top: 1
            });
            slider.css({
              "margin-top": 0
            });
            UploadCare.Line.hideUploading(widget);
            UploadCare.DragDrop.idle = true;
          }
        });
      };
      
      dropzone.bind('file-drop', function (ev, dev) {
        var files;
        files = dev.dataTransfer.files;
        if ( typeof files !== "undefined" && files !== null && files.length !== 0 ) {
          UploadCare.DragDrop.idle = false;
          upload(files);
        } else {
          UploadCare.DragDrop.onDragLeave(ev, dragzone, dropzone);
        }
      });
    },
    
    createDropZone: function ($, widget) {
      var cropper, dropZoneContainer, dropZoneNode, dropZoneNotification, dndLeftCorner, dndRightCorner, dropZoneDecorator;
      cropper = $(this.selectors.cropper, widget);
      
      dropZoneContainer = $('<div/>').attr({
        "class": this.useLargeDropZone ? "uploadcare-line-largedrop" : "uploadcare-line-tinydrop"
      });
      
      dropZoneDecorator = $('<div/>').attr({
        "class": "uploadcare-line-drop-decoration"
      }).css({
        width: widget.width() - 20,
        height: widget.height()
      });
      
      dropZoneArray = $('<span />').attr({
        "class": "dnd-arrow"
      });
      //dropZoneNotification.html('Drop files here');
      dropZoneArray.appendTo(dropZoneDecorator);
      
      dropZoneNotification = $('<span />');
      dropZoneNotification.html('Drop file here');
      dropZoneNotification.attr({ "class": "droptext"});
      dropZoneNotification.appendTo(dropZoneDecorator);
      
      var branding;
      
      branding = $('<span />');
      branding.attr({ "class": "branding" });
      branding.html('Powered by <strong>UploadCare</strong>');
      branding.appendTo(dropZoneDecorator);
      
      dndLeftCorner = $('<div />').attr({ "class": "lc" });
      dndRightCorner = $('<div />').attr({ "class": "rc" });
      
      dndLeftCorner.appendTo(dropZoneDecorator);
      dndRightCorner.appendTo(dropZoneDecorator);
      dropZoneDecorator.appendTo(dropZoneContainer);
      
      dropZoneNode = $('<div/>').attr({
        "class": "uploadcare-line-dropzone"
      });
      dropZoneNode.css({
        width: widget.width(),
        height: widget.height()
      });
      
      dropZoneContainer.appendTo(cropper);
      dropZoneNode.appendTo(dropZoneContainer);
      return dropZoneNode;
    },
    
    dragDropEvents: function (dragzone, dropzone) {
      var cooldownEvent;
      
      cooldownEvent = function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
        return ev;
      };
      
      var dde = function(event) {
        if ( UploadCare.DragDrop.eventTimer !== false ) {
          clearTimeout(UploadCare.DragDrop.eventTimer);
          UploadCare.DragDrop.eventTimer = false;
        }
        if ( UploadCare.DragDrop.idle === true ) {
          switch(event.type) {
            case 'drop':          
              UploadCare.DragDrop.started = false;
              UploadCare.DragDrop.onDragLeave(event, dragzone, dropzone);
              break;
            case 'dragleave':
              UploadCare.DragDrop.eventTimer = setTimeout(function() {
                UploadCare.DragDrop.started = false;
                UploadCare.DragDrop.onDragLeave(event, dragzone, dropzone);
              }, 100);
              break;
            case 'dragover':
            case 'dragenter':
              if ( UploadCare.DragDrop.started === false ) {
                UploadCare.DragDrop.started = true;
                UploadCare.DragDrop.onDragOver(event, dragzone, dropzone);
              }
          }
        }
        return cooldownEvent(event);
      }
      
      UploadCare.jQuery(document).bind('drop', dde).bind('dragenter', dde).bind('dragover', dde).bind('dragleave', dde);

      dropzone[0].ondrop = function (ev) {
        UploadCare.DragDrop.onDrop(cooldownEvent(ev), dragzone, dropzone);
        dropzone.trigger('file-drop', ev);
      };
      
      return null;
    },
    
    process: function (widget, hidden, files) {
      var deferred, form, getProgress, options, uploading, xhr;
      
      form = new FormData();
      deferred = UploadCare.jQuery.Deferred();
      options = UploadCare._params({
        pubKey: UploadCare.publicKey,
        meduim: 'line'
      });
      
      options.UPLOADCARE_FILE_ID = UploadCare._uuid();
      
      hidden.trigger('uploadcare-start');
      
      getProgress = function (ev) {
        if (ev.lengthComputable) {
          hidden.trigger('uploadcare-progress', {
            done: ev.loaded,
            total: ev.total
          });
        }
      };
      
      UploadCare.jQuery.each(options, function(key, value) {
        return form.append(key, value);
      });
      
      form.append('file', files[0]);
      
      xhr = new XMLHttpRequest;
      
      xhr.upload.addEventListener('progress', getProgress, false);
      xhr.addEventListener('abort', function() {
        return deferred.reject();
      }, false);
      xhr.addEventListener('error', function() {
        return deferred.reject(true);
      }, false);
      xhr.addEventListener('load', function() {
        return deferred.resolve(options.UPLOADCARE_FILE_ID);
      }, false);
      
      xhr.open("POST", UploadCare.byIframe._getUploadUrl(), true);
      xhr.send(form);
      
      uploading = UploadCare.jQuery('.uploadcare-line-uploading', widget);
      UploadCare.jQuery('.uploadcare-line-cancel', uploading).click(function() {
        xhr.abort();
      });
      return UploadCare._promise(deferred);
    },
    
    onDragOver: function (ev, dragzone, dropzone) {
      var widget = dragzone.parents(this.selectors.widget);
      
      widget.addClass('uploadcare-line-uploader-dnd');
      
      dragzone.parents(this.selectors.slider).css({
        "margin-top": -90
      });
      widget.find(this.selectors.filedata).css({
        top: -1
      });
      // dropzone.prev().animate(dropzone.prev().data('margin'));
      // widget.animate({
      //   width: 350,
      //   height: 70
      // }, function() {
      //   dropzone.css({
      //     width: 350,
      //     height: 70
      //   });
      // });
      
      return null;
    },
    
    onDragLeave: function (ev, dragzone, dropzone) {
      var widget = dragzone.parents(this.selectors.widget);
      var slider = dragzone.parents(this.selectors.slider);
      var filedata = widget.find(this.selectors.filedata);
      
      widget.removeClass('uploadcare-line-uploader-dnd');
      
      // dropzone.prev().animate({
      //   "margin-top": 0
      // });
      // widget.animate(widget.data('dimensions'), function() {
        slider.css({
          "margin-top": 0
        });
        filedata.css({
          top: 1
        });      
      // });
      
      return null; 
    },
    
    onDrop: function (ev, dragzone, dropzone) {
      var widget = dragzone.parents(this.selectors.widget);
      var slider = dragzone.parents(this.selectors.slider);
      var filedata = widget.find(this.selectors.filedata);
      
      widget.removeClass('uploadcare-line-uploader-dnd');
      
      // dropzone.prev().animate({
      //   "margin-top": 0
      // });
      // widget.animate(widget.data('dimensions'), function() {
        slider.css({
          "margin-top": -30
        });
        filedata.css({
          top: 1
        });
      // })
      
      return null;
    }
  };
})();

UploadCare.ready(function($) {
  $(document).bind('enlive', function() {
    UploadCare.DragDrop.init();
  });
});
UploadCare._translate(UploadCare.Line, 'en', {
    uploadFrom: 'Upload from',
    computer:   'Computer',
    web:        'Web',
    uploading:  'Uploading…',
    cancel:     'Cancel',
    back:       'Back',
    url:        'URL',
    done:       'Done',
    errors: {
        network: 'You have problem with Internet',
        unknown: 'Something awful happened',
        misconfiguration: 'Please check your widget config',
        badFileUrl: 'Incorrect file URL.',
        onlyImages: 'Only images allowed.'
    }
});
UploadCare.Line.html = '<div class="uploadcare-line-uploader"><style scoped="scoped">{style}</style><div class="uploadcare-line-error-wrapper"><div class="uploadcare-line-error"><div class="uploadcare-line-error-cloud"></div><div class="uploadcare-line-error-rain"></div><div class="uploadcare-line-error-text"></div><a href="#" title="{t back}" class="uploadcare-line-error-back"></a></div></div><div class="uploadcare-line-cropper"><div class="uploadcare-line-slider"><div class="uploadcare-line-upload"><div class="uploadcare-line-thumb"><div class="uploadcare-line-thumb-empty"></div></div><div class="uploadcare-line-buttons"><div class="uploadcare-line-file-input">{file}<a href="#" class="uploadcare-line-computer"><div class="uploadcare-line-icon"></div>{t computer}</a></div><a href="#" class="uploadcare-line-web"><div class="uploadcare-line-icon"></div>{t web}</a></div>{t uploadFrom}</div><div class="uploadcare-line-from-url"><div class="uploadcare-line-title">{t url}</div><div class="uploadcare-line-right"><input type="url" class="uploadcare-line-url" /><div class="uploadcare-line-buttons"><a href="#" class="uploadcare-line-url-submit">{t done}</a></div><a href="#" title="{t back}" class="uploadcare-line-cancel"></a></div></div></div><div class="uploadcare-line-uploading"><div class="uploadcare-line-thumb"><div class="uploadcare-line-thumb-empty"></div></div><a href="#" title="{t cancel}" class="uploadcare-line-cancel"></a><div class="uploadcare-line-progress"><div></div></div>{t uploading}</div><div class="uploadcare-line-filedata"><div class="uploadcare-line-filedata-icon-placeholder"><div class="uploadcare-line-filedata-icon-placeholder-icon"></div></div><div class="uploadcare-line-filedata-filename"></div><div class="uploadcare-line-filedata-filesize"></div><div class="uploadcare-line-buttons"><a href="#" title="{t cancel}" class="uploadcare-line-filedata-close">{t cancel}</a></div></div></div></div>';UploadCare.Line.style = '.uploadcare-line-uploader{width:293px;height:30px;line-height:30px;-webkit-border-radius:2px;-moz-border-radius:2px;-ms-border-radius:2px;-o-border-radius:2px;border-radius:2px;border:1px solid #d8d8d8;background:#f6f6f6;background:-webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #fcfcfc), color-stop(100%, #ececec));background:-webkit-linear-gradient(#fcfcfc,#ececec);background:-moz-linear-gradient(#fcfcfc,#ececec);background:-o-linear-gradient(#fcfcfc,#ececec);background:-ms-linear-gradient(#fcfcfc,#ececec);background:linear-gradient(#fcfcfc,#ececec);color:#333;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:13px;font-weight:bold;-webkit-box-shadow:rgba(0,0,0,0.08) 0 1px 3px;-moz-box-shadow:rgba(0,0,0,0.08) 0 1px 3px;box-shadow:rgba(0,0,0,0.08) 0 1px 3px;position:relative}.uploadcare-line-uploader.uploadcare-error{-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}.uploadcare-line-cropper{position:absolute;top:-1px;left:-1px;height:100%;width:100%;padding:1px;overflow:hidden}.uploadcare-line-thumb{float:left;width:30px;height:30px;border-right:1px solid #d8d8d8;margin-right:9px;position:relative}.uploadcare-line-thumb-empty{position:absolute;top:3px;left:3px;width:25px;height:25px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAACiklEQVRIx+WWy2sTURjFg6W0SkHd1F22BXERXYsrty1YQYO6shbqQoQu3Ijozv/BjX+AG1015DUhLyfvTMw7MQtj8ZEYFMSJTcr1nGEGk3EyKTiuvHCSzNx7f+fem+/7uC6/338uFArtSZL0PhwOdwKBwIbL1PBuC/0/IBGJRAS/MSeLuQumcRtkkEUm2VpHLBaLp9PpUblcflMqlYqVSuWG2URRlMe5XG5cLBYFVSgUBJ7f1Wq1xclxnEsGWWSSrXVkMpmvjUajJITwQtcgt9kE7zzQI+jJhHagY6Zxbp3hJZNsrQOr+owVBFwONzLJNtzvQetOm5BJtuv/awhFN0LzLUJzn0J4Snh3wlEThK0nlUod5vN5hq5AeH5EqJ46MgAJ9BR6PidSLiBXDpAXolqtCvz+gO/TR+Ymk8nviUSCGXzSxuQ8Ter1uqARdjHXZIqLI1B5DACdsTHxGCbcCU1gZntcU1yct8pSgUl/mPh8Pq02oe+syWS/2+0enxxj8T/+5tqZBIPBB4gqGVuXAT40jguGP+PxeAR9rzHm9lyTdrstoc4oyM5l88Ber7eO0tBkQcS2hWGCAih4FIBkBoPBJSuTKS4+LkNXZpSGleFweLeJRjhNjCMDJD8ej71Wi9PnzuRaDV6C0Z1Wq6UZUZ1Ohwab6Ftwstgtqaq6jQ21sANlNBpdddRgwmgZuskj+CcGf92QkQ2E4TOnuWSSrT3IsvwNRS/qtAmZZGsPSLJ2Nps9iEajL+H+AiX8osVuXxk3FbvbCueSQRaZZGsd/X7/IcKyieT6ghL+CSvYsqhDaT35bG8rnEsGWWSSbUTNKnQL2oXuQ2sWkXXddFOZdVtZ0xm7OnOV738BeS37eGOiGg0AAAAASUVORK5CYII=") no-repeat 50% 50%}.uploadcare-line-buttons{float:right}.uploadcare-line-buttons a{display:block;float:left;height:22px;line-height:22px;margin:3px 3px 0 0;padding:0 7px;border:1px solid #abcddc;border-color:#abcddc #a0c3d3 #92b8c9 #a0c3d3;text-decoration:none;color:#7dadc1;text-shadow:#fff 0 1px 1px;font-size:12px;background:#e6f5fb;background:-webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #f4fbfe), color-stop(100%, #d5eef8));background:-webkit-linear-gradient(#f4fbfe,#d5eef8);background:-moz-linear-gradient(#f4fbfe,#d5eef8);background:-o-linear-gradient(#f4fbfe,#d5eef8);background:-ms-linear-gradient(#f4fbfe,#d5eef8);background:linear-gradient(#f4fbfe,#d5eef8);-webkit-border-radius:2px;-moz-border-radius:2px;-ms-border-radius:2px;-o-border-radius:2px;border-radius:2px;-webkit-box-shadow:rgba(0,0,0,0.1) 0 1px 1px;-moz-box-shadow:rgba(0,0,0,0.1) 0 1px 1px;box-shadow:rgba(0,0,0,0.1) 0 1px 1px}.uploadcare-line-buttons .uploadcare-line-icon{position:absolute;left:7px}.uploadcare-line-cancel{display:block;float:right;width:8px;height:9px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAJCAQAAAClWqWlAAAAj0lEQVQI1wXBwQmDMBgG0G8Cbx6zQCFLFDqVdwdwjAxgsFAwUUFQcvgvthsIBsxFzO3re7Cl/bQPAGi1fdsSzo3so9VW93GkcziaJQf66GPgko8GVMlIFgolJ0MF4PuSe+NGuX9PAJ0eolCyZOEQOw0/zVxzMsmseaafcNVhPw0V1WnCftVgwYoKAKhYsfgDIRFiQ7984PoAAAAASUVORK5CYII=") no-repeat 50% 50%;padding:2px;margin:9px 4px 0 1px}.uploadcare-line-slider{-webkit-transition:all,300ms;-moz-transition:all,300ms;-ms-transition:all,300ms;-o-transition:all,300ms;transition:all,300ms;position:relative;margin:0}.uploadcare-line-buttons .uploadcare-line-computer{padding-left:28px;position:relative;margin-top:0}.uploadcare-line-buttons .uploadcare-line-computer .uploadcare-line-icon{top:5px;width:16px;height:13px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAANCAMAAACXZR4WAAAAP1BMVEUAAAD///////+Qrrytx9OvydeRr72SsL+Tsb+XtsSXt8WZuMeZuciausmcvMufv8+gwtGiw9OkxdWkxtalx9d4pYbSAAAABnRSTlMAWoCz2dmZsTKvAAAAU0lEQVQI162OOxaAIBADAyjIrnzl/md1UcRn7zRJpgoA47aBM+h4PfGX2DG5K7+CfxOBnh8UZFpKOQ1yIouQa2u1v5IsmrEeTUpkjkUyLVD6gzoBORkEIOkz/78AAAAASUVORK5CYII=") no-repeat 50% 50%}.uploadcare-line-buttons .uploadcare-line-web{padding-left:29px;position:relative}.uploadcare-line-buttons .uploadcare-line-web .uploadcare-line-icon{top:2px;width:17px;height:18px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAASCAYAAAC9+TVUAAAC/UlEQVQ4y41US0wTURStBKPRsFA3khgVt7rSxMQYVixwoTFu1BiWLoiGxIULjTGCiQsWIAK1bbAWCq1QWgXbWkpbpp1+7WdaoD9KQfk0fKRSAWmhn+e9IzUFRX3JyZt359xzz33z3nA4fxgNsoGDjXLtrSaFrgkgeC4frIN1JcSLOP8aQNoDSY+a+6gNkc7RYwlMPAjPLFR7xqdv89TmaHPf0CIIXttVoLFXe+zFO8NHudkrIIQ8BlwGnIotJUpNI5Gz8Hw3sZZ8wlWZCfAkWHC7gFy7j6s0TvA1NpLN5cox1vreON/ST/FhJpjI01hJm85JhEMeItA6CLjt3ibS0m/kqj1hvcLhD0NFtgLM9yW014lJYtqXEhm9pJ0eJp1WP+mgR1ghcFTBCsAelPA1lrQpMIkt3MwLQ/V7r4cYIrEF0l22IHnrHo9J7MGs1BHK4Lrd5CMCjS3Mkvlq+g7afGNiGgrdCQZsCTUT8UXm4m2z8RWuwhke67IGiNQe2pDYQ6yjV3oXujnMkVBuETMRk4GL8rwAfIXjSMAWhAY3Iiq1js6hiMQWzKAIQkR5iVjvOI8iKmdk6lKhC57aQqFdscXP7gP7bB4l2AY6yOVydSiIcRnN3OD00oyix+iuKBRR2EcpFMhXxGQWkBia/dKBm7+QWGtCp4NM+CpH7w3XtipNBA7RkbwIkK6srKfqYa5lW9gSk1r9qxAr2+IcEhpcuVg8UcZJbabPCHXOda6SJoVugHQAZ6VnzJ930u8KufPvobCwx+KLAq8YyUVG/6QKNxAd7TzJnUZmCt3InKG4lPZ5f+2bxpqdW16pKax6oc8VioiNzPJOkY10pqbb5l8CTg2gassFoUaiWliXbCNnstmqD8wYhW3BNSgtKFCMAj9PNvUQ3q9agp+UELv42wXEtgCVwel50UsVPQwJBAF3J4V3B8U7DE5qNZl6Crxzf/0dAOEkoPrb92R9eHZR5IrOdH9e/MpLbqafQfw6YD/nfwd+HcAJwGnAUcDe3bg/ALpRdnZzPzzmAAAAAElFTkSuQmCC") no-repeat 50% 50%}.uploadcare-line-file-input{float:left;overflow:hidden;position:relative;margin-top:3px}.uploadcare-line-file-input input{position:absolute;top:0;left:0;width:100%;height:100%;filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);opacity:0;cursor:pointer;z-index:2}.uploadcare-line-uploader.uploadcare-from-url .uploadcare-line-slider{left:-293px}.uploadcare-line-from-url{position:absolute;top:0;left:293px;width:293px}.uploadcare-line-title{margin:0 5px 0 10px;float:left}.uploadcare-line-url{float:left;border:1px solid #b9bcbe;border-color:#b9bcbe #bdc0c2 #c1c5c7 #bdc0c2;-webkit-border-radius:2px;-moz-border-radius:2px;-ms-border-radius:2px;-o-border-radius:2px;border-radius:2px;background:#fff;color:#777;height:22px;width:160px;padding:0 5px;-webkit-box-shadow:rgba(0,0,0,0.15) 0 1px 1px 0 inset;-moz-box-shadow:rgba(0,0,0,0.15) 0 1px 1px 0 inset;box-shadow:rgba(0,0,0,0.15) 0 1px 1px 0 inset;margin:3px 3px 0 0}.uploadcare-line-url:focus{outline:none}.uploadcare-line-right{float:right}.uploadcare-line-right .uploadcare-line-buttons{float:left}.uploadcare-line-right .uploadcare-line-cancel{float:left}.uploadcare-line-uploader.uploadcare-uploading .uploadcare-line-slider{margin-top:-30px}.uploadcare-line-progress{float:right;width:137px;height:4px;margin:12px 4px 0 0;border:1px solid #c9c9c9;border-top-color:#bbb;-webkit-border-radius:2px;-moz-border-radius:2px;-ms-border-radius:2px;-o-border-radius:2px;border-radius:2px;background:#d8d8d8;-webkit-box-shadow:#d0d0d0 0 1px 0 0 inset;-moz-box-shadow:#d0d0d0 0 1px 0 0 inset;box-shadow:#d0d0d0 0 1px 0 0 inset;position:relative}.uploadcare-line-progress div{position:absolute;width:40px;height:4px;top:-1px;left:-1px;border:1px solid #a9ccdb;-webkit-border-radius:2px;-moz-border-radius:2px;-ms-border-radius:2px;-o-border-radius:2px;border-radius:2px;background:#b7e2f3 url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAEAQMAAACTPww9AAAABlBMVEWb1u634vNqPjngAAAAEElEQVQI12N4wHCBYQNDAQAMuALRrGb97AAAAABJRU5ErkJggg==");-webkit-box-shadow:rgba(255,255,255,0.3) 0 1px 0 0 inset;-moz-box-shadow:rgba(255,255,255,0.3) 0 1px 0 0 inset;box-shadow:rgba(255,255,255,0.3) 0 1px 0 0 inset}.uploadcare-line-error-wrapper{display:none;position:absolute;top:-1px;left:-1px;overflow:hidden;z-index:10}.uploadcare-line-error{padding:5px 0;line-height:20px;width:293px;border:1px solid #dda1a5;-webkit-border-radius:2px;-moz-border-radius:2px;-ms-border-radius:2px;-o-border-radius:2px;border-radius:2px;color:#d15d62;background:#fff;-webkit-box-shadow:rgba(206,88,93,0.45) 0 0 15px 0 inset;-moz-box-shadow:rgba(206,88,93,0.45) 0 0 15px 0 inset;box-shadow:rgba(206,88,93,0.45) 0 0 15px 0 inset;position:relative;display:inline-block}.uploadcare-line-error-cloud{position:absolute;top:6px;left:9px;width:18px;height:12px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAMCAYAAABvEu28AAAAsElEQVQoz2NgQAMXY5PYgZgFymYC4iwgvgHE/6H4LxCfAmJvBmwAKCEHxBOA+AwQHwXiEiDOBeLfSIYg4ydAbItuiBIQn8Si+C8OQ2B4ERAzwwxhAeIWAhpw4f1ALIocJkvINGgHEHPBDNIE4otkGvQBiPuAmA9k0DEyDUHGXQx4YoUU/Apk0E8qGPQNZNAXKhh0iAGa8Cgx7AEQO4AM4gDiTCDeBU36pOBVQOwOin0AgvHi6I+GKv8AAAAASUVORK5CYII=") no-repeat 50% 50%}.uploadcare-line-error-rain{position:absolute;top:18px;left:10px;height:8px;width:15px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAHCAYAAADXhRcnAAAAb0lEQVQY02NggIKLsUmBDFgALvFLMPFLscldQEXzMRVgFweKQcQvxiQxAxlvgQrTUBRAxYE4DU0jqjhQox6SZAeSzXpIbCTxJD1s/jsJxLeJFUf2HxvQqf+Api5GCxg2oMZ/F9HEsdmsh1U8Brs4AKuWR7uentiJAAAAAElFTkSuQmCC") repeat 0 0;animation:uploadcare-line-pulse 1.3s linear infinite;-webkit-animation:uploadcare-line-pulse 1.3s linear infinite;-moz-animation:uploadcare-line-pulse 1.3s linear infinite}.uploadcare-line-error-text{float:left;margin-left:36px;width:225px}.uploadcare-line-error-back{display:block;float:right;padding:2px;margin:4px 4px 0 0;width:8px;height:8px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIBAMAAAA2IaO4AAAAGFBMVEUAAADRXWLRXWLRXWLRXWLRXWLRXWLRXWJUkwjSAAAAB3RSTlMAFSotur3qBiuZYwAAACZJREFUCNdjEFVgdmQITzYrZTArS09mYE4vMwARChAuWELUgDkQAK1mCNkIwNXGAAAAAElFTkSuQmCC") no-repeat 50% 50%}.uploadcare-line-filedata{position:relative;top:1px;height:30px}.uploadcare-line-filedata a.uploadcare-line-cancel{display:inline-block !important;margin:0;position:relative;top:9px;right:4px}.uploadcare-line-filedata-icon-placeholder{display:inline-block;vertical-align:top;background:-webkit-gradient(linear, 50% 0%, 50% 100%, color-stop(0%, #f2fdf3), color-stop(100%, #e7f0d5));background:-webkit-linear-gradient(#f2fdf3,#e7f0d5);background:-moz-linear-gradient(#f2fdf3,#e7f0d5);background:-o-linear-gradient(#f2fdf3,#e7f0d5);background:-ms-linear-gradient(#f2fdf3,#e7f0d5);background:linear-gradient(#f2fdf3,#e7f0d5);border-right:1px solid #d8d8d8;width:30px;height:30px}.uploadcare-line-filedata-icon-placeholder-icon{position:relative;display:inline-block;border:0 none;margin-left:6px;margin-top:6px;padding:0;width:18px;height:18px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjI4OUZGNDcwQzU0MTFFMTk1MTY5QjU3NDNFQTk4OEQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjI4OUZGNDgwQzU0MTFFMTk1MTY5QjU3NDNFQTk4OEQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMjg5RkY0NTBDNTQxMUUxOTUxNjlCNTc0M0VBOTg4RCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMjg5RkY0NjBDNTQxMUUxOTUxNjlCNTc0M0VBOTg4RCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pviw0ewAAAKlSURBVDjLrZTPS1RRFMfvtMpo0aYiiYK2tmlRELRpEdIu6m+IVoWKgoGQoWG7oNzZpGkSmtoimdw4jhqjNpTjDDkDaqkzzjjOvDf317s/3qi3M1MMmP3QcPGBxz2Hzznvex8PGWPQQYCEYkgqjqRmyFEYKa3g2QEE4sKCOi3VHWWjHFtEVKWR0Bi5rkKOu35OFHLHpZv/H1EK6QJHhU11eTkX2rCcpQCcHd2naAGJguURrn0zvOKLvZlpMavW50heLB/bh8hCWCQ8RK01jc2/2Ho12WgiyfdGurhGudyzZ5FbEJXrON7mm3262RmoM9HkiFFbuZh2xQUFvWWR0s5JoWmV1rooOiK1LIugdj5pRwLvPj2xO0bvmo9LA0Zu5cKwyTUNg4tAIwfIFQjta5bFk0xtdAjJKx2JERNZkPKza/a8ty/YbJ77a7cD8S7juBt+pWUVgMoiKjcqsvRb78hcuxmYaTWLmcltqcltRxAPF7kbC5lgsj/4sOD11xgf9GCZGldKnlZKoR0izNMVKSvW0z/VAhNrTO+HJjO36tvkMtsMkrnXwQfGO1YHQx6ZDI0nHEmqhZAIZDtFXOBi0NdTJGoNwkZFWc9Eo5la6NP9063bnYF60z1x34RXho2j16e54IeEgMuQArIVP4QA4g4poRS/lSbR7FCorSTz+mtNV6ABqDe+2WeGqBWT58l2x+HQT3eBOGc/gdtR7E4KR8Tb0GNTzOTleIPpge9l2QqBZNVHuX2CO+xfIoYoxYeV5rUp/MUehEw6Ru+Z8Vi3wWJtIs/SZyjPoj2JGOMIUwvenV1N2NHZIdgsmQ8bwnIXMc0hwmxEGfktv4goHGJECEGQxaUMiyubJ4YpJYiUwH9kl6gkoxSKNmI8X52n6VN/E5RFB/Vj+w6Gzcd8vWkbFQAAAABJRU5ErkJggg==") no-repeat 50% 50%;width:18px;height:18px}.uploadcare-line-filedata-filename{position:relative;display:inline-block;vertical-align:top;padding-left:10px;width:40%;height:30px}.uploadcare-line-filedata-filesize{display:inline-block;vertical-align:baseline;text-align:center;padding-left:7px;font-weight:400;height:30px;width:60px;opacity:0.9;position:relative}.uploadcare-line-filedata-close{position:relative}.uploadcare-line-tinydrop{position:relative;top:1px;height:30px;text-align:center}.uploadcare-line-drop-decoration{position:absolute;left:10px;top:0px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAeCAIAAAB11XNZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjMyMTk5NDgwOUVDMTFFMUEyMTBGMTk4Q0QyMTA1MzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjMyMTk5NDkwOUVDMTFFMUEyMTBGMTk4Q0QyMTA1MzQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMzIxOTk0NjA5RUMxMUUxQTIxMEYxOThDRDIxMDUzNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMzIxOTk0NzA5RUMxMUUxQTIxMEYxOThDRDIxMDUzNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlRlfWQAAADFSURBVCjPzZDLSgNREERP9e0h7hQdiBDw/z9MRCKaiI+JOveWi7hQkUxACdayabrOaa2HF3YmjXZvBFNJICKehs3l8vb+8TkkQ8D87OTivB9rSwA7Qpk5mx1FCbydhA2g1fAKCEWgT0y2q/3RAhjXBvhHl0nSqZU9bCdbDnTj/7j4t6SH+elfcCSQpSxX6+ubu3GsCtkE9KfHi3lfa0vj5lZC3axT14WEAUcpto119bAxpMj44lXtt2ZtWwTV1Nq+EWhP0neQhF0gA0Q2WAAAAABJRU5ErkJggg==") repeat-x 0 0;background-position-x:-1px;z-index:1;text-align:left}.uploadcare-line-drop-decoration span{color:#7391a0;display:inline-block;z-index:5}.uploadcare-line-drop-decoration .droptext{margin-left:10px}.uploadcare-line-drop-decoration .branding{font-size:11px;font-weight:200;opacity:0.9;float:right;text-shadow:1px 0px #fff}.uploadcare-line-drop-decoration .dnd-arrow{background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAMCAMAAAEbsuwEAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGMTE3NDA3MjA2ODExOUVFMUM2QTRBRUM4NTYwQiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1NTFCNUNCMTA2NjkxMUUxQUFBRjgzQ0M2RTczQ0U4RSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NTFCNUNCMDA2NjkxMUUxQUFBRjgzQ0M2RTczQ0U4RSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M0IE1hY2ludG9zaCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkY4N0YxMTc0MDcyMDY4MTFCQTE2QUIyNDBEM0NCREEwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkY5N0YxMTc0MDcyMDY4MTE5RUUxQzZBNEFFQzg1NjBCIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+rdynBwAAALdQTFRF////ZoCO////////////vcnPZ4KP////mKu0orS8n7G6aIKQoLK7kqawmq23may2m6632ODj0dre////9vj59ff49/n6////aoSS6+/x6u7w7fHzaYSSaYSSbomXaYWTaYWTcIybhp6qlay4lq25lKu3gJmmjKWzjaazjKWzaYWTaoWTfZmnfZimfZmnd5KgdpOidpSid5SjcYybdpOico+ecpCfc5CgdpSkdpWkd5ameJameJenijMzbQAAADV0Uk5TAAMDBwgJCgwQEBEeKjAwMTI+TVFSU1hbYmRlaXa/wMfIyMvOztHa2trb3eXl5+fo+fr6/f3V8BPSAAAAcElEQVQIHQXBiUIBUQAAwLHkJiT3kbuSYxWx7/3/d5mBUs9eJFKbah7tMlrhwGQRz3PyX+/43heRZlWkWYWPvzAbGIe4KjDaJND4vV1PZfCaxnCsIqd+idnPi5zO9v8Rw/22bJMffoaw7iag0H9L8AQwIgumRuIwGgAAAABJRU5ErkJggg==") no-repeat 0 0;display:inline-block;width:10px;height:12px;margin-bottom:-2px;margin-right:5px;z-index:5}.uploadcare-line-drop-decoration .lc{position:absolute;left:-10px;top:0;width:10px;height:30px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAeCAIAAACaFxhnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjMyMDVDRUYwOUVDMTFFMUEyMTBGMTk4Q0QyMTA1MzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjMyMDVDRjAwOUVDMTFFMUEyMTBGMTk4Q0QyMTA1MzQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMzIwNUNFRDA5RUMxMUUxQTIxMEYxOThDRDIxMDUzNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMzIwNUNFRTA5RUMxMUUxQTIxMEYxOThDRDIxMDUzNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PhMgTkcAAAFNSURBVCjPpVPZTgJBEKw+XAQWF4yGN///nzQkRANeEQ/IArsz5cPCcuODnUkmMzXVR/W0PLx83nSaEBw176VNygkQ0EjitHm1CbAoytHbx3Seh8B+L7u9ztxsDauM3j6+80Wn3VJIo5EIBKTXfpYhXrVbd/1e4hYjIsnaOQAzU0WMCBVSeX2dzt0UgKuQCLuZOggQAMpwpATFWfM1+YQs59m6YouM3yeDp/GyLCFSXbJmi8jXLJ/M8qIM29Gcq5c0d/dEIIg7sVnLLget8zpMZXvHlagkup3WZVIkbpAN7gQJkrzJUgFC5PYP2Igajon6P9X+ZBMgVPR++DR4fC6KIJC6vrpuipraBtrKHADRaja+Z/PHl3cwdtM066Rmsqo7kP1uZqo/+aIsY2AgImEynMwu3KqmmYgKAAQyRALwerpIlgcTo0URuNWJvfULcDLD4OsDXUsAAAAASUVORK5CYII=") no-repeat 0 0}.uploadcare-line-drop-decoration .rc{position:absolute;right:-10px;top:0;width:10px;height:30px;background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAeCAIAAACaFxhnAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QjMyMTk5NDAwOUVDMTFFMUEyMTBGMTk4Q0QyMTA1MzQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QjMyMTk5NDEwOUVDMTFFMUEyMTBGMTk4Q0QyMTA1MzQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCMzIwNUNGNTA5RUMxMUUxQTIxMEYxOThDRDIxMDUzNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCMzIwNUNGNjA5RUMxMUUxQTIxMEYxOThDRDIxMDUzNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlWZRmEAAAE7SURBVCjPtZJLTwJBEISregZBXqKoiR6MN///X9KEqCSrCAbd3e7ysAquUYwH5zCPdHrqq5rh4/oVPw0hC/yxShh2jkyydp8Xi7uHRUoc9vbPT466nQxAgEEi2O3uTUbDQb//tH6dzQsaaQSQBZhxOh6eTIZl7dd3D2VVbS9vlpAUiIAZUkqbMot1+ZklkSTqEAAJGWqhulrnncaErF3VX2PZdJOsqno2L4y4ODtt7OQWV0SxfN7r5GgA+ZWcuZNzznjnZ0ubAGEkv9FuUJt5s/mkLaVk04MBAaMB8BDvn1u/JRmJHaG6/iO177q11SZZVvXN7dyjvrq8AODh7W7CEgNp65uEuxbL1eNqBVpZ+3jQ+wgVWYAQLi/ryB07HPWPxyNXNNqcLV+aNBIJIASXpCaWjwf1kEN/NYY3iBer0LuJJuEAAAAASUVORK5CYII=") no-repeat 0 0}.uploadcare-line-dropzone{position:absolute;left:0;top:0;z-index:10}.uploadcare-line-uploader-dnd{border:1px solid #b2cedc}.uploadcare-line-uploader-dnd .uploadcare-line-tinydrop{top:0px}@keyframes uploadcare-line-pulse{from{background-position:0 0}to{background-position:0 15px}}@-webkit-keyframes uploadcare-line-pulse{from{background-position:0 0}to{background-position:0 15px}}@-moz-keyframes uploadcare-line-pulse{from{background-position:0 0}to{background-position:0 15px}}';/*
 * Copyright (c) 2011 UploadCare
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

UploadCare.ready(function ($) {
    $(document).ready(function () {
        UploadCare.Line.init($('body'));
    });
});
