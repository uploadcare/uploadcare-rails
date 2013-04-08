/*
 * Uploadcare (0.6.9.2)
 * Date: 2013-04-08 15:46:19 +0300
 * Rev: 5b86155f5a
 */
;(function(uploadcare){(function() {

  window.uploadcare || (window.uploadcare = {});

  uploadcare.namespace = function(path, fn) {
    var first, part, parts, rest, target, _i, _len;
    parts = path.split('.');
    first = parts[0];
    rest = parts.slice(1);
    if (first === 'uploadcare') {
      target = uploadcare;
    } else {
      window[first] || (window[first] = {});
      target = window[first];
    }
    for (_i = 0, _len = rest.length; _i < _len; _i++) {
      part = rest[_i];
      target[part] || (target[part] = {});
      target = target[part];
    }
    return fn(target);
  };

  uploadcare.expose = function(key, value) {
    return window.uploadcare[key] = value || uploadcare[key];
  };

}).call(this);
/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Tue Nov 13 2012 08:20:33 GMT-0500 (Eastern Standard Time)
 */

(function( window, undefined ) {
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,
	navigator = window.navigator,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Save a reference to some core methods
	core_push = Array.prototype.push,
	core_slice = Array.prototype.slice,
	core_indexOf = Array.prototype.indexOf,
	core_toString = Object.prototype.toString,
	core_hasOwn = Object.prototype.hasOwnProperty,
	core_trim = String.prototype.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

	// Used for detecting and trimming whitespace
	core_rnotwhite = /\S/,
	core_rspace = /\s+/,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// The ready event handler and self cleanup method
	DOMContentLoaded = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			jQuery.ready();
		} else if ( document.readyState === "complete" ) {
			// we're here because readyState === "complete" in oldIE
			// which is good enough for us to call the dom ready!
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	},

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context && context.nodeType ? context.ownerDocument || context : document );

					// scripts is true for back-compat
					selector = jQuery.parseHTML( match[1], doc, true );
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						this.attr.call( selector, context, true );
					}

					return jQuery.merge( this, selector );

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.8.3",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ),
			"slice", core_slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready, 1 );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ core_toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// scripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, scripts ) {
		var parsed;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			scripts = context;
			context = 0;
		}
		context = context || document;

		// Single tag
		if ( (parsed = rsingleTag.exec( data )) ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
		return jQuery.merge( [],
			(parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
	},

	parseJSON: function( data ) {
		if ( !data || typeof data !== "string") {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && core_rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var name,
			i = 0,
			length = obj.length,
			isObj = length === undefined || jQuery.isFunction( obj );

		if ( args ) {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.apply( obj[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( obj[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var type,
			ret = results || [];

		if ( arr != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			type = jQuery.type( arr );

			if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
				core_push.call( ret, arr );
			} else {
				jQuery.merge( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key,
			ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready, 1 );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.split( core_rspace ), function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				return jQuery.inArray( fn, list ) > -1;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
								function() {
									var returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.done( newDefer.resolve )
											.fail( newDefer.reject )
											.progress( newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								} :
								newDefer[ action ]
							);
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ] = list.fire
			deferred[ tuple[0] ] = list.fire;
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		eventName,
		i,
		isSupported,
		clickFn,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Support tests won't run in some limited or non-browser environments
	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !all || !a || !all.length ) {
		return {};
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";
	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form (#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: ( document.compatMode === "CSS1Compat" ),

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", clickFn = function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent("onclick");
		div.detachEvent( "onclick", clickFn );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	input.setAttribute( "checked", "checked" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: true,
			change: true,
			focusin: true
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, div, tds, marginDiv,
			divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// NOTE: To any future maintainer, we've window.getComputedStyle
		// because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. For more
			// info see bug #3333
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = document.createElement("div");
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			container.style.zoom = 1;
		}

		// Null elements to avoid leaks in IE
		body.removeChild( container );
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	fragment.removeChild( div );
	all = a = select = opt = input = fragment = div = null;

	return support;
})();
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	deletedIds: [],

	// Remove at next major release (1.9/2.0)
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split(" ");
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject( cache[ id ] ) ) {
				return;
			}
		}

		// Destroy the cache
		if ( isNode ) {
			jQuery.cleanData( [ elem ], true );

		// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
		} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
			delete cache[ id ];

		// When all else fails, null
		} else {
			cache[ id ] = null;
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				// Only convert to a number if it doesn't change the string
				+data + "" === data ? +data :
				rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery.removeData( elem, type + "queue", true );
				jQuery.removeData( elem, key, true );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook, fixSpecified,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea|)$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var removes, className, elem, c, cl, i, l;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}
		if ( (value && typeof value === "string") || value === undefined ) {
			removes = ( value || "" ).split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];
				if ( elem.nodeType === 1 && elem.className ) {

					className = (" " + elem.className + " ").replace( rclass, " " );

					// loop over each item in the removal list
					for ( c = 0, cl = removes.length; c < cl; c++ ) {
						// Remove until there is nothing to remove,
						while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
							className = className.replace( " " + removes[ c ] + " " , " " );
						}
					}
					elem.className = value ? jQuery.trim( className ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( core_rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	// Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
	attrFn: {},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {

			attrNames = value.split( core_rspace );

			for ( ; i < attrNames.length; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.value = value + "" );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var t, tns, type, origType, namespaces, origCount,
			j, events, special, eventType, handleObj,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, "events", true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
			type = event.type || event,
			namespaces = [];

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			for ( old = elem; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old === (elem.ownerDocument || document) ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
			handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = core_slice.call( arguments ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [];

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					selMatch = {};
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
		event.metaKey = !!event.metaKey;

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "_submit_attached" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "_submit_attached", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "_change_attached", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var cachedruns,
	assertGetIdNotName,
	Expr,
	getText,
	isXML,
	contains,
	compile,
	sortOrder,
	hasDuplicate,
	outermostContext,

	baseHasDuplicate = true,
	strundefined = "undefined",

	expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

	Token = String,
	document = window.document,
	docElem = document.documentElement,
	dirruns = 0,
	done = 0,
	pop = [].pop,
	push = [].push,
	slice = [].slice,
	// Use a stripped-down indexOf if a native one is unavailable
	indexOf = [].indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	// Augment a function for special use by Sizzle
	markFunction = function( fn, value ) {
		fn[ expando ] = value == null || value;
		return fn;
	},

	createCache = function() {
		var cache = {},
			keys = [];

		return markFunction(function( key, value ) {
			// Only keep the most recent entries
			if ( keys.push( key ) > Expr.cacheLength ) {
				delete cache[ keys.shift() ];
			}

			// Retrieve with (key + " ") to avoid collision with native Object.prototype properties (see Issue #157)
			return (cache[ key + " " ] = value);
		}, cache );
	},

	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// Regex

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments not in parens/brackets,
	//   then attribute selectors and non-pseudos (denoted by :),
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

	// For matchExpr.POS and matchExpr.needsContext
	pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
		"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

	rnot = /^:not/,
	rsibling = /[\x20\t\r\n\f]*[+~]/,
	rendsWithNot = /:not\($/,

	rheader = /h\d/i,
	rinputs = /input|select|textarea|button/i,

	rbackslash = /\\(?!\\)/g,

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"POS": new RegExp( pos, "i" ),
		"CHILD": new RegExp( "^:(only|nth|first|last)-child(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
	},

	// Support

	// Used for testing something on an element
	assert = function( fn ) {
		var div = document.createElement("div");

		try {
			return fn( div );
		} catch (e) {
			return false;
		} finally {
			// release memory in IE
			div = null;
		}
	},

	// Check if getElementsByTagName("*") returns only elements
	assertTagNameNoComments = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	}),

	// Check if getAttribute returns normalized href attributes
	assertHrefNotNormalized = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}),

	// Check if attributes should be retrieved by attribute nodes
	assertAttributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	}),

	// Check if getElementsByClassName can be trusted
	assertUsableClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	}),

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	assertUsableName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = document.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			document.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			document.getElementsByName( expando + 0 ).length;
		assertGetIdNotName = !document.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

// If slice is not available, provide a backup
try {
	slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		for ( ; (elem = this[i]); i++ ) {
			results.push( elem );
		}
		return results;
	};
}

function Sizzle( selector, context, results, seed ) {
	results = results || [];
	context = context || document;
	var match, elem, xml, m,
		nodeType = context.nodeType;

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( nodeType !== 1 && nodeType !== 9 ) {
		return [];
	}

	xml = isXML( context );

	if ( !xml && !seed ) {
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed, xml );
}

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	return Sizzle( expr, null, null, [ elem ] ).length > 0;
};

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (see #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	} else {

		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	}
	return ret;
};

isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Element contains another
contains = Sizzle.contains = docElem.contains ?
	function( a, b ) {
		var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b && b.parentNode;
		return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
	} :
	docElem.compareDocumentPosition ?
	function( a, b ) {
		return b && !!( a.compareDocumentPosition( b ) & 16 );
	} :
	function( a, b ) {
		while ( (b = b.parentNode) ) {
			if ( b === a ) {
				return true;
			}
		}
		return false;
	};

Sizzle.attr = function( elem, name ) {
	var val,
		xml = isXML( elem );

	if ( !xml ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( xml || assertAttributes ) {
		return elem.getAttribute( name );
	}
	val = elem.getAttributeNode( name );
	return val ?
		typeof elem[ name ] === "boolean" ?
			elem[ name ] ? name : null :
			val.specified ? val.value : null :
		null;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	// IE6/7 return a modified href
	attrHandle: assertHrefNotNormalized ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		},

	find: {
		"ID": assertGetIdNotName ?
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			} :
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );

					return m ?
						m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
							[m] :
							undefined :
						[];
				}
			},

		"TAG": assertTagNameNoComments ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== strundefined ) {
					return context.getElementsByTagName( tag );
				}
			} :
			function( tag, context ) {
				var results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					var elem,
						tmp = [],
						i = 0;

					for ( ; (elem = results[i]); i++ ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			},

		"NAME": assertUsableName && function( tag, context ) {
			if ( typeof context.getElementsByName !== strundefined ) {
				return context.getElementsByName( name );
			}
		},

		"CLASS": assertUsableClassName && function( className, context, xml ) {
			if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
				return context.getElementsByClassName( className );
			}
		}
	},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( rbackslash, "" );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				3 xn-component of xn+y argument ([+-]?\d*n|)
				4 sign of xn-component
				5 x of xn-component
				6 sign of y-component
				7 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1] === "nth" ) {
				// nth-child requires argument
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
				match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

			// other types prohibit arguments
			} else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var unquoted, excess;
			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			if ( match[3] ) {
				match[2] = match[3];
			} else if ( (unquoted = match[4]) ) {
				// Only check arguments that contain a pseudo
				if ( rpseudo.test(unquoted) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					unquoted = unquoted.slice( 0, excess );
					match[0] = match[0].slice( 0, excess );
				}
				match[2] = unquoted;
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {
		"ID": assertGetIdNotName ?
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					return elem.getAttribute("id") === id;
				};
			} :
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
					return node && node.value === id;
				};
			},

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}
			nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ expando ][ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem, context ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.substr( result.length - check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, argument, first, last ) {

			if ( type === "nth" ) {
				return function( elem ) {
					var node, diff,
						parent = elem.parentNode;

					if ( first === 1 && last === 0 ) {
						return true;
					}

					if ( parent ) {
						diff = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								diff++;
								if ( elem === node ) {
									break;
								}
							}
						}
					}

					// Incorporate the offset (or cast to NaN), then check against cycle size
					diff -= last;
					return diff === first || ( diff % first === 0 && diff / first >= 0 );
				};
			}

			return function( elem ) {
				var node = elem;

				switch ( type ) {
					case "only":
					case "first":
						while ( (node = node.previousSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						if ( type === "first" ) {
							return true;
						}

						node = elem;

						/* falls through */
					case "last":
						while ( (node = node.nextSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						return true;
				}
			};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			var nodeType;
			elem = elem.firstChild;
			while ( elem ) {
				if ( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ) {
					return false;
				}
				elem = elem.nextSibling;
			}
			return true;
		},

		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"text": function( elem ) {
			var type, attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				(type = elem.type) === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
		},

		// Input types
		"radio": createInputPseudo("radio"),
		"checkbox": createInputPseudo("checkbox"),
		"file": createInputPseudo("file"),
		"password": createInputPseudo("password"),
		"image": createInputPseudo("image"),

		"submit": createButtonPseudo("submit"),
		"reset": createButtonPseudo("reset"),

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"focus": function( elem ) {
			var doc = elem.ownerDocument;
			return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		"active": function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		},

		// Positional types
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			for ( var i = 0; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			for ( var i = 1; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = argument < 0 ? argument + length : argument; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = argument < 0 ? argument + length : argument; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

function siblingCheck( a, b, ret ) {
	if ( a === b ) {
		return ret;
	}

	var cur = a.nextSibling;

	while ( cur ) {
		if ( cur === b ) {
			return -1;
		}

		cur = cur.nextSibling;
	}

	return 1;
}

sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
			a.compareDocumentPosition :
			a.compareDocumentPosition(b) & 4
		) ? -1 : 1;
	} :
	function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

// Always assume the presence of duplicates if sort doesn't
// pass them to our comparison function (as in Google Chrome).
[0, 0].sort( sortOrder );
baseHasDuplicate = !hasDuplicate;

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		i = 1,
		j = 0;

	hasDuplicate = baseHasDuplicate;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ expando ][ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			tokens.push( matched = new Token( match.shift() ) );
			soFar = soFar.slice( matched.length );

			// Cast descendant combinators to space
			matched.type = match[0].replace( rtrim, " " );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {

				tokens.push( matched = new Token( match.shift() ) );
				soFar = soFar.slice( matched.length );
				matched.type = type;
				matched.matches = match;
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && combinator.dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( checkNonElements || elem.nodeType === 1  ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( !xml ) {
				var cache,
					dirkey = dirruns + " " + doneName + " ",
					cachedkey = dirkey + cachedruns;
				while ( (elem = elem[ dir ]) ) {
					if ( checkNonElements || elem.nodeType === 1 ) {
						if ( (cache = elem[ expando ]) === cachedkey ) {
							return elem.sizset;
						} else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
							if ( elem.sizset ) {
								return elem;
							}
						} else {
							elem[ expando ] = cachedkey;
							if ( matcher( elem, context, xml ) ) {
								elem.sizset = true;
								return elem;
							}
							elem.sizset = false;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( checkNonElements || elem.nodeType === 1 ) {
						if ( matcher( elem, context, xml ) ) {
							return elem;
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && tokens.slice( 0, i - 1 ).join("").replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && tokens.join("")
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Nested matchers should use non-integer dirruns
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = superMatcher.el;
			}

			// Add elements passing elementMatchers directly to results
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++superMatcher.el;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				for ( j = 0; (matcher = setMatchers[j]); j++ ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	superMatcher.el = 0;
	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ expando ][ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed, xml ) {
	var i, tokens, token, type, find,
		match = tokenize( selector ),
		j = match.length;

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !xml &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( rbackslash, "" ), context, xml )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().length );
			}

			// Fetch a seed set for right-to-left matching
			for ( i = matchExpr["POS"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( rbackslash, "" ),
						rsibling.test( tokens[0].type ) && context.parentNode || context,
						xml
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && tokens.join("");
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		xml,
		results,
		rsibling.test( selector )
	);
	return results;
}

if ( document.querySelectorAll ) {
	(function() {
		var disconnectedMatch,
			oldSelect = select,
			rescape = /'|\\/g,
			rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

			// qSa(:focus) reports false when true (Chrome 21), no need to also add to buggyMatches since matches checks buggyQSA
			// A support test would require too much code (would include document ready)
			rbuggyQSA = [ ":focus" ],

			// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
			// A support test would require too much code (would include document ready)
			// just skip matchesSelector for :active
			rbuggyMatches = [ ":active" ],
			matches = docElem.matchesSelector ||
				docElem.mozMatchesSelector ||
				docElem.webkitMatchesSelector ||
				docElem.oMatchesSelector ||
				docElem.msMatchesSelector;

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here (do not put tests after this one)
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE9 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<p test=''></p>";
			if ( div.querySelectorAll("[test^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here (do not put tests after this one)
			div.innerHTML = "<input type='hidden'/>";
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push(":enabled", ":disabled");
			}
		});

		// rbuggyQSA always contains :focus, so no need for a length check
		rbuggyQSA = /* rbuggyQSA.length && */ new RegExp( rbuggyQSA.join("|") );

		select = function( selector, context, results, seed, xml ) {
			// Only use querySelectorAll when not filtering,
			// when this is not xml,
			// and when no QSA bugs apply
			if ( !seed && !xml && !rbuggyQSA.test( selector ) ) {
				var groups, i,
					old = true,
					nid = expando,
					newContext = context,
					newSelector = context.nodeType === 9 && selector;

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					groups = tokenize( selector );

					if ( (old = context.getAttribute("id")) ) {
						nid = old.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}
					nid = "[id='" + nid + "'] ";

					i = groups.length;
					while ( i-- ) {
						groups[i] = nid + groups[i].join("");
					}
					newContext = rsibling.test( selector ) && context.parentNode || context;
					newSelector = groups.join(",");
				}

				if ( newSelector ) {
					try {
						push.apply( results, slice.call( newContext.querySelectorAll(
							newSelector
						), 0 ) );
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}

			return oldSelect( selector, context, results, seed, xml );
		};

		if ( matches ) {
			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				try {
					matches.call( div, "[test!='']:sizzle" );
					rbuggyMatches.push( "!=", pseudos );
				} catch ( e ) {}
			});

			// rbuggyMatches always contains :active and :focus, so no need for a length check
			rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

			Sizzle.matchesSelector = function( elem, expr ) {
				// Make sure that attribute selectors are quoted
				expr = expr.replace( rattributeQuotes, "='$1']" );

				// rbuggyMatches always contains :active, so no need for an existence check
				if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && !rbuggyQSA.test( expr ) ) {
					try {
						var ret = matches.call( elem, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9
								elem.document && elem.document.nodeType !== 11 ) {
							return ret;
						}
					} catch(e) {}
				}

				return Sizzle( expr, null, null, [ elem ] ).length > 0;
			};
		}
	})();
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Back-compat
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, l, length, n, r, ret,
			self = this;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		ret = this.pushStack( "", "find", selector );

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rcheckableType = /^(?:checkbox|radio)$/,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
// unless wrapped in a div with non-breaking characters in front of it.
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "X<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( set, this ), "before", this.selector );
		}
	},

	after: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( this, set ), "after", this.selector );
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( !isDisconnected( this[0] ) ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		}

		return this.length ?
			this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
			this;
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = [].concat.apply( [], args );

		var results, first, fragment, iNoClone,
			i = 0,
			value = args[0],
			scripts = [],
			l = this.length;

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call( this, i, table ? self.html() : undefined );
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			results = jQuery.buildFragment( args, this, scripts );
			fragment = results.fragment;
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				// Fragments from the fragment cache must always be cloned and never used in place.
				for ( iNoClone = results.cacheable || l - 1; i < l; i++ ) {
					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						i === iNoClone ?
							fragment :
							jQuery.clone( fragment, true, true )
					);
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						if ( jQuery.ajax ) {
							jQuery.ajax({
								url: elem.src,
								type: "GET",
								dataType: "script",
								async: false,
								global: false,
								"throws": true
							});
						} else {
							jQuery.error("no ajax");
						}
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	if ( nodeName === "object" ) {
		// IE6-10 improperly clones children of object elements using classid.
		// IE10 throws NoModificationAllowedError if parent is null, #12132.
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, context, scripts ) {
	var fragment, cacheable, cachehit,
		first = args[ 0 ];

	// Set context from what may come in as undefined or a jQuery collection or a node
	// Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
	// also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
	context = context || document;
	context = !context.nodeType && context[0] || context;
	context = context.ownerDocument || context;

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		// Mark cacheable and look for a hit
		cacheable = true;
		fragment = jQuery.fragments[ first ];
		cachehit = fragment !== undefined;
	}

	if ( !fragment ) {
		fragment = context.createDocumentFragment();
		jQuery.clean( args, context, fragment, scripts );

		// Update the cache, but only store false
		// unless this is a second parsing of the same content
		if ( cacheable ) {
			jQuery.fragments[ first ] = cachehit && fragment;
		}
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			l = insert.length,
			parent = this.length === 1 && this[0].parentNode;

		if ( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ) {
			insert[ original ]( this[0] );
			return this;
		} else {
			for ( ; i < l; i++ ) {
				elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			clone;

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
			safe = context === document && safeFragment,
			ret = [];

		// Ensure that context is a document
		if ( !context || typeof context.createDocumentFragment === "undefined" ) {
			context = document;
		}

		// Use the already-created safe fragment if context permits
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Ensure a safe container in which to render the html
					safe = safe || createSafeFragment( context );
					div = context.createElement("div");
					safe.appendChild( div );

					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Go to html and back, then peel off extra wrappers
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					depth = wrap[0];
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						hasBody = rtbody.test(elem);
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Take out of fragment container (we need a fresh div each time)
					div.parentNode.removeChild( div );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				jQuery.merge( ret, elem );
			}
		}

		// Fix #11356: Clear elements from safeFragment
		if ( div ) {
			elem = div = safe = null;
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				if ( jQuery.nodeName( elem, "input" ) ) {
					fixDefaultChecked( elem );
				} else if ( typeof elem.getElementsByTagName !== "undefined" ) {
					jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
				}
			}
		}

		// Append elements to a provided document fragment
		if ( fragment ) {
			// Special handling of each script element
			handleScript = function( elem ) {
				// Check if we consider it executable
				if ( !elem.type || rscriptType.test( elem.type ) ) {
					// Detach the script and store it in the scripts array (if provided) or the fragment
					// Return truthy to indicate that it has been handled
					return scripts ?
						scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
						fragment.appendChild( elem );
				}
			};

			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				// Check if we're done after handling an executable script
				if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
					// Append to fragment and handle embedded scripts
					fragment.appendChild( elem );
					if ( typeof elem.getElementsByTagName !== "undefined" ) {
						// handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
						jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

						// Splice the scripts into ret after their former ancestor and advance our index beyond them
						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						i += jsTags.length;
					}
				}
			}
		}

		return ret;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var data, id, elem, type,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( elem.removeAttribute ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						jQuery.deletedIds.push( id );
					}
				}
			}
		}
	}
});
// Limit scope pollution from any deprecated API
(function() {

var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
	browser[ matched.browser ] = true;
	browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
	browser.webkit = true;
} else if ( browser.webkit ) {
	browser.safari = true;
}

jQuery.browser = browser;

jQuery.sub = function() {
	function jQuerySub( selector, context ) {
		return new jQuerySub.fn.init( selector, context );
	}
	jQuery.extend( true, jQuerySub, this );
	jQuerySub.superclass = this;
	jQuerySub.fn = jQuerySub.prototype = this();
	jQuerySub.fn.constructor = jQuerySub;
	jQuerySub.sub = this.sub;
	jQuerySub.fn.init = function init( selector, context ) {
		if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
			context = jQuerySub( context );
		}

		return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
	};
	jQuerySub.fn.init.prototype = jQuerySub.fn;
	var rootjQuerySub = jQuerySub(document);
	return jQuerySub;
};

})();
var curCSS, iframe, iframeDoc,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([-+])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],

	eventsToggle = jQuery.fn.toggle;

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var elem, display,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		values[ index ] = jQuery._data( elem, "olddisplay" );
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && elem.style.display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {
			display = curCSS( elem, "display" );

			if ( !values[ index ] && display !== "none" ) {
				jQuery._data( elem, "olddisplay", display );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state, fn2 ) {
		var bool = typeof state === "boolean";

		if ( jQuery.isFunction( state ) && jQuery.isFunction( fn2 ) ) {
			return eventsToggle.apply( this, arguments );
		}

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, numeric, extra ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( numeric || extra !== undefined ) {
			num = parseFloat( val );
			return numeric || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: To any future maintainer, we've window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	curCSS = function( elem, name ) {
		var ret, width, minWidth, maxWidth,
			computed = window.getComputedStyle( elem, null ),
			style = elem.style;

		if ( computed ) {

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed.getPropertyValue( name ) || computed[ name ];

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	curCSS = function( elem, name ) {
		var left, rsLeft,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
			Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
			value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			// we use jQuery.css instead of curCSS here
			// because of the reliableMarginRight CSS hook!
			val += jQuery.css( elem, extra + cssExpand[ i ], true );
		}

		// From this point on we use curCSS for maximum performance (relevant in animations)
		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		valueIsBorderBox = true,
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox
		)
	) + "px";
}


// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	if ( elemdisplay[ nodeName ] ) {
		return elemdisplay[ nodeName ];
	}

	var elem = jQuery( "<" + nodeName + ">" ).appendTo( document.body ),
		display = elem.css("display");
	elem.remove();

	// If the simple way fails,
	// get element's real default display by attaching it to a temp iframe
	if ( display === "none" || display === "" ) {
		// Use the already-created iframe if possible
		iframe = document.body.appendChild(
			iframe || jQuery.extend( document.createElement("iframe"), {
				frameBorder: 0,
				width: 0,
				height: 0
			})
		);

		// Create a cacheable copy of the iframe document on first call.
		// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
		// document to it; WebKit & Firefox won't allow reusing the iframe document.
		if ( !iframeDoc || !iframe.createElement ) {
			iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
			iframeDoc.write("<!doctype html><html><body>");
			iframeDoc.close();
		}

		elem = iframeDoc.body.appendChild( iframeDoc.createElement(nodeName) );

		display = curCSS( elem, "display" );
		document.body.removeChild( iframe );
	}

	// Store the correct default display
	elemdisplay[ nodeName ] = display;

	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				if ( elem.offsetWidth === 0 && rdisplayswap.test( curCSS( elem, "display" ) ) ) {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				} else {
					return getWidthOrHeight( elem, name, extra );
				}
			}
		},

		set: function( elem, value, extra ) {
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box"
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
				style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "marginRight" );
					}
				});
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						var ret = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( ret ) ? jQuery( elem ).position()[ prop ] + "px" : ret;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	rselectTextarea = /^(?:select|textarea)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType, list, placeBefore,
			dataTypes = dataTypeExpression.toLowerCase().split( core_rspace ),
			i = 0,
			length = dataTypes.length;

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var selection,
		list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters );

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	// Don't do a request if no elements are being requested
	if ( !this.length ) {
		return this;
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// Request the remote document
	jQuery.ajax({
		url: url,

		// if "type" variable is undefined, then "GET" method will be used
		type: type,
		dataType: "html",
		data: params,
		complete: function( jqXHR, status ) {
			if ( callback ) {
				self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
			}
		}
	}).done(function( responseText ) {

		// Save response for use in complete callback
		response = arguments;

		// See if a selector was specified
		self.html( selector ?

			// Create a dummy div to hold the results
			jQuery("<div>")

				// inject the contents of the document in, removing the scripts
				// to avoid any 'Permission Denied' errors in IE
				.append( responseText.replace( rscript, "" ) )

				// Locate the specified elements
				.find( selector ) :

			// If not, just inject the full result
			responseText );

	});

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // ifModified key
			ifModifiedKey,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || strAbort;
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ ifModifiedKey ] = modified;
					}
					modified = jqXHR.getResponseHeader("Etag");
					if ( modified ) {
						jQuery.etag[ ifModifiedKey ] = modified;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.always( tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( core_rspace );

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? 80 : 443 ) ) !=
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already and return
				return jqXHR.abort();

		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	var conv, conv2, current, tmp,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ],
		converters = {},
		i = 0;

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
var oldCallbacks = [],
	rquestion = /\?/,
	rjsonp = /(=)\?(?=&|$)|\?\?/,
	nonce = jQuery.now();

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		data = s.data,
		url = s.url,
		hasCallback = s.jsonp !== false,
		replaceInUrl = hasCallback && rjsonp.test( url ),
		replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
			!( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") &&
			rjsonp.test( data );

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( s.dataTypes[ 0 ] === "jsonp" || replaceInUrl || replaceInData ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;
		overwritten = window[ callbackName ];

		// Insert callback into url or form data
		if ( replaceInUrl ) {
			s.url = url.replace( rjsonp, "$1" + callbackName );
		} else if ( replaceInData ) {
			s.data = data.replace( rjsonp, "$1" + callbackName );
		} else if ( hasCallback ) {
			s.url += ( rquestion.test( url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});
var xhrCallbacks,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( e ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback, 0 );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	}, 0 );
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		index = 0,
		tweenerIndex = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end, easing ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;

				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			anim: animation,
			queue: animation.opts.queue,
			elem: elem
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	var index, prop, value, length, dataShow, toggle, tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.done(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery.removeData( elem, "fxshow", true );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing any value as a 4th parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, false, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ||
			// special check for .toggle( handler, handler, ... )
			( !i && jQuery.isFunction( speed ) && jQuery.isFunction( easing ) ) ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations resolve immediately
				if ( empty ) {
					anim.stop( true );
				}
			};

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.interval = 13;

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
var rroot = /^(?:body|html)$/i;

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	if ( (body = doc.body) === elem ) {
		return jQuery.offset.bodyOffset( elem );
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== "undefined" ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	clientTop  = docElem.clientTop  || body.clientTop  || 0;
	clientLeft = docElem.clientLeft || body.clientLeft || 0;
	scrollTop  = win.pageYOffset || docElem.scrollTop;
	scrollLeft = win.pageXOffset || docElem.scrollLeft;
	return {
		top: box.top  + scrollTop  - clientTop,
		left: box.left + scrollLeft - clientLeft
	};
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.body;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, value, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );
(function() {
  var namespace;

  namespace = uploadcare.namespace;

  namespace('uploadcare', function(ns) {
    ns.jQuery = jQuery;
    jQuery.noConflict(true);
    ns.whenReady = function(fn) {
      return fn();
    };
    return ns.expose('whenReady');
  });

}).call(this);
// from https://github.com/kossnocorp/role

!function($){
  function rewriteSelector(context, name, argPos){
    var original = context[name];

    if (!original) return;

    context[name] = function(){
      arguments[argPos] = arguments[argPos].replace(/@([\w\u00c0-\uFFFF\-]+)/g, '[role~="$1"]');
      return original.apply(context, arguments);
    };

    $.extend(context[name], original);
  }

  rewriteSelector($, 'find', 0);
  rewriteSelector($, 'multiFilter', 0);
  rewriteSelector($.find, 'matchesSelector', 1);
  rewriteSelector($.find, 'matches', 0);

  function parse(roleString, without){
    var role, result = [], roles = $.trim(roleString).split(/\s+/);

    for(var i=0; i<roles.length; i++) {
      role = roles[i];
      if (!~$.inArray(role, result) && (!without || !~$.inArray(role, without)))
        result.push(role);
    }

    return result;
  };

  $.extend($.fn, {
    roles: function(){ return parse(this.attr('role')); },

    hasRole: function(roleName){
      var roles = parse(roleName);
      for(var i=0;i<roles.length;i++)
        if (!this.is('@'+roles[i])) return false;

      return true;
    },

    addRole: function(roleName){
      if (this.hasRole(roleName)) return this;

      return this.each(function(_, element){
        var $el = $(element);
        $el.attr('role', parse($el.attr('role') + ' ' + roleName).join(' '));
      });
    },

    removeRole: function(roleName){
      if (!this.hasRole(roleName)) return this;

      return this.each(function(_, element){
        var $el = $(element);
        $el.attr('role', parse($el.attr('role'), parse(roleName)).join(' '));
      });
    },

    toggleRole: function(roleName){
      var roles = parse(roleName);
      for(var i=0;i<roles.length;i++)
        this[this.hasRole(roles[i]) ? 'removeRole' : 'addRole'].call(this, roles[i]);
      return this;
    }
  });
}(uploadcare.jQuery)
;
// ┌──────────────────────────────────────────────────────────────────────────────────────┐ \\
// │ Eve 0.3.4 - JavaScript Events Library                                                │ \\
// ├──────────────────────────────────────────────────────────────────────────────────────┤ \\
// │ Copyright (c) 2008-2011 Dmitry Baranovskiy (http://dmitry.baranovskiy.com/)          │ \\
// │ Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license. │ \\
// └──────────────────────────────────────────────────────────────────────────────────────┘ \\

(function (glob) {
    var version = "0.3.4",
        has = "hasOwnProperty",
        separator = /[\.\/]/,
        wildcard = "*",
        fun = function () {},
        numsort = function (a, b) {
            return a - b;
        },
        current_event,
        stop,
        events = {n: {}},
    
        eve = function (name, scope) {
            var e = events,
                oldstop = stop,
                args = Array.prototype.slice.call(arguments, 2),
                listeners = eve.listeners(name),
                z = 0,
                f = false,
                l,
                indexed = [],
                queue = {},
                out = [],
                ce = current_event,
                errors = [];
            current_event = name;
            stop = 0;
            for (var i = 0, ii = listeners.length; i < ii; i++) if ("zIndex" in listeners[i]) {
                indexed.push(listeners[i].zIndex);
                if (listeners[i].zIndex < 0) {
                    queue[listeners[i].zIndex] = listeners[i];
                }
            }
            indexed.sort(numsort);
            while (indexed[z] < 0) {
                l = queue[indexed[z++]];
                out.push(l.apply(scope, args));
                if (stop) {
                    stop = oldstop;
                    return out;
                }
            }
            for (i = 0; i < ii; i++) {
                l = listeners[i];
                if ("zIndex" in l) {
                    if (l.zIndex == indexed[z]) {
                        out.push(l.apply(scope, args));
                        if (stop) {
                            break;
                        }
                        do {
                            z++;
                            l = queue[indexed[z]];
                            l && out.push(l.apply(scope, args));
                            if (stop) {
                                break;
                            }
                        } while (l)
                    } else {
                        queue[l.zIndex] = l;
                    }
                } else {
                    out.push(l.apply(scope, args));
                    if (stop) {
                        break;
                    }
                }
            }
            stop = oldstop;
            current_event = ce;
            return out.length ? out : null;
        };
    
    eve.listeners = function (name) {
        var names = name.split(separator),
            e = events,
            item,
            items,
            k,
            i,
            ii,
            j,
            jj,
            nes,
            es = [e],
            out = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            nes = [];
            for (j = 0, jj = es.length; j < jj; j++) {
                e = es[j].n;
                items = [e[names[i]], e[wildcard]];
                k = 2;
                while (k--) {
                    item = items[k];
                    if (item) {
                        nes.push(item);
                        out = out.concat(item.f || []);
                    }
                }
            }
            es = nes;
        }
        return out;
    };
    
    
    eve.on = function (name, f) {
        var names = name.split(separator),
            e = events;
        for (var i = 0, ii = names.length; i < ii; i++) {
            e = e.n;
            !e[names[i]] && (e[names[i]] = {n: {}});
            e = e[names[i]];
        }
        e.f = e.f || [];
        for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
            return fun;
        }
        e.f.push(f);
        return function (zIndex) {
            if (+zIndex == +zIndex) {
                f.zIndex = +zIndex;
            }
        };
    };
    
    eve.stop = function () {
        stop = 1;
    };
    
    eve.nt = function (subname) {
        if (subname) {
            return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(current_event);
        }
        return current_event;
    };
    
    
    eve.off = eve.unbind = function (name, f) {
        var names = name.split(separator),
            e,
            key,
            splice,
            i, ii, j, jj,
            cur = [events];
        for (i = 0, ii = names.length; i < ii; i++) {
            for (j = 0; j < cur.length; j += splice.length - 2) {
                splice = [j, 1];
                e = cur[j].n;
                if (names[i] != wildcard) {
                    if (e[names[i]]) {
                        splice.push(e[names[i]]);
                    }
                } else {
                    for (key in e) if (e[has](key)) {
                        splice.push(e[key]);
                    }
                }
                cur.splice.apply(cur, splice);
            }
        }
        for (i = 0, ii = cur.length; i < ii; i++) {
            e = cur[i];
            while (e.n) {
                if (f) {
                    if (e.f) {
                        for (j = 0, jj = e.f.length; j < jj; j++) if (e.f[j] == f) {
                            e.f.splice(j, 1);
                            break;
                        }
                        !e.f.length && delete e.f;
                    }
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        var funcs = e.n[key].f;
                        for (j = 0, jj = funcs.length; j < jj; j++) if (funcs[j] == f) {
                            funcs.splice(j, 1);
                            break;
                        }
                        !funcs.length && delete e.n[key].f;
                    }
                } else {
                    delete e.f;
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        delete e.n[key].f;
                    }
                }
                e = e.n;
            }
        }
    };
    
    eve.once = function (name, f) {
        var f2 = function () {
            var res = f.apply(this, arguments);
            eve.unbind(name, f2);
            return res;
        };
        return eve.on(name, f2);
    };
    
    eve.version = version;
    eve.toString = function () {
        return "You are running Eve " + version;
    };
    (typeof module != "undefined" && module.exports) ? (module.exports = eve) : (typeof define != "undefined" ? (define("eve", [], function() { return eve; })) : (glob.eve = eve));
})(uploadcare);

(function(eve){
  // ┌────────────────────────────────────────────────────────────────────┐ \\
  // │ Raphaël 2.1.0 - JavaScript Vector Library                          │ \\
  // ├────────────────────────────────────────────────────────────────────┤ \\
  // │ Copyright © 2008-2012 Dmitry Baranovskiy (http://raphaeljs.com)    │ \\
  // │ Copyright © 2008-2012 Sencha Labs (http://sencha.com)              │ \\
  // ├────────────────────────────────────────────────────────────────────┤ \\
  // │ Licensed under the MIT (http://raphaeljs.com/license.html) license.│ \\
  // └────────────────────────────────────────────────────────────────────┘ \\

  // ┌─────────────────────────────────────────────────────────────────────┐ \\
  // │ "Raphaël 2.1.0" - JavaScript Vector Library                         │ \\
  // ├─────────────────────────────────────────────────────────────────────┤ \\
  // │ Copyright (c) 2008-2011 Dmitry Baranovskiy (http://raphaeljs.com)   │ \\
  // │ Copyright (c) 2008-2011 Sencha Labs (http://sencha.com)             │ \\
  // │ Licensed under the MIT (http://raphaeljs.com/license.html) license. │ \\
  // └─────────────────────────────────────────────────────────────────────┘ \\
  (function () {
      
      function R(first) {
          if (R.is(first, "function")) {
              return loaded ? first() : eve.on("raphael.DOMload", first);
          } else if (R.is(first, array)) {
              return R._engine.create[apply](R, first.splice(0, 3 + R.is(first[0], nu))).add(first);
          } else {
              var args = Array.prototype.slice.call(arguments, 0);
              if (R.is(args[args.length - 1], "function")) {
                  var f = args.pop();
                  return loaded ? f.call(R._engine.create[apply](R, args)) : eve.on("raphael.DOMload", function () {
                      f.call(R._engine.create[apply](R, args));
                  });
              } else {
                  return R._engine.create[apply](R, arguments);
              }
          }
      }
      R.version = "2.1.0";
      R.eve = eve;
      var loaded,
          separator = /[, ]+/,
          elements = {circle: 1, rect: 1, path: 1, ellipse: 1, text: 1, image: 1},
          formatrg = /\{(\d+)\}/g,
          proto = "prototype",
          has = "hasOwnProperty",
          g = {
              doc: document,
              win: window
          },
          oldRaphael = {
              was: Object.prototype[has].call(g.win, "Raphael"),
              is: g.win.Raphael
          },
          Paper = function () {
              
              
              this.ca = this.customAttributes = {};
          },
          paperproto,
          appendChild = "appendChild",
          apply = "apply",
          concat = "concat",
          supportsTouch = "createTouch" in g.doc,
          E = "",
          S = " ",
          Str = String,
          split = "split",
          events = "click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[split](S),
          touchMap = {
              mousedown: "touchstart",
              mousemove: "touchmove",
              mouseup: "touchend"
          },
          lowerCase = Str.prototype.toLowerCase,
          math = Math,
          mmax = math.max,
          mmin = math.min,
          abs = math.abs,
          pow = math.pow,
          PI = math.PI,
          nu = "number",
          string = "string",
          array = "array",
          toString = "toString",
          fillString = "fill",
          objectToString = Object.prototype.toString,
          paper = {},
          push = "push",
          ISURL = R._ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
          colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i,
          isnan = {"NaN": 1, "Infinity": 1, "-Infinity": 1},
          bezierrg = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
          round = math.round,
          setAttribute = "setAttribute",
          toFloat = parseFloat,
          toInt = parseInt,
          upperCase = Str.prototype.toUpperCase,
          availableAttrs = R._availableAttrs = {
              "arrow-end": "none",
              "arrow-start": "none",
              blur: 0,
              "clip-rect": "0 0 1e9 1e9",
              cursor: "default",
              cx: 0,
              cy: 0,
              fill: "#fff",
              "fill-opacity": 1,
              font: '10px "Arial"',
              "font-family": '"Arial"',
              "font-size": "10",
              "font-style": "normal",
              "font-weight": 400,
              gradient: 0,
              height: 0,
              href: "http://raphaeljs.com/",
              "letter-spacing": 0,
              opacity: 1,
              path: "M0,0",
              r: 0,
              rx: 0,
              ry: 0,
              src: "",
              stroke: "#000",
              "stroke-dasharray": "",
              "stroke-linecap": "butt",
              "stroke-linejoin": "butt",
              "stroke-miterlimit": 0,
              "stroke-opacity": 1,
              "stroke-width": 1,
              target: "_blank",
              "text-anchor": "middle",
              title: "Raphael",
              transform: "",
              width: 0,
              x: 0,
              y: 0
          },
          availableAnimAttrs = R._availableAnimAttrs = {
              blur: nu,
              "clip-rect": "csv",
              cx: nu,
              cy: nu,
              fill: "colour",
              "fill-opacity": nu,
              "font-size": nu,
              height: nu,
              opacity: nu,
              path: "path",
              r: nu,
              rx: nu,
              ry: nu,
              stroke: "colour",
              "stroke-opacity": nu,
              "stroke-width": nu,
              transform: "transform",
              width: nu,
              x: nu,
              y: nu
          },
          whitespace = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g,
          commaSpaces = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,
          hsrg = {hs: 1, rg: 1},
          p2s = /,?([achlmqrstvxz]),?/gi,
          pathCommand = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,
          tCommand = /([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/ig,
          pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/ig,
          radial_gradient = R._radial_gradient = /^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,
          eldata = {},
          sortByKey = function (a, b) {
              return a.key - b.key;
          },
          sortByNumber = function (a, b) {
              return toFloat(a) - toFloat(b);
          },
          fun = function () {},
          pipe = function (x) {
              return x;
          },
          rectPath = R._rectPath = function (x, y, w, h, r) {
              if (r) {
                  return [["M", x + r, y], ["l", w - r * 2, 0], ["a", r, r, 0, 0, 1, r, r], ["l", 0, h - r * 2], ["a", r, r, 0, 0, 1, -r, r], ["l", r * 2 - w, 0], ["a", r, r, 0, 0, 1, -r, -r], ["l", 0, r * 2 - h], ["a", r, r, 0, 0, 1, r, -r], ["z"]];
              }
              return [["M", x, y], ["l", w, 0], ["l", 0, h], ["l", -w, 0], ["z"]];
          },
          ellipsePath = function (x, y, rx, ry) {
              if (ry == null) {
                  ry = rx;
              }
              return [["M", x, y], ["m", 0, -ry], ["a", rx, ry, 0, 1, 1, 0, 2 * ry], ["a", rx, ry, 0, 1, 1, 0, -2 * ry], ["z"]];
          },
          getPath = R._getPath = {
              path: function (el) {
                  return el.attr("path");
              },
              circle: function (el) {
                  var a = el.attrs;
                  return ellipsePath(a.cx, a.cy, a.r);
              },
              ellipse: function (el) {
                  var a = el.attrs;
                  return ellipsePath(a.cx, a.cy, a.rx, a.ry);
              },
              rect: function (el) {
                  var a = el.attrs;
                  return rectPath(a.x, a.y, a.width, a.height, a.r);
              },
              image: function (el) {
                  var a = el.attrs;
                  return rectPath(a.x, a.y, a.width, a.height);
              },
              text: function (el) {
                  var bbox = el._getBBox();
                  return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
              }
          },
          
          mapPath = R.mapPath = function (path, matrix) {
              if (!matrix) {
                  return path;
              }
              var x, y, i, j, ii, jj, pathi;
              path = path2curve(path);
              for (i = 0, ii = path.length; i < ii; i++) {
                  pathi = path[i];
                  for (j = 1, jj = pathi.length; j < jj; j += 2) {
                      x = matrix.x(pathi[j], pathi[j + 1]);
                      y = matrix.y(pathi[j], pathi[j + 1]);
                      pathi[j] = x;
                      pathi[j + 1] = y;
                  }
              }
              return path;
          };

      R._g = g;
      
      R.type = (g.win.SVGAngle || g.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1") ? "SVG" : "VML");
      if (R.type == "VML") {
          var d = g.doc.createElement("div"),
              b;
          d.innerHTML = '<v:shape adj="1"/>';
          b = d.firstChild;
          b.style.behavior = "url(#default#VML)";
          if (!(b && typeof b.adj == "object")) {
              return (R.type = E);
          }
          d = null;
      }
      
      
      R.svg = !(R.vml = R.type == "VML");
      R._Paper = Paper;
      
      R.fn = paperproto = Paper.prototype = R.prototype;
      R._id = 0;
      R._oid = 0;
      
      R.is = function (o, type) {
          type = lowerCase.call(type);
          if (type == "finite") {
              return !isnan[has](+o);
          }
          if (type == "array") {
              return o instanceof Array;
          }
          return  (type == "null" && o === null) ||
                  (type == typeof o && o !== null) ||
                  (type == "object" && o === Object(o)) ||
                  (type == "array" && Array.isArray && Array.isArray(o)) ||
                  objectToString.call(o).slice(8, -1).toLowerCase() == type;
      };

      function clone(obj) {
          if (Object(obj) !== obj) {
              return obj;
          }
          var res = new obj.constructor;
          for (var key in obj) if (obj[has](key)) {
              res[key] = clone(obj[key]);
          }
          return res;
      }

      
      R.angle = function (x1, y1, x2, y2, x3, y3) {
          if (x3 == null) {
              var x = x1 - x2,
                  y = y1 - y2;
              if (!x && !y) {
                  return 0;
              }
              return (180 + math.atan2(-y, -x) * 180 / PI + 360) % 360;
          } else {
              return R.angle(x1, y1, x3, y3) - R.angle(x2, y2, x3, y3);
          }
      };
      
      R.rad = function (deg) {
          return deg % 360 * PI / 180;
      };
      
      R.deg = function (rad) {
          return rad * 180 / PI % 360;
      };
      
      R.snapTo = function (values, value, tolerance) {
          tolerance = R.is(tolerance, "finite") ? tolerance : 10;
          if (R.is(values, array)) {
              var i = values.length;
              while (i--) if (abs(values[i] - value) <= tolerance) {
                  return values[i];
              }
          } else {
              values = +values;
              var rem = value % values;
              if (rem < tolerance) {
                  return value - rem;
              }
              if (rem > values - tolerance) {
                  return value - rem + values;
              }
          }
          return value;
      };
      
      
      var createUUID = R.createUUID = (function (uuidRegEx, uuidReplacer) {
          return function () {
              return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(uuidRegEx, uuidReplacer).toUpperCase();
          };
      })(/[xy]/g, function (c) {
          var r = math.random() * 16 | 0,
              v = c == "x" ? r : (r & 3 | 8);
          return v.toString(16);
      });

      
      R.setWindow = function (newwin) {
          eve("raphael.setWindow", R, g.win, newwin);
          g.win = newwin;
          g.doc = g.win.document;
          if (R._engine.initWin) {
              R._engine.initWin(g.win);
          }
      };
      var toHex = function (color) {
          if (R.vml) {
              // http://dean.edwards.name/weblog/2009/10/convert-any-colour-value-to-hex-in-msie/
              var trim = /^\s+|\s+$/g;
              var bod;
              try {
                  var docum = new ActiveXObject("htmlfile");
                  docum.write("<body>");
                  docum.close();
                  bod = docum.body;
              } catch(e) {
                  bod = createPopup().document.body;
              }
              var range = bod.createTextRange();
              toHex = cacher(function (color) {
                  try {
                      bod.style.color = Str(color).replace(trim, E);
                      var value = range.queryCommandValue("ForeColor");
                      value = ((value & 255) << 16) | (value & 65280) | ((value & 16711680) >>> 16);
                      return "#" + ("000000" + value.toString(16)).slice(-6);
                  } catch(e) {
                      return "none";
                  }
              });
          } else {
              var i = g.doc.createElement("i");
              i.title = "Rapha\xebl Colour Picker";
              i.style.display = "none";
              g.doc.body.appendChild(i);
              toHex = cacher(function (color) {
                  i.style.color = color;
                  return g.doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
              });
          }
          return toHex(color);
      },
      hsbtoString = function () {
          return "hsb(" + [this.h, this.s, this.b] + ")";
      },
      hsltoString = function () {
          return "hsl(" + [this.h, this.s, this.l] + ")";
      },
      rgbtoString = function () {
          return this.hex;
      },
      prepareRGB = function (r, g, b) {
          if (g == null && R.is(r, "object") && "r" in r && "g" in r && "b" in r) {
              b = r.b;
              g = r.g;
              r = r.r;
          }
          if (g == null && R.is(r, string)) {
              var clr = R.getRGB(r);
              r = clr.r;
              g = clr.g;
              b = clr.b;
          }
          if (r > 1 || g > 1 || b > 1) {
              r /= 255;
              g /= 255;
              b /= 255;
          }
          
          return [r, g, b];
      },
      packageRGB = function (r, g, b, o) {
          r *= 255;
          g *= 255;
          b *= 255;
          var rgb = {
              r: r,
              g: g,
              b: b,
              hex: R.rgb(r, g, b),
              toString: rgbtoString
          };
          R.is(o, "finite") && (rgb.opacity = o);
          return rgb;
      };
      
      
      R.color = function (clr) {
          var rgb;
          if (R.is(clr, "object") && "h" in clr && "s" in clr && "b" in clr) {
              rgb = R.hsb2rgb(clr);
              clr.r = rgb.r;
              clr.g = rgb.g;
              clr.b = rgb.b;
              clr.hex = rgb.hex;
          } else if (R.is(clr, "object") && "h" in clr && "s" in clr && "l" in clr) {
              rgb = R.hsl2rgb(clr);
              clr.r = rgb.r;
              clr.g = rgb.g;
              clr.b = rgb.b;
              clr.hex = rgb.hex;
          } else {
              if (R.is(clr, "string")) {
                  clr = R.getRGB(clr);
              }
              if (R.is(clr, "object") && "r" in clr && "g" in clr && "b" in clr) {
                  rgb = R.rgb2hsl(clr);
                  clr.h = rgb.h;
                  clr.s = rgb.s;
                  clr.l = rgb.l;
                  rgb = R.rgb2hsb(clr);
                  clr.v = rgb.b;
              } else {
                  clr = {hex: "none"};
                  clr.r = clr.g = clr.b = clr.h = clr.s = clr.v = clr.l = -1;
              }
          }
          clr.toString = rgbtoString;
          return clr;
      };
      
      R.hsb2rgb = function (h, s, v, o) {
          if (this.is(h, "object") && "h" in h && "s" in h && "b" in h) {
              v = h.b;
              s = h.s;
              h = h.h;
              o = h.o;
          }
          h *= 360;
          var R, G, B, X, C;
          h = (h % 360) / 60;
          C = v * s;
          X = C * (1 - abs(h % 2 - 1));
          R = G = B = v - C;

          h = ~~h;
          R += [C, X, 0, 0, X, C][h];
          G += [X, C, C, X, 0, 0][h];
          B += [0, 0, X, C, C, X][h];
          return packageRGB(R, G, B, o);
      };
      
      R.hsl2rgb = function (h, s, l, o) {
          if (this.is(h, "object") && "h" in h && "s" in h && "l" in h) {
              l = h.l;
              s = h.s;
              h = h.h;
          }
          if (h > 1 || s > 1 || l > 1) {
              h /= 360;
              s /= 100;
              l /= 100;
          }
          h *= 360;
          var R, G, B, X, C;
          h = (h % 360) / 60;
          C = 2 * s * (l < .5 ? l : 1 - l);
          X = C * (1 - abs(h % 2 - 1));
          R = G = B = l - C / 2;

          h = ~~h;
          R += [C, X, 0, 0, X, C][h];
          G += [X, C, C, X, 0, 0][h];
          B += [0, 0, X, C, C, X][h];
          return packageRGB(R, G, B, o);
      };
      
      R.rgb2hsb = function (r, g, b) {
          b = prepareRGB(r, g, b);
          r = b[0];
          g = b[1];
          b = b[2];

          var H, S, V, C;
          V = mmax(r, g, b);
          C = V - mmin(r, g, b);
          H = (C == 0 ? null :
               V == r ? (g - b) / C :
               V == g ? (b - r) / C + 2 :
                        (r - g) / C + 4
              );
          H = ((H + 360) % 6) * 60 / 360;
          S = C == 0 ? 0 : C / V;
          return {h: H, s: S, b: V, toString: hsbtoString};
      };
      
      R.rgb2hsl = function (r, g, b) {
          b = prepareRGB(r, g, b);
          r = b[0];
          g = b[1];
          b = b[2];

          var H, S, L, M, m, C;
          M = mmax(r, g, b);
          m = mmin(r, g, b);
          C = M - m;
          H = (C == 0 ? null :
               M == r ? (g - b) / C :
               M == g ? (b - r) / C + 2 :
                        (r - g) / C + 4);
          H = ((H + 360) % 6) * 60 / 360;
          L = (M + m) / 2;
          S = (C == 0 ? 0 :
               L < .5 ? C / (2 * L) :
                        C / (2 - 2 * L));
          return {h: H, s: S, l: L, toString: hsltoString};
      };
      R._path2string = function () {
          return this.join(",").replace(p2s, "$1");
      };
      function repush(array, item) {
          for (var i = 0, ii = array.length; i < ii; i++) if (array[i] === item) {
              return array.push(array.splice(i, 1)[0]);
          }
      }
      function cacher(f, scope, postprocessor) {
          function newf() {
              var arg = Array.prototype.slice.call(arguments, 0),
                  args = arg.join("\u2400"),
                  cache = newf.cache = newf.cache || {},
                  count = newf.count = newf.count || [];
              if (cache[has](args)) {
                  repush(count, args);
                  return postprocessor ? postprocessor(cache[args]) : cache[args];
              }
              count.length >= 1e3 && delete cache[count.shift()];
              count.push(args);
              cache[args] = f[apply](scope, arg);
              return postprocessor ? postprocessor(cache[args]) : cache[args];
          }
          return newf;
      }

      var preload = R._preload = function (src, f) {
          var img = g.doc.createElement("img");
          img.style.cssText = "position:absolute;left:-9999em;top:-9999em";
          img.onload = function () {
              f.call(this);
              this.onload = null;
              g.doc.body.removeChild(this);
          };
          img.onerror = function () {
              g.doc.body.removeChild(this);
          };
          g.doc.body.appendChild(img);
          img.src = src;
      };
      
      function clrToString() {
          return this.hex;
      }

      
      R.getRGB = cacher(function (colour) {
          if (!colour || !!((colour = Str(colour)).indexOf("-") + 1)) {
              return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: clrToString};
          }
          if (colour == "none") {
              return {r: -1, g: -1, b: -1, hex: "none", toString: clrToString};
          }
          !(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
          var res,
              red,
              green,
              blue,
              opacity,
              t,
              values,
              rgb = colour.match(colourRegExp);
          if (rgb) {
              if (rgb[2]) {
                  blue = toInt(rgb[2].substring(5), 16);
                  green = toInt(rgb[2].substring(3, 5), 16);
                  red = toInt(rgb[2].substring(1, 3), 16);
              }
              if (rgb[3]) {
                  blue = toInt((t = rgb[3].charAt(3)) + t, 16);
                  green = toInt((t = rgb[3].charAt(2)) + t, 16);
                  red = toInt((t = rgb[3].charAt(1)) + t, 16);
              }
              if (rgb[4]) {
                  values = rgb[4][split](commaSpaces);
                  red = toFloat(values[0]);
                  values[0].slice(-1) == "%" && (red *= 2.55);
                  green = toFloat(values[1]);
                  values[1].slice(-1) == "%" && (green *= 2.55);
                  blue = toFloat(values[2]);
                  values[2].slice(-1) == "%" && (blue *= 2.55);
                  rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = toFloat(values[3]));
                  values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
              }
              if (rgb[5]) {
                  values = rgb[5][split](commaSpaces);
                  red = toFloat(values[0]);
                  values[0].slice(-1) == "%" && (red *= 2.55);
                  green = toFloat(values[1]);
                  values[1].slice(-1) == "%" && (green *= 2.55);
                  blue = toFloat(values[2]);
                  values[2].slice(-1) == "%" && (blue *= 2.55);
                  (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
                  rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = toFloat(values[3]));
                  values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
                  return R.hsb2rgb(red, green, blue, opacity);
              }
              if (rgb[6]) {
                  values = rgb[6][split](commaSpaces);
                  red = toFloat(values[0]);
                  values[0].slice(-1) == "%" && (red *= 2.55);
                  green = toFloat(values[1]);
                  values[1].slice(-1) == "%" && (green *= 2.55);
                  blue = toFloat(values[2]);
                  values[2].slice(-1) == "%" && (blue *= 2.55);
                  (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
                  rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = toFloat(values[3]));
                  values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
                  return R.hsl2rgb(red, green, blue, opacity);
              }
              rgb = {r: red, g: green, b: blue, toString: clrToString};
              rgb.hex = "#" + (16777216 | blue | (green << 8) | (red << 16)).toString(16).slice(1);
              R.is(opacity, "finite") && (rgb.opacity = opacity);
              return rgb;
          }
          return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: clrToString};
      }, R);
      
      R.hsb = cacher(function (h, s, b) {
          return R.hsb2rgb(h, s, b).hex;
      });
      
      R.hsl = cacher(function (h, s, l) {
          return R.hsl2rgb(h, s, l).hex;
      });
      
      R.rgb = cacher(function (r, g, b) {
          return "#" + (16777216 | b | (g << 8) | (r << 16)).toString(16).slice(1);
      });
      
      R.getColor = function (value) {
          var start = this.getColor.start = this.getColor.start || {h: 0, s: 1, b: value || .75},
              rgb = this.hsb2rgb(start.h, start.s, start.b);
          start.h += .075;
          if (start.h > 1) {
              start.h = 0;
              start.s -= .2;
              start.s <= 0 && (this.getColor.start = {h: 0, s: 1, b: start.b});
          }
          return rgb.hex;
      };
      
      R.getColor.reset = function () {
          delete this.start;
      };

      // http://schepers.cc/getting-to-the-point
      function catmullRom2bezier(crp, z) {
          var d = [];
          for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
              var p = [
                          {x: +crp[i - 2], y: +crp[i - 1]},
                          {x: +crp[i],     y: +crp[i + 1]},
                          {x: +crp[i + 2], y: +crp[i + 3]},
                          {x: +crp[i + 4], y: +crp[i + 5]}
                      ];
              if (z) {
                  if (!i) {
                      p[0] = {x: +crp[iLen - 2], y: +crp[iLen - 1]};
                  } else if (iLen - 4 == i) {
                      p[3] = {x: +crp[0], y: +crp[1]};
                  } else if (iLen - 2 == i) {
                      p[2] = {x: +crp[0], y: +crp[1]};
                      p[3] = {x: +crp[2], y: +crp[3]};
                  }
              } else {
                  if (iLen - 4 == i) {
                      p[3] = p[2];
                  } else if (!i) {
                      p[0] = {x: +crp[i], y: +crp[i + 1]};
                  }
              }
              d.push(["C",
                    (-p[0].x + 6 * p[1].x + p[2].x) / 6,
                    (-p[0].y + 6 * p[1].y + p[2].y) / 6,
                    (p[1].x + 6 * p[2].x - p[3].x) / 6,
                    (p[1].y + 6*p[2].y - p[3].y) / 6,
                    p[2].x,
                    p[2].y
              ]);
          }

          return d;
      }
      
      R.parsePathString = function (pathString) {
          if (!pathString) {
              return null;
          }
          var pth = paths(pathString);
          if (pth.arr) {
              return pathClone(pth.arr);
          }
          
          var paramCounts = {a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0},
              data = [];
          if (R.is(pathString, array) && R.is(pathString[0], array)) { // rough assumption
              data = pathClone(pathString);
          }
          if (!data.length) {
              Str(pathString).replace(pathCommand, function (a, b, c) {
                  var params = [],
                      name = b.toLowerCase();
                  c.replace(pathValues, function (a, b) {
                      b && params.push(+b);
                  });
                  if (name == "m" && params.length > 2) {
                      data.push([b][concat](params.splice(0, 2)));
                      name = "l";
                      b = b == "m" ? "l" : "L";
                  }
                  if (name == "r") {
                      data.push([b][concat](params));
                  } else while (params.length >= paramCounts[name]) {
                      data.push([b][concat](params.splice(0, paramCounts[name])));
                      if (!paramCounts[name]) {
                          break;
                      }
                  }
              });
          }
          data.toString = R._path2string;
          pth.arr = pathClone(data);
          return data;
      };
      
      R.parseTransformString = cacher(function (TString) {
          if (!TString) {
              return null;
          }
          var paramCounts = {r: 3, s: 4, t: 2, m: 6},
              data = [];
          if (R.is(TString, array) && R.is(TString[0], array)) { // rough assumption
              data = pathClone(TString);
          }
          if (!data.length) {
              Str(TString).replace(tCommand, function (a, b, c) {
                  var params = [],
                      name = lowerCase.call(b);
                  c.replace(pathValues, function (a, b) {
                      b && params.push(+b);
                  });
                  data.push([b][concat](params));
              });
          }
          data.toString = R._path2string;
          return data;
      });
      // PATHS
      var paths = function (ps) {
          var p = paths.ps = paths.ps || {};
          if (p[ps]) {
              p[ps].sleep = 100;
          } else {
              p[ps] = {
                  sleep: 100
              };
          }
          setTimeout(function () {
              for (var key in p) if (p[has](key) && key != ps) {
                  p[key].sleep--;
                  !p[key].sleep && delete p[key];
              }
          });
          return p[ps];
      };
      
      R.findDotsAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
          var t1 = 1 - t,
              t13 = pow(t1, 3),
              t12 = pow(t1, 2),
              t2 = t * t,
              t3 = t2 * t,
              x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x,
              y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y,
              mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x),
              my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y),
              nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x),
              ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y),
              ax = t1 * p1x + t * c1x,
              ay = t1 * p1y + t * c1y,
              cx = t1 * c2x + t * p2x,
              cy = t1 * c2y + t * p2y,
              alpha = (90 - math.atan2(mx - nx, my - ny) * 180 / PI);
          (mx > nx || my < ny) && (alpha += 180);
          return {
              x: x,
              y: y,
              m: {x: mx, y: my},
              n: {x: nx, y: ny},
              start: {x: ax, y: ay},
              end: {x: cx, y: cy},
              alpha: alpha
          };
      };
      
      R.bezierBBox = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
          if (!R.is(p1x, "array")) {
              p1x = [p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y];
          }
          var bbox = curveDim.apply(null, p1x);
          return {
              x: bbox.min.x,
              y: bbox.min.y,
              x2: bbox.max.x,
              y2: bbox.max.y,
              width: bbox.max.x - bbox.min.x,
              height: bbox.max.y - bbox.min.y
          };
      };
      
      R.isPointInsideBBox = function (bbox, x, y) {
          return x >= bbox.x && x <= bbox.x2 && y >= bbox.y && y <= bbox.y2;
      };
      
      R.isBBoxIntersect = function (bbox1, bbox2) {
          var i = R.isPointInsideBBox;
          return i(bbox2, bbox1.x, bbox1.y)
              || i(bbox2, bbox1.x2, bbox1.y)
              || i(bbox2, bbox1.x, bbox1.y2)
              || i(bbox2, bbox1.x2, bbox1.y2)
              || i(bbox1, bbox2.x, bbox2.y)
              || i(bbox1, bbox2.x2, bbox2.y)
              || i(bbox1, bbox2.x, bbox2.y2)
              || i(bbox1, bbox2.x2, bbox2.y2)
              || (bbox1.x < bbox2.x2 && bbox1.x > bbox2.x || bbox2.x < bbox1.x2 && bbox2.x > bbox1.x)
              && (bbox1.y < bbox2.y2 && bbox1.y > bbox2.y || bbox2.y < bbox1.y2 && bbox2.y > bbox1.y);
      };
      function base3(t, p1, p2, p3, p4) {
          var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4,
              t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
          return t * t2 - 3 * p1 + 3 * p2;
      }
      function bezlen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
          if (z == null) {
              z = 1;
          }
          z = z > 1 ? 1 : z < 0 ? 0 : z;
          var z2 = z / 2,
              n = 12,
              Tvalues = [-0.1252,0.1252,-0.3678,0.3678,-0.5873,0.5873,-0.7699,0.7699,-0.9041,0.9041,-0.9816,0.9816],
              Cvalues = [0.2491,0.2491,0.2335,0.2335,0.2032,0.2032,0.1601,0.1601,0.1069,0.1069,0.0472,0.0472],
              sum = 0;
          for (var i = 0; i < n; i++) {
              var ct = z2 * Tvalues[i] + z2,
                  xbase = base3(ct, x1, x2, x3, x4),
                  ybase = base3(ct, y1, y2, y3, y4),
                  comb = xbase * xbase + ybase * ybase;
              sum += Cvalues[i] * math.sqrt(comb);
          }
          return z2 * sum;
      }
      function getTatLen(x1, y1, x2, y2, x3, y3, x4, y4, ll) {
          if (ll < 0 || bezlen(x1, y1, x2, y2, x3, y3, x4, y4) < ll) {
              return;
          }
          var t = 1,
              step = t / 2,
              t2 = t - step,
              l,
              e = .01;
          l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
          while (abs(l - ll) > e) {
              step /= 2;
              t2 += (l < ll ? 1 : -1) * step;
              l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
          }
          return t2;
      }
      function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
          if (
              mmax(x1, x2) < mmin(x3, x4) ||
              mmin(x1, x2) > mmax(x3, x4) ||
              mmax(y1, y2) < mmin(y3, y4) ||
              mmin(y1, y2) > mmax(y3, y4)
          ) {
              return;
          }
          var nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4),
              ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4),
              denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

          if (!denominator) {
              return;
          }
          var px = nx / denominator,
              py = ny / denominator,
              px2 = +px.toFixed(2),
              py2 = +py.toFixed(2);
          if (
              px2 < +mmin(x1, x2).toFixed(2) ||
              px2 > +mmax(x1, x2).toFixed(2) ||
              px2 < +mmin(x3, x4).toFixed(2) ||
              px2 > +mmax(x3, x4).toFixed(2) ||
              py2 < +mmin(y1, y2).toFixed(2) ||
              py2 > +mmax(y1, y2).toFixed(2) ||
              py2 < +mmin(y3, y4).toFixed(2) ||
              py2 > +mmax(y3, y4).toFixed(2)
          ) {
              return;
          }
          return {x: px, y: py};
      }
      function inter(bez1, bez2) {
          return interHelper(bez1, bez2);
      }
      function interCount(bez1, bez2) {
          return interHelper(bez1, bez2, 1);
      }
      function interHelper(bez1, bez2, justCount) {
          var bbox1 = R.bezierBBox(bez1),
              bbox2 = R.bezierBBox(bez2);
          if (!R.isBBoxIntersect(bbox1, bbox2)) {
              return justCount ? 0 : [];
          }
          var l1 = bezlen.apply(0, bez1),
              l2 = bezlen.apply(0, bez2),
              n1 = ~~(l1 / 5),
              n2 = ~~(l2 / 5),
              dots1 = [],
              dots2 = [],
              xy = {},
              res = justCount ? 0 : [];
          for (var i = 0; i < n1 + 1; i++) {
              var p = R.findDotsAtSegment.apply(R, bez1.concat(i / n1));
              dots1.push({x: p.x, y: p.y, t: i / n1});
          }
          for (i = 0; i < n2 + 1; i++) {
              p = R.findDotsAtSegment.apply(R, bez2.concat(i / n2));
              dots2.push({x: p.x, y: p.y, t: i / n2});
          }
          for (i = 0; i < n1; i++) {
              for (var j = 0; j < n2; j++) {
                  var di = dots1[i],
                      di1 = dots1[i + 1],
                      dj = dots2[j],
                      dj1 = dots2[j + 1],
                      ci = abs(di1.x - di.x) < .001 ? "y" : "x",
                      cj = abs(dj1.x - dj.x) < .001 ? "y" : "x",
                      is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
                  if (is) {
                      if (xy[is.x.toFixed(4)] == is.y.toFixed(4)) {
                          continue;
                      }
                      xy[is.x.toFixed(4)] = is.y.toFixed(4);
                      var t1 = di.t + abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t),
                          t2 = dj.t + abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);
                      if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
                          if (justCount) {
                              res++;
                          } else {
                              res.push({
                                  x: is.x,
                                  y: is.y,
                                  t1: t1,
                                  t2: t2
                              });
                          }
                      }
                  }
              }
          }
          return res;
      }
      
      R.pathIntersection = function (path1, path2) {
          return interPathHelper(path1, path2);
      };
      R.pathIntersectionNumber = function (path1, path2) {
          return interPathHelper(path1, path2, 1);
      };
      function interPathHelper(path1, path2, justCount) {
          path1 = R._path2curve(path1);
          path2 = R._path2curve(path2);
          var x1, y1, x2, y2, x1m, y1m, x2m, y2m, bez1, bez2,
              res = justCount ? 0 : [];
          for (var i = 0, ii = path1.length; i < ii; i++) {
              var pi = path1[i];
              if (pi[0] == "M") {
                  x1 = x1m = pi[1];
                  y1 = y1m = pi[2];
              } else {
                  if (pi[0] == "C") {
                      bez1 = [x1, y1].concat(pi.slice(1));
                      x1 = bez1[6];
                      y1 = bez1[7];
                  } else {
                      bez1 = [x1, y1, x1, y1, x1m, y1m, x1m, y1m];
                      x1 = x1m;
                      y1 = y1m;
                  }
                  for (var j = 0, jj = path2.length; j < jj; j++) {
                      var pj = path2[j];
                      if (pj[0] == "M") {
                          x2 = x2m = pj[1];
                          y2 = y2m = pj[2];
                      } else {
                          if (pj[0] == "C") {
                              bez2 = [x2, y2].concat(pj.slice(1));
                              x2 = bez2[6];
                              y2 = bez2[7];
                          } else {
                              bez2 = [x2, y2, x2, y2, x2m, y2m, x2m, y2m];
                              x2 = x2m;
                              y2 = y2m;
                          }
                          var intr = interHelper(bez1, bez2, justCount);
                          if (justCount) {
                              res += intr;
                          } else {
                              for (var k = 0, kk = intr.length; k < kk; k++) {
                                  intr[k].segment1 = i;
                                  intr[k].segment2 = j;
                                  intr[k].bez1 = bez1;
                                  intr[k].bez2 = bez2;
                              }
                              res = res.concat(intr);
                          }
                      }
                  }
              }
          }
          return res;
      }
      
      R.isPointInsidePath = function (path, x, y) {
          var bbox = R.pathBBox(path);
          return R.isPointInsideBBox(bbox, x, y) &&
                 interPathHelper(path, [["M", x, y], ["H", bbox.x2 + 10]], 1) % 2 == 1;
      };
      R._removedFactory = function (methodname) {
          return function () {
              eve("raphael.log", null, "Rapha\xebl: you are calling to method \u201c" + methodname + "\u201d of removed object", methodname);
          };
      };
      
      var pathDimensions = R.pathBBox = function (path) {
          var pth = paths(path);
          if (pth.bbox) {
              return pth.bbox;
          }
          if (!path) {
              return {x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0};
          }
          path = path2curve(path);
          var x = 0, 
              y = 0,
              X = [],
              Y = [],
              p;
          for (var i = 0, ii = path.length; i < ii; i++) {
              p = path[i];
              if (p[0] == "M") {
                  x = p[1];
                  y = p[2];
                  X.push(x);
                  Y.push(y);
              } else {
                  var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                  X = X[concat](dim.min.x, dim.max.x);
                  Y = Y[concat](dim.min.y, dim.max.y);
                  x = p[5];
                  y = p[6];
              }
          }
          var xmin = mmin[apply](0, X),
              ymin = mmin[apply](0, Y),
              xmax = mmax[apply](0, X),
              ymax = mmax[apply](0, Y),
              bb = {
                  x: xmin,
                  y: ymin,
                  x2: xmax,
                  y2: ymax,
                  width: xmax - xmin,
                  height: ymax - ymin
              };
          pth.bbox = clone(bb);
          return bb;
      },
          pathClone = function (pathArray) {
              var res = clone(pathArray);
              res.toString = R._path2string;
              return res;
          },
          pathToRelative = R._pathToRelative = function (pathArray) {
              var pth = paths(pathArray);
              if (pth.rel) {
                  return pathClone(pth.rel);
              }
              if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                  pathArray = R.parsePathString(pathArray);
              }
              var res = [],
                  x = 0,
                  y = 0,
                  mx = 0,
                  my = 0,
                  start = 0;
              if (pathArray[0][0] == "M") {
                  x = pathArray[0][1];
                  y = pathArray[0][2];
                  mx = x;
                  my = y;
                  start++;
                  res.push(["M", x, y]);
              }
              for (var i = start, ii = pathArray.length; i < ii; i++) {
                  var r = res[i] = [],
                      pa = pathArray[i];
                  if (pa[0] != lowerCase.call(pa[0])) {
                      r[0] = lowerCase.call(pa[0]);
                      switch (r[0]) {
                          case "a":
                              r[1] = pa[1];
                              r[2] = pa[2];
                              r[3] = pa[3];
                              r[4] = pa[4];
                              r[5] = pa[5];
                              r[6] = +(pa[6] - x).toFixed(3);
                              r[7] = +(pa[7] - y).toFixed(3);
                              break;
                          case "v":
                              r[1] = +(pa[1] - y).toFixed(3);
                              break;
                          case "m":
                              mx = pa[1];
                              my = pa[2];
                          default:
                              for (var j = 1, jj = pa.length; j < jj; j++) {
                                  r[j] = +(pa[j] - ((j % 2) ? x : y)).toFixed(3);
                              }
                      }
                  } else {
                      r = res[i] = [];
                      if (pa[0] == "m") {
                          mx = pa[1] + x;
                          my = pa[2] + y;
                      }
                      for (var k = 0, kk = pa.length; k < kk; k++) {
                          res[i][k] = pa[k];
                      }
                  }
                  var len = res[i].length;
                  switch (res[i][0]) {
                      case "z":
                          x = mx;
                          y = my;
                          break;
                      case "h":
                          x += +res[i][len - 1];
                          break;
                      case "v":
                          y += +res[i][len - 1];
                          break;
                      default:
                          x += +res[i][len - 2];
                          y += +res[i][len - 1];
                  }
              }
              res.toString = R._path2string;
              pth.rel = pathClone(res);
              return res;
          },
          pathToAbsolute = R._pathToAbsolute = function (pathArray) {
              var pth = paths(pathArray);
              if (pth.abs) {
                  return pathClone(pth.abs);
              }
              if (!R.is(pathArray, array) || !R.is(pathArray && pathArray[0], array)) { // rough assumption
                  pathArray = R.parsePathString(pathArray);
              }
              if (!pathArray || !pathArray.length) {
                  return [["M", 0, 0]];
              }
              var res = [],
                  x = 0,
                  y = 0,
                  mx = 0,
                  my = 0,
                  start = 0;
              if (pathArray[0][0] == "M") {
                  x = +pathArray[0][1];
                  y = +pathArray[0][2];
                  mx = x;
                  my = y;
                  start++;
                  res[0] = ["M", x, y];
              }
              var crz = pathArray.length == 3 && pathArray[0][0] == "M" && pathArray[1][0].toUpperCase() == "R" && pathArray[2][0].toUpperCase() == "Z";
              for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
                  res.push(r = []);
                  pa = pathArray[i];
                  if (pa[0] != upperCase.call(pa[0])) {
                      r[0] = upperCase.call(pa[0]);
                      switch (r[0]) {
                          case "A":
                              r[1] = pa[1];
                              r[2] = pa[2];
                              r[3] = pa[3];
                              r[4] = pa[4];
                              r[5] = pa[5];
                              r[6] = +(pa[6] + x);
                              r[7] = +(pa[7] + y);
                              break;
                          case "V":
                              r[1] = +pa[1] + y;
                              break;
                          case "H":
                              r[1] = +pa[1] + x;
                              break;
                          case "R":
                              var dots = [x, y][concat](pa.slice(1));
                              for (var j = 2, jj = dots.length; j < jj; j++) {
                                  dots[j] = +dots[j] + x;
                                  dots[++j] = +dots[j] + y;
                              }
                              res.pop();
                              res = res[concat](catmullRom2bezier(dots, crz));
                              break;
                          case "M":
                              mx = +pa[1] + x;
                              my = +pa[2] + y;
                          default:
                              for (j = 1, jj = pa.length; j < jj; j++) {
                                  r[j] = +pa[j] + ((j % 2) ? x : y);
                              }
                      }
                  } else if (pa[0] == "R") {
                      dots = [x, y][concat](pa.slice(1));
                      res.pop();
                      res = res[concat](catmullRom2bezier(dots, crz));
                      r = ["R"][concat](pa.slice(-2));
                  } else {
                      for (var k = 0, kk = pa.length; k < kk; k++) {
                          r[k] = pa[k];
                      }
                  }
                  switch (r[0]) {
                      case "Z":
                          x = mx;
                          y = my;
                          break;
                      case "H":
                          x = r[1];
                          break;
                      case "V":
                          y = r[1];
                          break;
                      case "M":
                          mx = r[r.length - 2];
                          my = r[r.length - 1];
                      default:
                          x = r[r.length - 2];
                          y = r[r.length - 1];
                  }
              }
              res.toString = R._path2string;
              pth.abs = pathClone(res);
              return res;
          },
          l2c = function (x1, y1, x2, y2) {
              return [x1, y1, x2, y2, x2, y2];
          },
          q2c = function (x1, y1, ax, ay, x2, y2) {
              var _13 = 1 / 3,
                  _23 = 2 / 3;
              return [
                      _13 * x1 + _23 * ax,
                      _13 * y1 + _23 * ay,
                      _13 * x2 + _23 * ax,
                      _13 * y2 + _23 * ay,
                      x2,
                      y2
                  ];
          },
          a2c = function (x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
              // for more information of where this math came from visit:
              // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
              var _120 = PI * 120 / 180,
                  rad = PI / 180 * (+angle || 0),
                  res = [],
                  xy,
                  rotate = cacher(function (x, y, rad) {
                      var X = x * math.cos(rad) - y * math.sin(rad),
                          Y = x * math.sin(rad) + y * math.cos(rad);
                      return {x: X, y: Y};
                  });
              if (!recursive) {
                  xy = rotate(x1, y1, -rad);
                  x1 = xy.x;
                  y1 = xy.y;
                  xy = rotate(x2, y2, -rad);
                  x2 = xy.x;
                  y2 = xy.y;
                  var cos = math.cos(PI / 180 * angle),
                      sin = math.sin(PI / 180 * angle),
                      x = (x1 - x2) / 2,
                      y = (y1 - y2) / 2;
                  var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
                  if (h > 1) {
                      h = math.sqrt(h);
                      rx = h * rx;
                      ry = h * ry;
                  }
                  var rx2 = rx * rx,
                      ry2 = ry * ry,
                      k = (large_arc_flag == sweep_flag ? -1 : 1) *
                          math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                      cx = k * rx * y / ry + (x1 + x2) / 2,
                      cy = k * -ry * x / rx + (y1 + y2) / 2,
                      f1 = math.asin(((y1 - cy) / ry).toFixed(9)),
                      f2 = math.asin(((y2 - cy) / ry).toFixed(9));

                  f1 = x1 < cx ? PI - f1 : f1;
                  f2 = x2 < cx ? PI - f2 : f2;
                  f1 < 0 && (f1 = PI * 2 + f1);
                  f2 < 0 && (f2 = PI * 2 + f2);
                  if (sweep_flag && f1 > f2) {
                      f1 = f1 - PI * 2;
                  }
                  if (!sweep_flag && f2 > f1) {
                      f2 = f2 - PI * 2;
                  }
              } else {
                  f1 = recursive[0];
                  f2 = recursive[1];
                  cx = recursive[2];
                  cy = recursive[3];
              }
              var df = f2 - f1;
              if (abs(df) > _120) {
                  var f2old = f2,
                      x2old = x2,
                      y2old = y2;
                  f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
                  x2 = cx + rx * math.cos(f2);
                  y2 = cy + ry * math.sin(f2);
                  res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
              }
              df = f2 - f1;
              var c1 = math.cos(f1),
                  s1 = math.sin(f1),
                  c2 = math.cos(f2),
                  s2 = math.sin(f2),
                  t = math.tan(df / 4),
                  hx = 4 / 3 * rx * t,
                  hy = 4 / 3 * ry * t,
                  m1 = [x1, y1],
                  m2 = [x1 + hx * s1, y1 - hy * c1],
                  m3 = [x2 + hx * s2, y2 - hy * c2],
                  m4 = [x2, y2];
              m2[0] = 2 * m1[0] - m2[0];
              m2[1] = 2 * m1[1] - m2[1];
              if (recursive) {
                  return [m2, m3, m4][concat](res);
              } else {
                  res = [m2, m3, m4][concat](res).join()[split](",");
                  var newres = [];
                  for (var i = 0, ii = res.length; i < ii; i++) {
                      newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
                  }
                  return newres;
              }
          },
          findDotAtSegment = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
              var t1 = 1 - t;
              return {
                  x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
                  y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
              };
          },
          curveDim = cacher(function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
              var a = (c2x - 2 * c1x + p1x) - (p2x - 2 * c2x + c1x),
                  b = 2 * (c1x - p1x) - 2 * (c2x - c1x),
                  c = p1x - c1x,
                  t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a,
                  t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a,
                  y = [p1y, p2y],
                  x = [p1x, p2x],
                  dot;
              abs(t1) > "1e12" && (t1 = .5);
              abs(t2) > "1e12" && (t2 = .5);
              if (t1 > 0 && t1 < 1) {
                  dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                  x.push(dot.x);
                  y.push(dot.y);
              }
              if (t2 > 0 && t2 < 1) {
                  dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                  x.push(dot.x);
                  y.push(dot.y);
              }
              a = (c2y - 2 * c1y + p1y) - (p2y - 2 * c2y + c1y);
              b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
              c = p1y - c1y;
              t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a;
              t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a;
              abs(t1) > "1e12" && (t1 = .5);
              abs(t2) > "1e12" && (t2 = .5);
              if (t1 > 0 && t1 < 1) {
                  dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
                  x.push(dot.x);
                  y.push(dot.y);
              }
              if (t2 > 0 && t2 < 1) {
                  dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
                  x.push(dot.x);
                  y.push(dot.y);
              }
              return {
                  min: {x: mmin[apply](0, x), y: mmin[apply](0, y)},
                  max: {x: mmax[apply](0, x), y: mmax[apply](0, y)}
              };
          }),
          path2curve = R._path2curve = cacher(function (path, path2) {
              var pth = !path2 && paths(path);
              if (!path2 && pth.curve) {
                  return pathClone(pth.curve);
              }
              var p = pathToAbsolute(path),
                  p2 = path2 && pathToAbsolute(path2),
                  attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                  attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
                  processPath = function (path, d) {
                      var nx, ny;
                      if (!path) {
                          return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                      }
                      !(path[0] in {T:1, Q:1}) && (d.qx = d.qy = null);
                      switch (path[0]) {
                          case "M":
                              d.X = path[1];
                              d.Y = path[2];
                              break;
                          case "A":
                              path = ["C"][concat](a2c[apply](0, [d.x, d.y][concat](path.slice(1))));
                              break;
                          case "S":
                              nx = d.x + (d.x - (d.bx || d.x));
                              ny = d.y + (d.y - (d.by || d.y));
                              path = ["C", nx, ny][concat](path.slice(1));
                              break;
                          case "T":
                              d.qx = d.x + (d.x - (d.qx || d.x));
                              d.qy = d.y + (d.y - (d.qy || d.y));
                              path = ["C"][concat](q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                              break;
                          case "Q":
                              d.qx = path[1];
                              d.qy = path[2];
                              path = ["C"][concat](q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                              break;
                          case "L":
                              path = ["C"][concat](l2c(d.x, d.y, path[1], path[2]));
                              break;
                          case "H":
                              path = ["C"][concat](l2c(d.x, d.y, path[1], d.y));
                              break;
                          case "V":
                              path = ["C"][concat](l2c(d.x, d.y, d.x, path[1]));
                              break;
                          case "Z":
                              path = ["C"][concat](l2c(d.x, d.y, d.X, d.Y));
                              break;
                      }
                      return path;
                  },
                  fixArc = function (pp, i) {
                      if (pp[i].length > 7) {
                          pp[i].shift();
                          var pi = pp[i];
                          while (pi.length) {
                              pp.splice(i++, 0, ["C"][concat](pi.splice(0, 6)));
                          }
                          pp.splice(i, 1);
                          ii = mmax(p.length, p2 && p2.length || 0);
                      }
                  },
                  fixM = function (path1, path2, a1, a2, i) {
                      if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                          path2.splice(i, 0, ["M", a2.x, a2.y]);
                          a1.bx = 0;
                          a1.by = 0;
                          a1.x = path1[i][1];
                          a1.y = path1[i][2];
                          ii = mmax(p.length, p2 && p2.length || 0);
                      }
                  };
              for (var i = 0, ii = mmax(p.length, p2 && p2.length || 0); i < ii; i++) {
                  p[i] = processPath(p[i], attrs);
                  fixArc(p, i);
                  p2 && (p2[i] = processPath(p2[i], attrs2));
                  p2 && fixArc(p2, i);
                  fixM(p, p2, attrs, attrs2, i);
                  fixM(p2, p, attrs2, attrs, i);
                  var seg = p[i],
                      seg2 = p2 && p2[i],
                      seglen = seg.length,
                      seg2len = p2 && seg2.length;
                  attrs.x = seg[seglen - 2];
                  attrs.y = seg[seglen - 1];
                  attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
                  attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
                  attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
                  attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
                  attrs2.x = p2 && seg2[seg2len - 2];
                  attrs2.y = p2 && seg2[seg2len - 1];
              }
              if (!p2) {
                  pth.curve = pathClone(p);
              }
              return p2 ? [p, p2] : p;
          }, null, pathClone),
          parseDots = R._parseDots = cacher(function (gradient) {
              var dots = [];
              for (var i = 0, ii = gradient.length; i < ii; i++) {
                  var dot = {},
                      par = gradient[i].match(/^([^:]*):?([\d\.]*)/);
                  dot.color = R.getRGB(par[1]);
                  if (dot.color.error) {
                      return null;
                  }
                  dot.color = dot.color.hex;
                  par[2] && (dot.offset = par[2] + "%");
                  dots.push(dot);
              }
              for (i = 1, ii = dots.length - 1; i < ii; i++) {
                  if (!dots[i].offset) {
                      var start = toFloat(dots[i - 1].offset || 0),
                          end = 0;
                      for (var j = i + 1; j < ii; j++) {
                          if (dots[j].offset) {
                              end = dots[j].offset;
                              break;
                          }
                      }
                      if (!end) {
                          end = 100;
                          j = ii;
                      }
                      end = toFloat(end);
                      var d = (end - start) / (j - i + 1);
                      for (; i < j; i++) {
                          start += d;
                          dots[i].offset = start + "%";
                      }
                  }
              }
              return dots;
          }),
          tear = R._tear = function (el, paper) {
              el == paper.top && (paper.top = el.prev);
              el == paper.bottom && (paper.bottom = el.next);
              el.next && (el.next.prev = el.prev);
              el.prev && (el.prev.next = el.next);
          },
          tofront = R._tofront = function (el, paper) {
              if (paper.top === el) {
                  return;
              }
              tear(el, paper);
              el.next = null;
              el.prev = paper.top;
              paper.top.next = el;
              paper.top = el;
          },
          toback = R._toback = function (el, paper) {
              if (paper.bottom === el) {
                  return;
              }
              tear(el, paper);
              el.next = paper.bottom;
              el.prev = null;
              paper.bottom.prev = el;
              paper.bottom = el;
          },
          insertafter = R._insertafter = function (el, el2, paper) {
              tear(el, paper);
              el2 == paper.top && (paper.top = el);
              el2.next && (el2.next.prev = el);
              el.next = el2.next;
              el.prev = el2;
              el2.next = el;
          },
          insertbefore = R._insertbefore = function (el, el2, paper) {
              tear(el, paper);
              el2 == paper.bottom && (paper.bottom = el);
              el2.prev && (el2.prev.next = el);
              el.prev = el2.prev;
              el2.prev = el;
              el.next = el2;
          },
          
          toMatrix = R.toMatrix = function (path, transform) {
              var bb = pathDimensions(path),
                  el = {
                      _: {
                          transform: E
                      },
                      getBBox: function () {
                          return bb;
                      }
                  };
              extractTransform(el, transform);
              return el.matrix;
          },
          
          transformPath = R.transformPath = function (path, transform) {
              return mapPath(path, toMatrix(path, transform));
          },
          extractTransform = R._extractTransform = function (el, tstr) {
              if (tstr == null) {
                  return el._.transform;
              }
              tstr = Str(tstr).replace(/\.{3}|\u2026/g, el._.transform || E);
              var tdata = R.parseTransformString(tstr),
                  deg = 0,
                  dx = 0,
                  dy = 0,
                  sx = 1,
                  sy = 1,
                  _ = el._,
                  m = new Matrix;
              _.transform = tdata || [];
              if (tdata) {
                  for (var i = 0, ii = tdata.length; i < ii; i++) {
                      var t = tdata[i],
                          tlen = t.length,
                          command = Str(t[0]).toLowerCase(),
                          absolute = t[0] != command,
                          inver = absolute ? m.invert() : 0,
                          x1,
                          y1,
                          x2,
                          y2,
                          bb;
                      if (command == "t" && tlen == 3) {
                          if (absolute) {
                              x1 = inver.x(0, 0);
                              y1 = inver.y(0, 0);
                              x2 = inver.x(t[1], t[2]);
                              y2 = inver.y(t[1], t[2]);
                              m.translate(x2 - x1, y2 - y1);
                          } else {
                              m.translate(t[1], t[2]);
                          }
                      } else if (command == "r") {
                          if (tlen == 2) {
                              bb = bb || el.getBBox(1);
                              m.rotate(t[1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                              deg += t[1];
                          } else if (tlen == 4) {
                              if (absolute) {
                                  x2 = inver.x(t[2], t[3]);
                                  y2 = inver.y(t[2], t[3]);
                                  m.rotate(t[1], x2, y2);
                              } else {
                                  m.rotate(t[1], t[2], t[3]);
                              }
                              deg += t[1];
                          }
                      } else if (command == "s") {
                          if (tlen == 2 || tlen == 3) {
                              bb = bb || el.getBBox(1);
                              m.scale(t[1], t[tlen - 1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                              sx *= t[1];
                              sy *= t[tlen - 1];
                          } else if (tlen == 5) {
                              if (absolute) {
                                  x2 = inver.x(t[3], t[4]);
                                  y2 = inver.y(t[3], t[4]);
                                  m.scale(t[1], t[2], x2, y2);
                              } else {
                                  m.scale(t[1], t[2], t[3], t[4]);
                              }
                              sx *= t[1];
                              sy *= t[2];
                          }
                      } else if (command == "m" && tlen == 7) {
                          m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
                      }
                      _.dirtyT = 1;
                      el.matrix = m;
                  }
              }

              
              el.matrix = m;

              _.sx = sx;
              _.sy = sy;
              _.deg = deg;
              _.dx = dx = m.e;
              _.dy = dy = m.f;

              if (sx == 1 && sy == 1 && !deg && _.bbox) {
                  _.bbox.x += +dx;
                  _.bbox.y += +dy;
              } else {
                  _.dirtyT = 1;
              }
          },
          getEmpty = function (item) {
              var l = item[0];
              switch (l.toLowerCase()) {
                  case "t": return [l, 0, 0];
                  case "m": return [l, 1, 0, 0, 1, 0, 0];
                  case "r": if (item.length == 4) {
                      return [l, 0, item[2], item[3]];
                  } else {
                      return [l, 0];
                  }
                  case "s": if (item.length == 5) {
                      return [l, 1, 1, item[3], item[4]];
                  } else if (item.length == 3) {
                      return [l, 1, 1];
                  } else {
                      return [l, 1];
                  }
              }
          },
          equaliseTransform = R._equaliseTransform = function (t1, t2) {
              t2 = Str(t2).replace(/\.{3}|\u2026/g, t1);
              t1 = R.parseTransformString(t1) || [];
              t2 = R.parseTransformString(t2) || [];
              var maxlength = mmax(t1.length, t2.length),
                  from = [],
                  to = [],
                  i = 0, j, jj,
                  tt1, tt2;
              for (; i < maxlength; i++) {
                  tt1 = t1[i] || getEmpty(t2[i]);
                  tt2 = t2[i] || getEmpty(tt1);
                  if ((tt1[0] != tt2[0]) ||
                      (tt1[0].toLowerCase() == "r" && (tt1[2] != tt2[2] || tt1[3] != tt2[3])) ||
                      (tt1[0].toLowerCase() == "s" && (tt1[3] != tt2[3] || tt1[4] != tt2[4]))
                      ) {
                      return;
                  }
                  from[i] = [];
                  to[i] = [];
                  for (j = 0, jj = mmax(tt1.length, tt2.length); j < jj; j++) {
                      j in tt1 && (from[i][j] = tt1[j]);
                      j in tt2 && (to[i][j] = tt2[j]);
                  }
              }
              return {
                  from: from,
                  to: to
              };
          };
      R._getContainer = function (x, y, w, h) {
          var container;
          container = h == null && !R.is(x, "object") ? g.doc.getElementById(x) : x;
          if (container == null) {
              return;
          }
          if (container.tagName) {
              if (y == null) {
                  return {
                      container: container,
                      width: container.style.pixelWidth || container.offsetWidth,
                      height: container.style.pixelHeight || container.offsetHeight
                  };
              } else {
                  return {
                      container: container,
                      width: y,
                      height: w
                  };
              }
          }
          return {
              container: 1,
              x: x,
              y: y,
              width: w,
              height: h
          };
      };
      
      R.pathToRelative = pathToRelative;
      R._engine = {};
      
      R.path2curve = path2curve;
      
      R.matrix = function (a, b, c, d, e, f) {
          return new Matrix(a, b, c, d, e, f);
      };
      function Matrix(a, b, c, d, e, f) {
          if (a != null) {
              this.a = +a;
              this.b = +b;
              this.c = +c;
              this.d = +d;
              this.e = +e;
              this.f = +f;
          } else {
              this.a = 1;
              this.b = 0;
              this.c = 0;
              this.d = 1;
              this.e = 0;
              this.f = 0;
          }
      }
      (function (matrixproto) {
          
          matrixproto.add = function (a, b, c, d, e, f) {
              var out = [[], [], []],
                  m = [[this.a, this.c, this.e], [this.b, this.d, this.f], [0, 0, 1]],
                  matrix = [[a, c, e], [b, d, f], [0, 0, 1]],
                  x, y, z, res;

              if (a && a instanceof Matrix) {
                  matrix = [[a.a, a.c, a.e], [a.b, a.d, a.f], [0, 0, 1]];
              }

              for (x = 0; x < 3; x++) {
                  for (y = 0; y < 3; y++) {
                      res = 0;
                      for (z = 0; z < 3; z++) {
                          res += m[x][z] * matrix[z][y];
                      }
                      out[x][y] = res;
                  }
              }
              this.a = out[0][0];
              this.b = out[1][0];
              this.c = out[0][1];
              this.d = out[1][1];
              this.e = out[0][2];
              this.f = out[1][2];
          };
          
          matrixproto.invert = function () {
              var me = this,
                  x = me.a * me.d - me.b * me.c;
              return new Matrix(me.d / x, -me.b / x, -me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
          };
          
          matrixproto.clone = function () {
              return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
          };
          
          matrixproto.translate = function (x, y) {
              this.add(1, 0, 0, 1, x, y);
          };
          
          matrixproto.scale = function (x, y, cx, cy) {
              y == null && (y = x);
              (cx || cy) && this.add(1, 0, 0, 1, cx, cy);
              this.add(x, 0, 0, y, 0, 0);
              (cx || cy) && this.add(1, 0, 0, 1, -cx, -cy);
          };
          
          matrixproto.rotate = function (a, x, y) {
              a = R.rad(a);
              x = x || 0;
              y = y || 0;
              var cos = +math.cos(a).toFixed(9),
                  sin = +math.sin(a).toFixed(9);
              this.add(cos, sin, -sin, cos, x, y);
              this.add(1, 0, 0, 1, -x, -y);
          };
          
          matrixproto.x = function (x, y) {
              return x * this.a + y * this.c + this.e;
          };
          
          matrixproto.y = function (x, y) {
              return x * this.b + y * this.d + this.f;
          };
          matrixproto.get = function (i) {
              return +this[Str.fromCharCode(97 + i)].toFixed(4);
          };
          matrixproto.toString = function () {
              return R.svg ?
                  "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")" :
                  [this.get(0), this.get(2), this.get(1), this.get(3), 0, 0].join();
          };
          matrixproto.toFilter = function () {
              return "progid:DXImageTransform.Microsoft.Matrix(M11=" + this.get(0) +
                  ", M12=" + this.get(2) + ", M21=" + this.get(1) + ", M22=" + this.get(3) +
                  ", Dx=" + this.get(4) + ", Dy=" + this.get(5) + ", sizingmethod='auto expand')";
          };
          matrixproto.offset = function () {
              return [this.e.toFixed(4), this.f.toFixed(4)];
          };
          function norm(a) {
              return a[0] * a[0] + a[1] * a[1];
          }
          function normalize(a) {
              var mag = math.sqrt(norm(a));
              a[0] && (a[0] /= mag);
              a[1] && (a[1] /= mag);
          }
          
          matrixproto.split = function () {
              var out = {};
              // translation
              out.dx = this.e;
              out.dy = this.f;

              // scale and shear
              var row = [[this.a, this.c], [this.b, this.d]];
              out.scalex = math.sqrt(norm(row[0]));
              normalize(row[0]);

              out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1];
              row[1] = [row[1][0] - row[0][0] * out.shear, row[1][1] - row[0][1] * out.shear];

              out.scaley = math.sqrt(norm(row[1]));
              normalize(row[1]);
              out.shear /= out.scaley;

              // rotation
              var sin = -row[0][1],
                  cos = row[1][1];
              if (cos < 0) {
                  out.rotate = R.deg(math.acos(cos));
                  if (sin < 0) {
                      out.rotate = 360 - out.rotate;
                  }
              } else {
                  out.rotate = R.deg(math.asin(sin));
              }

              out.isSimple = !+out.shear.toFixed(9) && (out.scalex.toFixed(9) == out.scaley.toFixed(9) || !out.rotate);
              out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate;
              out.noRotation = !+out.shear.toFixed(9) && !out.rotate;
              return out;
          };
          
          matrixproto.toTransformString = function (shorter) {
              var s = shorter || this[split]();
              if (s.isSimple) {
                  s.scalex = +s.scalex.toFixed(4);
                  s.scaley = +s.scaley.toFixed(4);
                  s.rotate = +s.rotate.toFixed(4);
                  return  (s.dx || s.dy ? "t" + [s.dx, s.dy] : E) + 
                          (s.scalex != 1 || s.scaley != 1 ? "s" + [s.scalex, s.scaley, 0, 0] : E) +
                          (s.rotate ? "r" + [s.rotate, 0, 0] : E);
              } else {
                  return "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)];
              }
          };
      })(Matrix.prototype);

      // WebKit rendering bug workaround method
      var version = navigator.userAgent.match(/Version\/(.*?)\s/) || navigator.userAgent.match(/Chrome\/(\d+)/);
      if ((navigator.vendor == "Apple Computer, Inc.") && (version && version[1] < 4 || navigator.platform.slice(0, 2) == "iP") ||
          (navigator.vendor == "Google Inc." && version && version[1] < 8)) {
          
          paperproto.safari = function () {
              var rect = this.rect(-99, -99, this.width + 99, this.height + 99).attr({stroke: "none"});
              setTimeout(function () {rect.remove();});
          };
      } else {
          paperproto.safari = fun;
      }
   
      var preventDefault = function () {
          this.returnValue = false;
      },
      preventTouch = function () {
          return this.originalEvent.preventDefault();
      },
      stopPropagation = function () {
          this.cancelBubble = true;
      },
      stopTouch = function () {
          return this.originalEvent.stopPropagation();
      },
      addEvent = (function () {
          if (g.doc.addEventListener) {
              return function (obj, type, fn, element) {
                  var realName = supportsTouch && touchMap[type] ? touchMap[type] : type,
                      f = function (e) {
                          var scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
                              scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft,
                              x = e.clientX + scrollX,
                              y = e.clientY + scrollY;
                      if (supportsTouch && touchMap[has](type)) {
                          for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
                              if (e.targetTouches[i].target == obj) {
                                  var olde = e;
                                  e = e.targetTouches[i];
                                  e.originalEvent = olde;
                                  e.preventDefault = preventTouch;
                                  e.stopPropagation = stopTouch;
                                  break;
                              }
                          }
                      }
                      return fn.call(element, e, x, y);
                  };
                  obj.addEventListener(realName, f, false);
                  return function () {
                      obj.removeEventListener(realName, f, false);
                      return true;
                  };
              };
          } else if (g.doc.attachEvent) {
              return function (obj, type, fn, element) {
                  var f = function (e) {
                      e = e || g.win.event;
                      var scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
                          scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft,
                          x = e.clientX + scrollX,
                          y = e.clientY + scrollY;
                      e.preventDefault = e.preventDefault || preventDefault;
                      e.stopPropagation = e.stopPropagation || stopPropagation;
                      return fn.call(element, e, x, y);
                  };
                  obj.attachEvent("on" + type, f);
                  var detacher = function () {
                      obj.detachEvent("on" + type, f);
                      return true;
                  };
                  return detacher;
              };
          }
      })(),
      drag = [],
      dragMove = function (e) {
          var x = e.clientX,
              y = e.clientY,
              scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
              scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft,
              dragi,
              j = drag.length;
          while (j--) {
              dragi = drag[j];
              if (supportsTouch) {
                  var i = e.touches.length,
                      touch;
                  while (i--) {
                      touch = e.touches[i];
                      if (touch.identifier == dragi.el._drag.id) {
                          x = touch.clientX;
                          y = touch.clientY;
                          (e.originalEvent ? e.originalEvent : e).preventDefault();
                          break;
                      }
                  }
              } else {
                  e.preventDefault();
              }
              var node = dragi.el.node,
                  o,
                  next = node.nextSibling,
                  parent = node.parentNode,
                  display = node.style.display;
              g.win.opera && parent.removeChild(node);
              node.style.display = "none";
              o = dragi.el.paper.getElementByPoint(x, y);
              node.style.display = display;
              g.win.opera && (next ? parent.insertBefore(node, next) : parent.appendChild(node));
              o && eve("raphael.drag.over." + dragi.el.id, dragi.el, o);
              x += scrollX;
              y += scrollY;
              eve("raphael.drag.move." + dragi.el.id, dragi.move_scope || dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y, e);
          }
      },
      dragUp = function (e) {
          R.unmousemove(dragMove).unmouseup(dragUp);
          var i = drag.length,
              dragi;
          while (i--) {
              dragi = drag[i];
              dragi.el._drag = {};
              eve("raphael.drag.end." + dragi.el.id, dragi.end_scope || dragi.start_scope || dragi.move_scope || dragi.el, e);
          }
          drag = [];
      },
      
      elproto = R.el = {};
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      for (var i = events.length; i--;) {
          (function (eventName) {
              R[eventName] = elproto[eventName] = function (fn, scope) {
                  if (R.is(fn, "function")) {
                      this.events = this.events || [];
                      this.events.push({name: eventName, f: fn, unbind: addEvent(this.shape || this.node || g.doc, eventName, fn, scope || this)});
                  }
                  return this;
              };
              R["un" + eventName] = elproto["un" + eventName] = function (fn) {
                  var events = this.events || [],
                      l = events.length;
                  while (l--) if (events[l].name == eventName && events[l].f == fn) {
                      events[l].unbind();
                      events.splice(l, 1);
                      !events.length && delete this.events;
                      return this;
                  }
                  return this;
              };
          })(events[i]);
      }
      
      
      elproto.data = function (key, value) {
          var data = eldata[this.id] = eldata[this.id] || {};
          if (arguments.length == 1) {
              if (R.is(key, "object")) {
                  for (var i in key) if (key[has](i)) {
                      this.data(i, key[i]);
                  }
                  return this;
              }
              eve("raphael.data.get." + this.id, this, data[key], key);
              return data[key];
          }
          data[key] = value;
          eve("raphael.data.set." + this.id, this, value, key);
          return this;
      };
      
      elproto.removeData = function (key) {
          if (key == null) {
              eldata[this.id] = {};
          } else {
              eldata[this.id] && delete eldata[this.id][key];
          }
          return this;
      };
      
      elproto.hover = function (f_in, f_out, scope_in, scope_out) {
          return this.mouseover(f_in, scope_in).mouseout(f_out, scope_out || scope_in);
      };
      
      elproto.unhover = function (f_in, f_out) {
          return this.unmouseover(f_in).unmouseout(f_out);
      };
      var draggable = [];
      
      elproto.drag = function (onmove, onstart, onend, move_scope, start_scope, end_scope) {
          function start(e) {
              (e.originalEvent || e).preventDefault();
              var scrollY = g.doc.documentElement.scrollTop || g.doc.body.scrollTop,
                  scrollX = g.doc.documentElement.scrollLeft || g.doc.body.scrollLeft;
              this._drag.x = e.clientX + scrollX;
              this._drag.y = e.clientY + scrollY;
              this._drag.id = e.identifier;
              !drag.length && R.mousemove(dragMove).mouseup(dragUp);
              drag.push({el: this, move_scope: move_scope, start_scope: start_scope, end_scope: end_scope});
              onstart && eve.on("raphael.drag.start." + this.id, onstart);
              onmove && eve.on("raphael.drag.move." + this.id, onmove);
              onend && eve.on("raphael.drag.end." + this.id, onend);
              eve("raphael.drag.start." + this.id, start_scope || move_scope || this, e.clientX + scrollX, e.clientY + scrollY, e);
          }
          this._drag = {};
          draggable.push({el: this, start: start});
          this.mousedown(start);
          return this;
      };
      
      elproto.onDragOver = function (f) {
          f ? eve.on("raphael.drag.over." + this.id, f) : eve.unbind("raphael.drag.over." + this.id);
      };
      
      elproto.undrag = function () {
          var i = draggable.length;
          while (i--) if (draggable[i].el == this) {
              this.unmousedown(draggable[i].start);
              draggable.splice(i, 1);
              eve.unbind("raphael.drag.*." + this.id);
          }
          !draggable.length && R.unmousemove(dragMove).unmouseup(dragUp);
      };
      
      paperproto.circle = function (x, y, r) {
          var out = R._engine.circle(this, x || 0, y || 0, r || 0);
          this.__set__ && this.__set__.push(out);
          return out;
      };
      
      paperproto.rect = function (x, y, w, h, r) {
          var out = R._engine.rect(this, x || 0, y || 0, w || 0, h || 0, r || 0);
          this.__set__ && this.__set__.push(out);
          return out;
      };
      
      paperproto.ellipse = function (x, y, rx, ry) {
          var out = R._engine.ellipse(this, x || 0, y || 0, rx || 0, ry || 0);
          this.__set__ && this.__set__.push(out);
          return out;
      };
      
      paperproto.path = function (pathString) {
          pathString && !R.is(pathString, string) && !R.is(pathString[0], array) && (pathString += E);
          var out = R._engine.path(R.format[apply](R, arguments), this);
          this.__set__ && this.__set__.push(out);
          return out;
      };
      
      paperproto.image = function (src, x, y, w, h) {
          var out = R._engine.image(this, src || "about:blank", x || 0, y || 0, w || 0, h || 0);
          this.__set__ && this.__set__.push(out);
          return out;
      };
      
      paperproto.text = function (x, y, text) {
          var out = R._engine.text(this, x || 0, y || 0, Str(text));
          this.__set__ && this.__set__.push(out);
          return out;
      };
      
      paperproto.set = function (itemsArray) {
          !R.is(itemsArray, "array") && (itemsArray = Array.prototype.splice.call(arguments, 0, arguments.length));
          var out = new Set(itemsArray);
          this.__set__ && this.__set__.push(out);
          return out;
      };
      
      paperproto.setStart = function (set) {
          this.__set__ = set || this.set();
      };
      
      paperproto.setFinish = function (set) {
          var out = this.__set__;
          delete this.__set__;
          return out;
      };
      
      paperproto.setSize = function (width, height) {
          return R._engine.setSize.call(this, width, height);
      };
      
      paperproto.setViewBox = function (x, y, w, h, fit) {
          return R._engine.setViewBox.call(this, x, y, w, h, fit);
      };
      
      
      paperproto.top = paperproto.bottom = null;
      
      paperproto.raphael = R;
      var getOffset = function (elem) {
          var box = elem.getBoundingClientRect(),
              doc = elem.ownerDocument,
              body = doc.body,
              docElem = doc.documentElement,
              clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
              top  = box.top  + (g.win.pageYOffset || docElem.scrollTop || body.scrollTop ) - clientTop,
              left = box.left + (g.win.pageXOffset || docElem.scrollLeft || body.scrollLeft) - clientLeft;
          return {
              y: top,
              x: left
          };
      };
      
      paperproto.getElementByPoint = function (x, y) {
          var paper = this,
              svg = paper.canvas,
              target = g.doc.elementFromPoint(x, y);
          if (g.win.opera && target.tagName == "svg") {
              var so = getOffset(svg),
                  sr = svg.createSVGRect();
              sr.x = x - so.x;
              sr.y = y - so.y;
              sr.width = sr.height = 1;
              var hits = svg.getIntersectionList(sr, null);
              if (hits.length) {
                  target = hits[hits.length - 1];
              }
          }
          if (!target) {
              return null;
          }
          while (target.parentNode && target != svg.parentNode && !target.raphael) {
              target = target.parentNode;
          }
          target == paper.canvas.parentNode && (target = svg);
          target = target && target.raphael ? paper.getById(target.raphaelid) : null;
          return target;
      };
      
      paperproto.getById = function (id) {
          var bot = this.bottom;
          while (bot) {
              if (bot.id == id) {
                  return bot;
              }
              bot = bot.next;
          }
          return null;
      };
      
      paperproto.forEach = function (callback, thisArg) {
          var bot = this.bottom;
          while (bot) {
              if (callback.call(thisArg, bot) === false) {
                  return this;
              }
              bot = bot.next;
          }
          return this;
      };
      
      paperproto.getElementsByPoint = function (x, y) {
          var set = this.set();
          this.forEach(function (el) {
              if (el.isPointInside(x, y)) {
                  set.push(el);
              }
          });
          return set;
      };
      function x_y() {
          return this.x + S + this.y;
      }
      function x_y_w_h() {
          return this.x + S + this.y + S + this.width + " \xd7 " + this.height;
      }
      
      elproto.isPointInside = function (x, y) {
          var rp = this.realPath = this.realPath || getPath[this.type](this);
          return R.isPointInsidePath(rp, x, y);
      };
      
      elproto.getBBox = function (isWithoutTransform) {
          if (this.removed) {
              return {};
          }
          var _ = this._;
          if (isWithoutTransform) {
              if (_.dirty || !_.bboxwt) {
                  this.realPath = getPath[this.type](this);
                  _.bboxwt = pathDimensions(this.realPath);
                  _.bboxwt.toString = x_y_w_h;
                  _.dirty = 0;
              }
              return _.bboxwt;
          }
          if (_.dirty || _.dirtyT || !_.bbox) {
              if (_.dirty || !this.realPath) {
                  _.bboxwt = 0;
                  this.realPath = getPath[this.type](this);
              }
              _.bbox = pathDimensions(mapPath(this.realPath, this.matrix));
              _.bbox.toString = x_y_w_h;
              _.dirty = _.dirtyT = 0;
          }
          return _.bbox;
      };
      
      elproto.clone = function () {
          if (this.removed) {
              return null;
          }
          var out = this.paper[this.type]().attr(this.attr());
          this.__set__ && this.__set__.push(out);
          return out;
      };
      
      elproto.glow = function (glow) {
          if (this.type == "text") {
              return null;
          }
          glow = glow || {};
          var s = {
              width: (glow.width || 10) + (+this.attr("stroke-width") || 1),
              fill: glow.fill || false,
              opacity: glow.opacity || .5,
              offsetx: glow.offsetx || 0,
              offsety: glow.offsety || 0,
              color: glow.color || "#000"
          },
              c = s.width / 2,
              r = this.paper,
              out = r.set(),
              path = this.realPath || getPath[this.type](this);
          path = this.matrix ? mapPath(path, this.matrix) : path;
          for (var i = 1; i < c + 1; i++) {
              out.push(r.path(path).attr({
                  stroke: s.color,
                  fill: s.fill ? s.color : "none",
                  "stroke-linejoin": "round",
                  "stroke-linecap": "round",
                  "stroke-width": +(s.width / c * i).toFixed(3),
                  opacity: +(s.opacity / c).toFixed(3)
              }));
          }
          return out.insertBefore(this).translate(s.offsetx, s.offsety);
      };
      var curveslengths = {},
      getPointAtSegmentLength = function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
          if (length == null) {
              return bezlen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
          } else {
              return R.findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, getTatLen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length));
          }
      },
      getLengthFactory = function (istotal, subpath) {
          return function (path, length, onlystart) {
              path = path2curve(path);
              var x, y, p, l, sp = "", subpaths = {}, point,
                  len = 0;
              for (var i = 0, ii = path.length; i < ii; i++) {
                  p = path[i];
                  if (p[0] == "M") {
                      x = +p[1];
                      y = +p[2];
                  } else {
                      l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                      if (len + l > length) {
                          if (subpath && !subpaths.start) {
                              point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                              sp += ["C" + point.start.x, point.start.y, point.m.x, point.m.y, point.x, point.y];
                              if (onlystart) {return sp;}
                              subpaths.start = sp;
                              sp = ["M" + point.x, point.y + "C" + point.n.x, point.n.y, point.end.x, point.end.y, p[5], p[6]].join();
                              len += l;
                              x = +p[5];
                              y = +p[6];
                              continue;
                          }
                          if (!istotal && !subpath) {
                              point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                              return {x: point.x, y: point.y, alpha: point.alpha};
                          }
                      }
                      len += l;
                      x = +p[5];
                      y = +p[6];
                  }
                  sp += p.shift() + p;
              }
              subpaths.end = sp;
              point = istotal ? len : subpath ? subpaths : R.findDotsAtSegment(x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);
              point.alpha && (point = {x: point.x, y: point.y, alpha: point.alpha});
              return point;
          };
      };
      var getTotalLength = getLengthFactory(1),
          getPointAtLength = getLengthFactory(),
          getSubpathsAtLength = getLengthFactory(0, 1);
      
      R.getTotalLength = getTotalLength;
      
      R.getPointAtLength = getPointAtLength;
      
      R.getSubpath = function (path, from, to) {
          if (this.getTotalLength(path) - to < 1e-6) {
              return getSubpathsAtLength(path, from).end;
          }
          var a = getSubpathsAtLength(path, to, 1);
          return from ? getSubpathsAtLength(a, from).end : a;
      };
      
      elproto.getTotalLength = function () {
          if (this.type != "path") {return;}
          if (this.node.getTotalLength) {
              return this.node.getTotalLength();
          }
          return getTotalLength(this.attrs.path);
      };
      
      elproto.getPointAtLength = function (length) {
          if (this.type != "path") {return;}
          return getPointAtLength(this.attrs.path, length);
      };
      
      elproto.getSubpath = function (from, to) {
          if (this.type != "path") {return;}
          return R.getSubpath(this.attrs.path, from, to);
      };
      
      var ef = R.easing_formulas = {
          linear: function (n) {
              return n;
          },
          "<": function (n) {
              return pow(n, 1.7);
          },
          ">": function (n) {
              return pow(n, .48);
          },
          "<>": function (n) {
              var q = .48 - n / 1.04,
                  Q = math.sqrt(.1734 + q * q),
                  x = Q - q,
                  X = pow(abs(x), 1 / 3) * (x < 0 ? -1 : 1),
                  y = -Q - q,
                  Y = pow(abs(y), 1 / 3) * (y < 0 ? -1 : 1),
                  t = X + Y + .5;
              return (1 - t) * 3 * t * t + t * t * t;
          },
          backIn: function (n) {
              var s = 1.70158;
              return n * n * ((s + 1) * n - s);
          },
          backOut: function (n) {
              n = n - 1;
              var s = 1.70158;
              return n * n * ((s + 1) * n + s) + 1;
          },
          elastic: function (n) {
              if (n == !!n) {
                  return n;
              }
              return pow(2, -10 * n) * math.sin((n - .075) * (2 * PI) / .3) + 1;
          },
          bounce: function (n) {
              var s = 7.5625,
                  p = 2.75,
                  l;
              if (n < (1 / p)) {
                  l = s * n * n;
              } else {
                  if (n < (2 / p)) {
                      n -= (1.5 / p);
                      l = s * n * n + .75;
                  } else {
                      if (n < (2.5 / p)) {
                          n -= (2.25 / p);
                          l = s * n * n + .9375;
                      } else {
                          n -= (2.625 / p);
                          l = s * n * n + .984375;
                      }
                  }
              }
              return l;
          }
      };
      ef.easeIn = ef["ease-in"] = ef["<"];
      ef.easeOut = ef["ease-out"] = ef[">"];
      ef.easeInOut = ef["ease-in-out"] = ef["<>"];
      ef["back-in"] = ef.backIn;
      ef["back-out"] = ef.backOut;

      var animationElements = [],
          requestAnimFrame = window.requestAnimationFrame       ||
                             window.webkitRequestAnimationFrame ||
                             window.mozRequestAnimationFrame    ||
                             window.oRequestAnimationFrame      ||
                             window.msRequestAnimationFrame     ||
                             function (callback) {
                                 setTimeout(callback, 16);
                             },
          animation = function () {
              var Now = +new Date,
                  l = 0;
              for (; l < animationElements.length; l++) {
                  var e = animationElements[l];
                  if (e.el.removed || e.paused) {
                      continue;
                  }
                  var time = Now - e.start,
                      ms = e.ms,
                      easing = e.easing,
                      from = e.from,
                      diff = e.diff,
                      to = e.to,
                      t = e.t,
                      that = e.el,
                      set = {},
                      now,
                      init = {},
                      key;
                  if (e.initstatus) {
                      time = (e.initstatus * e.anim.top - e.prev) / (e.percent - e.prev) * ms;
                      e.status = e.initstatus;
                      delete e.initstatus;
                      e.stop && animationElements.splice(l--, 1);
                  } else {
                      e.status = (e.prev + (e.percent - e.prev) * (time / ms)) / e.anim.top;
                  }
                  if (time < 0) {
                      continue;
                  }
                  if (time < ms) {
                      var pos = easing(time / ms);
                      for (var attr in from) if (from[has](attr)) {
                          switch (availableAnimAttrs[attr]) {
                              case nu:
                                  now = +from[attr] + pos * ms * diff[attr];
                                  break;
                              case "colour":
                                  now = "rgb(" + [
                                      upto255(round(from[attr].r + pos * ms * diff[attr].r)),
                                      upto255(round(from[attr].g + pos * ms * diff[attr].g)),
                                      upto255(round(from[attr].b + pos * ms * diff[attr].b))
                                  ].join(",") + ")";
                                  break;
                              case "path":
                                  now = [];
                                  for (var i = 0, ii = from[attr].length; i < ii; i++) {
                                      now[i] = [from[attr][i][0]];
                                      for (var j = 1, jj = from[attr][i].length; j < jj; j++) {
                                          now[i][j] = +from[attr][i][j] + pos * ms * diff[attr][i][j];
                                      }
                                      now[i] = now[i].join(S);
                                  }
                                  now = now.join(S);
                                  break;
                              case "transform":
                                  if (diff[attr].real) {
                                      now = [];
                                      for (i = 0, ii = from[attr].length; i < ii; i++) {
                                          now[i] = [from[attr][i][0]];
                                          for (j = 1, jj = from[attr][i].length; j < jj; j++) {
                                              now[i][j] = from[attr][i][j] + pos * ms * diff[attr][i][j];
                                          }
                                      }
                                  } else {
                                      var get = function (i) {
                                          return +from[attr][i] + pos * ms * diff[attr][i];
                                      };
                                      // now = [["r", get(2), 0, 0], ["t", get(3), get(4)], ["s", get(0), get(1), 0, 0]];
                                      now = [["m", get(0), get(1), get(2), get(3), get(4), get(5)]];
                                  }
                                  break;
                              case "csv":
                                  if (attr == "clip-rect") {
                                      now = [];
                                      i = 4;
                                      while (i--) {
                                          now[i] = +from[attr][i] + pos * ms * diff[attr][i];
                                      }
                                  }
                                  break;
                              default:
                                  var from2 = [][concat](from[attr]);
                                  now = [];
                                  i = that.paper.customAttributes[attr].length;
                                  while (i--) {
                                      now[i] = +from2[i] + pos * ms * diff[attr][i];
                                  }
                                  break;
                          }
                          set[attr] = now;
                      }
                      that.attr(set);
                      (function (id, that, anim) {
                          setTimeout(function () {
                              eve("raphael.anim.frame." + id, that, anim);
                          });
                      })(that.id, that, e.anim);
                  } else {
                      (function(f, el, a) {
                          setTimeout(function() {
                              eve("raphael.anim.frame." + el.id, el, a);
                              eve("raphael.anim.finish." + el.id, el, a);
                              R.is(f, "function") && f.call(el);
                          });
                      })(e.callback, that, e.anim);
                      that.attr(to);
                      animationElements.splice(l--, 1);
                      if (e.repeat > 1 && !e.next) {
                          for (key in to) if (to[has](key)) {
                              init[key] = e.totalOrigin[key];
                          }
                          e.el.attr(init);
                          runAnimation(e.anim, e.el, e.anim.percents[0], null, e.totalOrigin, e.repeat - 1);
                      }
                      if (e.next && !e.stop) {
                          runAnimation(e.anim, e.el, e.next, null, e.totalOrigin, e.repeat);
                      }
                  }
              }
              R.svg && that && that.paper && that.paper.safari();
              animationElements.length && requestAnimFrame(animation);
          },
          upto255 = function (color) {
              return color > 255 ? 255 : color < 0 ? 0 : color;
          };
      
      elproto.animateWith = function (el, anim, params, ms, easing, callback) {
          var element = this;
          if (element.removed) {
              callback && callback.call(element);
              return element;
          }
          var a = params instanceof Animation ? params : R.animation(params, ms, easing, callback),
              x, y;
          runAnimation(a, element, a.percents[0], null, element.attr());
          for (var i = 0, ii = animationElements.length; i < ii; i++) {
              if (animationElements[i].anim == anim && animationElements[i].el == el) {
                  animationElements[ii - 1].start = animationElements[i].start;
                  break;
              }
          }
          return element;
          // 
          // 
          // var a = params ? R.animation(params, ms, easing, callback) : anim,
          //     status = element.status(anim);
          // return this.animate(a).status(a, status * anim.ms / a.ms);
      };
      function CubicBezierAtTime(t, p1x, p1y, p2x, p2y, duration) {
          var cx = 3 * p1x,
              bx = 3 * (p2x - p1x) - cx,
              ax = 1 - cx - bx,
              cy = 3 * p1y,
              by = 3 * (p2y - p1y) - cy,
              ay = 1 - cy - by;
          function sampleCurveX(t) {
              return ((ax * t + bx) * t + cx) * t;
          }
          function solve(x, epsilon) {
              var t = solveCurveX(x, epsilon);
              return ((ay * t + by) * t + cy) * t;
          }
          function solveCurveX(x, epsilon) {
              var t0, t1, t2, x2, d2, i;
              for(t2 = x, i = 0; i < 8; i++) {
                  x2 = sampleCurveX(t2) - x;
                  if (abs(x2) < epsilon) {
                      return t2;
                  }
                  d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
                  if (abs(d2) < 1e-6) {
                      break;
                  }
                  t2 = t2 - x2 / d2;
              }
              t0 = 0;
              t1 = 1;
              t2 = x;
              if (t2 < t0) {
                  return t0;
              }
              if (t2 > t1) {
                  return t1;
              }
              while (t0 < t1) {
                  x2 = sampleCurveX(t2);
                  if (abs(x2 - x) < epsilon) {
                      return t2;
                  }
                  if (x > x2) {
                      t0 = t2;
                  } else {
                      t1 = t2;
                  }
                  t2 = (t1 - t0) / 2 + t0;
              }
              return t2;
          }
          return solve(t, 1 / (200 * duration));
      }
      elproto.onAnimation = function (f) {
          f ? eve.on("raphael.anim.frame." + this.id, f) : eve.unbind("raphael.anim.frame." + this.id);
          return this;
      };
      function Animation(anim, ms) {
          var percents = [],
              newAnim = {};
          this.ms = ms;
          this.times = 1;
          if (anim) {
              for (var attr in anim) if (anim[has](attr)) {
                  newAnim[toFloat(attr)] = anim[attr];
                  percents.push(toFloat(attr));
              }
              percents.sort(sortByNumber);
          }
          this.anim = newAnim;
          this.top = percents[percents.length - 1];
          this.percents = percents;
      }
      
      Animation.prototype.delay = function (delay) {
          var a = new Animation(this.anim, this.ms);
          a.times = this.times;
          a.del = +delay || 0;
          return a;
      };
      
      Animation.prototype.repeat = function (times) { 
          var a = new Animation(this.anim, this.ms);
          a.del = this.del;
          a.times = math.floor(mmax(times, 0)) || 1;
          return a;
      };
      function runAnimation(anim, element, percent, status, totalOrigin, times) {
          percent = toFloat(percent);
          var params,
              isInAnim,
              isInAnimSet,
              percents = [],
              next,
              prev,
              timestamp,
              ms = anim.ms,
              from = {},
              to = {},
              diff = {};
          if (status) {
              for (i = 0, ii = animationElements.length; i < ii; i++) {
                  var e = animationElements[i];
                  if (e.el.id == element.id && e.anim == anim) {
                      if (e.percent != percent) {
                          animationElements.splice(i, 1);
                          isInAnimSet = 1;
                      } else {
                          isInAnim = e;
                      }
                      element.attr(e.totalOrigin);
                      break;
                  }
              }
          } else {
              status = +to; // NaN
          }
          for (var i = 0, ii = anim.percents.length; i < ii; i++) {
              if (anim.percents[i] == percent || anim.percents[i] > status * anim.top) {
                  percent = anim.percents[i];
                  prev = anim.percents[i - 1] || 0;
                  ms = ms / anim.top * (percent - prev);
                  next = anim.percents[i + 1];
                  params = anim.anim[percent];
                  break;
              } else if (status) {
                  element.attr(anim.anim[anim.percents[i]]);
              }
          }
          if (!params) {
              return;
          }
          if (!isInAnim) {
              for (var attr in params) if (params[has](attr)) {
                  if (availableAnimAttrs[has](attr) || element.paper.customAttributes[has](attr)) {
                      from[attr] = element.attr(attr);
                      (from[attr] == null) && (from[attr] = availableAttrs[attr]);
                      to[attr] = params[attr];
                      switch (availableAnimAttrs[attr]) {
                          case nu:
                              diff[attr] = (to[attr] - from[attr]) / ms;
                              break;
                          case "colour":
                              from[attr] = R.getRGB(from[attr]);
                              var toColour = R.getRGB(to[attr]);
                              diff[attr] = {
                                  r: (toColour.r - from[attr].r) / ms,
                                  g: (toColour.g - from[attr].g) / ms,
                                  b: (toColour.b - from[attr].b) / ms
                              };
                              break;
                          case "path":
                              var pathes = path2curve(from[attr], to[attr]),
                                  toPath = pathes[1];
                              from[attr] = pathes[0];
                              diff[attr] = [];
                              for (i = 0, ii = from[attr].length; i < ii; i++) {
                                  diff[attr][i] = [0];
                                  for (var j = 1, jj = from[attr][i].length; j < jj; j++) {
                                      diff[attr][i][j] = (toPath[i][j] - from[attr][i][j]) / ms;
                                  }
                              }
                              break;
                          case "transform":
                              var _ = element._,
                                  eq = equaliseTransform(_[attr], to[attr]);
                              if (eq) {
                                  from[attr] = eq.from;
                                  to[attr] = eq.to;
                                  diff[attr] = [];
                                  diff[attr].real = true;
                                  for (i = 0, ii = from[attr].length; i < ii; i++) {
                                      diff[attr][i] = [from[attr][i][0]];
                                      for (j = 1, jj = from[attr][i].length; j < jj; j++) {
                                          diff[attr][i][j] = (to[attr][i][j] - from[attr][i][j]) / ms;
                                      }
                                  }
                              } else {
                                  var m = (element.matrix || new Matrix),
                                      to2 = {
                                          _: {transform: _.transform},
                                          getBBox: function () {
                                              return element.getBBox(1);
                                          }
                                      };
                                  from[attr] = [
                                      m.a,
                                      m.b,
                                      m.c,
                                      m.d,
                                      m.e,
                                      m.f
                                  ];
                                  extractTransform(to2, to[attr]);
                                  to[attr] = to2._.transform;
                                  diff[attr] = [
                                      (to2.matrix.a - m.a) / ms,
                                      (to2.matrix.b - m.b) / ms,
                                      (to2.matrix.c - m.c) / ms,
                                      (to2.matrix.d - m.d) / ms,
                                      (to2.matrix.e - m.e) / ms,
                                      (to2.matrix.f - m.f) / ms
                                  ];
                                  // from[attr] = [_.sx, _.sy, _.deg, _.dx, _.dy];
                                  // var to2 = {_:{}, getBBox: function () { return element.getBBox(); }};
                                  // extractTransform(to2, to[attr]);
                                  // diff[attr] = [
                                  //     (to2._.sx - _.sx) / ms,
                                  //     (to2._.sy - _.sy) / ms,
                                  //     (to2._.deg - _.deg) / ms,
                                  //     (to2._.dx - _.dx) / ms,
                                  //     (to2._.dy - _.dy) / ms
                                  // ];
                              }
                              break;
                          case "csv":
                              var values = Str(params[attr])[split](separator),
                                  from2 = Str(from[attr])[split](separator);
                              if (attr == "clip-rect") {
                                  from[attr] = from2;
                                  diff[attr] = [];
                                  i = from2.length;
                                  while (i--) {
                                      diff[attr][i] = (values[i] - from[attr][i]) / ms;
                                  }
                              }
                              to[attr] = values;
                              break;
                          default:
                              values = [][concat](params[attr]);
                              from2 = [][concat](from[attr]);
                              diff[attr] = [];
                              i = element.paper.customAttributes[attr].length;
                              while (i--) {
                                  diff[attr][i] = ((values[i] || 0) - (from2[i] || 0)) / ms;
                              }
                              break;
                      }
                  }
              }
              var easing = params.easing,
                  easyeasy = R.easing_formulas[easing];
              if (!easyeasy) {
                  easyeasy = Str(easing).match(bezierrg);
                  if (easyeasy && easyeasy.length == 5) {
                      var curve = easyeasy;
                      easyeasy = function (t) {
                          return CubicBezierAtTime(t, +curve[1], +curve[2], +curve[3], +curve[4], ms);
                      };
                  } else {
                      easyeasy = pipe;
                  }
              }
              timestamp = params.start || anim.start || +new Date;
              e = {
                  anim: anim,
                  percent: percent,
                  timestamp: timestamp,
                  start: timestamp + (anim.del || 0),
                  status: 0,
                  initstatus: status || 0,
                  stop: false,
                  ms: ms,
                  easing: easyeasy,
                  from: from,
                  diff: diff,
                  to: to,
                  el: element,
                  callback: params.callback,
                  prev: prev,
                  next: next,
                  repeat: times || anim.times,
                  origin: element.attr(),
                  totalOrigin: totalOrigin
              };
              animationElements.push(e);
              if (status && !isInAnim && !isInAnimSet) {
                  e.stop = true;
                  e.start = new Date - ms * status;
                  if (animationElements.length == 1) {
                      return animation();
                  }
              }
              if (isInAnimSet) {
                  e.start = new Date - e.ms * status;
              }
              animationElements.length == 1 && requestAnimFrame(animation);
          } else {
              isInAnim.initstatus = status;
              isInAnim.start = new Date - isInAnim.ms * status;
          }
          eve("raphael.anim.start." + element.id, element, anim);
      }
      
      R.animation = function (params, ms, easing, callback) {
          if (params instanceof Animation) {
              return params;
          }
          if (R.is(easing, "function") || !easing) {
              callback = callback || easing || null;
              easing = null;
          }
          params = Object(params);
          ms = +ms || 0;
          var p = {},
              json,
              attr;
          for (attr in params) if (params[has](attr) && toFloat(attr) != attr && toFloat(attr) + "%" != attr) {
              json = true;
              p[attr] = params[attr];
          }
          if (!json) {
              return new Animation(params, ms);
          } else {
              easing && (p.easing = easing);
              callback && (p.callback = callback);
              return new Animation({100: p}, ms);
          }
      };
      
      elproto.animate = function (params, ms, easing, callback) {
          var element = this;
          if (element.removed) {
              callback && callback.call(element);
              return element;
          }
          var anim = params instanceof Animation ? params : R.animation(params, ms, easing, callback);
          runAnimation(anim, element, anim.percents[0], null, element.attr());
          return element;
      };
      
      elproto.setTime = function (anim, value) {
          if (anim && value != null) {
              this.status(anim, mmin(value, anim.ms) / anim.ms);
          }
          return this;
      };
      
      elproto.status = function (anim, value) {
          var out = [],
              i = 0,
              len,
              e;
          if (value != null) {
              runAnimation(anim, this, -1, mmin(value, 1));
              return this;
          } else {
              len = animationElements.length;
              for (; i < len; i++) {
                  e = animationElements[i];
                  if (e.el.id == this.id && (!anim || e.anim == anim)) {
                      if (anim) {
                          return e.status;
                      }
                      out.push({
                          anim: e.anim,
                          status: e.status
                      });
                  }
              }
              if (anim) {
                  return 0;
              }
              return out;
          }
      };
      
      elproto.pause = function (anim) {
          for (var i = 0; i < animationElements.length; i++) if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
              if (eve("raphael.anim.pause." + this.id, this, animationElements[i].anim) !== false) {
                  animationElements[i].paused = true;
              }
          }
          return this;
      };
      
      elproto.resume = function (anim) {
          for (var i = 0; i < animationElements.length; i++) if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
              var e = animationElements[i];
              if (eve("raphael.anim.resume." + this.id, this, e.anim) !== false) {
                  delete e.paused;
                  this.status(e.anim, e.status);
              }
          }
          return this;
      };
      
      elproto.stop = function (anim) {
          for (var i = 0; i < animationElements.length; i++) if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
              if (eve("raphael.anim.stop." + this.id, this, animationElements[i].anim) !== false) {
                  animationElements.splice(i--, 1);
              }
          }
          return this;
      };
      function stopAnimation(paper) {
          for (var i = 0; i < animationElements.length; i++) if (animationElements[i].el.paper == paper) {
              animationElements.splice(i--, 1);
          }
      }
      eve.on("raphael.remove", stopAnimation);
      eve.on("raphael.clear", stopAnimation);
      elproto.toString = function () {
          return "Rapha\xebl\u2019s object";
      };

      // Set
      var Set = function (items) {
          this.items = [];
          this.length = 0;
          this.type = "set";
          if (items) {
              for (var i = 0, ii = items.length; i < ii; i++) {
                  if (items[i] && (items[i].constructor == elproto.constructor || items[i].constructor == Set)) {
                      this[this.items.length] = this.items[this.items.length] = items[i];
                      this.length++;
                  }
              }
          }
      },
      setproto = Set.prototype;
      
      setproto.push = function () {
          var item,
              len;
          for (var i = 0, ii = arguments.length; i < ii; i++) {
              item = arguments[i];
              if (item && (item.constructor == elproto.constructor || item.constructor == Set)) {
                  len = this.items.length;
                  this[len] = this.items[len] = item;
                  this.length++;
              }
          }
          return this;
      };
      
      setproto.pop = function () {
          this.length && delete this[this.length--];
          return this.items.pop();
      };
      
      setproto.forEach = function (callback, thisArg) {
          for (var i = 0, ii = this.items.length; i < ii; i++) {
              if (callback.call(thisArg, this.items[i], i) === false) {
                  return this;
              }
          }
          return this;
      };
      for (var method in elproto) if (elproto[has](method)) {
          setproto[method] = (function (methodname) {
              return function () {
                  var arg = arguments;
                  return this.forEach(function (el) {
                      el[methodname][apply](el, arg);
                  });
              };
          })(method);
      }
      setproto.attr = function (name, value) {
          if (name && R.is(name, array) && R.is(name[0], "object")) {
              for (var j = 0, jj = name.length; j < jj; j++) {
                  this.items[j].attr(name[j]);
              }
          } else {
              for (var i = 0, ii = this.items.length; i < ii; i++) {
                  this.items[i].attr(name, value);
              }
          }
          return this;
      };
      
      setproto.clear = function () {
          while (this.length) {
              this.pop();
          }
      };
      
      setproto.splice = function (index, count, insertion) {
          index = index < 0 ? mmax(this.length + index, 0) : index;
          count = mmax(0, mmin(this.length - index, count));
          var tail = [],
              todel = [],
              args = [],
              i;
          for (i = 2; i < arguments.length; i++) {
              args.push(arguments[i]);
          }
          for (i = 0; i < count; i++) {
              todel.push(this[index + i]);
          }
          for (; i < this.length - index; i++) {
              tail.push(this[index + i]);
          }
          var arglen = args.length;
          for (i = 0; i < arglen + tail.length; i++) {
              this.items[index + i] = this[index + i] = i < arglen ? args[i] : tail[i - arglen];
          }
          i = this.items.length = this.length -= count - arglen;
          while (this[i]) {
              delete this[i++];
          }
          return new Set(todel);
      };
      
      setproto.exclude = function (el) {
          for (var i = 0, ii = this.length; i < ii; i++) if (this[i] == el) {
              this.splice(i, 1);
              return true;
          }
      };
      setproto.animate = function (params, ms, easing, callback) {
          (R.is(easing, "function") || !easing) && (callback = easing || null);
          var len = this.items.length,
              i = len,
              item,
              set = this,
              collector;
          if (!len) {
              return this;
          }
          callback && (collector = function () {
              !--len && callback.call(set);
          });
          easing = R.is(easing, string) ? easing : collector;
          var anim = R.animation(params, ms, easing, collector);
          item = this.items[--i].animate(anim);
          while (i--) {
              this.items[i] && !this.items[i].removed && this.items[i].animateWith(item, anim, anim);
          }
          return this;
      };
      setproto.insertAfter = function (el) {
          var i = this.items.length;
          while (i--) {
              this.items[i].insertAfter(el);
          }
          return this;
      };
      setproto.getBBox = function () {
          var x = [],
              y = [],
              x2 = [],
              y2 = [];
          for (var i = this.items.length; i--;) if (!this.items[i].removed) {
              var box = this.items[i].getBBox();
              x.push(box.x);
              y.push(box.y);
              x2.push(box.x + box.width);
              y2.push(box.y + box.height);
          }
          x = mmin[apply](0, x);
          y = mmin[apply](0, y);
          x2 = mmax[apply](0, x2);
          y2 = mmax[apply](0, y2);
          return {
              x: x,
              y: y,
              x2: x2,
              y2: y2,
              width: x2 - x,
              height: y2 - y
          };
      };
      setproto.clone = function (s) {
          s = new Set;
          for (var i = 0, ii = this.items.length; i < ii; i++) {
              s.push(this.items[i].clone());
          }
          return s;
      };
      setproto.toString = function () {
          return "Rapha\xebl\u2018s set";
      };

      
      R.registerFont = function (font) {
          if (!font.face) {
              return font;
          }
          this.fonts = this.fonts || {};
          var fontcopy = {
                  w: font.w,
                  face: {},
                  glyphs: {}
              },
              family = font.face["font-family"];
          for (var prop in font.face) if (font.face[has](prop)) {
              fontcopy.face[prop] = font.face[prop];
          }
          if (this.fonts[family]) {
              this.fonts[family].push(fontcopy);
          } else {
              this.fonts[family] = [fontcopy];
          }
          if (!font.svg) {
              fontcopy.face["units-per-em"] = toInt(font.face["units-per-em"], 10);
              for (var glyph in font.glyphs) if (font.glyphs[has](glyph)) {
                  var path = font.glyphs[glyph];
                  fontcopy.glyphs[glyph] = {
                      w: path.w,
                      k: {},
                      d: path.d && "M" + path.d.replace(/[mlcxtrv]/g, function (command) {
                              return {l: "L", c: "C", x: "z", t: "m", r: "l", v: "c"}[command] || "M";
                          }) + "z"
                  };
                  if (path.k) {
                      for (var k in path.k) if (path[has](k)) {
                          fontcopy.glyphs[glyph].k[k] = path.k[k];
                      }
                  }
              }
          }
          return font;
      };
      
      paperproto.getFont = function (family, weight, style, stretch) {
          stretch = stretch || "normal";
          style = style || "normal";
          weight = +weight || {normal: 400, bold: 700, lighter: 300, bolder: 800}[weight] || 400;
          if (!R.fonts) {
              return;
          }
          var font = R.fonts[family];
          if (!font) {
              var name = new RegExp("(^|\\s)" + family.replace(/[^\w\d\s+!~.:_-]/g, E) + "(\\s|$)", "i");
              for (var fontName in R.fonts) if (R.fonts[has](fontName)) {
                  if (name.test(fontName)) {
                      font = R.fonts[fontName];
                      break;
                  }
              }
          }
          var thefont;
          if (font) {
              for (var i = 0, ii = font.length; i < ii; i++) {
                  thefont = font[i];
                  if (thefont.face["font-weight"] == weight && (thefont.face["font-style"] == style || !thefont.face["font-style"]) && thefont.face["font-stretch"] == stretch) {
                      break;
                  }
              }
          }
          return thefont;
      };
      
      paperproto.print = function (x, y, string, font, size, origin, letter_spacing) {
          origin = origin || "middle"; // baseline|middle
          letter_spacing = mmax(mmin(letter_spacing || 0, 1), -1);
          var letters = Str(string)[split](E),
              shift = 0,
              notfirst = 0,
              path = E,
              scale;
          R.is(font, string) && (font = this.getFont(font));
          if (font) {
              scale = (size || 16) / font.face["units-per-em"];
              var bb = font.face.bbox[split](separator),
                  top = +bb[0],
                  lineHeight = bb[3] - bb[1],
                  shifty = 0,
                  height = +bb[1] + (origin == "baseline" ? lineHeight + (+font.face.descent) : lineHeight / 2);
              for (var i = 0, ii = letters.length; i < ii; i++) {
                  if (letters[i] == "\n") {
                      shift = 0;
                      curr = 0;
                      notfirst = 0;
                      shifty += lineHeight;
                  } else {
                      var prev = notfirst && font.glyphs[letters[i - 1]] || {},
                          curr = font.glyphs[letters[i]];
                      shift += notfirst ? (prev.w || font.w) + (prev.k && prev.k[letters[i]] || 0) + (font.w * letter_spacing) : 0;
                      notfirst = 1;
                  }
                  if (curr && curr.d) {
                      path += R.transformPath(curr.d, ["t", shift * scale, shifty * scale, "s", scale, scale, top, height, "t", (x - top) / scale, (y - height) / scale]);
                  }
              }
          }
          return this.path(path).attr({
              fill: "#000",
              stroke: "none"
          });
      };

      
      paperproto.add = function (json) {
          if (R.is(json, "array")) {
              var res = this.set(),
                  i = 0,
                  ii = json.length,
                  j;
              for (; i < ii; i++) {
                  j = json[i] || {};
                  elements[has](j.type) && res.push(this[j.type]().attr(j));
              }
          }
          return res;
      };

      
      R.format = function (token, params) {
          var args = R.is(params, array) ? [0][concat](params) : arguments;
          token && R.is(token, string) && args.length - 1 && (token = token.replace(formatrg, function (str, i) {
              return args[++i] == null ? E : args[i];
          }));
          return token || E;
      };
      
      R.fullfill = (function () {
          var tokenRegex = /\{([^\}]+)\}/g,
              objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, // matches .xxxxx or ["xxxxx"] to run over object properties
              replacer = function (all, key, obj) {
                  var res = obj;
                  key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
                      name = name || quotedName;
                      if (res) {
                          if (name in res) {
                              res = res[name];
                          }
                          typeof res == "function" && isFunc && (res = res());
                      }
                  });
                  res = (res == null || res == obj ? all : res) + "";
                  return res;
              };
          return function (str, obj) {
              return String(str).replace(tokenRegex, function (all, key) {
                  return replacer(all, key, obj);
              });
          };
      })();
      
      R.ninja = function () {
          oldRaphael.was ? (g.win.Raphael = oldRaphael.is) : delete Raphael;
          return R;
      };
      
      R.st = setproto;
      // Firefox <3.6 fix: http://webreflection.blogspot.com/2009/11/195-chars-to-help-lazy-loading.html
      (function (doc, loaded, f) {
          if (doc.readyState == null && doc.addEventListener){
              doc.addEventListener(loaded, f = function () {
                  doc.removeEventListener(loaded, f, false);
                  doc.readyState = "complete";
              }, false);
              doc.readyState = "loading";
          }
          function isLoaded() {
              (/in/).test(doc.readyState) ? setTimeout(isLoaded, 9) : R.eve("raphael.DOMload");
          }
          isLoaded();
      })(document, "DOMContentLoaded");

      oldRaphael.was ? (g.win.Raphael = R) : (Raphael = R);
      
      eve.on("raphael.DOMload", function () {
          loaded = true;
      });
  })();


  // ┌─────────────────────────────────────────────────────────────────────┐ \\
  // │ Raphaël - JavaScript Vector Library                                 │ \\
  // ├─────────────────────────────────────────────────────────────────────┤ \\
  // │ SVG Module                                                          │ \\
  // ├─────────────────────────────────────────────────────────────────────┤ \\
  // │ Copyright (c) 2008-2011 Dmitry Baranovskiy (http://raphaeljs.com)   │ \\
  // │ Copyright (c) 2008-2011 Sencha Labs (http://sencha.com)             │ \\
  // │ Licensed under the MIT (http://raphaeljs.com/license.html) license. │ \\
  // └─────────────────────────────────────────────────────────────────────┘ \\
  window.Raphael.svg && function (R) {
      var has = "hasOwnProperty",
          Str = String,
          toFloat = parseFloat,
          toInt = parseInt,
          math = Math,
          mmax = math.max,
          abs = math.abs,
          pow = math.pow,
          separator = /[, ]+/,
          eve = R.eve,
          E = "",
          S = " ";
      var xlink = "http://www.w3.org/1999/xlink",
          markers = {
              block: "M5,0 0,2.5 5,5z",
              classic: "M5,0 0,2.5 5,5 3.5,3 3.5,2z",
              diamond: "M2.5,0 5,2.5 2.5,5 0,2.5z",
              open: "M6,1 1,3.5 6,6",
              oval: "M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"
          },
          markerCounter = {};
      R.toString = function () {
          return  "Your browser supports SVG.\nYou are running Rapha\xebl " + this.version;
      };
      var $ = function (el, attr) {
          if (attr) {
              if (typeof el == "string") {
                  el = $(el);
              }
              for (var key in attr) if (attr[has](key)) {
                  if (key.substring(0, 6) == "xlink:") {
                      el.setAttributeNS(xlink, key.substring(6), Str(attr[key]));
                  } else {
                      el.setAttribute(key, Str(attr[key]));
                  }
              }
          } else {
              el = R._g.doc.createElementNS("http://www.w3.org/2000/svg", el);
              el.style && (el.style.webkitTapHighlightColor = "rgba(0,0,0,0)");
          }
          return el;
      },
      addGradientFill = function (element, gradient) {
          var type = "linear",
              id = element.id + gradient,
              fx = .5, fy = .5,
              o = element.node,
              SVG = element.paper,
              s = o.style,
              el = R._g.doc.getElementById(id);
          if (!el) {
              gradient = Str(gradient).replace(R._radial_gradient, function (all, _fx, _fy) {
                  type = "radial";
                  if (_fx && _fy) {
                      fx = toFloat(_fx);
                      fy = toFloat(_fy);
                      var dir = ((fy > .5) * 2 - 1);
                      pow(fx - .5, 2) + pow(fy - .5, 2) > .25 &&
                          (fy = math.sqrt(.25 - pow(fx - .5, 2)) * dir + .5) &&
                          fy != .5 &&
                          (fy = fy.toFixed(5) - 1e-5 * dir);
                  }
                  return E;
              });
              gradient = gradient.split(/\s*\-\s*/);
              if (type == "linear") {
                  var angle = gradient.shift();
                  angle = -toFloat(angle);
                  if (isNaN(angle)) {
                      return null;
                  }
                  var vector = [0, 0, math.cos(R.rad(angle)), math.sin(R.rad(angle))],
                      max = 1 / (mmax(abs(vector[2]), abs(vector[3])) || 1);
                  vector[2] *= max;
                  vector[3] *= max;
                  if (vector[2] < 0) {
                      vector[0] = -vector[2];
                      vector[2] = 0;
                  }
                  if (vector[3] < 0) {
                      vector[1] = -vector[3];
                      vector[3] = 0;
                  }
              }
              var dots = R._parseDots(gradient);
              if (!dots) {
                  return null;
              }
              id = id.replace(/[\(\)\s,\xb0#]/g, "_");
              
              if (element.gradient && id != element.gradient.id) {
                  SVG.defs.removeChild(element.gradient);
                  delete element.gradient;
              }

              if (!element.gradient) {
                  el = $(type + "Gradient", {id: id});
                  element.gradient = el;
                  $(el, type == "radial" ? {
                      fx: fx,
                      fy: fy
                  } : {
                      x1: vector[0],
                      y1: vector[1],
                      x2: vector[2],
                      y2: vector[3],
                      gradientTransform: element.matrix.invert()
                  });
                  SVG.defs.appendChild(el);
                  for (var i = 0, ii = dots.length; i < ii; i++) {
                      el.appendChild($("stop", {
                          offset: dots[i].offset ? dots[i].offset : i ? "100%" : "0%",
                          "stop-color": dots[i].color || "#fff"
                      }));
                  }
              }
          }
          $(o, {
              fill: "url(#" + id + ")",
              opacity: 1,
              "fill-opacity": 1
          });
          s.fill = E;
          s.opacity = 1;
          s.fillOpacity = 1;
          return 1;
      },
      updatePosition = function (o) {
          var bbox = o.getBBox(1);
          $(o.pattern, {patternTransform: o.matrix.invert() + " translate(" + bbox.x + "," + bbox.y + ")"});
      },
      addArrow = function (o, value, isEnd) {
          if (o.type == "path") {
              var values = Str(value).toLowerCase().split("-"),
                  p = o.paper,
                  se = isEnd ? "end" : "start",
                  node = o.node,
                  attrs = o.attrs,
                  stroke = attrs["stroke-width"],
                  i = values.length,
                  type = "classic",
                  from,
                  to,
                  dx,
                  refX,
                  attr,
                  w = 3,
                  h = 3,
                  t = 5;
              while (i--) {
                  switch (values[i]) {
                      case "block":
                      case "classic":
                      case "oval":
                      case "diamond":
                      case "open":
                      case "none":
                          type = values[i];
                          break;
                      case "wide": h = 5; break;
                      case "narrow": h = 2; break;
                      case "long": w = 5; break;
                      case "short": w = 2; break;
                  }
              }
              if (type == "open") {
                  w += 2;
                  h += 2;
                  t += 2;
                  dx = 1;
                  refX = isEnd ? 4 : 1;
                  attr = {
                      fill: "none",
                      stroke: attrs.stroke
                  };
              } else {
                  refX = dx = w / 2;
                  attr = {
                      fill: attrs.stroke,
                      stroke: "none"
                  };
              }
              if (o._.arrows) {
                  if (isEnd) {
                      o._.arrows.endPath && markerCounter[o._.arrows.endPath]--;
                      o._.arrows.endMarker && markerCounter[o._.arrows.endMarker]--;
                  } else {
                      o._.arrows.startPath && markerCounter[o._.arrows.startPath]--;
                      o._.arrows.startMarker && markerCounter[o._.arrows.startMarker]--;
                  }
              } else {
                  o._.arrows = {};
              }
              if (type != "none") {
                  var pathId = "raphael-marker-" + type,
                      markerId = "raphael-marker-" + se + type + w + h;
                  if (!R._g.doc.getElementById(pathId)) {
                      p.defs.appendChild($($("path"), {
                          "stroke-linecap": "round",
                          d: markers[type],
                          id: pathId
                      }));
                      markerCounter[pathId] = 1;
                  } else {
                      markerCounter[pathId]++;
                  }
                  var marker = R._g.doc.getElementById(markerId),
                      use;
                  if (!marker) {
                      marker = $($("marker"), {
                          id: markerId,
                          markerHeight: h,
                          markerWidth: w,
                          orient: "auto",
                          refX: refX,
                          refY: h / 2
                      });
                      use = $($("use"), {
                          "xlink:href": "#" + pathId,
                          transform: (isEnd ? "rotate(180 " + w / 2 + " " + h / 2 + ") " : E) + "scale(" + w / t + "," + h / t + ")",
                          "stroke-width": (1 / ((w / t + h / t) / 2)).toFixed(4)
                      });
                      marker.appendChild(use);
                      p.defs.appendChild(marker);
                      markerCounter[markerId] = 1;
                  } else {
                      markerCounter[markerId]++;
                      use = marker.getElementsByTagName("use")[0];
                  }
                  $(use, attr);
                  var delta = dx * (type != "diamond" && type != "oval");
                  if (isEnd) {
                      from = o._.arrows.startdx * stroke || 0;
                      to = R.getTotalLength(attrs.path) - delta * stroke;
                  } else {
                      from = delta * stroke;
                      to = R.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
                  }
                  attr = {};
                  attr["marker-" + se] = "url(#" + markerId + ")";
                  if (to || from) {
                      attr.d = Raphael.getSubpath(attrs.path, from, to);
                  }
                  $(node, attr);
                  o._.arrows[se + "Path"] = pathId;
                  o._.arrows[se + "Marker"] = markerId;
                  o._.arrows[se + "dx"] = delta;
                  o._.arrows[se + "Type"] = type;
                  o._.arrows[se + "String"] = value;
              } else {
                  if (isEnd) {
                      from = o._.arrows.startdx * stroke || 0;
                      to = R.getTotalLength(attrs.path) - from;
                  } else {
                      from = 0;
                      to = R.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
                  }
                  o._.arrows[se + "Path"] && $(node, {d: Raphael.getSubpath(attrs.path, from, to)});
                  delete o._.arrows[se + "Path"];
                  delete o._.arrows[se + "Marker"];
                  delete o._.arrows[se + "dx"];
                  delete o._.arrows[se + "Type"];
                  delete o._.arrows[se + "String"];
              }
              for (attr in markerCounter) if (markerCounter[has](attr) && !markerCounter[attr]) {
                  var item = R._g.doc.getElementById(attr);
                  item && item.parentNode.removeChild(item);
              }
          }
      },
      dasharray = {
          "": [0],
          "none": [0],
          "-": [3, 1],
          ".": [1, 1],
          "-.": [3, 1, 1, 1],
          "-..": [3, 1, 1, 1, 1, 1],
          ". ": [1, 3],
          "- ": [4, 3],
          "--": [8, 3],
          "- .": [4, 3, 1, 3],
          "--.": [8, 3, 1, 3],
          "--..": [8, 3, 1, 3, 1, 3]
      },
      addDashes = function (o, value, params) {
          value = dasharray[Str(value).toLowerCase()];
          if (value) {
              var width = o.attrs["stroke-width"] || "1",
                  butt = {round: width, square: width, butt: 0}[o.attrs["stroke-linecap"] || params["stroke-linecap"]] || 0,
                  dashes = [],
                  i = value.length;
              while (i--) {
                  dashes[i] = value[i] * width + ((i % 2) ? 1 : -1) * butt;
              }
              $(o.node, {"stroke-dasharray": dashes.join(",")});
          }
      },
      setFillAndStroke = function (o, params) {
          var node = o.node,
              attrs = o.attrs,
              vis = node.style.visibility;
          node.style.visibility = "hidden";
          for (var att in params) {
              if (params[has](att)) {
                  if (!R._availableAttrs[has](att)) {
                      continue;
                  }
                  var value = params[att];
                  attrs[att] = value;
                  switch (att) {
                      case "blur":
                          o.blur(value);
                          break;
                      case "href":
                      case "title":
                      case "target":
                          var pn = node.parentNode;
                          if (pn.tagName.toLowerCase() != "a") {
                              var hl = $("a");
                              pn.insertBefore(hl, node);
                              hl.appendChild(node);
                              pn = hl;
                          }
                          if (att == "target") {
                              pn.setAttributeNS(xlink, "show", value == "blank" ? "new" : value);
                          } else {
                              pn.setAttributeNS(xlink, att, value);
                          }
                          break;
                      case "cursor":
                          node.style.cursor = value;
                          break;
                      case "transform":
                          o.transform(value);
                          break;
                      case "arrow-start":
                          addArrow(o, value);
                          break;
                      case "arrow-end":
                          addArrow(o, value, 1);
                          break;
                      case "clip-rect":
                          var rect = Str(value).split(separator);
                          if (rect.length == 4) {
                              o.clip && o.clip.parentNode.parentNode.removeChild(o.clip.parentNode);
                              var el = $("clipPath"),
                                  rc = $("rect");
                              el.id = R.createUUID();
                              $(rc, {
                                  x: rect[0],
                                  y: rect[1],
                                  width: rect[2],
                                  height: rect[3]
                              });
                              el.appendChild(rc);
                              o.paper.defs.appendChild(el);
                              $(node, {"clip-path": "url(#" + el.id + ")"});
                              o.clip = rc;
                          }
                          if (!value) {
                              var path = node.getAttribute("clip-path");
                              if (path) {
                                  var clip = R._g.doc.getElementById(path.replace(/(^url\(#|\)$)/g, E));
                                  clip && clip.parentNode.removeChild(clip);
                                  $(node, {"clip-path": E});
                                  delete o.clip;
                              }
                          }
                      break;
                      case "path":
                          if (o.type == "path") {
                              $(node, {d: value ? attrs.path = R._pathToAbsolute(value) : "M0,0"});
                              o._.dirty = 1;
                              if (o._.arrows) {
                                  "startString" in o._.arrows && addArrow(o, o._.arrows.startString);
                                  "endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                              }
                          }
                          break;
                      case "width":
                          node.setAttribute(att, value);
                          o._.dirty = 1;
                          if (attrs.fx) {
                              att = "x";
                              value = attrs.x;
                          } else {
                              break;
                          }
                      case "x":
                          if (attrs.fx) {
                              value = -attrs.x - (attrs.width || 0);
                          }
                      case "rx":
                          if (att == "rx" && o.type == "rect") {
                              break;
                          }
                      case "cx":
                          node.setAttribute(att, value);
                          o.pattern && updatePosition(o);
                          o._.dirty = 1;
                          break;
                      case "height":
                          node.setAttribute(att, value);
                          o._.dirty = 1;
                          if (attrs.fy) {
                              att = "y";
                              value = attrs.y;
                          } else {
                              break;
                          }
                      case "y":
                          if (attrs.fy) {
                              value = -attrs.y - (attrs.height || 0);
                          }
                      case "ry":
                          if (att == "ry" && o.type == "rect") {
                              break;
                          }
                      case "cy":
                          node.setAttribute(att, value);
                          o.pattern && updatePosition(o);
                          o._.dirty = 1;
                          break;
                      case "r":
                          if (o.type == "rect") {
                              $(node, {rx: value, ry: value});
                          } else {
                              node.setAttribute(att, value);
                          }
                          o._.dirty = 1;
                          break;
                      case "src":
                          if (o.type == "image") {
                              node.setAttributeNS(xlink, "href", value);
                          }
                          break;
                      case "stroke-width":
                          if (o._.sx != 1 || o._.sy != 1) {
                              value /= mmax(abs(o._.sx), abs(o._.sy)) || 1;
                          }
                          if (o.paper._vbSize) {
                              value *= o.paper._vbSize;
                          }
                          node.setAttribute(att, value);
                          if (attrs["stroke-dasharray"]) {
                              addDashes(o, attrs["stroke-dasharray"], params);
                          }
                          if (o._.arrows) {
                              "startString" in o._.arrows && addArrow(o, o._.arrows.startString);
                              "endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                          }
                          break;
                      case "stroke-dasharray":
                          addDashes(o, value, params);
                          break;
                      case "fill":
                          var isURL = Str(value).match(R._ISURL);
                          if (isURL) {
                              el = $("pattern");
                              var ig = $("image");
                              el.id = R.createUUID();
                              $(el, {x: 0, y: 0, patternUnits: "userSpaceOnUse", height: 1, width: 1});
                              $(ig, {x: 0, y: 0, "xlink:href": isURL[1]});
                              el.appendChild(ig);

                              (function (el) {
                                  R._preload(isURL[1], function () {
                                      var w = this.offsetWidth,
                                          h = this.offsetHeight;
                                      $(el, {width: w, height: h});
                                      $(ig, {width: w, height: h});
                                      o.paper.safari();
                                  });
                              })(el);
                              o.paper.defs.appendChild(el);
                              $(node, {fill: "url(#" + el.id + ")"});
                              o.pattern = el;
                              o.pattern && updatePosition(o);
                              break;
                          }
                          var clr = R.getRGB(value);
                          if (!clr.error) {
                              delete params.gradient;
                              delete attrs.gradient;
                              !R.is(attrs.opacity, "undefined") &&
                                  R.is(params.opacity, "undefined") &&
                                  $(node, {opacity: attrs.opacity});
                              !R.is(attrs["fill-opacity"], "undefined") &&
                                  R.is(params["fill-opacity"], "undefined") &&
                                  $(node, {"fill-opacity": attrs["fill-opacity"]});
                          } else if ((o.type == "circle" || o.type == "ellipse" || Str(value).charAt() != "r") && addGradientFill(o, value)) {
                              if ("opacity" in attrs || "fill-opacity" in attrs) {
                                  var gradient = R._g.doc.getElementById(node.getAttribute("fill").replace(/^url\(#|\)$/g, E));
                                  if (gradient) {
                                      var stops = gradient.getElementsByTagName("stop");
                                      $(stops[stops.length - 1], {"stop-opacity": ("opacity" in attrs ? attrs.opacity : 1) * ("fill-opacity" in attrs ? attrs["fill-opacity"] : 1)});
                                  }
                              }
                              attrs.gradient = value;
                              attrs.fill = "none";
                              break;
                          }
                          clr[has]("opacity") && $(node, {"fill-opacity": clr.opacity > 1 ? clr.opacity / 100 : clr.opacity});
                      case "stroke":
                          clr = R.getRGB(value);
                          node.setAttribute(att, clr.hex);
                          att == "stroke" && clr[has]("opacity") && $(node, {"stroke-opacity": clr.opacity > 1 ? clr.opacity / 100 : clr.opacity});
                          if (att == "stroke" && o._.arrows) {
                              "startString" in o._.arrows && addArrow(o, o._.arrows.startString);
                              "endString" in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                          }
                          break;
                      case "gradient":
                          (o.type == "circle" || o.type == "ellipse" || Str(value).charAt() != "r") && addGradientFill(o, value);
                          break;
                      case "opacity":
                          if (attrs.gradient && !attrs[has]("stroke-opacity")) {
                              $(node, {"stroke-opacity": value > 1 ? value / 100 : value});
                          }
                          // fall
                      case "fill-opacity":
                          if (attrs.gradient) {
                              gradient = R._g.doc.getElementById(node.getAttribute("fill").replace(/^url\(#|\)$/g, E));
                              if (gradient) {
                                  stops = gradient.getElementsByTagName("stop");
                                  $(stops[stops.length - 1], {"stop-opacity": value});
                              }
                              break;
                          }
                      default:
                          att == "font-size" && (value = toInt(value, 10) + "px");
                          var cssrule = att.replace(/(\-.)/g, function (w) {
                              return w.substring(1).toUpperCase();
                          });
                          node.style[cssrule] = value;
                          o._.dirty = 1;
                          node.setAttribute(att, value);
                          break;
                  }
              }
          }

          tuneText(o, params);
          node.style.visibility = vis;
      },
      leading = 1.2,
      tuneText = function (el, params) {
          if (el.type != "text" || !(params[has]("text") || params[has]("font") || params[has]("font-size") || params[has]("x") || params[has]("y"))) {
              return;
          }
          var a = el.attrs,
              node = el.node,
              fontSize = node.firstChild ? toInt(R._g.doc.defaultView.getComputedStyle(node.firstChild, E).getPropertyValue("font-size"), 10) : 10;

          if (params[has]("text")) {
              a.text = params.text;
              while (node.firstChild) {
                  node.removeChild(node.firstChild);
              }
              var texts = Str(params.text).split("\n"),
                  tspans = [],
                  tspan;
              for (var i = 0, ii = texts.length; i < ii; i++) {
                  tspan = $("tspan");
                  i && $(tspan, {dy: fontSize * leading, x: a.x});
                  tspan.appendChild(R._g.doc.createTextNode(texts[i]));
                  node.appendChild(tspan);
                  tspans[i] = tspan;
              }
          } else {
              tspans = node.getElementsByTagName("tspan");
              for (i = 0, ii = tspans.length; i < ii; i++) if (i) {
                  $(tspans[i], {dy: fontSize * leading, x: a.x});
              } else {
                  $(tspans[0], {dy: 0});
              }
          }
          $(node, {x: a.x, y: a.y});
          el._.dirty = 1;
          var bb = el._getBBox(),
              dif = a.y - (bb.y + bb.height / 2);
          dif && R.is(dif, "finite") && $(tspans[0], {dy: dif});
      },
      Element = function (node, svg) {
          var X = 0,
              Y = 0;
          
          this[0] = this.node = node;
          
          node.raphael = true;
          
          this.id = R._oid++;
          node.raphaelid = this.id;
          this.matrix = R.matrix();
          this.realPath = null;
          
          this.paper = svg;
          this.attrs = this.attrs || {};
          this._ = {
              transform: [],
              sx: 1,
              sy: 1,
              deg: 0,
              dx: 0,
              dy: 0,
              dirty: 1
          };
          !svg.bottom && (svg.bottom = this);
          
          this.prev = svg.top;
          svg.top && (svg.top.next = this);
          svg.top = this;
          
          this.next = null;
      },
      elproto = R.el;

      Element.prototype = elproto;
      elproto.constructor = Element;

      R._engine.path = function (pathString, SVG) {
          var el = $("path");
          SVG.canvas && SVG.canvas.appendChild(el);
          var p = new Element(el, SVG);
          p.type = "path";
          setFillAndStroke(p, {
              fill: "none",
              stroke: "#000",
              path: pathString
          });
          return p;
      };
      
      elproto.rotate = function (deg, cx, cy) {
          if (this.removed) {
              return this;
          }
          deg = Str(deg).split(separator);
          if (deg.length - 1) {
              cx = toFloat(deg[1]);
              cy = toFloat(deg[2]);
          }
          deg = toFloat(deg[0]);
          (cy == null) && (cx = cy);
          if (cx == null || cy == null) {
              var bbox = this.getBBox(1);
              cx = bbox.x + bbox.width / 2;
              cy = bbox.y + bbox.height / 2;
          }
          this.transform(this._.transform.concat([["r", deg, cx, cy]]));
          return this;
      };
      
      elproto.scale = function (sx, sy, cx, cy) {
          if (this.removed) {
              return this;
          }
          sx = Str(sx).split(separator);
          if (sx.length - 1) {
              sy = toFloat(sx[1]);
              cx = toFloat(sx[2]);
              cy = toFloat(sx[3]);
          }
          sx = toFloat(sx[0]);
          (sy == null) && (sy = sx);
          (cy == null) && (cx = cy);
          if (cx == null || cy == null) {
              var bbox = this.getBBox(1);
          }
          cx = cx == null ? bbox.x + bbox.width / 2 : cx;
          cy = cy == null ? bbox.y + bbox.height / 2 : cy;
          this.transform(this._.transform.concat([["s", sx, sy, cx, cy]]));
          return this;
      };
      
      elproto.translate = function (dx, dy) {
          if (this.removed) {
              return this;
          }
          dx = Str(dx).split(separator);
          if (dx.length - 1) {
              dy = toFloat(dx[1]);
          }
          dx = toFloat(dx[0]) || 0;
          dy = +dy || 0;
          this.transform(this._.transform.concat([["t", dx, dy]]));
          return this;
      };
      
      elproto.transform = function (tstr) {
          var _ = this._;
          if (tstr == null) {
              return _.transform;
          }
          R._extractTransform(this, tstr);

          this.clip && $(this.clip, {transform: this.matrix.invert()});
          this.pattern && updatePosition(this);
          this.node && $(this.node, {transform: this.matrix});
      
          if (_.sx != 1 || _.sy != 1) {
              var sw = this.attrs[has]("stroke-width") ? this.attrs["stroke-width"] : 1;
              this.attr({"stroke-width": sw});
          }

          return this;
      };
      
      elproto.hide = function () {
          !this.removed && this.paper.safari(this.node.style.display = "none");
          return this;
      };
      
      elproto.show = function () {
          !this.removed && this.paper.safari(this.node.style.display = "");
          return this;
      };
      
      elproto.remove = function () {
          if (this.removed || !this.node.parentNode) {
              return;
          }
          var paper = this.paper;
          paper.__set__ && paper.__set__.exclude(this);
          eve.unbind("raphael.*.*." + this.id);
          if (this.gradient) {
              paper.defs.removeChild(this.gradient);
          }
          R._tear(this, paper);
          if (this.node.parentNode.tagName.toLowerCase() == "a") {
              this.node.parentNode.parentNode.removeChild(this.node.parentNode);
          } else {
              this.node.parentNode.removeChild(this.node);
          }
          for (var i in this) {
              this[i] = typeof this[i] == "function" ? R._removedFactory(i) : null;
          }
          this.removed = true;
      };
      elproto._getBBox = function () {
          if (this.node.style.display == "none") {
              this.show();
              var hide = true;
          }
          var bbox = {};
          try {
              bbox = this.node.getBBox();
          } catch(e) {
              // Firefox 3.0.x plays badly here
          } finally {
              bbox = bbox || {};
          }
          hide && this.hide();
          return bbox;
      };
      
      elproto.attr = function (name, value) {
          if (this.removed) {
              return this;
          }
          if (name == null) {
              var res = {};
              for (var a in this.attrs) if (this.attrs[has](a)) {
                  res[a] = this.attrs[a];
              }
              res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
              res.transform = this._.transform;
              return res;
          }
          if (value == null && R.is(name, "string")) {
              if (name == "fill" && this.attrs.fill == "none" && this.attrs.gradient) {
                  return this.attrs.gradient;
              }
              if (name == "transform") {
                  return this._.transform;
              }
              var names = name.split(separator),
                  out = {};
              for (var i = 0, ii = names.length; i < ii; i++) {
                  name = names[i];
                  if (name in this.attrs) {
                      out[name] = this.attrs[name];
                  } else if (R.is(this.paper.customAttributes[name], "function")) {
                      out[name] = this.paper.customAttributes[name].def;
                  } else {
                      out[name] = R._availableAttrs[name];
                  }
              }
              return ii - 1 ? out : out[names[0]];
          }
          if (value == null && R.is(name, "array")) {
              out = {};
              for (i = 0, ii = name.length; i < ii; i++) {
                  out[name[i]] = this.attr(name[i]);
              }
              return out;
          }
          if (value != null) {
              var params = {};
              params[name] = value;
          } else if (name != null && R.is(name, "object")) {
              params = name;
          }
          for (var key in params) {
              eve("raphael.attr." + key + "." + this.id, this, params[key]);
          }
          for (key in this.paper.customAttributes) if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
              var par = this.paper.customAttributes[key].apply(this, [].concat(params[key]));
              this.attrs[key] = params[key];
              for (var subkey in par) if (par[has](subkey)) {
                  params[subkey] = par[subkey];
              }
          }
          setFillAndStroke(this, params);
          return this;
      };
      
      elproto.toFront = function () {
          if (this.removed) {
              return this;
          }
          if (this.node.parentNode.tagName.toLowerCase() == "a") {
              this.node.parentNode.parentNode.appendChild(this.node.parentNode);
          } else {
              this.node.parentNode.appendChild(this.node);
          }
          var svg = this.paper;
          svg.top != this && R._tofront(this, svg);
          return this;
      };
      
      elproto.toBack = function () {
          if (this.removed) {
              return this;
          }
          var parent = this.node.parentNode;
          if (parent.tagName.toLowerCase() == "a") {
              parent.parentNode.insertBefore(this.node.parentNode, this.node.parentNode.parentNode.firstChild); 
          } else if (parent.firstChild != this.node) {
              parent.insertBefore(this.node, this.node.parentNode.firstChild);
          }
          R._toback(this, this.paper);
          var svg = this.paper;
          return this;
      };
      
      elproto.insertAfter = function (element) {
          if (this.removed) {
              return this;
          }
          var node = element.node || element[element.length - 1].node;
          if (node.nextSibling) {
              node.parentNode.insertBefore(this.node, node.nextSibling);
          } else {
              node.parentNode.appendChild(this.node);
          }
          R._insertafter(this, element, this.paper);
          return this;
      };
      
      elproto.insertBefore = function (element) {
          if (this.removed) {
              return this;
          }
          var node = element.node || element[0].node;
          node.parentNode.insertBefore(this.node, node);
          R._insertbefore(this, element, this.paper);
          return this;
      };
      elproto.blur = function (size) {
          // Experimental. No Safari support. Use it on your own risk.
          var t = this;
          if (+size !== 0) {
              var fltr = $("filter"),
                  blur = $("feGaussianBlur");
              t.attrs.blur = size;
              fltr.id = R.createUUID();
              $(blur, {stdDeviation: +size || 1.5});
              fltr.appendChild(blur);
              t.paper.defs.appendChild(fltr);
              t._blur = fltr;
              $(t.node, {filter: "url(#" + fltr.id + ")"});
          } else {
              if (t._blur) {
                  t._blur.parentNode.removeChild(t._blur);
                  delete t._blur;
                  delete t.attrs.blur;
              }
              t.node.removeAttribute("filter");
          }
      };
      R._engine.circle = function (svg, x, y, r) {
          var el = $("circle");
          svg.canvas && svg.canvas.appendChild(el);
          var res = new Element(el, svg);
          res.attrs = {cx: x, cy: y, r: r, fill: "none", stroke: "#000"};
          res.type = "circle";
          $(el, res.attrs);
          return res;
      };
      R._engine.rect = function (svg, x, y, w, h, r) {
          var el = $("rect");
          svg.canvas && svg.canvas.appendChild(el);
          var res = new Element(el, svg);
          res.attrs = {x: x, y: y, width: w, height: h, r: r || 0, rx: r || 0, ry: r || 0, fill: "none", stroke: "#000"};
          res.type = "rect";
          $(el, res.attrs);
          return res;
      };
      R._engine.ellipse = function (svg, x, y, rx, ry) {
          var el = $("ellipse");
          svg.canvas && svg.canvas.appendChild(el);
          var res = new Element(el, svg);
          res.attrs = {cx: x, cy: y, rx: rx, ry: ry, fill: "none", stroke: "#000"};
          res.type = "ellipse";
          $(el, res.attrs);
          return res;
      };
      R._engine.image = function (svg, src, x, y, w, h) {
          var el = $("image");
          $(el, {x: x, y: y, width: w, height: h, preserveAspectRatio: "none"});
          el.setAttributeNS(xlink, "href", src);
          svg.canvas && svg.canvas.appendChild(el);
          var res = new Element(el, svg);
          res.attrs = {x: x, y: y, width: w, height: h, src: src};
          res.type = "image";
          return res;
      };
      R._engine.text = function (svg, x, y, text) {
          var el = $("text");
          svg.canvas && svg.canvas.appendChild(el);
          var res = new Element(el, svg);
          res.attrs = {
              x: x,
              y: y,
              "text-anchor": "middle",
              text: text,
              font: R._availableAttrs.font,
              stroke: "none",
              fill: "#000"
          };
          res.type = "text";
          setFillAndStroke(res, res.attrs);
          return res;
      };
      R._engine.setSize = function (width, height) {
          this.width = width || this.width;
          this.height = height || this.height;
          this.canvas.setAttribute("width", this.width);
          this.canvas.setAttribute("height", this.height);
          if (this._viewBox) {
              this.setViewBox.apply(this, this._viewBox);
          }
          return this;
      };
      R._engine.create = function () {
          var con = R._getContainer.apply(0, arguments),
              container = con && con.container,
              x = con.x,
              y = con.y,
              width = con.width,
              height = con.height;
          if (!container) {
              throw new Error("SVG container not found.");
          }
          var cnvs = $("svg"),
              css = "overflow:hidden;",
              isFloating;
          x = x || 0;
          y = y || 0;
          width = width || 512;
          height = height || 342;
          $(cnvs, {
              height: height,
              version: 1.1,
              width: width,
              xmlns: "http://www.w3.org/2000/svg"
          });
          if (container == 1) {
              cnvs.style.cssText = css + "position:absolute;left:" + x + "px;top:" + y + "px";
              R._g.doc.body.appendChild(cnvs);
              isFloating = 1;
          } else {
              cnvs.style.cssText = css + "position:relative";
              if (container.firstChild) {
                  container.insertBefore(cnvs, container.firstChild);
              } else {
                  container.appendChild(cnvs);
              }
          }
          container = new R._Paper;
          container.width = width;
          container.height = height;
          container.canvas = cnvs;
          container.clear();
          container._left = container._top = 0;
          isFloating && (container.renderfix = function () {});
          container.renderfix();
          return container;
      };
      R._engine.setViewBox = function (x, y, w, h, fit) {
          eve("raphael.setViewBox", this, this._viewBox, [x, y, w, h, fit]);
          var size = mmax(w / this.width, h / this.height),
              top = this.top,
              aspectRatio = fit ? "meet" : "xMinYMin",
              vb,
              sw;
          if (x == null) {
              if (this._vbSize) {
                  size = 1;
              }
              delete this._vbSize;
              vb = "0 0 " + this.width + S + this.height;
          } else {
              this._vbSize = size;
              vb = x + S + y + S + w + S + h;
          }
          $(this.canvas, {
              viewBox: vb,
              preserveAspectRatio: aspectRatio
          });
          while (size && top) {
              sw = "stroke-width" in top.attrs ? top.attrs["stroke-width"] : 1;
              top.attr({"stroke-width": sw});
              top._.dirty = 1;
              top._.dirtyT = 1;
              top = top.prev;
          }
          this._viewBox = [x, y, w, h, !!fit];
          return this;
      };
      
      R.prototype.renderfix = function () {
          var cnvs = this.canvas,
              s = cnvs.style,
              pos;
          try {
              pos = cnvs.getScreenCTM() || cnvs.createSVGMatrix();
          } catch (e) {
              pos = cnvs.createSVGMatrix();
          }
          var left = -pos.e % 1,
              top = -pos.f % 1;
          if (left || top) {
              if (left) {
                  this._left = (this._left + left) % 1;
                  s.left = this._left + "px";
              }
              if (top) {
                  this._top = (this._top + top) % 1;
                  s.top = this._top + "px";
              }
          }
      };
      
      R.prototype.clear = function () {
          R.eve("raphael.clear", this);
          var c = this.canvas;
          while (c.firstChild) {
              c.removeChild(c.firstChild);
          }
          this.bottom = this.top = null;
          (this.desc = $("desc")).appendChild(R._g.doc.createTextNode("Created with Rapha\xebl " + R.version));
          c.appendChild(this.desc);
          c.appendChild(this.defs = $("defs"));
      };
      
      R.prototype.remove = function () {
          eve("raphael.remove", this);
          this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
          for (var i in this) {
              this[i] = typeof this[i] == "function" ? R._removedFactory(i) : null;
          }
      };
      var setproto = R.st;
      for (var method in elproto) if (elproto[has](method) && !setproto[has](method)) {
          setproto[method] = (function (methodname) {
              return function () {
                  var arg = arguments;
                  return this.forEach(function (el) {
                      el[methodname].apply(el, arg);
                  });
              };
          })(method);
      }
  }(window.Raphael);

  // ┌─────────────────────────────────────────────────────────────────────┐ \\
  // │ Raphaël - JavaScript Vector Library                                 │ \\
  // ├─────────────────────────────────────────────────────────────────────┤ \\
  // │ VML Module                                                          │ \\
  // ├─────────────────────────────────────────────────────────────────────┤ \\
  // │ Copyright (c) 2008-2011 Dmitry Baranovskiy (http://raphaeljs.com)   │ \\
  // │ Copyright (c) 2008-2011 Sencha Labs (http://sencha.com)             │ \\
  // │ Licensed under the MIT (http://raphaeljs.com/license.html) license. │ \\
  // └─────────────────────────────────────────────────────────────────────┘ \\
  window.Raphael.vml && function (R) {
      var has = "hasOwnProperty",
          Str = String,
          toFloat = parseFloat,
          math = Math,
          round = math.round,
          mmax = math.max,
          mmin = math.min,
          abs = math.abs,
          fillString = "fill",
          separator = /[, ]+/,
          eve = R.eve,
          ms = " progid:DXImageTransform.Microsoft",
          S = " ",
          E = "",
          map = {M: "m", L: "l", C: "c", Z: "x", m: "t", l: "r", c: "v", z: "x"},
          bites = /([clmz]),?([^clmz]*)/gi,
          blurregexp = / progid:\S+Blur\([^\)]+\)/g,
          val = /-?[^,\s-]+/g,
          cssDot = "position:absolute;left:0;top:0;width:1px;height:1px",
          zoom = 21600,
          pathTypes = {path: 1, rect: 1, image: 1},
          ovalTypes = {circle: 1, ellipse: 1},
          path2vml = function (path) {
              var total =  /[ahqstv]/ig,
                  command = R._pathToAbsolute;
              Str(path).match(total) && (command = R._path2curve);
              total = /[clmz]/g;
              if (command == R._pathToAbsolute && !Str(path).match(total)) {
                  var res = Str(path).replace(bites, function (all, command, args) {
                      var vals = [],
                          isMove = command.toLowerCase() == "m",
                          res = map[command];
                      args.replace(val, function (value) {
                          if (isMove && vals.length == 2) {
                              res += vals + map[command == "m" ? "l" : "L"];
                              vals = [];
                          }
                          vals.push(round(value * zoom));
                      });
                      return res + vals;
                  });
                  return res;
              }
              var pa = command(path), p, r;
              res = [];
              for (var i = 0, ii = pa.length; i < ii; i++) {
                  p = pa[i];
                  r = pa[i][0].toLowerCase();
                  r == "z" && (r = "x");
                  for (var j = 1, jj = p.length; j < jj; j++) {
                      r += round(p[j] * zoom) + (j != jj - 1 ? "," : E);
                  }
                  res.push(r);
              }
              return res.join(S);
          },
          compensation = function (deg, dx, dy) {
              var m = R.matrix();
              m.rotate(-deg, .5, .5);
              return {
                  dx: m.x(dx, dy),
                  dy: m.y(dx, dy)
              };
          },
          setCoords = function (p, sx, sy, dx, dy, deg) {
              var _ = p._,
                  m = p.matrix,
                  fillpos = _.fillpos,
                  o = p.node,
                  s = o.style,
                  y = 1,
                  flip = "",
                  dxdy,
                  kx = zoom / sx,
                  ky = zoom / sy;
              s.visibility = "hidden";
              if (!sx || !sy) {
                  return;
              }
              o.coordsize = abs(kx) + S + abs(ky);
              s.rotation = deg * (sx * sy < 0 ? -1 : 1);
              if (deg) {
                  var c = compensation(deg, dx, dy);
                  dx = c.dx;
                  dy = c.dy;
              }
              sx < 0 && (flip += "x");
              sy < 0 && (flip += " y") && (y = -1);
              s.flip = flip;
              o.coordorigin = (dx * -kx) + S + (dy * -ky);
              if (fillpos || _.fillsize) {
                  var fill = o.getElementsByTagName(fillString);
                  fill = fill && fill[0];
                  o.removeChild(fill);
                  if (fillpos) {
                      c = compensation(deg, m.x(fillpos[0], fillpos[1]), m.y(fillpos[0], fillpos[1]));
                      fill.position = c.dx * y + S + c.dy * y;
                  }
                  if (_.fillsize) {
                      fill.size = _.fillsize[0] * abs(sx) + S + _.fillsize[1] * abs(sy);
                  }
                  o.appendChild(fill);
              }
              s.visibility = "visible";
          };
      R.toString = function () {
          return  "Your browser doesn\u2019t support SVG. Falling down to VML.\nYou are running Rapha\xebl " + this.version;
      };
      var addArrow = function (o, value, isEnd) {
          var values = Str(value).toLowerCase().split("-"),
              se = isEnd ? "end" : "start",
              i = values.length,
              type = "classic",
              w = "medium",
              h = "medium";
          while (i--) {
              switch (values[i]) {
                  case "block":
                  case "classic":
                  case "oval":
                  case "diamond":
                  case "open":
                  case "none":
                      type = values[i];
                      break;
                  case "wide":
                  case "narrow": h = values[i]; break;
                  case "long":
                  case "short": w = values[i]; break;
              }
          }
          var stroke = o.node.getElementsByTagName("stroke")[0];
          stroke[se + "arrow"] = type;
          stroke[se + "arrowlength"] = w;
          stroke[se + "arrowwidth"] = h;
      },
      setFillAndStroke = function (o, params) {
          // o.paper.canvas.style.display = "none";
          o.attrs = o.attrs || {};
          var node = o.node,
              a = o.attrs,
              s = node.style,
              xy,
              newpath = pathTypes[o.type] && (params.x != a.x || params.y != a.y || params.width != a.width || params.height != a.height || params.cx != a.cx || params.cy != a.cy || params.rx != a.rx || params.ry != a.ry || params.r != a.r),
              isOval = ovalTypes[o.type] && (a.cx != params.cx || a.cy != params.cy || a.r != params.r || a.rx != params.rx || a.ry != params.ry),
              res = o;


          for (var par in params) if (params[has](par)) {
              a[par] = params[par];
          }
          if (newpath) {
              a.path = R._getPath[o.type](o);
              o._.dirty = 1;
          }
          params.href && (node.href = params.href);
          params.title && (node.title = params.title);
          params.target && (node.target = params.target);
          params.cursor && (s.cursor = params.cursor);
          "blur" in params && o.blur(params.blur);
          if (params.path && o.type == "path" || newpath) {
              node.path = path2vml(~Str(a.path).toLowerCase().indexOf("r") ? R._pathToAbsolute(a.path) : a.path);
              if (o.type == "image") {
                  o._.fillpos = [a.x, a.y];
                  o._.fillsize = [a.width, a.height];
                  setCoords(o, 1, 1, 0, 0, 0);
              }
          }
          "transform" in params && o.transform(params.transform);
          if (isOval) {
              var cx = +a.cx,
                  cy = +a.cy,
                  rx = +a.rx || +a.r || 0,
                  ry = +a.ry || +a.r || 0;
              node.path = R.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x", round((cx - rx) * zoom), round((cy - ry) * zoom), round((cx + rx) * zoom), round((cy + ry) * zoom), round(cx * zoom));
          }
          if ("clip-rect" in params) {
              var rect = Str(params["clip-rect"]).split(separator);
              if (rect.length == 4) {
                  rect[2] = +rect[2] + (+rect[0]);
                  rect[3] = +rect[3] + (+rect[1]);
                  var div = node.clipRect || R._g.doc.createElement("div"),
                      dstyle = div.style;
                  dstyle.clip = R.format("rect({1}px {2}px {3}px {0}px)", rect);
                  if (!node.clipRect) {
                      dstyle.position = "absolute";
                      dstyle.top = 0;
                      dstyle.left = 0;
                      dstyle.width = o.paper.width + "px";
                      dstyle.height = o.paper.height + "px";
                      node.parentNode.insertBefore(div, node);
                      div.appendChild(node);
                      node.clipRect = div;
                  }
              }
              if (!params["clip-rect"]) {
                  node.clipRect && (node.clipRect.style.clip = "auto");
              }
          }
          if (o.textpath) {
              var textpathStyle = o.textpath.style;
              params.font && (textpathStyle.font = params.font);
              params["font-family"] && (textpathStyle.fontFamily = '"' + params["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g, E) + '"');
              params["font-size"] && (textpathStyle.fontSize = params["font-size"]);
              params["font-weight"] && (textpathStyle.fontWeight = params["font-weight"]);
              params["font-style"] && (textpathStyle.fontStyle = params["font-style"]);
          }
          if ("arrow-start" in params) {
              addArrow(res, params["arrow-start"]);
          }
          if ("arrow-end" in params) {
              addArrow(res, params["arrow-end"], 1);
          }
          if (params.opacity != null || 
              params["stroke-width"] != null ||
              params.fill != null ||
              params.src != null ||
              params.stroke != null ||
              params["stroke-width"] != null ||
              params["stroke-opacity"] != null ||
              params["fill-opacity"] != null ||
              params["stroke-dasharray"] != null ||
              params["stroke-miterlimit"] != null ||
              params["stroke-linejoin"] != null ||
              params["stroke-linecap"] != null) {
              var fill = node.getElementsByTagName(fillString),
                  newfill = false;
              fill = fill && fill[0];
              !fill && (newfill = fill = createNode(fillString));
              if (o.type == "image" && params.src) {
                  fill.src = params.src;
              }
              params.fill && (fill.on = true);
              if (fill.on == null || params.fill == "none" || params.fill === null) {
                  fill.on = false;
              }
              if (fill.on && params.fill) {
                  var isURL = Str(params.fill).match(R._ISURL);
                  if (isURL) {
                      fill.parentNode == node && node.removeChild(fill);
                      fill.rotate = true;
                      fill.src = isURL[1];
                      fill.type = "tile";
                      var bbox = o.getBBox(1);
                      fill.position = bbox.x + S + bbox.y;
                      o._.fillpos = [bbox.x, bbox.y];

                      R._preload(isURL[1], function () {
                          o._.fillsize = [this.offsetWidth, this.offsetHeight];
                      });
                  } else {
                      fill.color = R.getRGB(params.fill).hex;
                      fill.src = E;
                      fill.type = "solid";
                      if (R.getRGB(params.fill).error && (res.type in {circle: 1, ellipse: 1} || Str(params.fill).charAt() != "r") && addGradientFill(res, params.fill, fill)) {
                          a.fill = "none";
                          a.gradient = params.fill;
                          fill.rotate = false;
                      }
                  }
              }
              if ("fill-opacity" in params || "opacity" in params) {
                  var opacity = ((+a["fill-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+R.getRGB(params.fill).o + 1 || 2) - 1);
                  opacity = mmin(mmax(opacity, 0), 1);
                  fill.opacity = opacity;
                  if (fill.src) {
                      fill.color = "none";
                  }
              }
              node.appendChild(fill);
              var stroke = (node.getElementsByTagName("stroke") && node.getElementsByTagName("stroke")[0]),
              newstroke = false;
              !stroke && (newstroke = stroke = createNode("stroke"));
              if ((params.stroke && params.stroke != "none") ||
                  params["stroke-width"] ||
                  params["stroke-opacity"] != null ||
                  params["stroke-dasharray"] ||
                  params["stroke-miterlimit"] ||
                  params["stroke-linejoin"] ||
                  params["stroke-linecap"]) {
                  stroke.on = true;
              }
              (params.stroke == "none" || params.stroke === null || stroke.on == null || params.stroke == 0 || params["stroke-width"] == 0) && (stroke.on = false);
              var strokeColor = R.getRGB(params.stroke);
              stroke.on && params.stroke && (stroke.color = strokeColor.hex);
              opacity = ((+a["stroke-opacity"] + 1 || 2) - 1) * ((+a.opacity + 1 || 2) - 1) * ((+strokeColor.o + 1 || 2) - 1);
              var width = (toFloat(params["stroke-width"]) || 1) * .75;
              opacity = mmin(mmax(opacity, 0), 1);
              params["stroke-width"] == null && (width = a["stroke-width"]);
              params["stroke-width"] && (stroke.weight = width);
              width && width < 1 && (opacity *= width) && (stroke.weight = 1);
              stroke.opacity = opacity;
          
              params["stroke-linejoin"] && (stroke.joinstyle = params["stroke-linejoin"] || "miter");
              stroke.miterlimit = params["stroke-miterlimit"] || 8;
              params["stroke-linecap"] && (stroke.endcap = params["stroke-linecap"] == "butt" ? "flat" : params["stroke-linecap"] == "square" ? "square" : "round");
              if (params["stroke-dasharray"]) {
                  var dasharray = {
                      "-": "shortdash",
                      ".": "shortdot",
                      "-.": "shortdashdot",
                      "-..": "shortdashdotdot",
                      ". ": "dot",
                      "- ": "dash",
                      "--": "longdash",
                      "- .": "dashdot",
                      "--.": "longdashdot",
                      "--..": "longdashdotdot"
                  };
                  stroke.dashstyle = dasharray[has](params["stroke-dasharray"]) ? dasharray[params["stroke-dasharray"]] : E;
              }
              newstroke && node.appendChild(stroke);
          }
          if (res.type == "text") {
              res.paper.canvas.style.display = E;
              var span = res.paper.span,
                  m = 100,
                  fontSize = a.font && a.font.match(/\d+(?:\.\d*)?(?=px)/);
              s = span.style;
              a.font && (s.font = a.font);
              a["font-family"] && (s.fontFamily = a["font-family"]);
              a["font-weight"] && (s.fontWeight = a["font-weight"]);
              a["font-style"] && (s.fontStyle = a["font-style"]);
              fontSize = toFloat(a["font-size"] || fontSize && fontSize[0]) || 10;
              s.fontSize = fontSize * m + "px";
              res.textpath.string && (span.innerHTML = Str(res.textpath.string).replace(/</g, "&#60;").replace(/&/g, "&#38;").replace(/\n/g, "<br>"));
              var brect = span.getBoundingClientRect();
              res.W = a.w = (brect.right - brect.left) / m;
              res.H = a.h = (brect.bottom - brect.top) / m;
              // res.paper.canvas.style.display = "none";
              res.X = a.x;
              res.Y = a.y + res.H / 2;

              ("x" in params || "y" in params) && (res.path.v = R.format("m{0},{1}l{2},{1}", round(a.x * zoom), round(a.y * zoom), round(a.x * zoom) + 1));
              var dirtyattrs = ["x", "y", "text", "font", "font-family", "font-weight", "font-style", "font-size"];
              for (var d = 0, dd = dirtyattrs.length; d < dd; d++) if (dirtyattrs[d] in params) {
                  res._.dirty = 1;
                  break;
              }
          
              // text-anchor emulation
              switch (a["text-anchor"]) {
                  case "start":
                      res.textpath.style["v-text-align"] = "left";
                      res.bbx = res.W / 2;
                  break;
                  case "end":
                      res.textpath.style["v-text-align"] = "right";
                      res.bbx = -res.W / 2;
                  break;
                  default:
                      res.textpath.style["v-text-align"] = "center";
                      res.bbx = 0;
                  break;
              }
              res.textpath.style["v-text-kern"] = true;
          }
          // res.paper.canvas.style.display = E;
      },
      addGradientFill = function (o, gradient, fill) {
          o.attrs = o.attrs || {};
          var attrs = o.attrs,
              pow = Math.pow,
              opacity,
              oindex,
              type = "linear",
              fxfy = ".5 .5";
          o.attrs.gradient = gradient;
          gradient = Str(gradient).replace(R._radial_gradient, function (all, fx, fy) {
              type = "radial";
              if (fx && fy) {
                  fx = toFloat(fx);
                  fy = toFloat(fy);
                  pow(fx - .5, 2) + pow(fy - .5, 2) > .25 && (fy = math.sqrt(.25 - pow(fx - .5, 2)) * ((fy > .5) * 2 - 1) + .5);
                  fxfy = fx + S + fy;
              }
              return E;
          });
          gradient = gradient.split(/\s*\-\s*/);
          if (type == "linear") {
              var angle = gradient.shift();
              angle = -toFloat(angle);
              if (isNaN(angle)) {
                  return null;
              }
          }
          var dots = R._parseDots(gradient);
          if (!dots) {
              return null;
          }
          o = o.shape || o.node;
          if (dots.length) {
              o.removeChild(fill);
              fill.on = true;
              fill.method = "none";
              fill.color = dots[0].color;
              fill.color2 = dots[dots.length - 1].color;
              var clrs = [];
              for (var i = 0, ii = dots.length; i < ii; i++) {
                  dots[i].offset && clrs.push(dots[i].offset + S + dots[i].color);
              }
              fill.colors = clrs.length ? clrs.join() : "0% " + fill.color;
              if (type == "radial") {
                  fill.type = "gradientTitle";
                  fill.focus = "100%";
                  fill.focussize = "0 0";
                  fill.focusposition = fxfy;
                  fill.angle = 0;
              } else {
                  // fill.rotate= true;
                  fill.type = "gradient";
                  fill.angle = (270 - angle) % 360;
              }
              o.appendChild(fill);
          }
          return 1;
      },
      Element = function (node, vml) {
          this[0] = this.node = node;
          node.raphael = true;
          this.id = R._oid++;
          node.raphaelid = this.id;
          this.X = 0;
          this.Y = 0;
          this.attrs = {};
          this.paper = vml;
          this.matrix = R.matrix();
          this._ = {
              transform: [],
              sx: 1,
              sy: 1,
              dx: 0,
              dy: 0,
              deg: 0,
              dirty: 1,
              dirtyT: 1
          };
          !vml.bottom && (vml.bottom = this);
          this.prev = vml.top;
          vml.top && (vml.top.next = this);
          vml.top = this;
          this.next = null;
      };
      var elproto = R.el;

      Element.prototype = elproto;
      elproto.constructor = Element;
      elproto.transform = function (tstr) {
          if (tstr == null) {
              return this._.transform;
          }
          var vbs = this.paper._viewBoxShift,
              vbt = vbs ? "s" + [vbs.scale, vbs.scale] + "-1-1t" + [vbs.dx, vbs.dy] : E,
              oldt;
          if (vbs) {
              oldt = tstr = Str(tstr).replace(/\.{3}|\u2026/g, this._.transform || E);
          }
          R._extractTransform(this, vbt + tstr);
          var matrix = this.matrix.clone(),
              skew = this.skew,
              o = this.node,
              split,
              isGrad = ~Str(this.attrs.fill).indexOf("-"),
              isPatt = !Str(this.attrs.fill).indexOf("url(");
          matrix.translate(-.5, -.5);
          if (isPatt || isGrad || this.type == "image") {
              skew.matrix = "1 0 0 1";
              skew.offset = "0 0";
              split = matrix.split();
              if ((isGrad && split.noRotation) || !split.isSimple) {
                  o.style.filter = matrix.toFilter();
                  var bb = this.getBBox(),
                      bbt = this.getBBox(1),
                      dx = bb.x - bbt.x,
                      dy = bb.y - bbt.y;
                  o.coordorigin = (dx * -zoom) + S + (dy * -zoom);
                  setCoords(this, 1, 1, dx, dy, 0);
              } else {
                  o.style.filter = E;
                  setCoords(this, split.scalex, split.scaley, split.dx, split.dy, split.rotate);
              }
          } else {
              o.style.filter = E;
              skew.matrix = Str(matrix);
              skew.offset = matrix.offset();
          }
          oldt && (this._.transform = oldt);
          return this;
      };
      elproto.rotate = function (deg, cx, cy) {
          if (this.removed) {
              return this;
          }
          if (deg == null) {
              return;
          }
          deg = Str(deg).split(separator);
          if (deg.length - 1) {
              cx = toFloat(deg[1]);
              cy = toFloat(deg[2]);
          }
          deg = toFloat(deg[0]);
          (cy == null) && (cx = cy);
          if (cx == null || cy == null) {
              var bbox = this.getBBox(1);
              cx = bbox.x + bbox.width / 2;
              cy = bbox.y + bbox.height / 2;
          }
          this._.dirtyT = 1;
          this.transform(this._.transform.concat([["r", deg, cx, cy]]));
          return this;
      };
      elproto.translate = function (dx, dy) {
          if (this.removed) {
              return this;
          }
          dx = Str(dx).split(separator);
          if (dx.length - 1) {
              dy = toFloat(dx[1]);
          }
          dx = toFloat(dx[0]) || 0;
          dy = +dy || 0;
          if (this._.bbox) {
              this._.bbox.x += dx;
              this._.bbox.y += dy;
          }
          this.transform(this._.transform.concat([["t", dx, dy]]));
          return this;
      };
      elproto.scale = function (sx, sy, cx, cy) {
          if (this.removed) {
              return this;
          }
          sx = Str(sx).split(separator);
          if (sx.length - 1) {
              sy = toFloat(sx[1]);
              cx = toFloat(sx[2]);
              cy = toFloat(sx[3]);
              isNaN(cx) && (cx = null);
              isNaN(cy) && (cy = null);
          }
          sx = toFloat(sx[0]);
          (sy == null) && (sy = sx);
          (cy == null) && (cx = cy);
          if (cx == null || cy == null) {
              var bbox = this.getBBox(1);
          }
          cx = cx == null ? bbox.x + bbox.width / 2 : cx;
          cy = cy == null ? bbox.y + bbox.height / 2 : cy;
      
          this.transform(this._.transform.concat([["s", sx, sy, cx, cy]]));
          this._.dirtyT = 1;
          return this;
      };
      elproto.hide = function () {
          !this.removed && (this.node.style.display = "none");
          return this;
      };
      elproto.show = function () {
          !this.removed && (this.node.style.display = E);
          return this;
      };
      elproto._getBBox = function () {
          if (this.removed) {
              return {};
          }
          return {
              x: this.X + (this.bbx || 0) - this.W / 2,
              y: this.Y - this.H,
              width: this.W,
              height: this.H
          };
      };
      elproto.remove = function () {
          if (this.removed || !this.node.parentNode) {
              return;
          }
          this.paper.__set__ && this.paper.__set__.exclude(this);
          R.eve.unbind("raphael.*.*." + this.id);
          R._tear(this, this.paper);
          this.node.parentNode.removeChild(this.node);
          this.shape && this.shape.parentNode.removeChild(this.shape);
          for (var i in this) {
              this[i] = typeof this[i] == "function" ? R._removedFactory(i) : null;
          }
          this.removed = true;
      };
      elproto.attr = function (name, value) {
          if (this.removed) {
              return this;
          }
          if (name == null) {
              var res = {};
              for (var a in this.attrs) if (this.attrs[has](a)) {
                  res[a] = this.attrs[a];
              }
              res.gradient && res.fill == "none" && (res.fill = res.gradient) && delete res.gradient;
              res.transform = this._.transform;
              return res;
          }
          if (value == null && R.is(name, "string")) {
              if (name == fillString && this.attrs.fill == "none" && this.attrs.gradient) {
                  return this.attrs.gradient;
              }
              var names = name.split(separator),
                  out = {};
              for (var i = 0, ii = names.length; i < ii; i++) {
                  name = names[i];
                  if (name in this.attrs) {
                      out[name] = this.attrs[name];
                  } else if (R.is(this.paper.customAttributes[name], "function")) {
                      out[name] = this.paper.customAttributes[name].def;
                  } else {
                      out[name] = R._availableAttrs[name];
                  }
              }
              return ii - 1 ? out : out[names[0]];
          }
          if (this.attrs && value == null && R.is(name, "array")) {
              out = {};
              for (i = 0, ii = name.length; i < ii; i++) {
                  out[name[i]] = this.attr(name[i]);
              }
              return out;
          }
          var params;
          if (value != null) {
              params = {};
              params[name] = value;
          }
          value == null && R.is(name, "object") && (params = name);
          for (var key in params) {
              eve("raphael.attr." + key + "." + this.id, this, params[key]);
          }
          if (params) {
              for (key in this.paper.customAttributes) if (this.paper.customAttributes[has](key) && params[has](key) && R.is(this.paper.customAttributes[key], "function")) {
                  var par = this.paper.customAttributes[key].apply(this, [].concat(params[key]));
                  this.attrs[key] = params[key];
                  for (var subkey in par) if (par[has](subkey)) {
                      params[subkey] = par[subkey];
                  }
              }
              // this.paper.canvas.style.display = "none";
              if (params.text && this.type == "text") {
                  this.textpath.string = params.text;
              }
              setFillAndStroke(this, params);
              // this.paper.canvas.style.display = E;
          }
          return this;
      };
      elproto.toFront = function () {
          !this.removed && this.node.parentNode.appendChild(this.node);
          this.paper && this.paper.top != this && R._tofront(this, this.paper);
          return this;
      };
      elproto.toBack = function () {
          if (this.removed) {
              return this;
          }
          if (this.node.parentNode.firstChild != this.node) {
              this.node.parentNode.insertBefore(this.node, this.node.parentNode.firstChild);
              R._toback(this, this.paper);
          }
          return this;
      };
      elproto.insertAfter = function (element) {
          if (this.removed) {
              return this;
          }
          if (element.constructor == R.st.constructor) {
              element = element[element.length - 1];
          }
          if (element.node.nextSibling) {
              element.node.parentNode.insertBefore(this.node, element.node.nextSibling);
          } else {
              element.node.parentNode.appendChild(this.node);
          }
          R._insertafter(this, element, this.paper);
          return this;
      };
      elproto.insertBefore = function (element) {
          if (this.removed) {
              return this;
          }
          if (element.constructor == R.st.constructor) {
              element = element[0];
          }
          element.node.parentNode.insertBefore(this.node, element.node);
          R._insertbefore(this, element, this.paper);
          return this;
      };
      elproto.blur = function (size) {
          var s = this.node.runtimeStyle,
              f = s.filter;
          f = f.replace(blurregexp, E);
          if (+size !== 0) {
              this.attrs.blur = size;
              s.filter = f + S + ms + ".Blur(pixelradius=" + (+size || 1.5) + ")";
              s.margin = R.format("-{0}px 0 0 -{0}px", round(+size || 1.5));
          } else {
              s.filter = f;
              s.margin = 0;
              delete this.attrs.blur;
          }
      };

      R._engine.path = function (pathString, vml) {
          var el = createNode("shape");
          el.style.cssText = cssDot;
          el.coordsize = zoom + S + zoom;
          el.coordorigin = vml.coordorigin;
          var p = new Element(el, vml),
              attr = {fill: "none", stroke: "#000"};
          pathString && (attr.path = pathString);
          p.type = "path";
          p.path = [];
          p.Path = E;
          setFillAndStroke(p, attr);
          vml.canvas.appendChild(el);
          var skew = createNode("skew");
          skew.on = true;
          el.appendChild(skew);
          p.skew = skew;
          p.transform(E);
          return p;
      };
      R._engine.rect = function (vml, x, y, w, h, r) {
          var path = R._rectPath(x, y, w, h, r),
              res = vml.path(path),
              a = res.attrs;
          res.X = a.x = x;
          res.Y = a.y = y;
          res.W = a.width = w;
          res.H = a.height = h;
          a.r = r;
          a.path = path;
          res.type = "rect";
          return res;
      };
      R._engine.ellipse = function (vml, x, y, rx, ry) {
          var res = vml.path(),
              a = res.attrs;
          res.X = x - rx;
          res.Y = y - ry;
          res.W = rx * 2;
          res.H = ry * 2;
          res.type = "ellipse";
          setFillAndStroke(res, {
              cx: x,
              cy: y,
              rx: rx,
              ry: ry
          });
          return res;
      };
      R._engine.circle = function (vml, x, y, r) {
          var res = vml.path(),
              a = res.attrs;
          res.X = x - r;
          res.Y = y - r;
          res.W = res.H = r * 2;
          res.type = "circle";
          setFillAndStroke(res, {
              cx: x,
              cy: y,
              r: r
          });
          return res;
      };
      R._engine.image = function (vml, src, x, y, w, h) {
          var path = R._rectPath(x, y, w, h),
              res = vml.path(path).attr({stroke: "none"}),
              a = res.attrs,
              node = res.node,
              fill = node.getElementsByTagName(fillString)[0];
          a.src = src;
          res.X = a.x = x;
          res.Y = a.y = y;
          res.W = a.width = w;
          res.H = a.height = h;
          a.path = path;
          res.type = "image";
          fill.parentNode == node && node.removeChild(fill);
          fill.rotate = true;
          fill.src = src;
          fill.type = "tile";
          res._.fillpos = [x, y];
          res._.fillsize = [w, h];
          node.appendChild(fill);
          setCoords(res, 1, 1, 0, 0, 0);
          return res;
      };
      R._engine.text = function (vml, x, y, text) {
          var el = createNode("shape"),
              path = createNode("path"),
              o = createNode("textpath");
          x = x || 0;
          y = y || 0;
          text = text || "";
          path.v = R.format("m{0},{1}l{2},{1}", round(x * zoom), round(y * zoom), round(x * zoom) + 1);
          path.textpathok = true;
          o.string = Str(text);
          o.on = true;
          el.style.cssText = cssDot;
          el.coordsize = zoom + S + zoom;
          el.coordorigin = "0 0";
          var p = new Element(el, vml),
              attr = {
                  fill: "#000",
                  stroke: "none",
                  font: R._availableAttrs.font,
                  text: text
              };
          p.shape = el;
          p.path = path;
          p.textpath = o;
          p.type = "text";
          p.attrs.text = Str(text);
          p.attrs.x = x;
          p.attrs.y = y;
          p.attrs.w = 1;
          p.attrs.h = 1;
          setFillAndStroke(p, attr);
          el.appendChild(o);
          el.appendChild(path);
          vml.canvas.appendChild(el);
          var skew = createNode("skew");
          skew.on = true;
          el.appendChild(skew);
          p.skew = skew;
          p.transform(E);
          return p;
      };
      R._engine.setSize = function (width, height) {
          var cs = this.canvas.style;
          this.width = width;
          this.height = height;
          width == +width && (width += "px");
          height == +height && (height += "px");
          cs.width = width;
          cs.height = height;
          cs.clip = "rect(0 " + width + " " + height + " 0)";
          if (this._viewBox) {
              R._engine.setViewBox.apply(this, this._viewBox);
          }
          return this;
      };
      R._engine.setViewBox = function (x, y, w, h, fit) {
          R.eve("raphael.setViewBox", this, this._viewBox, [x, y, w, h, fit]);
          var width = this.width,
              height = this.height,
              size = 1 / mmax(w / width, h / height),
              H, W;
          if (fit) {
              H = height / h;
              W = width / w;
              if (w * H < width) {
                  x -= (width - w * H) / 2 / H;
              }
              if (h * W < height) {
                  y -= (height - h * W) / 2 / W;
              }
          }
          this._viewBox = [x, y, w, h, !!fit];
          this._viewBoxShift = {
              dx: -x,
              dy: -y,
              scale: size
          };
          this.forEach(function (el) {
              el.transform("...");
          });
          return this;
      };
      var createNode;
      R._engine.initWin = function (win) {
              var doc = win.document;
              doc.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
              try {
                  !doc.namespaces.rvml && doc.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
                  createNode = function (tagName) {
                      return doc.createElement('<rvml:' + tagName + ' class="rvml">');
                  };
              } catch (e) {
                  createNode = function (tagName) {
                      return doc.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
                  };
              }
          };
      R._engine.initWin(R._g.win);
      R._engine.create = function () {
          var con = R._getContainer.apply(0, arguments),
              container = con.container,
              height = con.height,
              s,
              width = con.width,
              x = con.x,
              y = con.y;
          if (!container) {
              throw new Error("VML container not found.");
          }
          var res = new R._Paper,
              c = res.canvas = R._g.doc.createElement("div"),
              cs = c.style;
          x = x || 0;
          y = y || 0;
          width = width || 512;
          height = height || 342;
          res.width = width;
          res.height = height;
          width == +width && (width += "px");
          height == +height && (height += "px");
          res.coordsize = zoom * 1e3 + S + zoom * 1e3;
          res.coordorigin = "0 0";
          res.span = R._g.doc.createElement("span");
          res.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;";
          c.appendChild(res.span);
          cs.cssText = R.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden", width, height);
          if (container == 1) {
              R._g.doc.body.appendChild(c);
              cs.left = x + "px";
              cs.top = y + "px";
              cs.position = "absolute";
          } else {
              if (container.firstChild) {
                  container.insertBefore(c, container.firstChild);
              } else {
                  container.appendChild(c);
              }
          }
          res.renderfix = function () {};
          return res;
      };
      R.prototype.clear = function () {
          R.eve("raphael.clear", this);
          this.canvas.innerHTML = E;
          this.span = R._g.doc.createElement("span");
          this.span.style.cssText = "position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;";
          this.canvas.appendChild(this.span);
          this.bottom = this.top = null;
      };
      R.prototype.remove = function () {
          R.eve("raphael.remove", this);
          this.canvas.parentNode.removeChild(this.canvas);
          for (var i in this) {
              this[i] = typeof this[i] == "function" ? R._removedFactory(i) : null;
          }
          return true;
      };

      var setproto = R.st;
      for (var method in elproto) if (elproto[has](method) && !setproto[has](method)) {
          setproto[method] = (function (methodname) {
              return function () {
                  var arg = arguments;
                  return this.forEach(function (el) {
                      el[methodname].apply(el, arg);
                  });
              };
          })(method);
      }
  }(window.Raphael);
})(uploadcare.eve)

uploadcare.Raphael = Raphael.ninja()
;
// changed:
//   Pusher.dependency_suffix = '.min'; (was '')
//   window.WEB_SOCKET_SWF_LOCATION = "https://s3.amazonaws.com/uploadcare-static/WebSocketMainInsecure.swf"

/*!
 * Pusher JavaScript Library v1.12.2
 * http://pusherapp.com/
 *
 * Copyright 2011, Pusher
 * Released under the MIT licence.
 */


;(function() {
  if (Function.prototype.scopedTo === undefined) {
    Function.prototype.scopedTo = function(context, args) {
      var f = this;
      return function() {
        return f.apply(context, Array.prototype.slice.call(args || [])
                       .concat(Array.prototype.slice.call(arguments)));
      };
    };
  }

  var Pusher = function(app_key, options) {
    this.options = options || {};
    this.key = app_key;
    this.channels = new Pusher.Channels();
    this.global_emitter = new Pusher.EventsDispatcher()

    var self = this;

    this.checkAppKey();

    this.connection = new Pusher.Connection(this.key, this.options);

    // Setup / teardown connection
    this.connection
      .bind('connected', function() {
        self.subscribeAll();
      })
      .bind('message', function(params) {
        var internal = (params.event.indexOf('pusher_internal:') === 0);
        if (params.channel) {
          var channel;
          if (channel = self.channel(params.channel)) {
            channel.emit(params.event, params.data);
          }
        }
        // Emit globaly [deprecated]
        if (!internal) self.global_emitter.emit(params.event, params.data);
      })
      .bind('disconnected', function() {
        self.channels.disconnect();
      })
      .bind('error', function(err) {
        Pusher.warn('Error', err);
      });

    Pusher.instances.push(this);

    if (Pusher.isReady) self.connect();
  };
  Pusher.instances = [];
  Pusher.prototype = {
    channel: function(name) {
      return this.channels.find(name);
    },

    connect: function() {
      this.connection.connect();
    },

    disconnect: function() {
      this.connection.disconnect();
    },

    bind: function(event_name, callback) {
      this.global_emitter.bind(event_name, callback);
      return this;
    },

    bind_all: function(callback) {
      this.global_emitter.bind_all(callback);
      return this;
    },

    subscribeAll: function() {
      var channel;
      for (channelName in this.channels.channels) {
        if (this.channels.channels.hasOwnProperty(channelName)) {
          this.subscribe(channelName);
        }
      }
    },

    subscribe: function(channel_name) {
      var self = this;
      var channel = this.channels.add(channel_name, this);

      if (this.connection.state === 'connected') {
        channel.authorize(this.connection.socket_id, this.options, function(err, data) {
          if (err) {
            channel.emit('pusher:subscription_error', data);
          } else {
            self.send_event('pusher:subscribe', {
              channel: channel_name,
              auth: data.auth,
              channel_data: data.channel_data
            });
          }
        });
      }
      return channel;
    },

    unsubscribe: function(channel_name) {
      this.channels.remove(channel_name);
      if (this.connection.state === 'connected') {
        this.send_event('pusher:unsubscribe', {
          channel: channel_name
        });
      }
    },

    send_event: function(event_name, data, channel) {
      return this.connection.send_event(event_name, data, channel);
    },

    checkAppKey: function() {
      if(this.key === null || this.key === undefined) {
        Pusher.warn('Warning', 'You must pass your app key when you instantiate Pusher.');
      }
    }
  };

  Pusher.Util = {
    extend: function extend(target, extensions) {
      for (var property in extensions) {
        if (extensions[property] && extensions[property].constructor &&
            extensions[property].constructor === Object) {
          target[property] = extend(target[property] || {}, extensions[property]);
        } else {
          target[property] = extensions[property];
        }
      }
      return target;
    },

    stringify: function stringify() {
      var m = ["Pusher"]
      for (var i = 0; i < arguments.length; i++){
        if (typeof arguments[i] === "string") {
          m.push(arguments[i])
        } else {
          if (window['JSON'] == undefined) {
            m.push(arguments[i].toString());
          } else {
            m.push(JSON.stringify(arguments[i]))
          }
        }
      };
      return m.join(" : ")
    },

    arrayIndexOf: function(array, item) { // MSIE doesn't have array.indexOf
      var nativeIndexOf = Array.prototype.indexOf;
      if (array == null) return -1;
      if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);
      for (i = 0, l = array.length; i < l; i++) if (array[i] === item) return i;
      return -1;
    }
  };

  // To receive log output provide a Pusher.log function, for example
  // Pusher.log = function(m){console.log(m)}
  Pusher.debug = function() {
    if (!Pusher.log) return
    Pusher.log(Pusher.Util.stringify.apply(this, arguments))
  }
  Pusher.warn = function() {
    if (window.console && window.console.warn) {
      window.console.warn(Pusher.Util.stringify.apply(this, arguments));
    } else {
      if (!Pusher.log) return
      Pusher.log(Pusher.Util.stringify.apply(this, arguments));
    }
  };

  // Pusher defaults
  Pusher.VERSION = '1.12.2';

  Pusher.host = 'ws.pusherapp.com';
  Pusher.ws_port = 80;
  Pusher.wss_port = 443;
  Pusher.channel_auth_endpoint = '/pusher/auth';
  Pusher.cdn_http = 'http://js.pusher.com/'
  Pusher.cdn_https = 'https://d3dy5gmtp8yhk7.cloudfront.net/'
  Pusher.dependency_suffix = '.min';
  Pusher.channel_auth_transport = 'ajax';
  Pusher.activity_timeout = 120000;
  Pusher.pong_timeout = 30000;

  Pusher.isReady = false;
  Pusher.ready = function() {
    Pusher.isReady = true;
    for (var i = 0, l = Pusher.instances.length; i < l; i++) {
      Pusher.instances[i].connect();
    }
  };

  this.Pusher = Pusher;
}).call(this);

;(function() {
/* Abstract event binding
Example:

    var MyEventEmitter = function(){};
    MyEventEmitter.prototype = new Pusher.EventsDispatcher;

    var emitter = new MyEventEmitter();

    // Bind to single event
    emitter.bind('foo_event', function(data){ alert(data)} );

    // Bind to all
    emitter.bind_all(function(eventName, data){ alert(data) });

--------------------------------------------------------*/

  function CallbackRegistry() {
    this._callbacks = {};
  };

  CallbackRegistry.prototype.get = function(eventName) {
    return this._callbacks[this._prefix(eventName)];
  };

  CallbackRegistry.prototype.add = function(eventName, callback) {
    var prefixedEventName = this._prefix(eventName);
    this._callbacks[prefixedEventName] = this._callbacks[prefixedEventName] || [];
    this._callbacks[prefixedEventName].push(callback);
  };

  CallbackRegistry.prototype.remove = function(eventName, callback) {
    if(this.get(eventName)) {
      var index = Pusher.Util.arrayIndexOf(this.get(eventName), callback);
      this._callbacks[this._prefix(eventName)].splice(index, 1);
    }
  };

  CallbackRegistry.prototype._prefix = function(eventName) {
    return "_" + eventName;
  };


  function EventsDispatcher(failThrough) {
    this.callbacks = new CallbackRegistry();
    this.global_callbacks = [];
    // Run this function when dispatching an event when no callbacks defined
    this.failThrough = failThrough;
  }

  EventsDispatcher.prototype.bind = function(eventName, callback) {
    this.callbacks.add(eventName, callback);
    return this;// chainable
  };

  EventsDispatcher.prototype.unbind = function(eventName, callback) {
    this.callbacks.remove(eventName, callback);
    return this;
  };

  EventsDispatcher.prototype.emit = function(eventName, data) {
    // Global callbacks
    for (var i = 0; i < this.global_callbacks.length; i++) {
      this.global_callbacks[i](eventName, data);
    }

    // Event callbacks
    var callbacks = this.callbacks.get(eventName);
    if (callbacks) {
      for (var i = 0; i < callbacks.length; i++) {
        callbacks[i](data);
      }
    } else if (this.failThrough) {
      this.failThrough(eventName, data)
    }

    return this;
  };

  EventsDispatcher.prototype.bind_all = function(callback) {
    this.global_callbacks.push(callback);
    return this;
  };

  this.Pusher.EventsDispatcher = EventsDispatcher;
}).call(this);

;(function() {
  var Pusher = this.Pusher;

  /*-----------------------------------------------
    Helpers:
  -----------------------------------------------*/

  function capitalize(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
  }


  function safeCall(method, obj, data) {
    if (obj[method] !== undefined) {
      obj[method](data);
    }
  }

  /*-----------------------------------------------
    The State Machine
  -----------------------------------------------*/
  function Machine(initialState, transitions, stateActions) {
    Pusher.EventsDispatcher.call(this);

    this.state = undefined;
    this.errors = [];

    // functions for each state
    this.stateActions = stateActions;

    // set up the transitions
    this.transitions = transitions;

    this.transition(initialState);
  };

  Machine.prototype.transition = function(nextState, data) {
    var prevState = this.state;
    var stateCallbacks = this.stateActions;

    if (prevState && (Pusher.Util.arrayIndexOf(this.transitions[prevState], nextState) == -1)) {
      this.emit('invalid_transition_attempt', {
        oldState: prevState,
        newState: nextState
      });

      throw new Error('Invalid transition [' + prevState + ' to ' + nextState + ']');
    }

    // exit
    safeCall(prevState + 'Exit', stateCallbacks, data);

    // tween
    safeCall(prevState + 'To' + capitalize(nextState), stateCallbacks, data);

    // pre
    safeCall(nextState + 'Pre', stateCallbacks, data);

    // change state:
    this.state = nextState;

    // handy to bind to
    this.emit('state_change', {
      oldState: prevState,
      newState: nextState
    });

    // Post:
    safeCall(nextState + 'Post', stateCallbacks, data);
  };

  Machine.prototype.is = function(state) {
    return this.state === state;
  };

  Machine.prototype.isNot = function(state) {
    return this.state !== state;
  };

  Pusher.Util.extend(Machine.prototype, Pusher.EventsDispatcher.prototype);

  this.Pusher.Machine = Machine;
}).call(this);

;(function() {
  /*
    A little bauble to interface with window.navigator.onLine,
    window.ononline and window.onoffline.  Easier to mock.
  */

  var NetInfo = function() {
    var self = this;
    Pusher.EventsDispatcher.call(this);
    // This is okay, as IE doesn't support this stuff anyway.
    if (window.addEventListener !== undefined) {
      window.addEventListener("online", function() {
        self.emit('online', null);
      }, false);
      window.addEventListener("offline", function() {
        self.emit('offline', null);
      }, false);
    }
  };

  // Offline means definitely offline (no connection to router).
  // Inverse does NOT mean definitely online (only currently supported in Safari
  // and even there only means the device has a connection to the router).
  NetInfo.prototype.isOnLine = function() {
    if (window.navigator.onLine === undefined) {
      return true;
    } else {
      return window.navigator.onLine;
    }
  };

  Pusher.Util.extend(NetInfo.prototype, Pusher.EventsDispatcher.prototype);

  this.Pusher.NetInfo = NetInfo;
}).call(this);

;(function() {
  var Pusher = this.Pusher;

  var machineTransitions = {
    'initialized': ['waiting', 'failed'],
    'waiting': ['connecting', 'permanentlyClosed'],
    'connecting': ['open', 'permanentlyClosing', 'impermanentlyClosing', 'waiting'],
    'open': ['connected', 'permanentlyClosing', 'impermanentlyClosing', 'waiting'],
    'connected': ['permanentlyClosing', 'waiting'],
    'impermanentlyClosing': ['waiting', 'permanentlyClosing'],
    'permanentlyClosing': ['permanentlyClosed'],
    'permanentlyClosed': ['waiting', 'failed'],
    'failed': ['permanentlyClosed']
  };


  // Amount to add to time between connection attemtpts per failed attempt.
  var UNSUCCESSFUL_CONNECTION_ATTEMPT_ADDITIONAL_WAIT = 2000;
  var UNSUCCESSFUL_OPEN_ATTEMPT_ADDITIONAL_TIMEOUT = 2000;
  var UNSUCCESSFUL_CONNECTED_ATTEMPT_ADDITIONAL_TIMEOUT = 2000;

  var MAX_CONNECTION_ATTEMPT_WAIT = 5 * UNSUCCESSFUL_CONNECTION_ATTEMPT_ADDITIONAL_WAIT;
  var MAX_OPEN_ATTEMPT_TIMEOUT = 5 * UNSUCCESSFUL_OPEN_ATTEMPT_ADDITIONAL_TIMEOUT;
  var MAX_CONNECTED_ATTEMPT_TIMEOUT = 5 * UNSUCCESSFUL_CONNECTED_ATTEMPT_ADDITIONAL_TIMEOUT;

  function resetConnectionParameters(connection) {
    connection.connectionWait = 0;

    if (Pusher.TransportType === 'flash') {
      // Flash needs a bit more time
      connection.openTimeout = 5000;
    } else {
      connection.openTimeout = 2000;
    }
    connection.connectedTimeout = 2000;
    connection.connectionSecure = connection.compulsorySecure;
    connection.connectionAttempts = 0;
  }

  function Connection(key, options) {
    var self = this;

    Pusher.EventsDispatcher.call(this);

    this.options = Pusher.Util.extend({encrypted: false}, options);

    this.netInfo = new Pusher.NetInfo();

    this.netInfo.bind('online', function(){
      if (self._machine.is('waiting')) {
        self._machine.transition('connecting');
        updateState('connecting');
      }
    });

    this.netInfo.bind('offline', function() {
      if (self._machine.is('connected')) {
        // These are for Chrome 15, which ends up
        // having two sockets hanging around.
        self.socket.onclose = undefined;
        self.socket.onmessage = undefined;
        self.socket.onerror = undefined;
        self.socket.onopen = undefined;

        self.socket.close();
        self.socket = undefined;
        self._machine.transition('waiting');
      }
    });

    // define the state machine that runs the connection
    this._machine = new Pusher.Machine('initialized', machineTransitions, {
      initializedPre: function() {
        self.compulsorySecure = self.options.encrypted;

        self.key = key;
        self.socket = null;
        self.socket_id = null;

        self.state = 'initialized';
      },

      waitingPre: function() {
        if (self.connectionWait > 0) {
          self.emit('connecting_in', self.connectionWait);
        }

        if (self.netInfo.isOnLine() && self.connectionAttempts <= 4) {
          updateState('connecting');
        } else {
          updateState('unavailable');
        }

        // When in the unavailable state we attempt to connect, but don't
        // broadcast that fact
        if (self.netInfo.isOnLine()) {
          self._waitingTimer = setTimeout(function() {
            self._machine.transition('connecting');
          }, connectionDelay());
        }
      },

      waitingExit: function() {
        clearTimeout(self._waitingTimer);
      },

      connectingPre: function() {
        // Case that a user manages to get to the connecting
        // state even when offline.
        if (self.netInfo.isOnLine() === false) {
          self._machine.transition('waiting');
          updateState('unavailable');

          return;
        }

        var url = formatURL(self.key, self.connectionSecure);
        Pusher.debug('Connecting', url);
        self.socket = new Pusher.Transport(url);
        // now that the socket connection attempt has been started,
        // set up the callbacks fired by the socket for different outcomes
        self.socket.onopen = ws_onopen;
        self.socket.onclose = transitionToWaiting;
        self.socket.onerror = ws_onError;

        // allow time to get ws_onOpen, otherwise close socket and try again
        self._connectingTimer = setTimeout(TransitionToImpermanentlyClosing, self.openTimeout);
      },

      connectingExit: function() {
        clearTimeout(self._connectingTimer);
        self.socket.onopen = undefined; // unbind to avoid open events that are no longer relevant
      },

      connectingToWaiting: function() {
        updateConnectionParameters();

        // FUTURE: update only ssl
      },

      connectingToImpermanentlyClosing: function() {
        updateConnectionParameters();

        // FUTURE: update only timeout
      },

      openPre: function() {
        self.socket.onmessage = ws_onMessageOpen;
        self.socket.onerror = ws_onError;
        self.socket.onclose = transitionToWaiting;

        // allow time to get connected-to-Pusher message, otherwise close socket, try again
        self._openTimer = setTimeout(TransitionToImpermanentlyClosing, self.connectedTimeout);
      },

      openExit: function() {
        clearTimeout(self._openTimer);
        self.socket.onmessage = undefined; // unbind to avoid messages that are no longer relevant
      },

      openToWaiting: function() {
        updateConnectionParameters();
      },

      openToImpermanentlyClosing: function() {
        updateConnectionParameters();
      },

      connectedPre: function(socket_id) {
        self.socket_id = socket_id;

        self.socket.onmessage = ws_onMessageConnected;
        self.socket.onerror = ws_onError;
        self.socket.onclose = transitionToWaiting;

        resetConnectionParameters(self);
        self.connectedAt = new Date().getTime();

        resetActivityCheck();
      },

      connectedPost: function() {
        updateState('connected');
      },

      connectedExit: function() {
        stopActivityCheck();
        updateState('disconnected');
      },

      impermanentlyClosingPost: function() {
        if (self.socket) {
          self.socket.onclose = transitionToWaiting;
          self.socket.close();
        }
      },

      permanentlyClosingPost: function() {
        if (self.socket) {
          self.socket.onclose = function() {
            resetConnectionParameters(self);
            self._machine.transition('permanentlyClosed');
          };

          self.socket.close();
        } else {
          resetConnectionParameters(self);
          self._machine.transition('permanentlyClosed');
        }
      },

      failedPre: function() {
        updateState('failed');
        Pusher.debug('WebSockets are not available in this browser.');
      },

      permanentlyClosedPost: function() {
        updateState('disconnected');
      }
    });

    /*-----------------------------------------------
      -----------------------------------------------*/

    function updateConnectionParameters() {
      if (self.connectionWait < MAX_CONNECTION_ATTEMPT_WAIT) {
        self.connectionWait += UNSUCCESSFUL_CONNECTION_ATTEMPT_ADDITIONAL_WAIT;
      }

      if (self.openTimeout < MAX_OPEN_ATTEMPT_TIMEOUT) {
        self.openTimeout += UNSUCCESSFUL_OPEN_ATTEMPT_ADDITIONAL_TIMEOUT;
      }

      if (self.connectedTimeout < MAX_CONNECTED_ATTEMPT_TIMEOUT) {
        self.connectedTimeout += UNSUCCESSFUL_CONNECTED_ATTEMPT_ADDITIONAL_TIMEOUT;
      }

      if (self.compulsorySecure !== true) {
        self.connectionSecure = !self.connectionSecure;
      }

      self.connectionAttempts++;
    }

    function formatURL(key, isSecure) {
      var port = Pusher.ws_port;
      var protocol = 'ws://';

      // Always connect with SSL if the current page has
      // been loaded via HTTPS.
      //
      // FUTURE: Always connect using SSL.
      //
      if (isSecure || document.location.protocol === 'https:') {
        port = Pusher.wss_port;
        protocol = 'wss://';
      }

      var flash = (Pusher.TransportType === "flash") ? "true" : "false";

      return protocol + Pusher.host + ':' + port + '/app/' + key + '?protocol=5&client=js'
        + '&version=' + Pusher.VERSION
        + '&flash=' + flash;
    }

    // callback for close and retry.  Used on timeouts.
    function TransitionToImpermanentlyClosing() {
      self._machine.transition('impermanentlyClosing');
    }

    function resetActivityCheck() {
      if (self._activityTimer) { clearTimeout(self._activityTimer); }
      // Send ping after inactivity
      self._activityTimer = setTimeout(function() {
        self.send_event('pusher:ping', {})
        // Wait for pong response
        self._activityTimer = setTimeout(function() {
          self.socket.close();
        }, (self.options.pong_timeout || Pusher.pong_timeout))
      }, (self.options.activity_timeout || Pusher.activity_timeout))
    }

    function stopActivityCheck() {
      if (self._activityTimer) { clearTimeout(self._activityTimer); }
    }

    // Returns the delay before the next connection attempt should be made
    //
    // This function guards against attempting to connect more frequently than
    // once every second
    //
    function connectionDelay() {
      var delay = self.connectionWait;
      if (delay === 0) {
        if (self.connectedAt) {
          var t = 1000;
          var connectedFor = new Date().getTime() - self.connectedAt;
          if (connectedFor < t) {
            delay = t - connectedFor;
          }
        }
      }
      return delay;
    }

    /*-----------------------------------------------
      WebSocket Callbacks
      -----------------------------------------------*/

    // no-op, as we only care when we get pusher:connection_established
    function ws_onopen() {
      self._machine.transition('open');
    };

    function handleCloseCode(code, message) {
      // first inform the end-developer of this error
      self.emit('error', {type: 'PusherError', data: {code: code, message: message}});

      if (code === 4000) {
        // SSL only app
        self.compulsorySecure = true;
        self.connectionSecure = true;
        self.options.encrypted = true;

        TransitionToImpermanentlyClosing();
      } else if (code < 4100) {
        // Permentently close connection
        self._machine.transition('permanentlyClosing')
      } else if (code < 4200) {
        // Backoff before reconnecting
        self.connectionWait = 1000;
        self._machine.transition('waiting')
      } else if (code < 4300) {
        // Reconnect immediately
        TransitionToImpermanentlyClosing();
      } else {
        // Unknown error
        self._machine.transition('permanentlyClosing')
      }
    }

    function ws_onMessageOpen(event) {
      var params = parseWebSocketEvent(event);
      if (params !== undefined) {
        if (params.event === 'pusher:connection_established') {
          self._machine.transition('connected', params.data.socket_id);
        } else if (params.event === 'pusher:error') {
          handleCloseCode(params.data.code, params.data.message)
        }
      }
    }

    function ws_onMessageConnected(event) {
      resetActivityCheck();

      var params = parseWebSocketEvent(event);
      if (params !== undefined) {
        Pusher.debug('Event recd', params);

        switch (params.event) {
          case 'pusher:error':
            self.emit('error', {type: 'PusherError', data: params.data});
            break;
          case 'pusher:ping':
            self.send_event('pusher:pong', {})
            break;
        }

        self.emit('message', params);
      }
    }


    /**
     * Parses an event from the WebSocket to get
     * the JSON payload that we require
     *
     * @param {MessageEvent} event  The event from the WebSocket.onmessage handler.
    **/
    function parseWebSocketEvent(event) {
      try {
        var params = JSON.parse(event.data);

        if (typeof params.data === 'string') {
          try {
            params.data = JSON.parse(params.data);
          } catch (e) {
            if (!(e instanceof SyntaxError)) {
              throw e;
            }
          }
        }

        return params;
      } catch (e) {
        self.emit('error', {type: 'MessageParseError', error: e, data: event.data});
      }
    }

    function transitionToWaiting() {
      self._machine.transition('waiting');
    }

    function ws_onError(error) {
      // just emit error to user - socket will already be closed by browser
      self.emit('error', { type: 'WebSocketError', error: error });
    }

    // Updates the public state information exposed by connection
    //
    // This is distinct from the internal state information used by _machine
    // to manage the connection
    //
    function updateState(newState, data) {
      var prevState = self.state;
      self.state = newState;

      // Only emit when the state changes
      if (prevState !== newState) {
        Pusher.debug('State changed', prevState + ' -> ' + newState);
        self.emit('state_change', {previous: prevState, current: newState});
        self.emit(newState, data);
      }
    }
  };

  Connection.prototype.connect = function() {
    // no WebSockets
    if (!this._machine.is('failed') && !Pusher.Transport) {
      this._machine.transition('failed');
    }
    // initial open of connection
    else if(this._machine.is('initialized')) {
      resetConnectionParameters(this);
      this._machine.transition('waiting');
    }
    // user skipping connection wait
    else if (this._machine.is('waiting') && this.netInfo.isOnLine() === true) {
      this._machine.transition('connecting');
    }
    // user re-opening connection after closing it
    else if(this._machine.is("permanentlyClosed")) {
      resetConnectionParameters(this);
      this._machine.transition('waiting');
    }
  };

  Connection.prototype.send = function(data) {
    if (this._machine.is('connected')) {
      // Workaround for MobileSafari bug (see https://gist.github.com/2052006)
      var self = this;
      setTimeout(function() {
        self.socket.send(data);
      }, 0);
      return true;
    } else {
      return false;
    }
  };

  Connection.prototype.send_event = function(event_name, data, channel) {
    var payload = {
      event: event_name,
      data: data
    };
    if (channel) payload['channel'] = channel;

    Pusher.debug('Event sent', payload);
    return this.send(JSON.stringify(payload));
  }

  Connection.prototype.disconnect = function() {
    if (this._machine.is('permanentlyClosed')) return;

    if (this._machine.is('waiting') || this._machine.is('failed')) {
      this._machine.transition('permanentlyClosed');
    } else {
      this._machine.transition('permanentlyClosing');
    }
  };

  Pusher.Util.extend(Connection.prototype, Pusher.EventsDispatcher.prototype);
  this.Pusher.Connection = Connection;
}).call(this);

;(function() {
  Pusher.Channels = function() {
    this.channels = {};
  };

  Pusher.Channels.prototype = {
    add: function(channel_name, pusher) {
      var existing_channel = this.find(channel_name);
      if (!existing_channel) {
        var channel = Pusher.Channel.factory(channel_name, pusher);
        this.channels[channel_name] = channel;
        return channel;
      } else {
        return existing_channel;
      }
    },

    find: function(channel_name) {
      return this.channels[channel_name];
    },

    remove: function(channel_name) {
      delete this.channels[channel_name];
    },

    disconnect: function () {
      for(var channel_name in this.channels){
        this.channels[channel_name].disconnect()
      }
    }
  };

  Pusher.Channel = function(channel_name, pusher) {
    var self = this;
    Pusher.EventsDispatcher.call(this, function(event_name, event_data) {
      Pusher.debug('No callbacks on ' + channel_name + ' for ' + event_name);
    });

    this.pusher = pusher;
    this.name = channel_name;
    this.subscribed = false;

    this.bind('pusher_internal:subscription_succeeded', function(data) {
      self.onSubscriptionSucceeded(data);
    });
  };

  Pusher.Channel.prototype = {
    // inheritable constructor
    init: function() {},
    disconnect: function() {
      this.subscribed = false;
      this.emit("pusher_internal:disconnected");
    },

    onSubscriptionSucceeded: function(data) {
      this.subscribed = true;
      this.emit('pusher:subscription_succeeded');
    },

    authorize: function(socketId, options, callback){
      return callback(false, {}); // normal channels don't require auth
    },

    trigger: function(event, data) {
      return this.pusher.send_event(event, data, this.name);
    }
  };

  Pusher.Util.extend(Pusher.Channel.prototype, Pusher.EventsDispatcher.prototype);

  Pusher.Channel.PrivateChannel = {
    authorize: function(socketId, options, callback){
      var self = this;
      var authorizer = new Pusher.Channel.Authorizer(this, Pusher.channel_auth_transport, options);
      return authorizer.authorize(socketId, function(err, authData) {
        if(!err) {
          self.emit('pusher_internal:authorized', authData);
        }

        callback(err, authData);
      });
    }
  };

  Pusher.Channel.PresenceChannel = {
    init: function(){
      this.members = new Members(this); // leeches off channel events
    },

    onSubscriptionSucceeded: function(data) {
      this.subscribed = true;
      // We override this because we want the Members obj to be responsible for
      // emitting the pusher:subscription_succeeded.  It will do this after it has done its work.
    }
  };

  var Members = function(channel) {
    var self = this;

    var reset = function() {
      this._members_map = {};
      this.count = 0;
      this.me = null;
    };
    reset.call(this);

    channel.bind('pusher_internal:authorized', function(authorizedData) {
      var channelData = JSON.parse(authorizedData.channel_data);
      channel.bind("pusher_internal:subscription_succeeded", function(subscriptionData) {
        self._members_map = subscriptionData.presence.hash;
        self.count = subscriptionData.presence.count;
        self.me = self.get(channelData.user_id);
        channel.emit('pusher:subscription_succeeded', self);
      });
    });

    channel.bind('pusher_internal:member_added', function(data) {
      if(self.get(data.user_id) === null) { // only incr if user_id does not already exist
        self.count++;
      }

      self._members_map[data.user_id] = data.user_info;
      channel.emit('pusher:member_added', self.get(data.user_id));
    });

    channel.bind('pusher_internal:member_removed', function(data) {
      var member = self.get(data.user_id);
      if(member) {
        delete self._members_map[data.user_id];
        self.count--;
        channel.emit('pusher:member_removed', member);
      }
    });

    channel.bind('pusher_internal:disconnected', function() {
      reset.call(self);
    });
  };

  Members.prototype = {
    each: function(callback) {
      for(var i in this._members_map) {
        callback(this.get(i));
      }
    },

    get: function(user_id) {
      if (this._members_map.hasOwnProperty(user_id)) { // have heard of this user user_id
        return {
          id: user_id,
          info: this._members_map[user_id]
        }
      } else { // have never heard of this user
        return null;
      }
    }
  };

  Pusher.Channel.factory = function(channel_name, pusher){
    var channel = new Pusher.Channel(channel_name, pusher);
    if (channel_name.indexOf('private-') === 0) {
      Pusher.Util.extend(channel, Pusher.Channel.PrivateChannel);
    } else if (channel_name.indexOf('presence-') === 0) {
      Pusher.Util.extend(channel, Pusher.Channel.PrivateChannel);
      Pusher.Util.extend(channel, Pusher.Channel.PresenceChannel);
    };
    channel.init();
    return channel;
  };
}).call(this);
;(function() {
  Pusher.Channel.Authorizer = function(channel, type, options) {
    this.channel = channel;
    this.type = type;

    this.authOptions = (options || {}).auth || {};
  };

  Pusher.Channel.Authorizer.prototype = {
    composeQuery: function(socketId) {
      var query = '&socket_id=' + encodeURIComponent(socketId)
        + '&channel_name=' + encodeURIComponent(this.channel.name);

      for(var i in this.authOptions.params) {
        query += "&" + encodeURIComponent(i) + "=" + encodeURIComponent(this.authOptions.params[i]);
      }

      return query;
    },

    authorize: function(socketId, callback) {
      return Pusher.authorizers[this.type].call(this, socketId, callback);
    }
  };


  Pusher.auth_callbacks = {};
  Pusher.authorizers = {
    ajax: function(socketId, callback){
      var self = this, xhr;

      if (Pusher.XHR) {
        xhr = new Pusher.XHR();
      } else {
        xhr = (window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP"));
      }

      xhr.open("POST", Pusher.channel_auth_endpoint, true);

      // add request headers
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
      for(var headerName in this.authOptions.headers) {
        xhr.setRequestHeader(headerName, this.authOptions.headers[headerName]);
      }

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            var data, parsed = false;

            try {
              data = JSON.parse(xhr.responseText);
              parsed = true;
            } catch (e) {
              callback(true, 'JSON returned from webapp was invalid, yet status code was 200. Data was: ' + xhr.responseText);
            }

            if (parsed) { // prevents double execution.
              callback(false, data);
            }
          } else {
            Pusher.warn("Couldn't get auth info from your webapp", xhr.status);
            callback(true, xhr.status);
          }
        }
      };

      xhr.send(this.composeQuery(socketId));
      return xhr;
    },

    jsonp: function(socketId, callback){
      if(this.authOptions.headers !== undefined) {
        Pusher.warn("Warn", "To send headers with the auth request, you must use AJAX, rather than JSONP.");
      }

      var script = document.createElement("script");
      // Hacked wrapper.
      Pusher.auth_callbacks[this.channel.name] = function(data) {
        callback(false, data);
      };

      var callback_name = "Pusher.auth_callbacks['" + this.channel.name + "']";
      script.src = Pusher.channel_auth_endpoint
        + '?callback='
        + encodeURIComponent(callback_name)
        + this.composeQuery(socketId);

      var head = document.getElementsByTagName("head")[0] || document.documentElement;
      head.insertBefore( script, head.firstChild );
    }
  };
}).call(this);
// _require(dependencies, callback) takes an array of dependency urls and a
// callback to call when all the dependecies have finished loading
var _require = (function() {
  function handleScriptLoaded(elem, callback) {
    if (document.addEventListener) {
      elem.addEventListener('load', callback, false);
    } else {
      elem.attachEvent('onreadystatechange', function () {
        if (elem.readyState == 'loaded' || elem.readyState == 'complete') {
          callback();
        }
      });
    }
  }

  function addScript(src, callback) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.setAttribute('src', src);
    script.setAttribute("type","text/javascript");
    script.setAttribute('async', true);

    handleScriptLoaded(script, function() {
      callback();
    });

    head.appendChild(script);
  }

  return function(deps, callback) {
    var deps_loaded = 0;
    for (var i = 0; i < deps.length; i++) {
      addScript(deps[i], function() {
        if (deps.length == ++deps_loaded) {
          // This setTimeout is a workaround for an Opera issue
          setTimeout(callback, 0);
        }
      });
    }
  }
})();

;(function() {
  // Support Firefox versions which prefix WebSocket
  if (!window['WebSocket'] && window['MozWebSocket']) {
    window['WebSocket'] = window['MozWebSocket']
  }

  if (window['WebSocket']) {
    Pusher.Transport = window['WebSocket'];
    Pusher.TransportType = 'native';
  }

  var cdn = (document.location.protocol == 'http:') ? Pusher.cdn_http : Pusher.cdn_https;
  var root = cdn + Pusher.VERSION;
  var deps = [];

  if (!window['JSON']) {
    deps.push(root + '/json2' + Pusher.dependency_suffix + '.js');
  }
  if (!window['WebSocket']) {
    // We manually initialize web-socket-js to iron out cross browser issues
    window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = true;
    deps.push(root + '/flashfallback' + Pusher.dependency_suffix + '.js');
  }

  var initialize = function() {
    if (window['WebSocket']) {
      // Initialize function in the case that we have native WebSocket support
      return function() {
        Pusher.ready();
      }
    } else {
      // Initialize function for fallback case
      return function() {
        if (window['WebSocket']) {
          // window['WebSocket'] is a flash emulation of WebSocket
          Pusher.Transport = window['WebSocket'];
          Pusher.TransportType = 'flash';

          // window.WEB_SOCKET_SWF_LOCATION = root + "/WebSocketMain.swf";
          window.WEB_SOCKET_SWF_LOCATION = "https://s3.amazonaws.com/uploadcare-static/WebSocketMainInsecure.swf"
          WebSocket.__addTask(function() {
            Pusher.ready();
          })
          WebSocket.__initialize();
        } else {
          // Flash must not be installed
          Pusher.Transport = null;
          Pusher.TransportType = 'none';
          Pusher.ready();
        }
      }
    }
  }();

  // Allows calling a function when the document body is available
  var ondocumentbody = function(callback) {
    var load_body = function() {
      document.body ? callback() : setTimeout(load_body, 0);
    }
    load_body();
  };

  var initializeOnDocumentBody = function() {
    ondocumentbody(initialize);
  }

  if (deps.length > 0) {
    _require(deps, initializeOnDocumentBody);
  } else {
    initializeOnDocumentBody();
  }
})();

(function() {



}).call(this);
(function() {
  var __slice = [].slice;

  uploadcare.debug = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return uploadcare.jQuery(uploadcare).trigger('log.uploadcare', [args]);
  };

}).call(this);
(function() {

  uploadcare.namespace('uploadcare.utils.abilities', function(ns) {
    ns.canFileAPI = !!window.FileList;
    ns.dragAndDrop = (function() {
      var el;
      el = document.createElement("div");
      return ("draggable" in el) || ("ondragstart" in el && "ondrop" in el);
    })();
    return ns.fileDragAndDrop = ns.canFileAPI && ns.dragAndDrop;
  });

}).call(this);
(function() {
  var debug;

  debug = uploadcare.debug;

  uploadcare.namespace('uploadcare.utils.pusher', function(ns) {
    var hasOwners, pusherInstance, pusherWrapped, pushers, releasePusher, updateConnection;
    pushers = {};
    ns.getPusher = function(key, owner) {
      if (!(key in pushers)) {
        pushers[key] = {
          instance: null,
          owners: {}
        };
      }
      if (!pushers[key].owners[owner]) {
        pushers[key].owners[owner] = true;
      }
      updateConnection(key);
      return pusherWrapped(key, owner);
    };
    releasePusher = function(key, owner) {
      debug('releasing', owner);
      if (!pushers[key].owners[owner]) {
        debug('this pusher has already been released');
        return;
      }
      pushers[key].owners[owner] = false;
      return updateConnection(key);
    };
    hasOwners = function(key) {
      var owner;
      return ((function() {
        var _results;
        _results = [];
        for (owner in pushers[key].owners) {
          if (pushers[key].owners[owner]) {
            _results.push(owner);
          }
        }
        return _results;
      })()).length > 0;
    };
    updateConnection = function(key) {
      var instance;
      instance = pusherInstance(key);
      if (hasOwners(key)) {
        return instance.connect();
      } else {
        debug('disconnect timeout started', key);
        return setTimeout((function() {
          if (hasOwners(key)) {
            return debug('not disconnecting in the end');
          } else {
            debug('actual disconnect', key);
            return instance.disconnect();
          }
        }), 5000);
      }
    };
    pusherInstance = function(key) {
      var _ref;
      if (((_ref = pushers[key]) != null ? _ref.instance : void 0) != null) {
        return pushers[key].instance;
      }
      debug('new actual Pusher');
      return pushers[key].instance = new Pusher(key);
    };
    return pusherWrapped = function(key, owner) {
      var Wrapped;
      Wrapped = function() {
        this.owner = owner;
        this.release = function() {
          return releasePusher(key, owner);
        };
        return this;
      };
      Wrapped.prototype = pusherInstance(key);
      return new Wrapped();
    };
  });

}).call(this);
(function() {
  var $, debug, pusher;

  $ = uploadcare.jQuery, debug = uploadcare.debug;

  pusher = uploadcare.utils.pusher;

  uploadcare.namespace('uploadcare.utils.pubsub', function(ns) {
    var PollWatcher, PusherWatcher;
    ns.PubSub = (function() {

      function PubSub(settings, channel, topic) {
        this.settings = settings;
        this.channel = channel;
        this.topic = topic;
        this.pollUrlConstructor = function(channel, topic) {
          return "" + this.settings.socialBase + "/pubsub/status/" + this.channel + "/" + this.topic;
        };
        this.pusherw = new PusherWatcher(this, this.settings.pusherKey);
        this.pollw = new PollWatcher(this);
      }

      PubSub.prototype.watch = function() {
        var _this = this;
        this.pusherw.watch();
        this.pollw.watch();
        return $(this.pusherw).on('started', function() {
          return _this.pollw.stop();
        });
      };

      PubSub.prototype.stop = function() {
        this.pusherw.stop();
        return this.pollw.stop();
      };

      PubSub.prototype.__update = function(status) {
        if (!this.status || this.status.score < status.score) {
          this.status = status;
          return this.__notify();
        }
      };

      PubSub.prototype.__notify = function() {
        debug('status', this.status.score, this.status.state, this.status);
        return $(this).trigger(this.status.state, [this.status]);
      };

      return PubSub;

    })();
    PusherWatcher = (function() {

      function PusherWatcher(ps, pusherKey) {
        this.ps = ps;
        this.pusher = pusher.getPusher(pusherKey, this.__channelName());
      }

      PusherWatcher.prototype.__channelName = function() {
        return "pubsub.channel." + this.ps.channel + "." + this.ps.topic;
      };

      PusherWatcher.prototype.watch = function() {
        var onStarted,
          _this = this;
        this.channel = this.pusher.subscribe(this.__channelName());
        this.channel.bind('event', function(data) {
          return _this.ps.__update($.parseJSON(data));
        });
        onStarted = function() {
          debug('wow, listening with pusher');
          $(_this).trigger('started');
          return _this.channel.unbind('event', onStarted);
        };
        return this.channel.bind('event', onStarted);
      };

      PusherWatcher.prototype.stop = function() {
        if (this.pusher) {
          this.pusher.release();
        }
        return this.pusher = null;
      };

      return PusherWatcher;

    })();
    return PollWatcher = (function() {

      function PollWatcher(ps) {
        this.ps = ps;
      }

      PollWatcher.prototype.watch = function() {
        var _this = this;
        return this.interval = setInterval((function() {
          return _this.__checkStatus();
        }), 2000);
      };

      PollWatcher.prototype.stop = function() {
        if (this.interval) {
          clearInterval(this.interval);
        }
        return this.interval = null;
      };

      PollWatcher.prototype.__checkStatus = function() {
        var fail,
          _this = this;
        debug('polling status...');
        fail = function() {
          return _this.ps.__update({
            score: -1,
            state: 'error'
          });
        };
        return $.ajax(this.ps.pollUrlConstructor(this.ps.channel, this.ps.topic), {
          dataType: 'jsonp'
        }).fail(fail).done(function(data) {
          if (data.error) {
            return fail();
          }
          return _this.ps.__update(data);
        });
      };

      return PollWatcher;

    })();
  });

}).call(this);
(function() {
  var $, namespace;

  namespace = uploadcare.namespace, $ = uploadcare.jQuery;

  namespace('uploadcare.utils', function(ns) {
    ns.defer = function(fn) {
      return setTimeout(fn, 0);
    };
    ns.once = function(fn) {
      var called, result;
      called = false;
      result = null;
      return function() {
        if (!called) {
          result = fn.apply(this, arguments);
          called = true;
        }
        return result;
      };
    };
    ns.bindAll = function(source, methods) {
      var method, target, _fn, _i, _len;
      target = {};
      _fn = function(method) {
        var fn;
        fn = source[method];
        return target[method] = !$.isFunction(fn) ? fn : function() {
          var result;
          result = fn.apply(source, arguments);
          if (result === source) {
            return target;
          } else {
            return result;
          }
        };
      };
      for (_i = 0, _len = methods.length; _i < _len; _i++) {
        method = methods[_i];
        _fn(method);
      }
      return target;
    };
    ns.publicCallbacks = function(callbacks) {
      var result;
      result = callbacks.add;
      result.add = callbacks.add;
      result.remove = callbacks.remove;
      return result;
    };
    ns.uuid = function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r, v;
        r = Math.random() * 16 | 0;
        v = c === 'x' ? r : r & 3 | 8;
        return v.toString(16);
      });
    };
    ns.uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i;
    ns.fullUuidRegex = new RegExp("^" + ns.uuidRegex.source + "$", 'i');
    ns.cdnUrlModifiersRegex = /(?:-\/(?:[a-z0-9_,]+\/)+)+/i;
    ns.normalizeUrl = function(url) {
      if (!url.match(/^([a-z][a-z0-9+\-\.]*:)?\/\//i)) {
        url = "https://" + url;
      }
      return url.replace(/\/+$/, '');
    };
    ns.buildSettings = function(settings) {
      var crop, key, ratio, size, value, _i, _j, _len, _len1, _ref, _ref1;
      settings = $.extend({}, uploadcare.defaults, settings || {});
      if ($.type(settings.tabs) === "string") {
        settings.tabs = settings.tabs.split(' ');
      }
      settings.tabs = settings.tabs || [];
      _ref = ['urlBase', 'socialBase', 'cdnBase'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        settings[key] = ns.normalizeUrl(settings[key]);
      }
      _ref1 = ['previewStep', 'multiple', 'imagesOnly', 'pathValue'];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        key = _ref1[_j];
        if (typeof settings[key] === 'string') {
          value = $.trim(settings[key]).toLowerCase();
          settings[key] = !(value === 'false' || value === 'disabled');
        } else {
          settings[key] = !!settings[key];
        }
      }
      if (settings.multiple) {
        console.log('Sorry, the multiupload is not working now');
        settings.multiple = false;
      }
      if (settings.multiple) {
        settings.crop = 'disabled';
      }
      settings.__cropParsed = {
        enabled: true,
        scale: false,
        upscale: false,
        preferedSize: null
      };
      crop = '' + settings.crop;
      if (crop.match(/(disabled|false)/i)) {
        crop = 'disabled';
        settings.__cropParsed.enabled = false;
      } else if (ratio = crop.match(/[0-9]+\:[0-9]+/)) {
        crop = ratio[0];
        settings.__cropParsed.preferedSize = ratio[0].replace(':', 'x');
      } else if (size = crop.match(/[0-9]+x[0-9]+/i)) {
        settings.__cropParsed.preferedSize = size[0];
        settings.__cropParsed.scale = true;
        if (crop.match(/upscale/i)) {
          crop = size[0] + ' upscale';
          settings.__cropParsed.upscale = true;
        } else {
          crop = size[0];
        }
      } else {
        crop = '';
      }
      settings.crop = crop;
      if (settings.__cropParsed.enabled || settings.multiple) {
        settings.previewStep = true;
      }
      return settings;
    };
    ns.fitText = function(text, max) {
      var head, tail;
      if (text.length > max) {
        head = Math.ceil((max - 3) / 2);
        tail = Math.floor((max - 3) / 2);
        return text.slice(0, head) + '...' + text.slice(-tail);
      } else {
        return text;
      }
    };
    ns.fileInput = function(container, multiple, fn) {
      var input;
      container.find('input:file').remove();
      input = multiple ? $('<input type="file" multiple>') : $('<input type="file">');
      input.on('change', fn).css({
        position: 'absolute',
        top: 0,
        opacity: 0,
        margin: 0,
        padding: 0,
        width: 'auto',
        height: 'auto',
        cursor: container.css('cursor')
      });
      container.css({
        position: 'relative',
        overflow: 'hidden'
      }).append(input);
      return container.mousemove(function(e) {
        var left, top, width, _ref;
        _ref = $(this).offset(), left = _ref.left, top = _ref.top;
        width = input.width();
        return input.css({
          left: e.pageX - left - width + 10,
          top: e.pageY - top - 10
        });
      });
    };
    ns.parseUrl = function(url) {
      var a;
      a = document.createElement('a');
      a.href = url;
      return a;
    };
    return ns.createObjectUrl = function(object) {
      var URL;
      URL = window.URL || window.webkitURL;
      if (URL) {
        return URL.createObjectURL(object);
      }
      return null;
    };
  });

}).call(this);
(function() {

  uploadcare.defaults = {
    locale: window.UPLOADCARE_LOCALE,
    translations: window.UPLOADCARE_LOCALE_TRANSLATIONS,
    pluralize: window.UPLOADCARE_LOCALE_PLURALIZE,
    publicKey: window.UPLOADCARE_PUBLIC_KEY || void 0,
    pusherKey: window.UPLOADCARE_PUSHER_KEY || '79ae88bd931ea68464d9',
    urlBase: window.UPLOADCARE_URL_BASE || 'https://upload.uploadcare.com',
    socialBase: window.UPLOADCARE_SOCIAL_BASE || 'https://social.uploadcare.com',
    cdnBase: window.UPLOADCARE_CDN_BASE || 'https://ucarecdn.com',
    live: window.UPLOADCARE_LIVE != null ? window.UPLOADCARE_LIVE : true,
    tabs: window.UPLOADCARE_TABS || 'file url facebook dropbox gdrive instagram',
    crop: window.UPLOADCARE_CROP != null ? window.UPLOADCARE_CROP : 'disabled',
    multiple: !!window.UPLOADCARE_MULTIPLE,
    previewStep: !!window.UPLOADCARE_PREVIEW_STEP,
    imagesOnly: !!window.UPLOADCARE_IMAGES_ONLY,
    pathValue: !!window.UPLOADCARE_PATH_VALUE
  };

}).call(this);
(function() {

  uploadcare.namespace('uploadcare.locale.translations', function(ns) {
    return ns.en = {
      ready: 'Upload from',
      uploading: 'Uploading... Please wait.',
      loadingInfo: 'Loading info...',
      errors: {
        "default": 'Error',
        baddata: 'Incorrect value',
        size: 'Too big',
        upload: 'Can\'t upload',
        user: 'Upload canceled',
        info: 'Can\'t load info',
        image: 'Only images allowed'
      },
      draghere: 'Drop the file here',
      file: {
        one: '1 file',
        other: '%1 files'
      },
      buttons: {
        cancel: 'Cancel',
        remove: 'Remove',
        file: 'Computer'
      },
      dialog: {
        tabs: {
          file: {
            drag: 'Drop a file here',
            nodrop: 'Upload files from your computer',
            or: 'or',
            button: 'Choose a file from computer',
            also: 'You can also choose it from',
            tabNames: {
              facebook: 'Facebook',
              dropbox: 'Dropbox',
              gdrive: 'Google Drive',
              instagram: 'Instagram',
              url: 'Arbitrary Links'
            }
          },
          url: {
            title: 'Files from the Web',
            line1: 'Grab any file off the web.',
            line2: 'Just provide the link.',
            input: 'Paste your link here...',
            button: 'Upload'
          },
          preview: {
            unknownName: 'unknown',
            change: 'Cancel',
            back: 'Back',
            done: 'Upload',
            unknown: {
              title: 'Uploading. Please wait for a preview.',
              done: 'Skip preview and accept'
            },
            regular: {
              title: 'Upload this file?',
              line1: 'You are about to upload the file above.',
              line2: 'Please confirm.'
            },
            image: {
              title: 'Upload this image?',
              change: 'Cancel'
            },
            crop: {
              title: 'Crop and upload this image'
            },
            error: {
              "default": {
                title: 'Uploading failed',
                line1: 'Something went wrong during the upload.',
                line2: 'Please try again.'
              },
              image: {
                title: 'Images only',
                line1: 'Only image files are accepted.',
                line2: 'Please try again with another file.'
              },
              size: {
                title: 'Size limit',
                line1: 'The file you selected exceeds the 100 MB limit.',
                line2: 'Please try again with another file.'
              }
            }
          }
        },
        footer: {
          text: 'Uploading, storing and processing files by',
          link: 'Uploadcare.com'
        }
      },
      crop: {
        error: {
          title: 'Error',
          text: 'Can\'t load image'
        },
        done: 'Done'
      }
    };
  });

  uploadcare.namespace('uploadcare.locale.pluralize', function(ns) {
    return ns.en = function(n) {
      if (n === 1) {
        return 'one';
      }
      return 'other';
    };
  });

}).call(this);
(function() {

  uploadcare.namespace('uploadcare.locale.translations', function(ns) {
    return ns.es = {
      ready: 'Subir desde',
      uploading: 'Subiendo... Por favor espere.',
      loadingInfo: 'Cargando Información...',
      errors: {
        "default": 'Error',
        baddata: 'Valor incorrecto',
        size: 'Demasiado grande',
        upload: 'No se ha podido subir',
        user: 'Subida cancelada',
        info: 'No se pudo cargar la información',
        image: 'Sólo se permiten imagenes'
      },
      draghere: 'Arrastra los archivos hasta aquí',
      file: {
        one: '1 archivo',
        other: '%1 archivos'
      },
      buttons: {
        cancel: 'Cancelar',
        remove: 'Eliminar',
        file: 'Computadora'
      },
      dialog: {
        tabs: {
          file: {
            drag: 'Arrastra una archivo aquí',
            nodrop: 'Sube fotos desde tu computadora',
            or: 'o',
            button: 'Elige un archivo desde tu computadora',
            also: 'Tambien puedes seleccionarlo de',
            tabNames: {
              facebook: 'Facebook',
              dropbox: 'Dropbox',
              gdrive: 'Google Drive',
              instagram: 'Instagram',
              url: 'Una dirección cualquiera'
            }
          },
          url: {
            title: 'Archivos de la web',
            line1: 'Selecciona cualquier archivo de la web.',
            line2: 'Sólo danos el link.',
            input: 'Copia tu link aquí...',
            button: 'Subir'
          },
          preview: {
            unknownName: 'desconocido',
            change: 'Cancelar',
            back: 'Atras',
            done: 'Subir',
            unknown: {
              title: 'Subiendo. Por favor espera para una vista previa.',
              done: 'Saltar vista previa y aceptar'
            },
            regular: {
              title: '¿Quieres subir este archivo?',
              line1: 'Estás por subir el archivo de arriba.',
              line2: 'Confirma por favor.'
            },
            image: {
              title: '¿Quieres subir esta imagen?',
              change: 'Cancelar'
            },
            crop: {
              title: 'Cortar y subir esta imagen'
            },
            error: {
              "default": {
                title: 'La subida falló',
                line1: 'Algo salio mal durante la subida.',
                line2: 'Por favor, trata de nuevo.'
              },
              image: {
                title: 'Sólo imagenes',
                line1: 'Sólo se aceptan archivos de imagenes.',
                line2: 'Por favor, trata de nuevo con otro archivo.'
              },
              size: {
                title: 'Límite de tamaño',
                line1: 'El archivo que has seleccinado sobrepasa el límite de los 100MB.',
                line2: 'Por favor trata de nuevo con otro archivo.'
              }
            }
          }
        },
        footer: {
          text: 'Los archivos ha sido subidos, gestionados y procesados por',
          link: 'Uploadcare.com'
        }
      },
      crop: {
        error: {
          title: 'Error',
          text: 'No se pudo cargar la imangen'
        },
        done: 'Listo'
      }
    };
  });

  uploadcare.namespace('uploadcare.locale.pluralize', function(ns) {
    return ns.es = function(n) {
      if (n === 1) {
        return 'one';
      }
      return 'other';
    };
  });

}).call(this);
(function() {

  uploadcare.namespace('uploadcare.locale.translations', function(ns) {
    return ns.lv = {
      ready: 'Izvēlieties failu',
      uploading: 'Augšupielādē... Lūdzu, gaidiet.',
      errors: {
        "default": 'Kļūda',
        image: 'Atļauti tikai attēli'
      },
      draghere: 'Velciet failus šeit',
      file: {
        zero: '0 failu',
        one: '1 fails',
        other: '%1 faili'
      },
      buttons: {
        cancel: 'Atcelt',
        remove: 'Dzēst',
        file: 'Dators'
      },
      dialog: {
        title: 'Ielādēt jebko no jebkurienes',
        poweredby: 'Darbināts ar',
        support: {
          images: 'Attēli',
          audio: 'Audio',
          video: 'Video',
          documents: 'Dokumenti'
        },
        tabs: {
          file: {
            title: 'Mans dators',
            line1: 'Paņemiet jebkuru failu no jūsu datora.',
            line2: 'Izvēlēties ar dialogu vai ievelciet iekšā.',
            button: 'Meklēt failus'
          },
          url: {
            title: 'Faili no tīmekļa',
            line1: 'Paņemiet jebkuru failu no tīmekļa.',
            line2: 'Tikai uzrādiet linku.',
            input: 'Ielīmējiet linku šeit...',
            button: 'Ielādēt'
          }
        }
      }
    };
  });

  uploadcare.namespace('uploadcare.locale.pluralize', function(ns) {
    return ns.lv = function(n) {
      if (n === 0) {
        return 'zero';
      }
      if ((n % 10 === 1) && (n % 100 !== 11)) {
        return 'one';
      }
      return 'other';
    };
  });

}).call(this);
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  uploadcare.namespace('uploadcare.locale.translations', function(ns) {
    return ns.pl = {
      ready: 'Prześlij z',
      uploading: 'Przesyłanie... Proszę czekać.',
      errors: {
        "default": 'Błąd'
      },
      draghere: 'Upuść plik tutaj',
      buttons: {
        cancel: 'Anuluj',
        remove: 'Usuń',
        file: 'Komputer'
      },
      dialog: {
        tabs: {
          file: {
            title: 'Mój komputer'
          },
          url: {
            title: 'Pliki z sieci'
          }
        }
      }
    };
  });

  uploadcare.namespace('uploadcare.locale.pluralize', function(ns) {
    return ns.pl = function(n) {
      var _ref, _ref1, _ref2, _ref3;
      if (n === 1) {
        return 'one';
      }
      if ((_ref = n % 10, __indexOf.call([2, 3, 4], _ref) >= 0) && (_ref1 = n % 100, __indexOf.call([12, 13, 14], _ref1) < 0)) {
        return 'few';
      }
      if ((n !== 1) && ((_ref2 = n % 10, __indexOf.call([2, 3, 4], _ref2) < 0) || (_ref3 = n % 100, __indexOf.call([12, 13, 14], _ref3) >= 0))) {
        return 'many';
      }
      return 'other';
    };
  });

}).call(this);
(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  uploadcare.namespace('uploadcare.locale.translations', function(ns) {
    return ns.ru = {
      ready: 'Выберите файл',
      uploading: 'Идет загрузка',
      loadingInfo: 'Загрузка информации...',
      errors: {
        "default": 'Ошибка',
        baddata: 'Некорректные данные',
        size: 'Слишком большой файл',
        upload: 'Ошибка при загрузке',
        user: 'Загрузка прервана',
        info: 'Ошибка при загрузке информации',
        image: 'Разрешены только изображения'
      },
      draghere: 'Перетащите файл сюда',
      file: {
        one: '1 файл',
        few: '%1 файла',
        many: '%1 файлов',
        other: '%1 файла'
      },
      buttons: {
        cancel: 'Отмена',
        remove: 'Удалить',
        file: 'Компьютер'
      },
      dialog: {
        tabs: {
          file: {
            drag: 'Перетащите файл сюда',
            nodrop: 'Загрузка файлов с вашего компьютера',
            or: 'или',
            button: 'Выбрать файлы',
            also: 'Вы также можете загрузить файлы используя',
            tabNames: {
              facebook: 'Facebook',
              dropbox: 'Dropbox',
              gdrive: 'Google Drive',
              instagram: 'Instagram',
              url: 'Внешнюю ссылку'
            }
          },
          url: {
            title: 'Файлы с других сайтов',
            line1: 'Загрузите любой файл из сети.',
            line2: '',
            input: 'Укажите здесь ссылку...',
            button: 'Загрузить'
          },
          preview: {
            unknownName: 'неизвестно',
            change: 'Отмена',
            back: 'Назад',
            done: 'Загрузить',
            unknown: {
              title: 'Загрузка. Пожалуйста подождите.',
              done: 'Пропустить предварительный просмотр'
            },
            regular: {
              title: 'Загрузить этот файл?',
              line1: 'Вы собираетесь загрузить представленный файл.',
              line2: 'Пожалуйста, подтвердите.'
            },
            image: {
              title: 'Загрузить это изображение?',
              change: 'Отмена'
            },
            crop: {
              title: 'Обрезать и загрузить это изображение'
            },
            error: {
              "default": {
                title: 'Ошибка загрузки',
                line1: 'Что-то пошло не так во время загрузки.',
                line2: 'Пожалуйста, попробуйте ещё раз.'
              },
              image: {
                title: 'Только изображения',
                line1: 'Можно загружать только изображения.',
                line2: 'Попробуйте загрузить другой файл.'
              },
              size: {
                title: 'Файл слишком большой',
                line1: 'Размер выбранного файла превышает 100 Мб.',
                line2: 'Попробуйте загрузить другой файл.'
              }
            }
          }
        },
        footer: {
          text: 'Для загрузки, хранения и обработки файлов используется',
          link: 'Uploadcare.com'
        }
      },
      crop: {
        error: {
          title: 'Ошибка',
          text: 'Изображение не удалось загрузить'
        },
        done: 'ОК'
      }
    };
  });

  uploadcare.namespace('uploadcare.locale.pluralize', function(ns) {
    return ns.ru = function(n) {
      var _ref, _ref1, _ref2, _ref3;
      if ((n % 10 === 1) && (n % 100 !== 11)) {
        return 'one';
      }
      if ((_ref = n % 10, __indexOf.call([2, 3, 4], _ref) >= 0) && (_ref1 = n % 100, __indexOf.call([12, 13, 14], _ref1) < 0)) {
        return 'few';
      }
      if ((n % 10 === 0) || (_ref2 = n % 10, __indexOf.call([5, 6, 7, 8, 9], _ref2) >= 0) || (_ref3 = n % 100, __indexOf.call([11, 12, 13, 14], _ref3) >= 0)) {
        return 'many';
      }
      return 'other';
    };
  });

}).call(this);
(function() {
  var $, namespace;

  namespace = uploadcare.namespace, $ = uploadcare.jQuery;

  namespace('uploadcare.locale', function(ns) {
    var defaultLocale, translate, _base, _name;
    defaultLocale = 'en';
    ns.lang = uploadcare.defaults.locale || defaultLocale;
    (_base = ns.translations)[_name = ns.lang] || (_base[_name] = {});
    $.extend(ns.translations[ns.lang], uploadcare.defaults.translations);
    translate = function(key, locale) {
      var node, path, subkey, _i, _len;
      if (locale == null) {
        locale = defaultLocale;
      }
      path = key.split('.');
      node = ns.translations[locale];
      for (_i = 0, _len = path.length; _i < _len; _i++) {
        subkey = path[_i];
        if (node == null) {
          return null;
        }
        node = node[subkey];
      }
      return node;
    };
    return ns.t = function(key, n) {
      var lang, pluralize, value, _ref;
      lang = ns.lang;
      value = translate(key, lang);
      if (!(value != null) && lang !== defaultLocale) {
        lang = defaultLocale;
        value = translate(key, lang);
      }
      if (n != null) {
        pluralize = ns.pluralize[lang];
        if (pluralize != null) {
          value = ((_ref = value[pluralize(n)]) != null ? _ref.replace('%1', n) : void 0) || n;
        } else {
          value = '';
        }
      }
      return value || '';
    };
  });

}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/circle"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="uploadcare-widget-circle-back" role="uploadcare-widget-status">\n    <div class="uploadcare-widget-circle-center"></div>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/crop-widget"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="uploadcare-crop-widget">\n  <div class="uploadcare-crop-widget__image-wrap" role="uploadcare-crop-widget-image-wrap">\n    <div class="uploadcare-crop-widget__error">\n      <div class="uploadcare-crop-widget__error__title">',(''+ t('crop.error.title') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n      <div class="uploadcare-crop-widget__error__text">',(''+ t('crop.error.text') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n    </div>\n  </div>\n  <div class="uploadcare-crop-widget__controls">\n    <button class="uploadcare-crop-widget__done-button" role="uploadcare-crop-widget-done-button">\n      ',(''+ t('crop.done') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'\n    </button>\n  </div>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/dialog"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="uploadcare-dialog">\n    <div class="uploadcare-dialog-inner-wrap1">\n    <div class="uploadcare-dialog-inner-wrap2">\n        <div class="uploadcare-dialog-close">\n            <div role="uploadcare-dialog-close">&times;</div>\n        </div>\n        <div class="uploadcare-dialog-panel-wrap">\n            <div class="uploadcare-dialog-panel">\n                <div class="uploadcare-dialog-body">\n                    <div class="uploadcare-dialog-tabs" role="uploadcare-dialog-tabs"></div>\n                </div>\n            </div>\n            <div class="uploadcare-dialog-footer">\n                ',(''+ t('dialog.footer.text') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'\n                <a href="https://uploadcare.com/" target="_blank">',(''+ t('dialog.footer.link') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</a>\n            </div>\n        </div>\n    </div>\n    </div>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/styles"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('\n\n\n\n\n\n.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab:after{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAFeCAYAAADHfkwkAAAQGUlEQVR42uydbYxVRxnHuxdaa6q8pLwEQSi1CpLWT1qML9A2gDRVbKQNDfWDoU1s0bQ1RqOJrUqNDRQwvhCtxp6%2BKJMQarTQLmAbKtg2QutriESK1KTCCrvlZWnLsmzxP%2BzD3f%2FOM3P39sOZc8Xnwz8zZ87ce%2BZ3nnlm5p4zd%2Ba806dPnxMyEAMxEAMxEAMxkP9bkIceXUty5xWPDD6G2hCfhfTliP8e8Q6oB3EvH0eaWwHNQryt%2FjmEBRR8fyYQiApSg5agMHsQngbIaYSQo1DiIsm7BHlrHgJhHUqUD6ToB5kK7eBC4phhfKFDCE7fId9BNyYDSDG4OlyF8BAVkEINAThoIE55D%2BF4lnxnDhDHd2weLtojBVJVqCAgZY14tevBuU%2Bwz%2BSoWtNwoWO4qIJgmDiQS8JB3dA0aUhKBxkmPsFVRwFIWiMAnXfAZ4ZlsIhbIs5cd1o5VoVtHtCFlrml1OYXF2pDgfcQQOyu66qV9iMOWXt8n1SmRWZLYbiQEsabWk5Lg0A6%2F%2BwyLbJcmk4uRMLJNUi88BLqPMvLtMh27hN0vU%2F1EyJdzShd3ZBtZYJ00MVUn5Bw9K2IQ5xvaMeHOsqsWj2JFinVDD9FfY%2BPR%2FsdtlIx4Hs95VmEQXR10dULhfcdWyEgyjdEAWAWkA51B4NQAUnVkri2SNpfOjI4e9o3BDTpRxpad66iUp19hb7ryirp8VST5wVqeZnOPlv5RtzZB5w2ag2n%2Bxit2WVapA3aExY63THqdF2NdFx%2BPdbKHv3eosdPQ492df4GvyDLHjT6Ly%2F6h%2FE7Vd3Wx1oaMFblXgD0sJJB6n3CdKibfUFbQFc%2FLeVj3dB0eTqTBcTrWhQCP3W1r6SrD8J0K9Xjv1O%2Bv9xfiEXwHEou3J3uSwaJHT20YrfcmFxPUVzsudZ0X68JQkBU8xx93iWfnV63RJ4HdPx0ke%2Beq0FLEH9JQJQFQtAzeeUBnb45%2BXyExZaqQbOg%2B5HvWahDRsxeHdCzyOvPzYJq%2FFkJOW4PsQ3EQAzEQAzEQAzEQAzEQAzEQAzEQAzEQAzEQIInjTPlCaF%2BETr0E3edJ3irRXoJmlnmQ%2By9UoD9uNDLCKH%2BEI8%2B5RhxaNC5ehyic4nPHhDAveWByIwEqK0IHpmqUOKFiM4NZfU25Ov0likNRKzxMgMIEBc%2Bqrfy3kMsWC5IQSAKQJ7WFyqdj5sFWZsLxInEKoGVvDQw0psE8a8kSvURcVA9GzutII8b%2BoaVbxFHIKo6xauaAmsWxJUMgouoQuvqk3L8pn0EKrlqkY%2Bk%2FMBLzXdvqaolIGGB1TFLA7UGiO%2BFVWeoAHTzLDCtZJEARHWOyvEZtkkQB5BMza8GcI0bgEdaqdXqBzkRdnhFqtAqT9Md4vFyQdLTyGmmg5LKX%2Bg0Pc8rg4%2BomaJcOCgAcgIZm0iTBs%2FRj0ihRLoQzcTVZ5WlSx6iHOeL6Uk0KQvpub4axoXAR8usWnepaUtQHI6rVtMWY91REoietyWhiONuX4Pf8f9qlacoqR9M3PSepLscVqHelgFpPPp190AxR2agu1sBpOGQBOG9aqJmEELfsgd0BmIgBmIgBmIgBmIgBmIgBmIgBmIgBmIgBmIgBnLugCTeHzo1P4VnCyE%2BAfH7kb4b8RMIu5C%2BGeEihLVqQNIvPhPp7tPQ0QZrqjwNjawCRFskPePhBqiXXi30IdwHdQVQG%2FCZtqwgeoqfFFwvRDkIAmE70iZL9axBi6Cj9D5lYVYQXYVcaAWxhOuld4mPIe0CKPyuxbTQ2KbcFuHqFbPQjR6CXvb8ykP4PBGQGtKPS76u3D5CBVfhXNxhgXDQgCUkT%2BzG%2FFPy92QFoUKFGgEdpFdt66ELkXeCnI9ZZBLUJ9bbXQGIi1nkS%2FSK7XewjIf4OfQ6dIfcALbscOTfQOtqrcoLomeY3gD5Dm8jvUOcieOvBatvLC0EBPHh0Dryo2PQxPzODhXUxELnQ3%2BifuFt0CU4%2FzAkabAMCtsP4dYR5CmcX1DZEAU6C3EaGg09RSDTqBV7kHr1b0JzaF7KKcRvqm6spXvs2dC3aRmeB8l%2FplG%2BLQjHQVGI3FVrAVnCFwj9hPNN7BTohE8T%2BWr1PqlmYin3Z1nc1UMsqmz0K059jJz0MQ9BE5rvDCaZeYe%2FkuCeQNo4BZEfxK0kiHaEgFATMb8gTe7DYo0tVLW%2B2CpTOP4uPtCHOz1Z%2FCU2XBmH8x5iHc3H6sS50S0BQj6wjwof%2B09JvZ8gx%2F6UP9cqIJ1S91%2BFakX8XzzDBllCWicBbA0QVJfNNA%2FrJgEgYdgBCIgs4eoQRQtZZBGNp45CS6BhUqUmQRsJ9BTAFWxrWKR%2FvcbfBrPkXpcZ1H1UncQSMi5rNYuIVUaiUBuDVfsZrBvxBdEZ2S0GArk2aCEK533mMNQD7YFWQ5O4NUPIMPaAzkAMxEAMxEAMxEAMxEAMxEAMxEAMxEAMxEAMxEAyKNdD7PEyv%2BTEEJtx4VyzW3E6%2F12PI5yQ87XCbxounCcqwp1b9T4kiCugjTlBXkts8aSAEtsNQsn03pwgUkgJ0%2Fu1SRhXkdi%2FJxvIkAVMVTWVV%2FlQXpAhN9zS1uG0HdDUyFILVVhE%2BwYXVtJTLdjH1EzU6kDSq80UUQs5Dt8eX6cO5yu2CGvIvRLJGgnLZgYJdxTTcvE8NBs13pdUA5La%2FzMJOHgpxGj1yweiW6wUgLZCoReglGOX30eiPTmDKaDEnHmGkbzZq5YGSW8orxeidGoCNOWvstXSe%2Bqmt9EMfER9LqNFlHOn%2BxPlS2yRxB7VlTh7%2FPdGDFLSuSOMfz4%2FiCi56pnedz1wfAapxNlpg%2Fm3ts0%2FgRSBg1c%2FRIGa2d6cLVKIOE9FrZZuoaLjJu0fERDHwNn7kZNqyB4N9dCeO8JEC9eb00eeCAqhhu8KRM7xdNrET932nLNMJ%2BCCT0Inw2ZWCswFjzUMsWrnrbwJae%2ByB3QGYiAGYiAGYiAGYiAGYiAGYiAGYiAGYiAGYiAG8j8EErzjkIWP1q6CnkF8YrAZlxbyQNsQX4nwnZXvCCP%2Fa78Z2k8PrA8inKsWSBJohPN8HnolsR9ajHhbVRa5wlsgsS%2BVX1XgbqhGr6F9%2FB7E%2B2KvH8Sal2cDQeFG4qLfg3oju4SFx5sRvxhpYxH6eJBHzaLrRdpqxEeWCoKLfBba33D2jz5%2BACEUbBuVyg%2FJNW4uE%2BR6FKAr9jpay%2B1COJ9mN8yHdun36no2EY47%2FbXKrVqPnlmZZjsumrLCIYRLoeGFXlnTp%2Flzh7jwgZ9tQ%2FrkXK3WcOg73nGpAD3QSmiU2mKQJtPIhJpRCH3eHrJsH7QM%2BYdn3%2F4JugbaL0sXXgZFpjI5tQMyfc9l%2FrNI%2FzfiV1fV%2FEJuPMLHoaViJb3TGCQg9WO2rP%2BsfMe4qnYWmwsdoKqxC5oPNVqY1Usg4Pz4DLVkBxDOyQMidxEXvQ8X7St8AXSr0460GQEQV7UZCNtjsx7kO7%2Frr1H2jvmX4GLPp6ZpEFgvwjUo%2FBhyeMTdmgLnFIBujp9D3iklgviBoetrZvdJOT4si0ze6eOULy3kkWHMyrKr1odxoRf1eEnvSAm9gmM%2F8%2FrjCF%2BRtKHmB7%2Fgr5HL2Wu44O24YFeDAm2RMdaNfrgBuLHQ0zhOTSHsRPw2qJa31Rqo9z9DyB1jHwq1TKaO%2F5DAHsD5i6BlUL16Svyn0JiqN3Z8NzQT2gl1In0eNBl6PrK56U5ATkX8WhlP7YCuRJ6Jle9QifAfCL8u6%2FmOga7zQA22nD0MXS95zwfYlxHurgIk%2FKfB3oH%2FhbjvI3wz9gcXhpE8a85aDTD7qgMRGGiKjLX0FCZRGgiScVp1VUvrKhTqjwogIfltMqd1tqMlf5Fm%2BTboUINOs%2F57pSX21eXhOlQ%2FlrRR8tukh3449UJr1PKfVYMU6rlVdBnQaVA7jtsBNEPy2ZNGAzEQAzEQAzEQAzEQAzEQAzEQAzEQAzEQAzEQAzlnQPTOexLWdZ2krY8tFiZpXdDolgGBAgj3fpk8dg2e9b6niPxNnOBWVQ%2BirXAWapMU9K%2By%2BdDqwQCOYTzkpa01y7Rfnwz%2BcP952VbwVV59gKGg9S1mEXeBvBTlO38QGoH4XZE1GlkfrQokhPD6igCE%2FrBctqDd02D%2ByR8QtlUBEi4xNR7hsfBOy93vQfxS6DOpFkzSKtnYMVwf60EotbrZSYTvFcttH7CC0j7kvbASiwjIBxG%2BSXc2tMgKeh33IcoX85WvVuUjbSjQc0GV4fh%2FoBHBbq%2B%2FqINofzmC9LFV%2BMhibQnHTrwksqXzFIRvKHAJoR%2FlBrlI5l%2BlZjfshGrhMp%2Bi%2ByKLI%2FEmd9Mygrh7uZ6HcegjwbRZhhmBtIMEE1axDbkmZ%2FoFVd%2Bg6d%2BhfhlaQQ8u3e1DLId4dQYQ7O6dcFjoNWhirEoVegfLFxE%2F0i93pJC4aGsOkF0DEMrZvxEMIpVFWmPmg0w8TnVqMv3vVpz%2FNeKQewbxM8IxidNcPaS8C3P1I%2B3aR9xChONxrlvSmp2vFa6cdgB6R67m1%2F%2BAOkWj2q1SpX5CaZEhi0j%2Fq4fXa7w1d4f4A9pq9gOIX05wup%2BISi0k9jccD8s9RLlYZlr%2FWMCe1AXWy3syaAR6fgVjLefDzyH0QHOia2JzmEgrBrSp0h9WAKhBfwkKpyzA1ik0YB%2FSrrDnWgZiIAZiIAZiIAZiIAZiIAZiIAby3%2FbOWKWBIIqiqARRhChaaKH4BVrYuHYWlnaKja1f4H%2BkFi3WyvyAnTExxNIfUIiFokGsRGGzEMG7cgM3%2BzbpMtNMcdnZcTPOmbdvHDLPNwEkgASQABJAAsgY5ChgIILuoKEnudrsHIVHbHa52RM5B2FKkbRo%2B01lAG2siu5FpoRxapFbk3pt9A6V6hv1bUC0Uc7UkYGouwZJrCWqIo52sQW2c21Noe6JzyeuQbTTFsgmR9KdqbWCbYpWvz3nICNyyRnIWIR6A8IQKD8gotEpDq31DAgGpUVruQZRB7di%2FQ%2Beucb1kiPeo1UOtS1u3b0T1AOI9Q%2B9nsdMqqcJwqAHDoCZ7fyAjD4IO87FaImqZVwfzesnQF58RJKtrtAPEtwvDcQDS5k6kGNqZ7XN2CcIYfbYkZpJpsd7gZuBfmUG8w8iUUBHvL9iHSVQFMtffH7RK0j%2F1dC8QbTQvYnVErGuTIiuGRznIPylkodxDkqgHrQO6WyVDzA44SDUfIPoEkU7e8HO3EAlsYyGy66i%2FMHPHudmQu8%2BQv3PXB0uXZoob0jqz0mU93F95SDUGQ%2Fv1yKyws37whb0JrPaM0NnP2V91oIWhljZvbNnEgidqZahs%2F%2FA%2F8G11wvKp1BJ2%2FI8%2FdozcmObYn0adZsA3mV6qgn%2BTNry7%2Bz9sPB5dWjxCVXO4S1I1g7bS1xbpMHXpcK%2FC%2BYVy9URwoLw8xVapOHaIhE6l9qQP3sqq10gqqpaTqEdH%2F8IE6GDTXTCfB0kkaTSYVvHchfPNzOI8AVdAAkgASSABJAAEkACSAAZq%2F4A0EvZstJINZUAAAAASUVORK5CYII%3D)}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab:hover:after{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAFeCAYAAADHfkwkAAAJFUlEQVR42uzdfWxVdx3H8dvbDkemsGYFgp0w5rSMbP6lY9EJ28IQMkUiWyDgH4YtcZuGzRjNTNxUZraUJ%2BMD8SmSkMx%2FDCMKbAVkAZnOWJiPIZIVLCZaKm3HgA1bSv36%2FuO75Jeb23NuH845v8Lnj1faXs5t%2Bs55%2BP3Or%2FfSkpldERSiEIUoRCEKUYhCAuufbQ3VYQFa8Vt0Y8B1%2B2MbfJs6RBdSxlp0wGrU4c8pxxIyB%2B2wUWrHnMJCPOJu9MDGqAcLcg%2FxiMUYgI2TAXwitxCPaMF52Di7gJbMQzyiPjgnstCO%2BjxC1sIy9lCmIX7t78ghpAN1WYYshOVkYZYhrTmGtGYZ8kqOIYezDOmGjdBBZyPUnVnIKAbAAyi5AyMdIBUS26Glk72GkA15Xn41IEY2RSlnPWl8KI9JY17T%2BCMZRhzNZRrvMXNxIaMbq7l53%2BouzeBWd2lRiw9Lx2nPXAgicg8JD7OjYzwn5sa2QHdiBAEnYlugC5WxABvxu8olU39so29Tjm3JdNQUohCFKEQhClGIQhSiEIUoRCEKUYhCFKIQl%2FVrUebjBCxjJzA%2Fy5CTMHThVEZOw3AyyxBDN%2BqyOrT813u9sKxDTmV9jvD4KYUoRCEKUYhCFKKQkYX05xDyVuYheVHI1RbyVo4h57IMeSLHkHUxLD50wobxz4m0inIpIWRwooQ8DUvx1EQIeaaGkG9qgU4hClGIQhSiEIUoRCEKUYhCFKIQhShEIQpRiEJmYiOOox992IeVKE%2BUkE%2FjHGwYL2Nq7CEPYBDmhtCJvoqY3aiLNaQyog2zgndbr6zYUytiDKmMeAGTwm38e6yGub2xhTxYEbEziKgMKQe%2FaO2LKeS%2BtD3hwu%2FzDxgGYgmZgjNBxA5ci5nDhfDxRgzBcDyWkC8FEb%2FxiJ%2FhItZV2b4Bu2Fuc9EhD2Am9sDcfDwJCzxWEfELmDuP5qJCwqvTNfgTzL0LN2E7zF1Ec5WIy1hW5IAYXmIbcQDmWlBy22DuG1hUEbGqsClKGOEW4lvB19uCkBaY24%2Fp4xLhxhKxbJhxYjb6YW47PuiHmbk%2Fo94jVhY2%2B%2FWT%2BnzCOPE4LPAk7gi%2BfhHTg4jCQjaFc6cgIvQFXMR23xv7Ye6L72xXdMjfg1msTwCrmu4R4dWpF41RhATnQGdCBKpeYj%2BFUiwhvTC8gfIwEfVVIlahFFPIPphblbYnwojYQlbC3DmsRT3emQDuSYiIKqQOv4YFLuIUhhIi4grxmKnYk%2FL%2Fyi2LfTko3DMrsA9nMYAObMGNWqBTiEIUohCFKEQhClGIQhSiEIUoRCEKUYhCFHIVhPADzMAL6IeNk37swsw8Q34Fy8iePEPezjBkMM8Qy5JCcg5px5zKq9ZEDLkLpSshZPIVERJGhI8rRCGjCkmfaylEIaaTXSEKUYhCigu5lGHIYJ4hL2YY0pb3S8pfCvbMeLiEvXivFugUohCFKEQhClGIQhSiEIUoRCEKUYhCFKIQhUzskCnYjENoriGgGYexCe%2BJ5d3Ta9AFc2dwX0LEYt%2FGXBdWo66o97Pf7nvAqriMp1AOAsp4GkOwKg7httxC%2FA3538EgLMU%2B3IBp%2FrmlGMQWTM0sxCM%2BGxxGtfqxsxHowposQ5ajD1aDY1iCklvij1kNerE860NrFl6BDaMHj6EBpQoN%2Fm89Cc8%2FjFm5nOz%2BA3274sQdwCZcj1KK633bAZgbwno0FHH5vRdd2IlbUBqhW%2Fy5%2F8Y9RY4jM7ArPJSSJBxquzC9kBAf9E4nnNxpKk%2F%2B01iU5zjSgOcSBrY2zEsImOfbWBVDeBYNWY8jN%2BH3NQ5sW9EUBDRha40D6auYnWXI5mBP1OIs1uFx%2F9xqNIRNWR9ad%2BI1WA3%2Bhbvwcf%2FcanAUd%2BY1jpTxaMoovx%2FT8CDW%2BOcvp4zmj6BcxOW3CT%2FFUJWBbTK%2BXzHnug7rq2z%2FEzQVfWP1PszHEfRiMWZVuyj4NnOw1Ldtxx1ojuEO8XV8DZPQhPvRm3IBWO7bXoMv43gMISeD94V8F%2F%2BDJfFttgZ7rTOGkNnYCRsVn6fFtIpyN%2F44goBjWBTrclAZj6Cn1vuVuELS7zfCaUvjRFyga0Gbm6eVRoUoRCEKUYhCFKIQhShEIQpRiEIUohCFKEQhV1%2FI%2Ff5xB2wYfWiMOeRWDOJevD%2FlbeKbYw7ZC8NfUY8tKe9fvznGkE%2FCAp9HI95IiNkRW8gkvA4LnMEUPAFL8LGYQr4Cq6LVIzsSQv6AuhhCZuA8rIoB3IzPwBKsiiFkW8oJ%2FQGUUl4H2Ylri3wF3YdTfq%2B%2BASX3EViCrxb1Cro6vAobxn8wBaXA8wnbv4lpRYSshiVYi1KF2fhvwnN%2BkFuIR1yX8vqrIwl%2FJ%2FG5hOddRkueIc%2FAEny0MiDhb1NX2p3XizPnpBweP0cpxaOwBPdkHZI2q30bzTW%2B3vc1vDmMg3mEHEsI%2BXrs9yNhyJKEQW0yHsYv3aFRWpHXyd5WJWQFZuACbAxO4915hdyKyzB3ECX8CDZGD%2Bc9IH4vuPZ%2FCLcFcaP1N9TnHXIDzuKHKOEl2BgtKWrS%2BDkPWjQOEXuLnsaX8ZcxRgzhdq1rKUQhClGIQhSiEIUoRCEKUYhC%2Ft%2Fevas0EEQBGB6VIIqQSCxMYbATLLSwSay0sLRTbGx9At8jtWihlU9gZ8yF2OkLKGihqIiVF9gEIse%2FmGIQ4oobN6c4xdcO%2FMXAmcPCWoiFWIiFWIiFaA2JDyijgTYkgTYaKA%2Fid7QldCB91EE57ZAzyB%2B94ybwBPFqaYdECUJKcIERXEMQpR0iCRS%2FX%2FbwyyELsZB4HzjBEVroQrAJF8jjUWvIPnJwgXlcQnpQF3II10MWV%2BpCghGlAEGEKbgfbEC88eBMFSFrEFThYozhE4KitpAtCI7hfuEVgry2kBUIzuFiZINh0WkLmUCELmZjQnYgqKoL8Q4gOEWmR8QMniHY1hpSCCbZJhbgvGGs4x6CGoZUhnhLeIB4t7jAC8RrYRJObYg3jT28QQJ32EUGTntIaBSLWMUchuAAPSERBDm4JPx5uUE9rOoQVJBNGJNFBYJ62iHlf1o%2BLA9qHdTs0zqoGUQkCFHCQizEQizEQizEQizEQnT6AqfQwgd5BnPGAAAAAElFTkSuQmCC)}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab.uploadcare-dialog-selected-tab:after{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAFeCAYAAADHfkwkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAADDJJREFUeNrtW21wVUcZJgnQYiuBCQUjISQtGmBK%2FKGWgJWPDqEwCEUpA94kMxrr2CLQatWpM7R%2B1LEFCp1anXJJRBmrP0roaEv5DISPto5A1XovIxIgqC2kBAoEKgkErs%2Feuyd3z549Hzfp2XNueZ%2BZZ%2FZk7%2B4573Ped9999wz06UMgEAgEAoHw0UZ8x7gccFJsx7jl4Ou4bkXbGU%2BxNZ7qW8HGsLFhFJALg2vBZlwnGGNCa1zHzddsbC2bGwoRMKwU3C8aG1cbbuoTBLK5pUF7YgrYpjLaTphKJNo2cFJQIqbz2E8b11hua7DkBUvo8bV0r%2B5wKoPR7U5Gu%2FXZeO4iu7cuT%2BSxuLYJkW7PZBha4nh27zwd3qiNuRtjEeVFmBGaGPsNHftEs0tatayJmEtIKdZOc8zPfQYPmGzzYEcBMacwtM9yk%2F0Ustz04HQoJNxScMwlMSja5X6uj3126VRe4DGX9OuU4Xi7108hrZns4Ly%2FCW1TzCn8mGeFF8HbVj%2BFdMYdUq3CI43C3Ma4e%2F0l9nX6uUY64x42N6E1C5F2fpeU7KuQ1rjHhS38rQytuFsmayxv9VPIvpjLZua00DPc6ff6KWSFU2zHHPYJL7WX1Lfc1w0x5lJi9NRjit993BAby3N4%2BeAlY3nZve3mNvt%2BcmQFXTwD41VnlJhDwRnTUTQaZTwedCDmJsCahezXiLlCPqiljOdeGc0OQfEMRcRcFn8sdbAarfuoO5NtWm7VrtdShm%2B2M4M6t88UPeN1n1Ds8MwTwYgQwyyWiuuefD0x1sToPmEADMrlH9uOWgxVHHX59VF%2BbA7HBzppn8nln0NXwsA3eG3G1hEju34D7Ur%2BWTV8AggEAoFAIBAIBAKBQCAQCIQwY9bsuePBo2DCZ7JnjPdTyDH%2BoJPgCZ94ij%2FjmJ9C2ANawRwfn5EDnmHP8lvICQ0hfIKEkBASQkJICAkhISQkMyEdGoRc0iFEG0nIjSTkkkYhF%2FwU8ohGIUvDcLZvcTDw39n0keKKg5Cr2SLiCQ9h83g2CHnSg5Af08c1AoFAIBAIBAKBQCAQCAQCgXCDY%2BasOYXgSvAw2AGeBbeBC8DcbBFxH3gBTNhwJ5gfdhH3g1cFo6%2BBLdwjophXwZxsEbEFLOa%2F5fKwEj01LxtEbAT7K8ZFhDFbwyZiviTiZZUIwTOX%2BLizYRJR6cUT0pzjfGxnWEQMBE8LIhrAm1nqdZhTxBMAG384LEK%2BI4jYw0X8GvwfuFQxvi%2FPVsacVWFY2GzD2yQYNR58TEqxiyQRLwm%2FtYPDw5Cd%2BoF%2FEwy7CSwB1wt9zDPDFSK6wDlhSbGDwUbBuDJh3Dqh%2F0fgNEnEwjDtE5PBnwh%2FrxPGlgn928GhYRExR7VPgCN5QWj0s7D6NA8zo%2B%2FvYB4XsSDoKrbdbp%2FA9cPSAmcL%2Fi7h79e4RxYEnaGekWonVdnxbb6w13NvbBfmLA7LXvFPoYotdhg3lIsQs9MZlhTCIsRYAy0u41QpdnaYaqkz3LD37U52NiIW9gkT%2BPHUMHBhVorghi4QjGSHolqWToUCcJMk4qthPfXlgDukFMsy1Amhig23CEFMvvTmZV4E52bLlxHmmXl8zZxjhyKwGVzNQow%2BgBEIBAKBQCAQCAQCgUAgEAiEGwATItFhE6qiGysiazrQJtAmWIv%2BdGtci4yYf5PmdaB9BW2hTiF%2FMhlnGBVxECGxW4RV7CadQj5gxlZEFF6IyAan%2BgyhFRHFCxDGgfr%2B477JA3IoRWzedsR8bRojvQCdHrF6IKI2WNVWKMaILyYwIab1ofKA4AWI2I%2FrUrt7sjHahFhCR5WFIlF16ESid7u9HI1Cou4ZKmLbNyBEQtZIGUkSFonahpqtZ4Nc7GlB6lCzpGjJSHmcsdb0CrHbtW3CyxBrTePWOcHsI%2FZrIaM3bBd%2BeoRURd3TblUGQqoCEGLeH6ylSqYbnPhCtK6RCrsyQ94ozXVUwrXU0e6RiLosqbArHFVZS3WfQLKWU31VpQ43uwUenBBl4edea7lWCEEJqYhEXUt2OyPtarJAShT5mKs8KToIUZ1dtKdfi9ERm4OVQ9ZS1WU6Q%2BuKZW2o6iaFobaLPT1G61H3NVXaVKZghzWiqn7Rt0WnRwrx0M3gFfmEqPSEate3fFVJ3msr%2BEn64EYgEAgEAoFAIBAIBAKBQCAQshnL4gPBVeBucLiH8cPBveAz4MfDICAHrAJPggnO02Clw5zpfIwxns2NJO8VkIhx3AMJBbvAx8FcYXwu%2BAR4zWYOu9edOgXkg8%2BCV20MErkNLABv49du49k9Vyef4bOIaimMvDDKmcmck8mQ9VHIXPCsR2MOgTOEuTN4n5e5Z5LP8tkrxeA%2BByPawEVgX8Xcvvy3Nof5e5PP0LROmEE%2FkxZuJ0%2BngzzMH8THdgrz2b1%2BqnwBGgTdw%2BP5ZXBUD%2BaP4nPfBacGuY8MA1%2BxDSVvnl3E7zE0KBGV4Cnbxe0%2BX1787F7TdApgb%2FEph41tCzjWYf5YPkY1l93z5%2F6vk2XxEvDPHje2X4FDhLlDeJ%2BXjfRNcKSfQlY5eELFc%2BBS8GF%2B7XXetWRW89krFeBbHg16B7wb%2FCK%2F9jLnYPIZmtYJKwAfctnlt%2FMaaz6vkNn1Tpfd%2FEFToalx4bO4r5PCzdjYBoDPSzXXLfw3efxa03oKKA2PAMeDB%2Fhbnc7LGFVSYGNKwZl87H7wLk%2BHMQ1CjoA%2FBPtzD83iRjolgLl8bD%2FwUfBwGIQc4wayt%2FsceN3Dgr7OU7HhtZYwCBnJ66VED9mzOs1HQVPAv2Yg4JDekiTztPygy3mjrcdFZgCCVOcNo2wZ3CfrsCxexgtE50KSQCAQCAQCgUAgEAgEAoFAIBA%2Bmiiqq5nF2vZdpQ1gIskm1pYI16VnwcFhFjGmqL7mauHzC%2B9p2Vx2B4y9kjS8SRBkXO8qXRVmIVshJFFUV%2F2PiU%2FfmwdjV0vGi15hIm8PoYjqLzERxSkhCVx%2F68WN4wfD4PdthLBwawiXiPqa%2FvDGkaSAlAjWni6JRgYebyx7xCSkSRZT%2BoUwCfk%2BhCSSrOdMXS%2F%2F8vr7%2BsPoZotX0mL%2BAuaEYV0MA9uLjJAyeaWmE%2B3tb28b%2BxVlaKVDbGEYvLEu7YXqpCeEdXIF%2FBRPx%2FscvNIC3hykiM%2BB14vrLSFliFphjIWhn7cudhN%2FEJSIHAh40%2FBCt4j0OnkP1wPFOTD2RQch58Hbgki3kZThqTVRLApJ9dfKcy7sKh0JYy9bQist7Je6F%2Fgt4DvmkKpOCMIOFEWrlP9cCcY%2B1V2uWNkFlukU8qSwX5jXRqpvot3c8zvvGAhjTzvsK6%2FqCqlSGHu5W4DVK793uweMfchBCONUHUIa0gtb8kZdzQdFa6td%2F%2B1V69ZRfWHsW3yBn4eI89J1kw4hh8QwKjan3WXZc96or5lh2jPSbCl5rnbA9CUND0xfvOGPKTbsxt9WLt6wuxJk10bbfZ3iPF1itpj3juTamDfpe78bBmMuwqgEjEmYWpGsT%2B5P%2F30KvFXXgh8Dw7uEDTAZ0zBgjcVok7GcS4TWKuYB3RviL3iIdY144evllUteuhPGdXW%2FbdEjSZpFVIoeSf8WQ5unW0gBRJxD%2B0LSG4sbNivCxCxA9o51%2FIxgFn5dzdfGPP1YAd7utPTbFjwgi5H7zUK2BprFKpdsyIURbyvjvju8zCIrrQngGjiOvkERCAQCgUAgEAgEAoFAIBAIhCzFlO%2FWTwB3gx1gohfs4PeZEISICrCzlwJkdmoXgwfu7IXBF8FjAk8Jv%2B3SLeRyL4RUSPfKA4%2Fw3y7rFtKbECpW3G%2Bf8TsJISHuvARuAn%2FLDe3i%2FfOlexWAJ8MqZC04SJozFjzoNjdMQn7jMC8f%2FFfohAh%2FFxrpExziMvd%2BwfCP2d0zKCGVvK%2FRw9wB4DV54YdFyALe9weP8y%2Fw8QVhEzKF973uYW6%2BUSw63TMoIbfy9cFSbInL3G%2BqwjAUQnhfHe%2FfAfazmTcCfI%2BPqw6rkEKhkt0Dlgu%2F5YKzwf8aVS6YE0ohvP%2Bz4LtCej0OHgDbhD62yw%2F2es9AhPDfPgGuAdulze4%2F4KMOYRcuIcKYm8DPgFPBMjmUwiLEOFgN%2BpDuNyiog1UTf%2FBqti%2F08l75%2FD7sfk26hUzw6ePDxKA%2BB%2B35kD4H7QlEBIFAIBAIBALhxsL%2FAWFBQYLmSYGkAAAAAElFTkSuQmCC)}.uploadcare-widget-buttons>li.uploadcare-widget-buttons-dialog,.uploadcare-widget-buttons>li.uploadcare-widget-buttons-file,.uploadcare-widget-buttons>li.uploadcare-widget-buttons-url{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAB4CAYAAACaTFAUAAADn0lEQVR42u3bS2wNURjA8aLaEBp0IV5NPGJBkJBSEl1UtB5hQW0JXSIsxGMjFsRjQ9AHQtJiwUpUaVJExELi3US5JZ7FlajiJlQfPv%2FcfKQ5uVNuO2em9Cx%2BSe%2FMSe8%2FM3PnnGluU0SkR3FBLsgF7T9YXAn5S5VBBEkyY12QC3JB%2F0VQEiwFaUh3BBb0p3HJnjpbU4ap0s32LsgFuSAXpGzOZR0lNVb5GOT9RoOwGgdQih1Yin5BB6XjKFo0ZB4mYhrq0IhNQQVlIYKtxhumYYz%2BnAnBBfSxGZSOJ5AObxRFGcTDGZtBR7AX54yjUwnBZ4%2Bo%2Bb4H6QXcgiVGzEYIvkJwS8d9h6gHNoJWQ7DNCPqAcszFJFyDIAbpYKjfQbtRaMRkQTqI4DEELca%2BqX4HlWCCEVQD6URfiMq3cYSyjaAjEA95OmYsBDP8DloMQaYRFX9txLw1xrRjgN9BqfgIQUoCZyCqAinqOKps3Yc2QzyiaiGoR7VxdEbanDou41mCoHREjG2C7bbnsn44C8EIM0xtQzu2BLn8KMRdiGqGoBVVGBX4ekhlIhcLMB0DPMa5NbULckEuqLuT6xp8gSQphiILQRrTNZ9675%2BFTdU1V6XhXVTeRN8Lwg968bpBY3pGkBnigswQkwty15AL%2BqeDvnQjKGYjqAhNkCQ1ocitGF2QC3JB7rnMPZclqXcGmevnp89fyPmqS%2BEG1T6skyvXrsvNW7flZcMbYVu4QcT8fv2o%2Fkl8W3HZsZCC9DRpSBxHSveHGMRpi%2BN1%2FLQdO1HeM04ZP8e3VddcCf%2BiRvxosU0%2FaSEFmbiG3I2xS8KeXN1zmVsxuiAX1LuCuK9kIKeT%2FbOQEdR%2FTy3Ca7RibYL969GGV1ho80ExEychhhKkoj9KIYYKDPMtSGNWIArxcAqnIR6iKPQlSL%2BvuAVtEEM7ijFEleg2MbRhM%2Fr4ecoK0AhRd5CdYNxM3IOoRuRbuaj5xeNxAxuQ2um3sRijY8fpditBk1GL7UjrZFyajnmASbY%2BZcsRg6jHyEswbh4iEBXDMr8%2FZbvwA2L4gQoMVychHuN2%2BhlUgJcQD%2BUaJh6eo8DvUzYYxQmO1B7dl4F9CW4LhzHY5tSRi3o0YyVG4y7uIwurdF8Ec4OYywowEFOQg3cQ9R5zMEXH5AcRVIJqrMU3iKEZ63ARpUEtP5ajAeLhLVYEukDTi%2FgQ2hPNbaGtGHUxdh%2B1mN0jlrC%2F1kNuTR2En2aqi4BnOyDfAAAAAElFTkSuQmCC)}.uploadcare-crop-widget .jcrop-vline,.uploadcare-crop-widget .jcrop-hline{background-image:url(data:image/gif;base64,R0lGODlhCAAIAJEAAKqqqv%2F%2F%2FwAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2BQQJCgAAACwAAAAACAAIAAACDZQFCadrzVRMB9FZ5SwAIfkECQoAAAAsAAAAAAgACAAAAg%2BELqCYaudeW9ChyOyltQAAIfkECQoAAAAsAAAAAAgACAAAAg8EhGKXm%2BrQYtC0WGl9oAAAIfkECQoAAAAsAAAAAAgACAAAAg%2BEhWKQernaYmjCWLF7qAAAIfkECQoAAAAsAAAAAAgACAAAAg2EISmna81UTAfRWeUsACH5BAkKAAAALAAAAAAIAAgAAAIPFA6imGrnXlvQocjspbUAACH5BAkKAAAALAAAAAAIAAgAAAIPlIBgl5vq0GLQtFhpfaIAACH5BAUKAAAALAAAAAAIAAgAAAIPlIFgknq52mJowlixe6gAADs%3D)}.uploadcare-dialog-file-sources:before{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAAsCAYAAAA%2BaAX8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArdJREFUeNrsml1ozWEcx387lolkMSNJLKNIIhQ3btwouXBDlJer09rF3LFdyZWLCbHMy4W3lPfXQl5rGyk1WkqE8hLJxbCZjW0%2Bj%2Bd32tNxzhnLyv%2F%2FO9%2F69JzzdLY63%2FN9nuf3PM%2B%2FYOee%2BjIReQcdkkVVlUmxoASshiewQozLmTEaJsEZuA0zrJvRA%2BvgPuyFWii2ZkYhjIFLcCToL4Ip8Al6LSWjBOrS%2Bjt1Hum1Nkzeww3J69cwOREkYCQ8hDnwOdcf7qrbF%2BkvnqlccMm4ELz%2FArdgq9XVJL3YqoZV4RIb9RT88TDJEJePfPn1utz%2BNiziXI0msvRf1dUkdnPFX5sR%2FPqNMN2KIYl%2BZttjcByGWplAcy0%2F9TSvYIuVOqM%2FbYD55pOh6Wilua77lRLTZgTzx0K4B2NNm6GG3KE5rTvc4abNUNXAU6gwbwbpcBu6tbAjn4y%2B%2BcOV6otg%2B0D%2BR2zMCAx5pFv9QzDErBmqdlimq0utlaIrl77CcphoPRkpfYeX%2BtrtZcotmxHK1SINsDRvhshB8TdzB2C2tTkjk%2B7CVPHXDQVarbZbTEZK38SfuLtz1OewxrIZKT3W%2BWMTnIVhls1waoZ5cHOQhmWkzHDqEn%2BF2QazoAmWWDUjVItWrO62%2FwqUWjbD6RzMhIviT9CcRlg1IzV0XDpeB4k5r7thc2akyyXlGhyGbXEpugaqDk3Kfuk7VlwJc3XP02IpGSl1i38awKlRi7fL8GCwd8f%2F%2BynVW9gs%2FpGqjfBB%2B116qv%2F1%2FicqR3Y9mpIufe%2FmlXHiT%2Bsbgs%2BVWjAjXU2alPLguGC8%2BKeO3sBJ8adwWZXp8rxQoq82bd2zaROgTJfnbu13r0%2BJv%2BJ4Bkc1TUUYMpnW3Ri2VlUmO%2BNgRrpeKOGRwgLxj1ZMgx%2Favxh2wygoxpjkTwEGAPykmqa52kHJAAAAAElFTkSuQmCC)}.uploadcare-crop-widget--loading .uploadcare-crop-widget__image-wrap{background-image:url(data:image/gif;base64,R0lGODlhGQAZAPQAAOzq7Ozu7OTm5Ly6vKSmpLS2tNTS1MzKzKyqrOTi5MTCxLSytNTW1Nze3PT29Ly%2BvKyurPz%2B%2FPz6%2FMzOzMTGxNza3PTy9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH%2FC05FVFNDQVBFMi4wAwEAAAAh%2BQQFCQAAACwAAAAAGQAZAEAFhCAgjqIkRRKgFEfjkOMZwXQNRKhs7yKe1ibULcdzpEw8QKIBkLySUBjSmKQ6aQ6c9powPAjgQUDqi5bKZTNJllafZ7JfNCsk0bcvE7tu26cGYAgIFU9AWjYBBwgETDBtUHQjj1E6Om5nJ0iXAHQnhW56lpc6k1CipTuiMahvnzR%2BQ1s0IQAh%2BQQFCQAAACwUAAQABQAIAAAFHaBTBQDAEIMDJARRlQexqAFCNOVDHKVBFKXEQBECACH5BAUJAAAALBQADQAFAAgAAAUcIAAIyiEaRCE%2BhBkgRAIcxOIIsAGggwM4hoAoBAAh%2BQQFCQAAACwNAAEACAAYAAAFJyAgAtBonmiqrmzrvnAsz6KQmMFBEIlgKDtEITAIQhgOwKNwaCRFIQAh%2BQQFCQABACwEAAEAFQAYAAAFTWAgjmRplWiqruNJIGwsr8Zs3y2u73zv25Te4Ic7BRo9oy1BCDCIDMGOgSBMlChYCVCoIhQGqXNEGABMBghhHURhSZbGoXAQDSiVtygEACH5BAUJAAMALAAADQAYAAwAAAVBIKUIQ2meaFoQTOq%2BFPK8dKkQDYFYtRuUFghh0qsxEARA8YQwWQqIxhLFGwCklSlNp30RXo9mz1EjLAzkbunwCgEAIfkEBQkADwAsAAAEABcACAAABS3g8wCJaJ5o6hRIk74iYzIEIsAwQjgLceDARi0AxB0IiiJsUCAYlDDF4AZNhQAAIfkECQkAEQAsAQAAABgACgAABT5gJI5OcxTTqK6rwywEgVBsPQZDjDyGoCK2kUF2ANQCQZHDkEhGBJUaoekMIgjVFVYEySaBXpUF23yEVQpRCAAh%2BQQJCQAXACwBAAAAGAAKAAAFXOAljk5zFNMVRZI0vrDDLASBUJe0ri48BoMa4mEQ5HS7iMN3MdgOAGaLBwMkHIYE89VyVAIiR4Gg3foYhMGSgSAYzbBErXKBEA5w5oGwsCAQYHkwFjVyD4JMCnchACH5BAkJAAoALAEAAAAYABUAAAVloCKOTnMUkxJFkjS%2BsMMsBIFQirSuLjwGgxriYRDkdLuIw6cw2A4AZosHAyQchgTz1VI4eo4CQbv1OVYiBoJgLMOQLgjh4GbuFAhEoG5nER58UiyBW0iEgj2HiouMjY6PkJGSjSEAIfkECQkAFwAsAQAAABgAGQAABZLgJY5OcxTTFUWSNL6wwywEgVCXtK4uPAaDGuJhEOR0u4jDdzHYDgBmiwcDJByGBPPVujh6jgJBu%2FU5ViIGgmAsw5AuCOHgZu4uCESgbmcRHnxSfgaBPkgDbYUjOj2KTAqJji0SBAyOiytDlyI8NhabPHIpkmhqBFGFZywXFgUIDYpIIwCwFZFMAloSS5u9vr%2B9IQAh%2BQQJCQAXACwBAAAAGAAZAAAFq%2BAljk5zFNMVRZI0vrDDLASBUJe0ri48BoMa4mEQ5HS7iMN3MdgOAGaLBwMkHIYE89W6OHqOAkG79TlWIgaCYCzDkC4I4eBm7i4IRKBuZxEefFJ%2BBoE%2BSANthSM6PYpMComOLRIEDI6LK0OXIjw2Fps8cimSaGoEUYVnLBcWBQgNikgjALAVkVJLEksvDDYTn4KrPgBiNgpFR0nCZgZyNTjKjWUWJgV0PNIvIQAh%2BQQJCQAVACwAAAAAGQAZAAAFpGAljpXTHMVURZEkkTDpMAtBIFQlsewbj4GBDfEwCHQ7XsTxqxhuB8DP1YsBEg5DojlylXylAmHLhTlYIwaCcCyTkj4I4eCO8UQIRKBub1UID3wxOy8EBoIwSRUDbYgihI5lCo2OLoUMkY9oRJkrfjcWmVVyKpVoFWoEUoJnfhUWBQgNiIojALMSTGW5OrpvVU1wTa08vJZKYFPInsWCVC89ySQhACH5BAkJABUALAAAAAAZABkAAAWeYCWOldMcxVRFkSSRMOkwC0EgVCWx7BuPgYEN8TAIdDtexPGrGG4HwM%2FViwESDkOiOXKVfKUCYcuFOVgjBoJwLJOSLweEcHDHeJUGAhGw31sHBA9%2BMTsSYgaEMEkKA22KIoaQXDtMk0hwlzo9aJdwnZNVVZBJkaN%2BZy0jp3alXXFgTQ4vEpZvrIsstmZKLUwuSbi5PC%2B9sWVUxS3HIyEAIfkECQkAAAAsAAAAABkAGQAABYggII6A0xzFBESRJJEw6TALQSAUILHsG4%2BBgQ3xMAh0O17E8QMYbofAz9WLOSQOY3PkKvlE1S3MweKGxSNyC7xGw5K6sjvWg8%2FfrfNdlGx99yVygFNLg3xUbYNJdoo9goBVenN2i3tqX5JijEheaFc6THiJMUmhVkotTC59o6RKL6h%2Fmjuwfk0hACH5BAUJAAAALAAAAAAZABkAAAV2ICCOoiRFEhChKemS54qq8vyOTo06gKnzt1jk1ou1SI6UiThaJkmrIxO3akanrpztinXFetXuK%2FoVe1Fcs5WsRobbwQgQbjLCS9F326hXX9NmZXZmWkeAWGUlKU9TTxJza1JnckRaMo9FQjZEmik6kkw%2BnixEIQA7)}.uploadcare-dialog{font-family:"Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif;position:fixed;left:0;top:0;width:100%;height:100%;background:rgba(49,49,49,0.95);z-index:10000;overflow:auto}.uploadcare-dialog *{margin:0;padding:0}.uploadcare-dialog-inner-wrap1{display:table;width:100%;height:100%}.uploadcare-dialog-inner-wrap2{display:table-cell;vertical-align:middle}.uploadcare-dialog-close{position:absolute;top:4px;left:0;width:100%;min-width:988px}.uploadcare-dialog-close>div{margin:0;padding:0;border:none;background:none;width:33px;height:33px;line-height:33px;font-size:29.7px;font-weight:bold;color:#1d1d1d;cursor:pointer;position:absolute;right:0;top:0}.uploadcare-dialog-panel-wrap{margin:0 auto;width:900px;padding:0 44px}.uploadcare-dialog-panel{width:900px;height:616px;overflow:hidden;border-radius:8px;background:#fff;-ms-box-shadow:0 1px 2px rgba(0,0,0,0.35);-moz-box-shadow:0 1px 2px rgba(0,0,0,0.35);-webkit-box-shadow:0 1px 2px rgba(0,0,0,0.35);-o-box-shadow:0 1px 2px rgba(0,0,0,0.35);box-shadow:0 1px 2px rgba(0,0,0,0.35);font-weight:normal}.uploadcare-dialog-panel a{text-decoration:none;border-bottom:1px dotted}.uploadcare-dialog-panel a:link,.uploadcare-dialog-panel a:visited{color:#1a85ad;border-bottom-color:#1a85ad}.uploadcare-dialog-panel a:hover,.uploadcare-dialog-panel a:active{color:#252525;border-bottom-color:#252525}.uploadcare-dialog-body .uploadcare-dialog-tabs{-ms-box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box;width:75px;height:616px;float:left;list-style:none;list-style-type:none;margin:0;padding:0;background:#dee0e1;border-bottom-left-radius:8px;border-top-left-radius:8px;overflow:hidden;position:relative}.uploadcare-dialog-body .uploadcare-dialog-tabs:before{content:\'\';display:block;position:absolute;top:0;right:0;bottom:0;width:0;border-left:1px solid #c5cace}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab{-ms-box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box;width:75px;height:66px;border-bottom:1px solid #c5cace;border-right:1px solid #c5cace;cursor:pointer;position:relative}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab:after{content:\'\';display:block;position:absolute;width:50px;height:50px;top:50%;left:50%;margin-top:-25px;margin-left:-25px}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab:hover{background-color:#ebeced}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab.uploadcare-dialog-selected-tab{margin-right:-1px;border-right:1px solid #efefef}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab.uploadcare-dialog-selected-tab,.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab.uploadcare-dialog-selected-tab:hover{background-color:#efefef}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab.uploadcare-dialog-tab-file:after{background-position:0 -50px}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab.uploadcare-dialog-tab-url:after{background-position:0 -100px}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab.uploadcare-dialog-tab-facebook:after{background-position:0 -150px}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab.uploadcare-dialog-tab-dropbox:after{background-position:0 -200px}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab.uploadcare-dialog-tab-gdrive:after{background-position:0 -250px}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab.uploadcare-dialog-tab-instagram:after{background-position:0 -300px}.uploadcare-dialog-body .uploadcare-dialog-tabs .uploadcare-dialog-tab.uploadcare-dialog-first-tab{border-top-left-radius:8px}.uploadcare-dialog-body .uploadcare-dialog-tabs-panel{position:relative;-ms-box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box;margin-left:75px;padding:22px 25px;width:825px;height:616px;line-height:22px;background:#efefef;border-bottom-right-radius:8px;border-top-right-radius:8px;font-size:16px;color:black}.uploadcare-dialog-body .uploadcare-dialog-tabs-panel input{-ms-box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box;width:100%;height:44px;margin-bottom:22px;padding:11px 12.5px;font-family:inherit;font-size:16px;border:1px solid #c5cace;background:white;color:black}.uploadcare-dialog-body .uploadcare-dialog-tabs-panel .uploadcare-dialog-drop-file{background:white;border:1px dashed #c5cace;border-radius:3px;height:99px;padding-top:77px;text-align:center;color:#545454}.uploadcare-dialog-body .uploadcare-dialog-tabs-panel-facebook,.uploadcare-dialog-body .uploadcare-dialog-tabs-panel-dropbox,.uploadcare-dialog-body .uploadcare-dialog-tabs-panel-gdrive,.uploadcare-dialog-body .uploadcare-dialog-tabs-panel-instagram{padding:0}.uploadcare-dialog-body .uploadcare-dialog-tabs-panel-facebook iframe,.uploadcare-dialog-body .uploadcare-dialog-tabs-panel-dropbox iframe,.uploadcare-dialog-body .uploadcare-dialog-tabs-panel-gdrive iframe,.uploadcare-dialog-body .uploadcare-dialog-tabs-panel-instagram iframe{border-bottom-right-radius:8px;border-top-right-radius:8px}.uploadcare-dialog-footer{font-size:13px;text-align:center;color:#888;margin-top:15px}.uploadcare-dialog-footer a{color:#c2c2c2;text-decoration:none}.uploadcare-dialog-footer a:hover{text-decoration:underline}.uploadcare-dialog-title{font-size:25px;line-height:1;font-weight:bolder;margin-bottom:25px}.uploadcare-dialog-title2{font-size:20px;line-height:1;padding-bottom:11px}.uploadcare-dialog-label{font-size:15px;line-height:25px;margin-bottom:12.5px}.uploadcare-dialog-section{margin-bottom:22px}.uploadcare-dialog-normal-text{font-size:13px;color:#545454}.uploadcare-dialog-button{display:inline-block;font-size:13px;line-height:31px;padding:0 22px;margin-right:.5em;border:solid 1px;border-radius:3px;cursor:pointer;color:#444}.uploadcare-dialog-button,.uploadcare-dialog-button[disabled]:active,.uploadcare-dialog-button.uploadcare-disabled-el:active,.uploadcare-dialog-button[disabled]:hover,.uploadcare-dialog-button.uploadcare-disabled-el:hover{background:#f3f3f3;background:-webkit-linear-gradient(whitesmoke,#f1f1f1);background:-moz-linear-gradient(whitesmoke,#f1f1f1);background:-o-linear-gradient(whitesmoke,#f1f1f1);background:linear-gradient(whitesmoke,#f1f1f1);-ms-box-shadow:none;-moz-box-shadow:none;-webkit-box-shadow:none;-o-box-shadow:none;box-shadow:none;border-color:gainsboro}.uploadcare-dialog-button:hover{background:#f8f8f8;background:-webkit-linear-gradient(#fbfbfb,#f6f6f6);background:-moz-linear-gradient(#fbfbfb,#f6f6f6);background:-o-linear-gradient(#fbfbfb,#f6f6f6);background:linear-gradient(#fbfbfb,#f6f6f6);-ms-box-shadow:inset 0 -1px 3px rgba(0,0,0,0.05);-moz-box-shadow:inset 0 -1px 3px rgba(0,0,0,0.05);-webkit-box-shadow:inset 0 -1px 3px rgba(0,0,0,0.05);-o-box-shadow:inset 0 -1px 3px rgba(0,0,0,0.05);box-shadow:inset 0 -1px 3px rgba(0,0,0,0.05)}.uploadcare-dialog-button:active{background:#f3f3f3;background:-webkit-linear-gradient(whitesmoke,#f1f1f1);background:-moz-linear-gradient(whitesmoke,#f1f1f1);background:-o-linear-gradient(whitesmoke,#f1f1f1);background:linear-gradient(whitesmoke,#f1f1f1);-ms-box-shadow:inset 0 2px 2px rgba(0,0,0,0.05);-moz-box-shadow:inset 0 2px 2px rgba(0,0,0,0.05);-webkit-box-shadow:inset 0 2px 2px rgba(0,0,0,0.05);-o-box-shadow:inset 0 2px 2px rgba(0,0,0,0.05);box-shadow:inset 0 2px 2px rgba(0,0,0,0.05)}.uploadcare-dialog-button[disabled],.uploadcare-dialog-button.uploadcare-disabled-el{cursor:default;opacity:.6}.uploadcare-dialog-button:active,.uploadcare-dialog-button:hover{border-color:#cbcbcb}.uploadcare-dialog-button-success{display:inline-block;font-size:13px;line-height:31px;padding:0 22px;margin-right:.5em;border:solid 1px;border-radius:3px;cursor:pointer;color:white}.uploadcare-dialog-button-success,.uploadcare-dialog-button-success[disabled]:active,.uploadcare-dialog-button-success.uploadcare-disabled-el:active,.uploadcare-dialog-button-success[disabled]:hover,.uploadcare-dialog-button-success.uploadcare-disabled-el:hover{background:#3786eb;background:-webkit-linear-gradient(#3b8df7,#347fdf);background:-moz-linear-gradient(#3b8df7,#347fdf);background:-o-linear-gradient(#3b8df7,#347fdf);background:linear-gradient(#3b8df7,#347fdf);-ms-box-shadow:none;-moz-box-shadow:none;-webkit-box-shadow:none;-o-box-shadow:none;box-shadow:none;border-color:#266fcb}.uploadcare-dialog-button-success:hover{background:#3279d6;background:-webkit-linear-gradient(#3986ea,#2c6dc2);background:-moz-linear-gradient(#3986ea,#2c6dc2);background:-o-linear-gradient(#3986ea,#2c6dc2);background:linear-gradient(#3986ea,#2c6dc2);-ms-box-shadow:inset 0 -1px 3px rgba(0,0,0,0.05);-moz-box-shadow:inset 0 -1px 3px rgba(0,0,0,0.05);-webkit-box-shadow:inset 0 -1px 3px rgba(0,0,0,0.05);-o-box-shadow:inset 0 -1px 3px rgba(0,0,0,0.05);box-shadow:inset 0 -1px 3px rgba(0,0,0,0.05)}.uploadcare-dialog-button-success:active{background:#3177d3;background:-webkit-linear-gradient(#3680e1,#2c6fc5);background:-moz-linear-gradient(#3680e1,#2c6fc5);background:-o-linear-gradient(#3680e1,#2c6fc5);background:linear-gradient(#3680e1,#2c6fc5);-ms-box-shadow:inset 0 2px 2px rgba(0,0,0,0.05);-moz-box-shadow:inset 0 2px 2px rgba(0,0,0,0.05);-webkit-box-shadow:inset 0 2px 2px rgba(0,0,0,0.05);-o-box-shadow:inset 0 2px 2px rgba(0,0,0,0.05);box-shadow:inset 0 2px 2px rgba(0,0,0,0.05)}.uploadcare-dialog-button-success[disabled],.uploadcare-dialog-button-success.uploadcare-disabled-el{cursor:default;opacity:.6}.uploadcare-dialog-button-success:active,.uploadcare-dialog-button-success:hover{border-color:#266eca #1f62b7 #1753a1}.uploadcare-dialog-button-success:hover{-ms-box-shadow:inset 0 -1px 3px rgba(22,82,160,0.5);-moz-box-shadow:inset 0 -1px 3px rgba(22,82,160,0.5);-webkit-box-shadow:inset 0 -1px 3px rgba(22,82,160,0.5);-o-box-shadow:inset 0 -1px 3px rgba(22,82,160,0.5);box-shadow:inset 0 -1px 3px rgba(22,82,160,0.5)}.uploadcare-dialog-button-success:active{-ms-box-shadow:inset 0 1px 3px rgba(22,82,160,0.4);-moz-box-shadow:inset 0 1px 3px rgba(22,82,160,0.4);-webkit-box-shadow:inset 0 1px 3px rgba(22,82,160,0.4);-o-box-shadow:inset 0 1px 3px rgba(22,82,160,0.4);box-shadow:inset 0 1px 3px rgba(22,82,160,0.4)}.uploadcare-dialog-big-button{border-radius:100px;font-size:20px;font-weight:normal;letter-spacing:1px;color:white;line-height:64px;border:solid 1px #276fcb;text-shadow:0 -1px #2a7ce5;display:inline-block;padding:0 2em;cursor:pointer;-ms-box-shadow:inset 0 -2px #1f66c1;-moz-box-shadow:inset 0 -2px #1f66c1;-webkit-box-shadow:inset 0 -2px #1f66c1;-o-box-shadow:inset 0 -2px #1f66c1;box-shadow:inset 0 -2px #1f66c1;background:#458dee;background:-webkit-linear-gradient(#4892f6,#4289e6);background:-moz-linear-gradient(#4892f6,#4289e6);background:-o-linear-gradient(#4892f6,#4289e6);background:linear-gradient(#4892f6,#4289e6)}.uploadcare-dialog-big-button:hover{-ms-box-shadow:inset 0 -2px #1652a0;-moz-box-shadow:inset 0 -2px #1652a0;-webkit-box-shadow:inset 0 -2px #1652a0;-o-box-shadow:inset 0 -2px #1652a0;box-shadow:inset 0 -2px #1652a0;background:#3279d6;background:-webkit-linear-gradient(#3986eb,#2c6dc2);background:-moz-linear-gradient(#3986eb,#2c6dc2);background:-o-linear-gradient(#3986eb,#2c6dc2);background:linear-gradient(#3986eb,#2c6dc2)}.uploadcare-dialog-big-button:active{border:none;line-height:66px;-ms-box-shadow:inset 0 2px #2561b9;-moz-box-shadow:inset 0 2px #2561b9;-webkit-box-shadow:inset 0 2px #2561b9;-o-box-shadow:inset 0 2px #2561b9;box-shadow:inset 0 2px #2561b9;background:#2c6ec3;background:-webkit-linear-gradient(#2c6ec3,#2c6ec3);background:-moz-linear-gradient(#2c6ec3,#2c6ec3);background:-o-linear-gradient(#2c6ec3,#2c6ec3);background:linear-gradient(#2c6ec3,#2c6ec3)}.uploadcare-dialog-preview-image-wrap1{width:100%;height:452px;margin-bottom:25px;display:table}.uploadcare-dialog-preview-image-wrap2{display:table-cell;vertical-align:middle;text-align:center}.uploadcare-dialog-preview-image-wrap2 img{max-width:775px;max-height:452px;display:block;margin:0 auto}.uploadcare-dialog-preview-footer{background:#fff3be;border-top:1px solid #efe2a9;height:33px;padding:16px 30px;margin:0 -25px -22px;border-bottom-right-radius:8px}.uploadcare-dialog-preview-footer .uploadcare-dialog-button-success{float:right;margin-right:0}.uploadcare-dialog-preview-footer .uploadcare-dialog-button{float:left}.uploadcare-dialog-preview-center{text-align:center;padding-top:176px}.uploadcare-dialog-preview-circle{width:66px;height:66px;display:inline-block;margin-bottom:22px}.uploadcare-no-draganddrop .uploadcare-if-draganddrop{display:none}.uploadcare-draganddrop .uploadcare-if-no-draganddrop{display:none}.uploadcare-dialog-file-drop-area{width:100%;height:100%;-ms-box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box;background:#f8f8f8;border:dashed 3px #c5cacd;text-align:center;border-radius:3px;padding-top:70px}.uploadcare-dialog-file-drop-area .uploadcare-dialog-big-button{margin-top:11px;margin-bottom:55px}.uploadcare-no-draganddrop .uploadcare-dialog-file-drop-area{border:none;padding-top:73px;background:transparent}.uploadcare-dialog-file-title{font-size:40px;line-height:1;color:#dee0e1;font-weight:bold;margin-bottom:66px;text-shadow:0 1px white}.uploadcare-no-draganddrop .uploadcare-dialog-file-title{text-shadow:none;color:black;margin-top:66px}.uploadcare-dialog-file-or{font-size:13px;color:#8f9498;margin-bottom:44px}.uploadcare-dialog-file-sources{position:relative;display:inline-block}.uploadcare-dialog-file-sources:before{content:\'\';display:block;position:absolute;width:67px;height:44px;top:-32px;left:-90px}.uploadcare-dialog-file-source{display:inline;font-size:15px;margin-right:.2em;cursor:pointer;font-weight:300}.uploadcare-dialog-file-source:after{content:\'\\00B7\';color:#b7babc;margin-left:.5em}.uploadcare-dialog-file-source:last-child:after{display:none}.uploadcare-draging .uploadcare-dialog-file-or,.uploadcare-draging .uploadcare-dialog-file-sources,.uploadcare-draging .uploadcare-dialog-file-drop-area .uploadcare-dialog-big-button{display:none}.uploadcare-draging .uploadcare-dialog-file-drop-area{background:#f2f7fe;border-color:#438ae7;padding-top:264px}.uploadcare-draging .uploadcare-dialog-file-title{color:#438ae7}.uploadcare-crop-widget .jcrop-holder{direction:ltr;text-align:left}.uploadcare-crop-widget .jcrop-vline,.uploadcare-crop-widget .jcrop-hline{background-color:white;background-position:top left;background-repeat:repeat;font-size:0;position:absolute}.uploadcare-crop-widget .jcrop-vline{height:100%;width:1px!important}.uploadcare-crop-widget .jcrop-hline{height:1px!important;width:100%}.uploadcare-crop-widget .jcrop-vline.right{right:0}.uploadcare-crop-widget .jcrop-hline.bottom{bottom:0}.uploadcare-crop-widget .jcrop-handle{background-color:#333;border:1px #eee solid;font-size:1px}.uploadcare-crop-widget .jcrop-tracker{height:100%;width:100%;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;-webkit-user-select:none}.uploadcare-crop-widget .jcrop-handle.ord-n{left:50%;margin-left:-4px;margin-top:-4px;top:0}.uploadcare-crop-widget .jcrop-handle.ord-s{bottom:0;left:50%;margin-bottom:-4px;margin-left:-4px}.uploadcare-crop-widget .jcrop-handle.ord-e{margin-right:-4px;margin-top:-4px;right:0;top:50%}.uploadcare-crop-widget .jcrop-handle.ord-w{left:0;margin-left:-4px;margin-top:-4px;top:50%}.uploadcare-crop-widget .jcrop-handle.ord-nw{left:0;margin-left:-4px;margin-top:-4px;top:0}.uploadcare-crop-widget .jcrop-handle.ord-ne{margin-right:-4px;margin-top:-4px;right:0;top:0}.uploadcare-crop-widget .jcrop-handle.ord-se{bottom:0;margin-bottom:-4px;margin-right:-4px;right:0}.uploadcare-crop-widget .jcrop-handle.ord-sw{bottom:0;left:0;margin-bottom:-4px;margin-left:-4px}.uploadcare-crop-widget .jcrop-dragbar.ord-n,.uploadcare-crop-widget .jcrop-dragbar.ord-s{height:7px;width:100%}.uploadcare-crop-widget .jcrop-dragbar.ord-e,.uploadcare-crop-widget .jcrop-dragbar.ord-w{height:100%;width:7px}.uploadcare-crop-widget .jcrop-dragbar.ord-n{margin-top:-4px}.uploadcare-crop-widget .jcrop-dragbar.ord-s{bottom:0;margin-bottom:-4px}.uploadcare-crop-widget .jcrop-dragbar.ord-e{margin-right:-4px;right:0}.uploadcare-crop-widget .jcrop-dragbar.ord-w{margin-left:-4px}.uploadcare-crop-widget .jcrop-light .jcrop-vline,.uploadcare-crop-widget .jcrop-light .jcrop-hline{background:#FFF;filter:Alpha(opacity=70)!important;opacity:.70!important}.uploadcare-crop-widget .jcrop-light .jcrop-handle{-moz-border-radius:3px;-webkit-border-radius:3px;background-color:#000;border-color:#FFF;border-radius:3px}.uploadcare-crop-widget .jcrop-dark .jcrop-vline,.uploadcare-crop-widget .jcrop-dark .jcrop-hline{background:#000;filter:Alpha(opacity=70)!important;opacity:.7!important}.uploadcare-crop-widget .jcrop-dark .jcrop-handle{-moz-border-radius:3px;-webkit-border-radius:3px;background-color:#FFF;border-color:#000;border-radius:3px}.uploadcare-crop-widget .jcrop-holder img,.uploadcare-crop-widget img.jcrop-preview{max-width:none}.uploadcare-crop-widget{font-family:"Helvetica Neue",Helvetica,Arial,"Lucida Grande",sans-serif}.uploadcare-crop-widget__image-wrap{position:relative}.uploadcare-crop-widget--loading .uploadcare-crop-widget__image-wrap{background-repeat:no-repeat;background-position:center}.uploadcare-crop-widget__image-wrap img{display:block}.uploadcare-crop-widget__error{-ms-box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box;text-align:center;position:absolute;top:50%;left:0;right:0;margin-top:-1em;display:none}.uploadcare-crop-widget--error .uploadcare-crop-widget__error{display:block}.uploadcare-crop-widget__error__title{font-size:20px}.uploadcare-crop-widget__error__text{font-size:15px}.uploadcare-crop-widget__controls{height:30px;padding-top:5px;text-align:center}.uploadcare-crop-widget--no-controls .uploadcare-crop-widget__controls{display:none}.uploadcare-widget{display:inline-block!important;position:relative;vertical-align:middle;padding:0 5px}.uploadcare-widget[data-status=loaded] .uploadcare-widget-buttons>li,.uploadcare-widget[data-status=started] .uploadcare-widget-buttons>li{display:none}.uploadcare-widget[data-status=started] .uploadcare-widget-buttons .uploadcare-widget-buttons-cancel,.uploadcare-widget[data-status=loaded] .uploadcare-widget-buttons .uploadcare-widget-buttons-remove{display:inline-block}.uploadcare-widget .uploadcare-widget-circle{width:25px;height:25px;top:-1px;float:left;margin-right:1ex}.uploadcare-widget-circle{position:relative;font-size:0}.uploadcare-widget-circle .uploadcare-widget-circle-back{position:relative;width:100%;height:100%;border-radius:50%;background:#e1e5e7}.uploadcare-widget-circle .uploadcare-widget-circle-back.uploadcare-widget-circle-active{background:#d0bf26}.uploadcare-widget-circle .uploadcare-widget-circle-center{position:absolute;background:white;width:10%;height:10%;top:50%;left:50%;border-radius:50%;margin-top:-5%;margin-left:-5%}.uploadcare-widget-buttons{position:relative;top:-1px;float:left;overflow:hidden;margin:0;padding:0;list-style:none}.uploadcare-widget-buttons>li{height:24px;float:left;font-size:11px;color:#8f9295;line-height:25px;min-width:36px;padding:0 6px;margin:0 3px 1px 0;list-style:none;-ms-box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-o-box-sizing:border-box;box-sizing:border-box;border-radius:2px;background:#e1e5e7;cursor:default}.uploadcare-widget-buttons>li.uploadcare-widget-buttons-dialog,.uploadcare-widget-buttons>li.uploadcare-widget-buttons-file,.uploadcare-widget-buttons>li.uploadcare-widget-buttons-url{background-position:0 0;background-repeat:no-repeat;padding-left:30px}.uploadcare-widget-buttons>li.uploadcare-widget-buttons-dialog,.uploadcare-widget-buttons>li.uploadcare-widget-buttons-url{background-position:0 -24px}.uploadcare-widget-buttons>li.uploadcare-widget-buttons-cancel,.uploadcare-widget-buttons>li.uploadcare-widget-buttons-remove{font-size:.9em;display:none}.uploadcare-widget-status-text{float:left;overflow:hidden;line-height:25px;height:25px;margin-right:1ex;white-space:nowrap;padding:0 5px}.uploadcare-widget-file-name{cursor:pointer;color:#1a85ad;border-bottom-color:#1a85ad;text-decoration:none;border-bottom:1px dotted}.uploadcare-widget .uploadcare-widget-dragndrop-area{display:none;position:absolute;top:-8px;left:0;width:100%;height:41px;line-height:41px;text-align:center;background-color:#f0f0f0;color:#707478;border:1px dashed #b3b5b6;border-radius:20.5px}.uploadcare-widget .uploadcare-widget-dragndrop-area.uploadcare-dragging{display:block}\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/tab-file"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="uploadcare-dialog-file-drop-area" role="uploadcare-drop-area">\n  <div class="uploadcare-dialog-file-title uploadcare-if-draganddrop">\n    ',(''+ t('dialog.tabs.file.drag') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'\n  </div>\n  <div class="uploadcare-dialog-file-title uploadcare-if-no-draganddrop">\n    ',(''+ t('dialog.tabs.file.nodrop') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'\n  </div>\n  <div class="uploadcare-dialog-file-or uploadcare-if-draganddrop">\n    ',(''+ t('dialog.tabs.file.or') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'\n  </div>\n  <div class="uploadcare-dialog-big-button" role="uploadcare-dialog-browse-file">\n    ',(''+ t('dialog.tabs.file.button') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'\n  </div>\n  <div class="uploadcare-dialog-file-or">\n    ',(''+ t('dialog.tabs.file.also') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'\n  </div>\n  <div class="uploadcare-dialog-file-sources">\n    ');  for (var i = 0; i < avalibleTabs.length; i++) { 
        var tab = avalibleTabs[i];
        if (tab == 'file') continue; ; __p.push('\n      <div \n        class="uploadcare-dialog-file-source"\n        role="uploadcare-dialog-switch-tab"\n        data-tab="',(''+ tab ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'"\n      >',(''+ t('dialog.tabs.file.tabNames.' + tab) ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n    ');  } ; __p.push('\n  </div>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/tab-preview-error"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="uploadcare-dialog-title">',(''+ 
    t('dialog.tabs.preview.error.'+error+'.title') || t('dialog.tabs.preview.error.default.title')
  ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n\n<div class="uploadcare-dialog-label">\n  ',(''+ (file.name || t('dialog.tabs.preview.unknownName')) ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'');  if (file.size != null) { ; __p.push(',\n  ',(''+ Math.round(file.size/1000) ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),' KB');  } ; __p.push('\n</div>\n\n<div class="uploadcare-dialog-section uploadcare-dialog-normal-text">\n  ',(''+ 
      t('dialog.tabs.preview.error.'+error+'.line1') || t('dialog.tabs.preview.error.default.line1')
    ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'<br/>\n  ',(''+ 
      t('dialog.tabs.preview.error.'+error+'.line2') || t('dialog.tabs.preview.error.default.line2')
    ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'\n</div>\n\n<div\n  class="uploadcare-dialog-button-success" \n  role="uploadcare-dialog-preview-back">',(''+ t('dialog.tabs.preview.change') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/tab-preview-image"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="uploadcare-dialog-title">',(''+ t('dialog.tabs.preview.image.title') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n\n<div class="uploadcare-dialog-preview-image-wrap1">\n<div class="uploadcare-dialog-preview-image-wrap2">\n  <img \n    src="',(''+ file.previewUrl ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'" \n    title="',(''+ (file.name || t('dialog.tabs.preview.unknownName')) ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'" \n    alt="',(''+ (file.name || t('dialog.tabs.preview.unknownName')) ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'"\n    role="uploadcare-dialog-preview-image"\n  />\n</div>\n</div>\n\n<div class="uploadcare-dialog-preview-footer">\n  <div \n    class="uploadcare-dialog-button" \n    role="uploadcare-dialog-preview-back">',(''+ t('dialog.tabs.preview.image.change') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n  <div \n    class="uploadcare-dialog-button-success" \n    role="uploadcare-dialog-preview-done">',(''+ t('dialog.tabs.preview.done') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/tab-preview-regular"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="uploadcare-dialog-title">',(''+ t('dialog.tabs.preview.regular.title') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n\n<div class="uploadcare-dialog-label">\n  ',(''+ (file.name || t('dialog.tabs.preview.unknownName')) ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'');  if (file.size != null) { ; __p.push(',\n  ',(''+ Math.round(file.size/1000) ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),' KB');  } ; __p.push('\n</div>\n\n<div class="uploadcare-dialog-section uploadcare-dialog-normal-text">\n  ',(''+ t('dialog.tabs.preview.regular.line1') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'<br/>\n  ',(''+ t('dialog.tabs.preview.regular.line2') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'\n</div>\n\n<div \n  class="uploadcare-dialog-button-success" \n  role="uploadcare-dialog-preview-done">',(''+ t('dialog.tabs.preview.done') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n<div \n  class="uploadcare-dialog-button" \n  role="uploadcare-dialog-preview-back">',(''+ t('dialog.tabs.preview.change') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/tab-preview-unknown"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="uploadcare-dialog-preview-center">\n  \n  <div \n    class="uploadcare-dialog-preview-circle"\n    role="uploadcare-dialog-preview-circle"></div>\n  <div class="uploadcare-dialog-title2">',(''+ t('dialog.tabs.preview.unknown.title') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n  <div class="uploadcare-dialog-label">\n    ',(''+ (file.name || t('dialog.tabs.preview.unknownName')) ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'');  if (file.size != null) { ; __p.push(',\n    ',(''+ Math.round(file.size/1000) ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),' KB');  } ; __p.push('\n  </div>\n  <div \n    class="uploadcare-dialog-button-success" \n    role="uploadcare-dialog-preview-done">',(''+ t('dialog.tabs.preview.unknown.done') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/tab-preview"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/tab-url"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="uploadcare-dialog-title">',(''+ t('dialog.tabs.url.title') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n<div class="uploadcare-dialog-section uploadcare-dialog-normal-text">\n    <div>',(''+ t('dialog.tabs.url.line1') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n    <div>',(''+ t('dialog.tabs.url.line2') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n</div>\n<form role="uploadcare-dialog-url-form">\n    <input type="text" role="uploadcare-dialog-url-input" placeholder="',(''+ t('dialog.tabs.url.input') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'">\n    <button class="uploadcare-dialog-button" type="submit" role="uploadcare-dialog-url-submit">',(''+ t('dialog.tabs.url.button') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</button>\n</form>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/widget-button"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<li \n  role="uploadcare-widget-buttons-',  name ,'" \n  class="uploadcare-widget-buttons-',  name ,'"\n>',(''+ caption ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</li>\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/widget-file-name"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<span \n  role="uploadcare-widget-file-name" \n  class="uploadcare-widget-file-name">',(''+ name ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</span>,\n',(''+ size ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),' kb\n');}return __p.join('');};
}).call(this);
(function() {
  this.JST || (this.JST = {});
  this.JST["uploadcare/templates/widget"] = function(obj){var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('<div class="uploadcare-widget">\n    <div role="uploadcare-widget-status"></div>\n    <div role="uploadcare-widget-status-text" class="uploadcare-widget-status-text"></div>\n    <ul role="uploadcare-widget-buttons" class="uploadcare-widget-buttons"></ul>\n    <div class="uploadcare-widget-dragndrop-area" role="uploadcare-drop-area">',(''+ t('draghere') ).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g,'&#x2F;'),'</div>\n</div>\n');}return __p.join('');};
}).call(this);
(function() {
  var locale, namespace;

  namespace = uploadcare.namespace, locale = uploadcare.locale;

  namespace('uploadcare.templates', function(ns) {
    return ns.tpl = function(key, ctx) {
      var fn;
      if (ctx == null) {
        ctx = {};
      }
      fn = JST["uploadcare/templates/" + key];
      if (fn != null) {
        ctx.t = locale.t;
        return fn(ctx);
      } else {
        return '';
      }
    };
  });

}).call(this);
(function() {
  var $, css, style, tpl;

  $ = uploadcare.jQuery;

  tpl = uploadcare.templates.tpl;

  css = tpl('styles');

  style = document.createElement('style');

  style.setAttribute('type', 'text/css');

  if (style.styleSheet != null) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }

  $('head').append(style);

}).call(this);
/**
 * jquery.Jcrop.js v0.9.10
 * jQuery Image Cropping Plugin - released under MIT License 
 * Author: Kelly Hallman <khallman@gmail.com>
 * http://github.com/tapmodo/Jcrop
 * Copyright (c) 2008-2012 Tapmodo Interactive LLC {{{
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * }}}
 */


(function ($) {

  $.Jcrop = function (obj, opt) {
    var options = $.extend({}, $.Jcrop.defaults),
        docOffset, lastcurs, ie6mode = false;

    // Internal Methods {{{
    function px(n) {
      return Math.round(n) + 'px';
    }
    function cssClass(cl) {
      return options.baseClass + '-' + cl;
    }
    function supportsColorFade() {
      return $.fx.step.hasOwnProperty('backgroundColor');
    }
    function getPos(obj) //{{{
    {
      var pos = $(obj).offset();
      return [pos.left, pos.top];
    }
    //}}}
    function mouseAbs(e) //{{{
    {
      return [(e.pageX - docOffset[0]), (e.pageY - docOffset[1])];
    }
    //}}}
    function setOptions(opt) //{{{
    {
      if (typeof(opt) !== 'object') opt = {};
      options = $.extend(options, opt);

      $.each(['onChange','onSelect','onRelease','onDblClick'],function(i,e) {
        if (typeof(options[e]) !== 'function') options[e] = function () {};
      });
    }
    //}}}
    function startDragMode(mode, pos) //{{{
    {
      docOffset = getPos($img);
      Tracker.setCursor(mode === 'move' ? mode : mode + '-resize');

      if (mode === 'move') {
        return Tracker.activateHandlers(createMover(pos), doneSelect);
      }

      var fc = Coords.getFixed();
      var opp = oppLockCorner(mode);
      var opc = Coords.getCorner(oppLockCorner(opp));

      Coords.setPressed(Coords.getCorner(opp));
      Coords.setCurrent(opc);

      Tracker.activateHandlers(dragmodeHandler(mode, fc), doneSelect);
    }
    //}}}
    function dragmodeHandler(mode, f) //{{{
    {
      return function (pos) {
        if (!options.aspectRatio) {
          switch (mode) {
          case 'e':
            pos[1] = f.y2;
            break;
          case 'w':
            pos[1] = f.y2;
            break;
          case 'n':
            pos[0] = f.x2;
            break;
          case 's':
            pos[0] = f.x2;
            break;
          }
        } else {
          switch (mode) {
          case 'e':
            pos[1] = f.y + 1;
            break;
          case 'w':
            pos[1] = f.y + 1;
            break;
          case 'n':
            pos[0] = f.x + 1;
            break;
          case 's':
            pos[0] = f.x + 1;
            break;
          }
        }
        Coords.setCurrent(pos);
        Selection.update();
      };
    }
    //}}}
    function createMover(pos) //{{{
    {
      var lloc = pos;
      KeyManager.watchKeys();

      return function (pos) {
        Coords.moveOffset([pos[0] - lloc[0], pos[1] - lloc[1]]);
        lloc = pos;

        Selection.update();
      };
    }
    //}}}
    function oppLockCorner(ord) //{{{
    {
      switch (ord) {
      case 'n':
        return 'sw';
      case 's':
        return 'nw';
      case 'e':
        return 'nw';
      case 'w':
        return 'ne';
      case 'ne':
        return 'sw';
      case 'nw':
        return 'se';
      case 'se':
        return 'nw';
      case 'sw':
        return 'ne';
      }
    }
    //}}}
    function createDragger(ord) //{{{
    {
      return function (e) {
        if (options.disabled) {
          return false;
        }
        if ((ord === 'move') && !options.allowMove) {
          return false;
        }
        
        // Fix position of crop area when dragged the very first time.
        // Necessary when crop image is in a hidden element when page is loaded.
        docOffset = getPos($img);

        btndown = true;
        startDragMode(ord, mouseAbs(e));
        e.stopPropagation();
        e.preventDefault();
        return false;
      };
    }
    //}}}
    function presize($obj, w, h) //{{{
    {
      var nw = $obj.width(),
          nh = $obj.height();
      if ((nw > w) && w > 0) {
        nw = w;
        nh = (w / $obj.width()) * $obj.height();
      }
      if ((nh > h) && h > 0) {
        nh = h;
        nw = (h / $obj.height()) * $obj.width();
      }
      xscale = $obj.width() / nw;
      yscale = $obj.height() / nh;
      $obj.width(nw).height(nh);
    }
    //}}}
    function unscale(c) //{{{
    {
      return {
        x: c.x * xscale,
        y: c.y * yscale,
        x2: c.x2 * xscale,
        y2: c.y2 * yscale,
        w: c.w * xscale,
        h: c.h * yscale
      };
    }
    //}}}
    function doneSelect(pos) //{{{
    {
      var c = Coords.getFixed();
      if ((c.w > options.minSelect[0]) && (c.h > options.minSelect[1])) {
        Selection.enableHandles();
        Selection.done();
      } else {
        Selection.release();
      }
      Tracker.setCursor(options.allowSelect ? 'crosshair' : 'default');
    }
    //}}}
    function newSelection(e) //{{{
    {
      if (options.disabled) {
        return false;
      }
      if (!options.allowSelect) {
        return false;
      }
      btndown = true;
      docOffset = getPos($img);
      Selection.disableHandles();
      Tracker.setCursor('crosshair');
      var pos = mouseAbs(e);
      Coords.setPressed(pos);
      Selection.update();
      Tracker.activateHandlers(selectDrag, doneSelect);
      KeyManager.watchKeys();

      e.stopPropagation();
      e.preventDefault();
      return false;
    }
    //}}}
    function selectDrag(pos) //{{{
    {
      Coords.setCurrent(pos);
      Selection.update();
    }
    //}}}
    function newTracker() //{{{
    {
      var trk = $('<div></div>').addClass(cssClass('tracker'));
      if ($.browser.msie) {
        trk.css({
          opacity: 0,
          backgroundColor: 'white'
        });
      }
      return trk;
    }
    //}}}

    // }}}
    // Initialization {{{
    // Sanitize some options {{{
    if ($.browser.msie && ($.browser.version.split('.')[0] === '6')) {
      ie6mode = true;
    }
    if (typeof(obj) !== 'object') {
      obj = $(obj)[0];
    }
    if (typeof(opt) !== 'object') {
      opt = {};
    }
    // }}}
    setOptions(opt);
    // Initialize some jQuery objects {{{
    // The values are SET on the image(s) for the interface
    // If the original image has any of these set, they will be reset
    // However, if you destroy() the Jcrop instance the original image's
    // character in the DOM will be as you left it.
    var img_css = {
      border: 'none',
      visibility: 'visible',
      margin: 0,
      padding: 0,
      position: 'absolute',
      top: 0,
      left: 0
    };

    var $origimg = $(obj),
      img_mode = true;

    if (obj.tagName == 'IMG') {
      // Fix size of crop image.
      // Necessary when crop image is within a hidden element when page is loaded.
      if ($origimg[0].width != 0 && $origimg[0].height != 0) {
        // Obtain dimensions from contained img element.
        $origimg.width($origimg[0].width);
        $origimg.height($origimg[0].height);
      } else {
        // Obtain dimensions from temporary image in case the original is not loaded yet (e.g. IE 7.0). 
        var tempImage = new Image();
        tempImage.src = $origimg[0].src;
        $origimg.width(tempImage.width);
        $origimg.height(tempImage.height);
      } 

      var $img = $origimg.clone().removeAttr('id').css(img_css).show();

      $img.width($origimg.width());
      $img.height($origimg.height());
      $origimg.after($img).hide();

    } else {
      $img = $origimg.css(img_css).show();
      img_mode = false;
      if (options.shade === null) { options.shade = true; }
    }

    presize($img, options.boxWidth, options.boxHeight);

    var boundx = $img.width(),
        boundy = $img.height(),
        
        
        $div = $('<div />').width(boundx).height(boundy).addClass(cssClass('holder')).css({
        position: 'relative',
        backgroundColor: options.bgColor
      }).insertAfter($origimg).append($img);

    if (options.addClass) {
      $div.addClass(options.addClass);
    }

    var $img2 = $('<div />'),

        $img_holder = $('<div />') 
        .width('100%').height('100%').css({
          zIndex: 310,
          position: 'absolute',
          overflow: 'hidden'
        }),

        $hdl_holder = $('<div />') 
        .width('100%').height('100%').css('zIndex', 320), 

        $sel = $('<div />') 
        .css({
          position: 'absolute',
          zIndex: 600
        }).dblclick(function(){
          var c = Coords.getFixed();
          options.onDblClick.call(api,c);
        }).insertBefore($img).append($img_holder, $hdl_holder); 

    if (img_mode) {

      $img2 = $('<img />')
          .attr('src', $img.attr('src')).css(img_css).width(boundx).height(boundy),

      $img_holder.append($img2);

    }

    if (ie6mode) {
      $sel.css({
        overflowY: 'hidden'
      });
    }

    var bound = options.boundary;
    var $trk = newTracker().width(boundx + (bound * 2)).height(boundy + (bound * 2)).css({
      position: 'absolute',
      top: px(-bound),
      left: px(-bound),
      zIndex: 290
    }).mousedown(newSelection);

    /* }}} */
    // Set more variables {{{
    var bgcolor = options.bgColor,
        bgopacity = options.bgOpacity,
        xlimit, ylimit, xmin, ymin, xscale, yscale, enabled = true,
        btndown, animating, shift_down;

    docOffset = getPos($img);
    // }}}
    // }}}
    // Internal Modules {{{
    // Touch Module {{{ 
    var Touch = (function () {
      // Touch support detection function adapted (under MIT License)
      // from code by Jeffrey Sambells - http://github.com/iamamused/
      function hasTouchSupport() {
        var support = {},
            events = ['touchstart', 'touchmove', 'touchend'],
            el = document.createElement('div'), i;

        try {
          for(i=0; i<events.length; i++) {
            var eventName = events[i];
            eventName = 'on' + eventName;
            var isSupported = (eventName in el);
            if (!isSupported) {
              el.setAttribute(eventName, 'return;');
              isSupported = typeof el[eventName] == 'function';
            }
            support[events[i]] = isSupported;
          }
          return support.touchstart && support.touchend && support.touchmove;
        }
        catch(err) {
          return false;
        }
      }

      function detectSupport() {
        if ((options.touchSupport === true) || (options.touchSupport === false)) return options.touchSupport;
          else return hasTouchSupport();
      }
      return {
        createDragger: function (ord) {
          return function (e) {
            e.pageX = e.originalEvent.changedTouches[0].pageX;
            e.pageY = e.originalEvent.changedTouches[0].pageY;
            if (options.disabled) {
              return false;
            }
            if ((ord === 'move') && !options.allowMove) {
              return false;
            }
            btndown = true;
            startDragMode(ord, mouseAbs(e));
            e.stopPropagation();
            e.preventDefault();
            return false;
          };
        },
        newSelection: function (e) {
          e.pageX = e.originalEvent.changedTouches[0].pageX;
          e.pageY = e.originalEvent.changedTouches[0].pageY;
          return newSelection(e);
        },
        isSupported: hasTouchSupport,
        support: detectSupport()
      };
    }());
    // }}}
    // Coords Module {{{
    var Coords = (function () {
      var x1 = 0,
          y1 = 0,
          x2 = 0,
          y2 = 0,
          ox, oy;

      function setPressed(pos) //{{{
      {
        pos = rebound(pos);
        x2 = x1 = pos[0];
        y2 = y1 = pos[1];
      }
      //}}}
      function setCurrent(pos) //{{{
      {
        pos = rebound(pos);
        ox = pos[0] - x2;
        oy = pos[1] - y2;
        x2 = pos[0];
        y2 = pos[1];
      }
      //}}}
      function getOffset() //{{{
      {
        return [ox, oy];
      }
      //}}}
      function moveOffset(offset) //{{{
      {
        var ox = offset[0],
            oy = offset[1];

        if (0 > x1 + ox) {
          ox -= ox + x1;
        }
        if (0 > y1 + oy) {
          oy -= oy + y1;
        }

        if (boundy < y2 + oy) {
          oy += boundy - (y2 + oy);
        }
        if (boundx < x2 + ox) {
          ox += boundx - (x2 + ox);
        }

        x1 += ox;
        x2 += ox;
        y1 += oy;
        y2 += oy;
      }
      //}}}
      function getCorner(ord) //{{{
      {
        var c = getFixed();
        switch (ord) {
        case 'ne':
          return [c.x2, c.y];
        case 'nw':
          return [c.x, c.y];
        case 'se':
          return [c.x2, c.y2];
        case 'sw':
          return [c.x, c.y2];
        }
      }
      //}}}
      function getFixed() //{{{
      {
        if (!options.aspectRatio) {
          return getRect();
        }
        // This function could use some optimization I think...
        var aspect = options.aspectRatio,
            min_x = options.minSize[0] / xscale,
            
            
            //min_y = options.minSize[1]/yscale,
            max_x = options.maxSize[0] / xscale,
            max_y = options.maxSize[1] / yscale,
            rw = x2 - x1,
            rh = y2 - y1,
            rwa = Math.abs(rw),
            rha = Math.abs(rh),
            real_ratio = rwa / rha,
            xx, yy, w, h;

        if (max_x === 0) {
          max_x = boundx * 10;
        }
        if (max_y === 0) {
          max_y = boundy * 10;
        }
        if (real_ratio < aspect) {
          yy = y2;
          w = rha * aspect;
          xx = rw < 0 ? x1 - w : w + x1;

          if (xx < 0) {
            xx = 0;
            h = Math.abs((xx - x1) / aspect);
            yy = rh < 0 ? y1 - h : h + y1;
          } else if (xx > boundx) {
            xx = boundx;
            h = Math.abs((xx - x1) / aspect);
            yy = rh < 0 ? y1 - h : h + y1;
          }
        } else {
          xx = x2;
          h = rwa / aspect;
          yy = rh < 0 ? y1 - h : y1 + h;
          if (yy < 0) {
            yy = 0;
            w = Math.abs((yy - y1) * aspect);
            xx = rw < 0 ? x1 - w : w + x1;
          } else if (yy > boundy) {
            yy = boundy;
            w = Math.abs(yy - y1) * aspect;
            xx = rw < 0 ? x1 - w : w + x1;
          }
        }

        // Magic %-)
        if (xx > x1) { // right side
          if (xx - x1 < min_x) {
            xx = x1 + min_x;
          } else if (xx - x1 > max_x) {
            xx = x1 + max_x;
          }
          if (yy > y1) {
            yy = y1 + (xx - x1) / aspect;
          } else {
            yy = y1 - (xx - x1) / aspect;
          }
        } else if (xx < x1) { // left side
          if (x1 - xx < min_x) {
            xx = x1 - min_x;
          } else if (x1 - xx > max_x) {
            xx = x1 - max_x;
          }
          if (yy > y1) {
            yy = y1 + (x1 - xx) / aspect;
          } else {
            yy = y1 - (x1 - xx) / aspect;
          }
        }

        if (xx < 0) {
          x1 -= xx;
          xx = 0;
        } else if (xx > boundx) {
          x1 -= xx - boundx;
          xx = boundx;
        }

        if (yy < 0) {
          y1 -= yy;
          yy = 0;
        } else if (yy > boundy) {
          y1 -= yy - boundy;
          yy = boundy;
        }

        return makeObj(flipCoords(x1, y1, xx, yy));
      }
      //}}}
      function rebound(p) //{{{
      {
        if (p[0] < 0) {
          p[0] = 0;
        }
        if (p[1] < 0) {
          p[1] = 0;
        }

        if (p[0] > boundx) {
          p[0] = boundx;
        }
        if (p[1] > boundy) {
          p[1] = boundy;
        }

        return [p[0], p[1]];
      }
      //}}}
      function flipCoords(x1, y1, x2, y2) //{{{
      {
        var xa = x1,
            xb = x2,
            ya = y1,
            yb = y2;
        if (x2 < x1) {
          xa = x2;
          xb = x1;
        }
        if (y2 < y1) {
          ya = y2;
          yb = y1;
        }
        return [xa, ya, xb, yb];
      }
      //}}}
      function getRect() //{{{
      {
        var xsize = x2 - x1,
            ysize = y2 - y1,
            delta;

        if (xlimit && (Math.abs(xsize) > xlimit)) {
          x2 = (xsize > 0) ? (x1 + xlimit) : (x1 - xlimit);
        }
        if (ylimit && (Math.abs(ysize) > ylimit)) {
          y2 = (ysize > 0) ? (y1 + ylimit) : (y1 - ylimit);
        }

        if (ymin / yscale && (Math.abs(ysize) < ymin / yscale)) {
          y2 = (ysize > 0) ? (y1 + ymin / yscale) : (y1 - ymin / yscale);
        }
        if (xmin / xscale && (Math.abs(xsize) < xmin / xscale)) {
          x2 = (xsize > 0) ? (x1 + xmin / xscale) : (x1 - xmin / xscale);
        }

        if (x1 < 0) {
          x2 -= x1;
          x1 -= x1;
        }
        if (y1 < 0) {
          y2 -= y1;
          y1 -= y1;
        }
        if (x2 < 0) {
          x1 -= x2;
          x2 -= x2;
        }
        if (y2 < 0) {
          y1 -= y2;
          y2 -= y2;
        }
        if (x2 > boundx) {
          delta = x2 - boundx;
          x1 -= delta;
          x2 -= delta;
        }
        if (y2 > boundy) {
          delta = y2 - boundy;
          y1 -= delta;
          y2 -= delta;
        }
        if (x1 > boundx) {
          delta = x1 - boundy;
          y2 -= delta;
          y1 -= delta;
        }
        if (y1 > boundy) {
          delta = y1 - boundy;
          y2 -= delta;
          y1 -= delta;
        }

        return makeObj(flipCoords(x1, y1, x2, y2));
      }
      //}}}
      function makeObj(a) //{{{
      {
        return {
          x: a[0],
          y: a[1],
          x2: a[2],
          y2: a[3],
          w: a[2] - a[0],
          h: a[3] - a[1]
        };
      }
      //}}}

      return {
        flipCoords: flipCoords,
        setPressed: setPressed,
        setCurrent: setCurrent,
        getOffset: getOffset,
        moveOffset: moveOffset,
        getCorner: getCorner,
        getFixed: getFixed
      };
    }());

    //}}}
    // Shade Module {{{
    var Shade = (function() {
      var enabled = false,
          holder = $('<div />').css({
            position: 'absolute',
            zIndex: 240,
            opacity: 0
          }),
          shades = {
            top: createShade(),
            left: createShade().height(boundy),
            right: createShade().height(boundy),
            bottom: createShade()
          };

      function resizeShades(w,h) {
        shades.left.css({ height: px(h) });
        shades.right.css({ height: px(h) });
      }
      function updateAuto()
      {
        return updateShade(Coords.getFixed());
      }
      function updateShade(c)
      {
        shades.top.css({
          left: px(c.x),
          width: px(c.w),
          height: px(c.y)
        });
        shades.bottom.css({
          top: px(c.y2),
          left: px(c.x),
          width: px(c.w),
          height: px(boundy-c.y2)
        });
        shades.right.css({
          left: px(c.x2),
          width: px(boundx-c.x2)
        });
        shades.left.css({
          width: px(c.x)
        });
      }
      function createShade() {
        return $('<div />').css({
          position: 'absolute',
          backgroundColor: options.shadeColor||options.bgColor
        }).appendTo(holder);
      }
      function enableShade() {
        if (!enabled) {
          enabled = true;
          holder.insertBefore($img);
          updateAuto();
          Selection.setBgOpacity(1,0,1);
          $img2.hide();

          setBgColor(options.shadeColor||options.bgColor,1);
          if (Selection.isAwake())
          {
            setOpacity(options.bgOpacity,1);
          }
            else setOpacity(1,1);
        }
      }
      function setBgColor(color,now) {
        colorChangeMacro(getShades(),color,now);
      }
      function disableShade() {
        if (enabled) {
          holder.remove();
          $img2.show();
          enabled = false;
          if (Selection.isAwake()) {
            Selection.setBgOpacity(options.bgOpacity,1,1);
          } else {
            Selection.setBgOpacity(1,1,1);
            Selection.disableHandles();
          }
          colorChangeMacro($div,0,1);
        }
      }
      function setOpacity(opacity,now) {
        if (enabled) {
          if (options.bgFade && !now) {
            holder.animate({
              opacity: 1-opacity
            },{
              queue: false,
              duration: options.fadeTime
            });
          }
          else holder.css({opacity:1-opacity});
        }
      }
      function refreshAll() {
        options.shade ? enableShade() : disableShade();
        if (Selection.isAwake()) setOpacity(options.bgOpacity);
      }
      function getShades() {
        return holder.children();
      }

      return {
        update: updateAuto,
        updateRaw: updateShade,
        getShades: getShades,
        setBgColor: setBgColor,
        enable: enableShade,
        disable: disableShade,
        resize: resizeShades,
        refresh: refreshAll,
        opacity: setOpacity
      };
    }());
    // }}}
    // Selection Module {{{
    var Selection = (function () {
      var awake,
          hdep = 370,
          borders = {},
          handle = {},
          dragbar = {},
          seehandles = false;

      // Private Methods
      function insertBorder(type) //{{{
      {
        var jq = $('<div />').css({
          position: 'absolute',
          opacity: options.borderOpacity
        }).addClass(cssClass(type));
        $img_holder.append(jq);
        return jq;
      }
      //}}}
      function dragDiv(ord, zi) //{{{
      {
        var jq = $('<div />').mousedown(createDragger(ord)).css({
          cursor: ord + '-resize',
          position: 'absolute',
          zIndex: zi
        }).addClass('ord-'+ord);

        if (Touch.support) {
          jq.bind('touchstart.jcrop', Touch.createDragger(ord));
        }

        $hdl_holder.append(jq);
        return jq;
      }
      //}}}
      function insertHandle(ord) //{{{
      {
        var hs = options.handleSize;
        return dragDiv(ord, hdep++).css({
          opacity: options.handleOpacity
        }).width(hs).height(hs).addClass(cssClass('handle'));
      }
      //}}}
      function insertDragbar(ord) //{{{
      {
        return dragDiv(ord, hdep++).addClass('jcrop-dragbar');
      }
      //}}}
      function createDragbars(li) //{{{
      {
        var i;
        for (i = 0; i < li.length; i++) {
          dragbar[li[i]] = insertDragbar(li[i]);
        }
      }
      //}}}
      function createBorders(li) //{{{
      {
        var cl,i;
        for (i = 0; i < li.length; i++) {
          switch(li[i]){
            case'n': cl='hline'; break;
            case's': cl='hline bottom'; break;
            case'e': cl='vline right'; break;
            case'w': cl='vline'; break;
          }
          borders[li[i]] = insertBorder(cl);
        }
      }
      //}}}
      function createHandles(li) //{{{
      {
        var i;
        for (i = 0; i < li.length; i++) {
          handle[li[i]] = insertHandle(li[i]);
        }
      }
      //}}}
      function moveto(x, y) //{{{
      {
        if (!options.shade) {
          $img2.css({
            top: px(-y),
            left: px(-x)
          });
        }
        $sel.css({
          top: px(y),
          left: px(x)
        });
      }
      //}}}
      function resize(w, h) //{{{
      {
        $sel.width(Math.round(w)).height(Math.round(h));
      }
      //}}}
      function refresh() //{{{
      {
        var c = Coords.getFixed();

        Coords.setPressed([c.x, c.y]);
        Coords.setCurrent([c.x2, c.y2]);

        updateVisible();
      }
      //}}}

      // Internal Methods
      function updateVisible(select) //{{{
      {
        if (awake) {
          return update(select);
        }
      }
      //}}}
      function update(select) //{{{
      {
        var c = Coords.getFixed();

        resize(c.w, c.h);
        moveto(c.x, c.y);
        if (options.shade) Shade.updateRaw(c);

        awake || show();

        if (select) {
          options.onSelect.call(api, unscale(c));
        } else {
          options.onChange.call(api, unscale(c));
        }
      }
      //}}}
      function setBgOpacity(opacity,force,now) //{{{
      {
        if (!awake && !force) return;
        if (options.bgFade && !now) {
          $img.animate({
            opacity: opacity
          },{
            queue: false,
            duration: options.fadeTime
          });
        } else {
          $img.css('opacity', opacity);
        }
      }
      //}}}
      function show() //{{{
      {
        $sel.show();

        if (options.shade) Shade.opacity(bgopacity);
          else setBgOpacity(bgopacity,true);

        awake = true;
      }
      //}}}
      function release() //{{{
      {
        disableHandles();
        $sel.hide();

        if (options.shade) Shade.opacity(1);
          else setBgOpacity(1);

        awake = false;
        options.onRelease.call(api);
      }
      //}}}
      function showHandles() //{{{
      {
        if (seehandles) {
          $hdl_holder.show();
        }
      }
      //}}}
      function enableHandles() //{{{
      {
        seehandles = true;
        if (options.allowResize) {
          $hdl_holder.show();
          return true;
        }
      }
      //}}}
      function disableHandles() //{{{
      {
        seehandles = false;
        $hdl_holder.hide();
      } 
      //}}}
      function animMode(v) //{{{
      {
        if (v) {
          animating = true;
          disableHandles();
        } else {
          animating = false;
          enableHandles();
        }
      } 
      //}}}
      function done() //{{{
      {
        animMode(false);
        refresh();
      } 
      //}}}
      // Insert draggable elements {{{
      // Insert border divs for outline

      if (options.dragEdges && $.isArray(options.createDragbars))
        createDragbars(options.createDragbars);

      if ($.isArray(options.createHandles))
        createHandles(options.createHandles);

      if (options.drawBorders && $.isArray(options.createBorders))
        createBorders(options.createBorders);

      //}}}

      // This is a hack for iOS5 to support drag/move touch functionality
      $(document).bind('touchstart.jcrop-ios',function(e) {
        if ($(e.currentTarget).hasClass('jcrop-tracker')) e.stopPropagation();
      });

      var $track = newTracker().mousedown(createDragger('move')).css({
        cursor: 'move',
        position: 'absolute',
        zIndex: 360
      });

      if (Touch.support) {
        $track.bind('touchstart.jcrop', Touch.createDragger('move'));
      }

      $img_holder.append($track);
      disableHandles();

      return {
        updateVisible: updateVisible,
        update: update,
        release: release,
        refresh: refresh,
        isAwake: function () {
          return awake;
        },
        setCursor: function (cursor) {
          $track.css('cursor', cursor);
        },
        enableHandles: enableHandles,
        enableOnly: function () {
          seehandles = true;
        },
        showHandles: showHandles,
        disableHandles: disableHandles,
        animMode: animMode,
        setBgOpacity: setBgOpacity,
        done: done
      };
    }());
    
    //}}}
    // Tracker Module {{{
    var Tracker = (function () {
      var onMove = function () {},
          onDone = function () {},
          trackDoc = options.trackDocument;

      function toFront() //{{{
      {
        $trk.css({
          zIndex: 450
        });
        if (Touch.support) {
          $(document)
            .bind('touchmove.jcrop', trackTouchMove)
            .bind('touchend.jcrop', trackTouchEnd);
        }
        if (trackDoc) {
          $(document)
            .bind('mousemove.jcrop',trackMove)
            .bind('mouseup.jcrop',trackUp);
        }
      } 
      //}}}
      function toBack() //{{{
      {
        $trk.css({
          zIndex: 290
        });
        $(document).unbind('.jcrop');
      } 
      //}}}
      function trackMove(e) //{{{
      {
        onMove(mouseAbs(e));
        return false;
      } 
      //}}}
      function trackUp(e) //{{{
      {
        e.preventDefault();
        e.stopPropagation();

        if (btndown) {
          btndown = false;

          onDone(mouseAbs(e));

          if (Selection.isAwake()) {
            options.onSelect.call(api, unscale(Coords.getFixed()));
          }

          toBack();
          onMove = function () {};
          onDone = function () {};
        }

        return false;
      }
      //}}}
      function activateHandlers(move, done) //{{{
      {
        btndown = true;
        onMove = move;
        onDone = done;
        toFront();
        return false;
      }
      //}}}
      function trackTouchMove(e) //{{{
      {
        e.pageX = e.originalEvent.changedTouches[0].pageX;
        e.pageY = e.originalEvent.changedTouches[0].pageY;
        return trackMove(e);
      }
      //}}}
      function trackTouchEnd(e) //{{{
      {
        e.pageX = e.originalEvent.changedTouches[0].pageX;
        e.pageY = e.originalEvent.changedTouches[0].pageY;
        return trackUp(e);
      }
      //}}}
      function setCursor(t) //{{{
      {
        $trk.css('cursor', t);
      }
      //}}}

      if (!trackDoc) {
        $trk.mousemove(trackMove).mouseup(trackUp).mouseout(trackUp);
      }

      $img.before($trk);
      return {
        activateHandlers: activateHandlers,
        setCursor: setCursor
      };
    }());
    //}}}
    // KeyManager Module {{{
    var KeyManager = (function () {
      var $keymgr = $('<input type="radio" />').css({
        position: 'fixed',
        left: '-120px',
        width: '12px'
      }).addClass('jcrop-keymgr'),

        $keywrap = $('<div />').css({
          position: 'absolute',
          overflow: 'hidden'
        }).append($keymgr);

      function watchKeys() //{{{
      {
        if (options.keySupport) {
          $keymgr.show();
          $keymgr.focus();
        }
      }
      //}}}
      function onBlur(e) //{{{
      {
        $keymgr.hide();
      }
      //}}}
      function doNudge(e, x, y) //{{{
      {
        if (options.allowMove) {
          Coords.moveOffset([x, y]);
          Selection.updateVisible(true);
        }
        e.preventDefault();
        e.stopPropagation();
      }
      //}}}
      function parseKey(e) //{{{
      {
        if (e.ctrlKey || e.metaKey) {
          return true;
        }
        shift_down = e.shiftKey ? true : false;
        var nudge = shift_down ? 10 : 1;

        switch (e.keyCode) {
        case 37:
          doNudge(e, -nudge, 0);
          break;
        case 39:
          doNudge(e, nudge, 0);
          break;
        case 38:
          doNudge(e, 0, -nudge);
          break;
        case 40:
          doNudge(e, 0, nudge);
          break;
        case 27:
          if (options.allowSelect) Selection.release();
          break;
        case 9:
          return true;
        }

        return false;
      }
      //}}}

      if (options.keySupport) {
        $keymgr.keydown(parseKey).blur(onBlur);
        if (ie6mode || !options.fixedSupport) {
          $keymgr.css({
            position: 'absolute',
            left: '-20px'
          });
          $keywrap.append($keymgr).insertBefore($img);
        } else {
          $keymgr.insertBefore($img);
        }
      }


      return {
        watchKeys: watchKeys
      };
    }());
    //}}}
    // }}}
    // API methods {{{
    function setClass(cname) //{{{
    {
      $div.removeClass().addClass(cssClass('holder')).addClass(cname);
    }
    //}}}
    function animateTo(a, callback) //{{{
    {
      var x1 = a[0] / xscale,
          y1 = a[1] / yscale,
          x2 = a[2] / xscale,
          y2 = a[3] / yscale;

      if (animating) {
        return;
      }

      var animto = Coords.flipCoords(x1, y1, x2, y2),
          c = Coords.getFixed(),
          initcr = [c.x, c.y, c.x2, c.y2],
          animat = initcr,
          interv = options.animationDelay,
          ix1 = animto[0] - initcr[0],
          iy1 = animto[1] - initcr[1],
          ix2 = animto[2] - initcr[2],
          iy2 = animto[3] - initcr[3],
          pcent = 0,
          velocity = options.swingSpeed;

      x1 = animat[0];
      y1 = animat[1];
      x2 = animat[2];
      y2 = animat[3];

      Selection.animMode(true);
      var anim_timer;

      function queueAnimator() {
        window.setTimeout(animator, interv);
      }
      var animator = (function () {
        return function () {
          pcent += (100 - pcent) / velocity;

          animat[0] = Math.round(x1 + ((pcent / 100) * ix1));
          animat[1] = Math.round(y1 + ((pcent / 100) * iy1));
          animat[2] = Math.round(x2 + ((pcent / 100) * ix2));
          animat[3] = Math.round(y2 + ((pcent / 100) * iy2));

          if (pcent >= 99.8) {
            pcent = 100;
          }
          if (pcent < 100) {
            setSelectRaw(animat);
            queueAnimator();
          } else {
            Selection.done();
            Selection.animMode(false);
            if (typeof(callback) === 'function') {
              callback.call(api);
            }
          }
        };
      }());
      queueAnimator();
    }
    //}}}
    function setSelect(rect) //{{{
    {
      setSelectRaw([rect[0] / xscale, rect[1] / yscale, rect[2] / xscale, rect[3] / yscale]);
      options.onSelect.call(api, unscale(Coords.getFixed()));
      Selection.enableHandles();
    }
    //}}}
    function setSelectRaw(l) //{{{
    {
      Coords.setPressed([l[0], l[1]]);
      Coords.setCurrent([l[2], l[3]]);
      Selection.update();
    }
    //}}}
    function tellSelect() //{{{
    {
      return unscale(Coords.getFixed());
    }
    //}}}
    function tellScaled() //{{{
    {
      return Coords.getFixed();
    }
    //}}}
    function setOptionsNew(opt) //{{{
    {
      setOptions(opt);
      interfaceUpdate();
    }
    //}}}
    function disableCrop() //{{{
    {
      options.disabled = true;
      Selection.disableHandles();
      Selection.setCursor('default');
      Tracker.setCursor('default');
    }
    //}}}
    function enableCrop() //{{{
    {
      options.disabled = false;
      interfaceUpdate();
    }
    //}}}
    function cancelCrop() //{{{
    {
      Selection.done();
      Tracker.activateHandlers(null, null);
    }
    //}}}
    function destroy() //{{{
    {
      $div.remove();
      $origimg.show();
      $origimg.css('visibility','visible');
      $(obj).removeData('Jcrop');
    }
    //}}}
    function setImage(src, callback) //{{{
    {
      Selection.release();
      disableCrop();
      var img = new Image();
      img.onload = function () {
        var iw = img.width;
        var ih = img.height;
        var bw = options.boxWidth;
        var bh = options.boxHeight;
        $img.width(iw).height(ih);
        $img.attr('src', src);
        $img2.attr('src', src);
        presize($img, bw, bh);
        boundx = $img.width();
        boundy = $img.height();
        $img2.width(boundx).height(boundy);
        $trk.width(boundx + (bound * 2)).height(boundy + (bound * 2));
        $div.width(boundx).height(boundy);
        Shade.resize(boundx,boundy);
        enableCrop();

        if (typeof(callback) === 'function') {
          callback.call(api);
        }
      };
      img.src = src;
    }
    //}}}
    function colorChangeMacro($obj,color,now) {
      var mycolor = color || options.bgColor;
      if (options.bgFade && supportsColorFade() && options.fadeTime && !now) {
        $obj.animate({
          backgroundColor: mycolor
        }, {
          queue: false,
          duration: options.fadeTime
        });
      } else {
        $obj.css('backgroundColor', mycolor);
      }
    }
    function interfaceUpdate(alt) //{{{
    // This method tweaks the interface based on options object.
    // Called when options are changed and at end of initialization.
    {
      if (options.allowResize) {
        if (alt) {
          Selection.enableOnly();
        } else {
          Selection.enableHandles();
        }
      } else {
        Selection.disableHandles();
      }

      Tracker.setCursor(options.allowSelect ? 'crosshair' : 'default');
      Selection.setCursor(options.allowMove ? 'move' : 'default');

      if (options.hasOwnProperty('trueSize')) {
        xscale = options.trueSize[0] / boundx;
        yscale = options.trueSize[1] / boundy;
      }

      if (options.hasOwnProperty('setSelect')) {
        setSelect(options.setSelect);
        Selection.done();
        delete(options.setSelect);
      }

      Shade.refresh();

      if (options.bgColor != bgcolor) {
        colorChangeMacro(
          options.shade? Shade.getShades(): $div,
          options.shade?
            (options.shadeColor || options.bgColor):
            options.bgColor
        );
        bgcolor = options.bgColor;
      }

      if (bgopacity != options.bgOpacity) {
        bgopacity = options.bgOpacity;
        if (options.shade) Shade.refresh();
          else Selection.setBgOpacity(bgopacity);
      }

      xlimit = options.maxSize[0] || 0;
      ylimit = options.maxSize[1] || 0;
      xmin = options.minSize[0] || 0;
      ymin = options.minSize[1] || 0;

      if (options.hasOwnProperty('outerImage')) {
        $img.attr('src', options.outerImage);
        delete(options.outerImage);
      }

      Selection.refresh();
    }
    //}}}
    //}}}

    if (Touch.support) $trk.bind('touchstart.jcrop', Touch.newSelection);

    $hdl_holder.hide();
    interfaceUpdate(true);

    var api = {
      setImage: setImage,
      animateTo: animateTo,
      setSelect: setSelect,
      setOptions: setOptionsNew,
      tellSelect: tellSelect,
      tellScaled: tellScaled,
      setClass: setClass,

      disable: disableCrop,
      enable: enableCrop,
      cancel: cancelCrop,
      release: Selection.release,
      destroy: destroy,

      focus: KeyManager.watchKeys,

      getBounds: function () {
        return [boundx * xscale, boundy * yscale];
      },
      getWidgetSize: function () {
        return [boundx, boundy];
      },
      getScaleFactor: function () {
        return [xscale, yscale];
      },
      getOptions: function() {
        // careful: internal values are returned
        return options;
      },

      ui: {
        holder: $div,
        selection: $sel
      }
    };

    if ($.browser.msie)
      $div.bind('selectstart', function () { return false; });

    $origimg.data('Jcrop', api);
    return api;
  };
  $.fn.Jcrop = function (options, callback) //{{{
  {
    var api;
    // Iterate over each object, attach Jcrop
    this.each(function () {
      // If we've already attached to this object
      if ($(this).data('Jcrop')) {
        // The API can be requested this way (undocumented)
        if (options === 'api') return $(this).data('Jcrop');
        // Otherwise, we just reset the options...
        else $(this).data('Jcrop').setOptions(options);
      }
      // If we haven't been attached, preload and attach
      else {
        if (this.tagName == 'IMG')
          $.Jcrop.Loader(this,function(){
            $(this).css({display:'block',visibility:'hidden'});
            api = $.Jcrop(this, options);
            if ($.isFunction(callback)) callback.call(api);
          });
        else {
          $(this).css({display:'block',visibility:'hidden'});
          api = $.Jcrop(this, options);
          if ($.isFunction(callback)) callback.call(api);
        }
      }
    });

    // Return "this" so the object is chainable (jQuery-style)
    return this;
  };
  //}}}
  // $.Jcrop.Loader - basic image loader {{{

  $.Jcrop.Loader = function(imgobj,success,error){
    var $img = $(imgobj), img = $img[0];

    function completeCheck(){
      if (img.complete) {
        $img.unbind('.jcloader');
        if ($.isFunction(success)) success.call(img);
      }
      else window.setTimeout(completeCheck,50);
    }

    $img
      .bind('load.jcloader',completeCheck)
      .bind('error.jcloader',function(e){
        $img.unbind('.jcloader');
        if ($.isFunction(error)) error.call(img);
      });

    if (img.complete && $.isFunction(success)){
      $img.unbind('.jcloader');
      success.call(img);
    }
  };

  //}}}
  // Global Defaults {{{
  $.Jcrop.defaults = {

    // Basic Settings
    allowSelect: true,
    allowMove: true,
    allowResize: true,

    trackDocument: true,

    // Styling Options
    baseClass: 'jcrop',
    addClass: null,
    bgColor: 'black',
    bgOpacity: 0.6,
    bgFade: false,
    borderOpacity: 0.4,
    handleOpacity: 0.5,
    handleSize: 7,

    aspectRatio: 0,
    keySupport: true,
    createHandles: ['n','s','e','w','nw','ne','se','sw'],
    createDragbars: ['n','s','e','w'],
    createBorders: ['n','s','e','w'],
    drawBorders: true,
    dragEdges: true,
    fixedSupport: true,
    touchSupport: null,

    shade: null,

    boxWidth: 0,
    boxHeight: 0,
    boundary: 2,
    fadeTime: 400,
    animationDelay: 20,
    swingSpeed: 3,

    minSelect: [0, 0],
    maxSize: [0, 0],
    minSize: [0, 0],

    // Callbacks / Event Handlers
    onChange: function () {},
    onSelect: function () {},
    onDblClick: function () {},
    onRelease: function () {}
  };

  // }}}
}(uploadcare.jQuery));
(function() {
  var $, namespace, tpl;

  namespace = uploadcare.namespace, $ = uploadcare.jQuery;

  tpl = uploadcare.templates.tpl;

  namespace('uploadcare.crop', function(ns) {
    return ns.CropWidget = (function() {
      var CONTROLS_HEIGHT, IMAGE_CLEARED, LOADING_ERROR, checkOptions, cropModifierRegExp, defaultOptions, fitSize;

      defaultOptions = {
        container: null,
        scale: true,
        upscale: false,
        widgetSize: null,
        preferedSize: null,
        controls: true
      };

      LOADING_ERROR = 'loadingerror';

      IMAGE_CLEARED = 'imagecleared';

      CONTROLS_HEIGHT = 30;

      checkOptions = function(options) {
        var option, value, _i, _len, _ref, _results;
        if (!options.container) {
          throw new Error("options.container must be specified");
        }
        _ref = ['widgetSize', 'preferedSize'];
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          option = _ref[_i];
          value = options[option];
          if (!(!value || (typeof value === 'string' && value.match(/^\d+x\d+$/i)))) {
            throw new Error("options." + option + " must follow pattern '123x456' or be falsy");
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };

      fitSize = function(objWidth, objHeight, boxWidth, boxHeight, upscale) {
        if (upscale == null) {
          upscale = false;
        }
        if (objWidth > boxWidth || objHeight > boxHeight || upscale) {
          if (boxWidth / boxHeight < objWidth / objHeight) {
            return [boxWidth, Math.floor(objHeight / objWidth * boxWidth)];
          } else {
            return [Math.floor(objWidth / objHeight * boxHeight), boxHeight];
          }
        } else {
          return [objWidth, objHeight];
        }
      };

      function CropWidget(options) {
        this.__options = $.extend({}, defaultOptions, options);
        if (!this.__options.preferedSize) {
          this.__options.scale = false;
        }
        checkOptions(this.__options);
        this.onStateChange = $.Callbacks();
        this.__buildWidget();
      }

      CropWidget.prototype.croppedImageUrl = function(originalUrl) {
        var _this = this;
        return this.croppedImageModifiers(originalUrl).pipe(function(opts) {
          return _this.__url + opts.modifiers;
        });
      };

      cropModifierRegExp = /-\/crop\/([0-9]+)x([0-9]+)(\/(center|([0-9]+),([0-9]+)))?\//i;

      CropWidget.prototype.croppedImageModifiers = function(originalUrl, currentModifiers) {
        var previousCoords, raw,
          _this = this;
        previousCoords = null;
        if (raw = currentModifiers != null ? currentModifiers.match(cropModifierRegExp) : void 0) {
          previousCoords = {
            width: parseInt(raw[1], 10),
            height: parseInt(raw[2], 10),
            center: raw[4] === 'center',
            top: parseInt(raw[5], 10) || void 0,
            left: parseInt(raw[6], 10) || void 0
          };
        }
        return this.croppedImageCoords(originalUrl, previousCoords).pipe(function(coords) {
          var modifiers, opts, scale, sh, size, sw, topLeft;
          size = "" + coords.w + "x" + coords.h;
          topLeft = "" + coords.x + "," + coords.y;
          modifiers = "-/crop/" + size + "/" + topLeft + "/";
          opts = {
            crop: $.extend({}, coords),
            modifiers: modifiers
          };
          if (_this.__options.scale) {
            scale = _this.__options.preferedSize.split('x');
            if (scale[0]) {
              sw = scale[0] - 0;
            }
            if (scale[1]) {
              sh = scale[1] - 0;
            }
            if (coords.w > sw || _this.__options.upscale) {
              opts.crop.sw = sw;
              opts.crop.sh = sh;
              modifiers += "-/resize/" + _this.__options.preferedSize + "/";
            }
          }
          return opts;
        });
      };

      CropWidget.prototype.croppedImageCoords = function(originalUrl, previousCoords) {
        this.__clearImage();
        this.__setImage(originalUrl, previousCoords);
        return this.__deferred.promise();
      };

      CropWidget.prototype.forceDone = function() {
        if (this.__state === 'loaded') {
          return this.__deferred.resolve(this.getCurrentCoords());
        } else {
          throw new Error("not ready");
        }
      };

      CropWidget.prototype.getCurrentCoords = function() {
        var fixedCoords, key, scaleRatio, value, _ref;
        scaleRatio = this.__resizedWidth / this.__originalWidth;
        fixedCoords = {};
        _ref = this.__currentCoords;
        for (key in _ref) {
          value = _ref[key];
          fixedCoords[key] = Math.round(value / scaleRatio);
        }
        return fixedCoords;
      };

      CropWidget.prototype.destroy = function() {
        this.__clearImage();
        this.__widgetElement.remove();
        return this.__widgetElement = this.__imageWrap = this.__doneButton = null;
      };

      CropWidget.prototype.__buildWidget = function() {
        var _ref, _ref1;
        this.container = $(this.__options.container);
        this.__widgetElement = $(tpl('crop-widget'));
        this.__imageWrap = this.__widgetElement.find('@uploadcare-crop-widget-image-wrap');
        this.__doneButton = this.__widgetElement.find('@uploadcare-crop-widget-done-button');
        if (!this.__options.controls) {
          this.__widgetElement.addClass('uploadcare-crop-widget--no-controls');
        }
        _ref1 = (_ref = this.__widgetSize(), this.__widgetWidth = _ref[0], this.__widgetHeight = _ref[1], _ref), this.__wrapWidth = _ref1[0], this.__wrapHeight = _ref1[1];
        if (this.__options.controls) {
          this.__wrapHeight -= CONTROLS_HEIGHT;
        }
        this.__imageWrap.css({
          width: this.__wrapWidth,
          height: this.__wrapHeight
        });
        this.__widgetElement.css({
          width: this.__widgetWidth,
          height: this.__widgetHeight
        });
        this.__widgetElement.appendTo(this.container);
        this.__setState('waiting');
        return this["__bind"]();
      };

      CropWidget.prototype["__bind"] = function() {
        var _this = this;
        return this.__doneButton.click(function() {
          return _this.forceDone();
        });
      };

      CropWidget.prototype.__clearImage = function() {
        var _ref;
        if ((_ref = this.__jCropApi) != null) {
          _ref.destroy();
        }
        if (this.__deferred && this.__deferred.state() === 'pending') {
          this.__deferred.reject(IMAGE_CLEARED);
          this.__deferred = false;
        }
        if (this.__img) {
          this.__img.remove();
          this.__img.off();
          this.__img = null;
        }
        this.__resizedHeight = this.__resizedWidth = this.__originalHeight = this.__originalWidth = null;
        return this.__setState('waiting');
      };

      CropWidget.prototype.__setImage = function(__url, previousCoords) {
        var _this = this;
        this.__url = __url;
        this.__deferred = $.Deferred();
        this.__setState('loading');
        this.__img = $('<img/>');
        this.__img.attr('src', this.__url);
        return this.__img.on({
          load: function() {
            _this.__setState('loaded');
            _this.__calcImgSizes();
            _this.__img.appendTo(_this.__imageWrap);
            return _this.__initJcrop(previousCoords);
          },
          error: function() {
            _this.__setState('error');
            return _this.__deferred.reject(LOADING_ERROR);
          }
        });
      };

      CropWidget.prototype.__calcImgSizes = function() {
        var paddingLeft, paddingTop, _ref, _ref1;
        _ref = this.__img[0], this.__originalWidth = _ref.width, this.__originalHeight = _ref.height;
        _ref1 = fitSize(this.__originalWidth, this.__originalHeight, this.__wrapWidth, this.__wrapHeight), this.__resizedWidth = _ref1[0], this.__resizedHeight = _ref1[1];
        paddingTop = (this.__wrapHeight - this.__resizedHeight) / 2;
        paddingLeft = (this.__wrapWidth - this.__resizedWidth) / 2;
        this.__img.attr({
          width: this.__resizedWidth,
          height: this.__resizedHeight
        });
        return this.__imageWrap.css({
          paddingTop: paddingTop,
          paddingLeft: paddingLeft,
          width: this.__wrapWidth - paddingLeft,
          height: this.__wrapHeight - paddingTop
        });
      };

      CropWidget.prototype.__widgetSize = function() {
        if (!this.__options.widgetSize) {
          return [this.container.width(), this.container.height()];
        } else {
          return this.__options.widgetSize.split('x');
        }
      };

      CropWidget.prototype.__setState = function(state) {
        var prefix, s;
        if (this.__state === state) {
          return;
        }
        this.__state = state;
        prefix = 'uploadcare-crop-widget--';
        this.__widgetElement.removeClass(((function() {
          var _i, _len, _ref, _results;
          _ref = ['error', 'loading', 'loaded', 'waiting'];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            s = _ref[_i];
            _results.push(prefix + s);
          }
          return _results;
        })()).join(' ')).addClass(prefix + state);
        this.onStateChange.fire(state);
        return this.__doneButton.prop('disabled', state !== 'loaded');
      };

      CropWidget.prototype.__initJcrop = function(previousCoords) {
        var height, i, jCropOptions, left, scaleRatio, setApi, top, val, width, _i, _len, _ref, _ref1, _ref2,
          _this = this;
        jCropOptions = {
          onSelect: function(coords) {
            return _this.__currentCoords = coords;
          }
        };
        if (this.__options.preferedSize) {
          _ref = this.__options.preferedSize.split('x'), width = _ref[0], height = _ref[1];
          jCropOptions.aspectRatio = width / height;
        }
        if (!previousCoords) {
          previousCoords = {
            center: true
          };
          if (this.__options.preferedSize) {
            _ref1 = fitSize(width, height, this.__originalWidth, this.__originalHeight, true), previousCoords.width = _ref1[0], previousCoords.height = _ref1[1];
          } else {
            previousCoords.width = this.__originalWidth;
            previousCoords.height = this.__originalHeight;
          }
        }
        if (previousCoords.center) {
          top = (this.__originalWidth - previousCoords.width) / 2;
          left = (this.__originalHeight - previousCoords.height) / 2;
        } else {
          top = previousCoords.top || 0;
          left = previousCoords.left || 0;
        }
        jCropOptions.setSelect = [top, left, previousCoords.width + top, previousCoords.height + left];
        scaleRatio = this.__resizedWidth / this.__originalWidth;
        _ref2 = jCropOptions.setSelect;
        for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
          val = _ref2[i];
          jCropOptions.setSelect[i] = val * scaleRatio;
        }
        setApi = function(api) {
          return _this.__jCropApi = api;
        };
        return this.__img.Jcrop(jCropOptions, function() {
          return setApi(this);
        });
      };

      return CropWidget;

    })();
  });

}).call(this);
(function() {
  var $, namespace, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace = uploadcare.namespace, $ = uploadcare.jQuery, utils = uploadcare.utils;

  namespace('uploadcare.files', function(ns) {
    return ns.BaseFile = (function() {

      function BaseFile(settings) {
        this.__resolveApi = __bind(this.__resolveApi, this);

        this.__rejectApi = __bind(this.__rejectApi, this);

        this.__notifyApi = __bind(this.__notifyApi, this);

        this.__extendPromise = __bind(this.__extendPromise, this);

        this.__preview = __bind(this.__preview, this);

        this.__cancel = __bind(this.__cancel, this);

        this.__fileInfo = __bind(this.__fileInfo, this);

        this.__requestInfo = __bind(this.__requestInfo, this);

        var _this = this;
        this.settings = utils.buildSettings(settings);
        this.fileId = null;
        this.fileName = null;
        this.fileSize = null;
        this.isStored = null;
        this.cdnUrl = null;
        this.cdnUrlModifiers = null;
        this.previewUrl = null;
        this.isImage = null;
        this.__uploadDf = $.Deferred();
        this.__infoDf = $.Deferred();
        this.__progressState = 'uploading';
        this.__progress = 0;
        this.__uploadDf.fail(function(error) {
          return _this.__infoDf.reject(error, _this);
        }).done(function() {
          return _this.__requestInfo();
        });
        this.__initApi();
        this.__notifyApi();
      }

      BaseFile.prototype.__startUpload = function() {
        throw new Error('not implemented');
      };

      BaseFile.prototype.__requestInfo = function() {
        var fail,
          _this = this;
        fail = function() {
          return _this.__infoDf.reject('info', _this);
        };
        return $.ajax("" + this.settings.urlBase + "/info/", {
          data: {
            file_id: this.fileId,
            pub_key: this.settings.publicKey
          },
          dataType: 'jsonp'
        }).fail(fail).done(function(data) {
          if (data.error) {
            return fail();
          }
          _this.fileName = data.original_filename;
          _this.fileSize = data.size;
          _this.isImage = data.is_image;
          _this.isStored = data.is_stored;
          _this.__buildPreviewUrl();
          if (_this.settings.imagesOnly && !_this.isImage) {
            _this.__infoDf.reject('image', _this);
            return;
          }
          return _this.__infoDf.resolve(_this);
        });
      };

      BaseFile.prototype.__buildPreviewUrl = function() {
        if (this.__tmpFinalPreviewUrl) {
          return this.previewUrl = this.__tmpFinalPreviewUrl;
        } else {
          return this.previewUrl = "" + this.settings.urlBase + "/preview/?file_id=" + this.fileId + "&pub_key=" + this.settings.publicKey;
        }
      };

      BaseFile.prototype.__progressInfo = function() {
        return {
          state: this.__progressState,
          uploadProgress: this.__progress,
          progress: this.__progressState === 'ready' ? 1 : this.__progress * 0.9,
          incompleteFileInfo: this.__fileInfo()
        };
      };

      BaseFile.prototype.__fileInfo = function() {
        return {
          uuid: this.fileId,
          name: this.fileName,
          size: this.fileSize,
          isStored: this.isStored,
          isImage: this.isImage,
          cdnUrl: "" + this.settings.cdnBase + "/" + this.fileId + "/" + (this.cdnUrlModifiers || ''),
          cdnUrlModifiers: this.cdnUrlModifiers,
          previewUrl: this.previewUrl
        };
      };

      BaseFile.prototype.__cancel = function() {
        return this.__uploadDf.reject('user', this);
      };

      BaseFile.prototype.__preview = function(p, selector) {
        var _this = this;
        return p.done(function(info) {
          var img, opts;
          if (!info.crop) {
            return $(selector).empty();
          }
          opts = info.crop;
          img = new Image();
          img.src = _this.previewUrl;
          return img.onload = function() {
            var el, sh, sw, sx, sy;
            if (opts.sw || opts.sh) {
              sw = opts.sw || opts.sh * opts.w / opts.h;
              sh = opts.sh || opts.sw * opts.h / opts.w;
            } else {
              sw = opts.w;
              sh = opts.h;
            }
            sx = sw / opts.w;
            sy = sh / opts.h;
            el = $('<div>').css({
              position: 'relative',
              overflow: 'hidden',
              width: sw,
              height: sh
            }).append($(img).css({
              position: 'absolute',
              left: opts.x * -sx,
              top: opts.y * -sy,
              width: img.width * sx,
              height: img.height * sy
            }));
            return $(selector).html(el);
          };
        });
      };

      BaseFile.prototype.__extendPromise = function(p) {
        var __pipe, __then,
          _this = this;
        p.cancel = this.__cancel;
        p.preview = function(selector) {
          return _this.__preview(p, selector);
        };
        __pipe = p.pipe;
        p.pipe = function() {
          return _this.__extendPromise(__pipe.apply(p, arguments));
        };
        __then = p.then;
        p.then = function() {
          return _this.__extendPromise(__then.apply(p, arguments));
        };
        return p;
      };

      BaseFile.prototype.__notifyApi = function() {
        return this.apiDeferred.notify(this.__progressInfo());
      };

      BaseFile.prototype.__rejectApi = function(err) {
        return this.apiDeferred.reject(err, this.__fileInfo());
      };

      BaseFile.prototype.__resolveApi = function() {
        return this.apiDeferred.resolve(this.__fileInfo());
      };

      BaseFile.prototype.__initApi = function() {
        var _this = this;
        this.apiDeferred = $.Deferred();
        this.apiPromise = this.__extendPromise(this.apiDeferred.promise());
        this.__uploadDf.progress(function(progress) {
          _this.__progress = progress;
          return _this.__notifyApi();
        });
        this.__uploadDf.done(function() {
          _this.__progressState = 'uploaded';
          _this.__progress = 1;
          return _this.__notifyApi();
        });
        this.__infoDf.done(function() {
          _this.__progressState = 'ready';
          _this.__notifyApi();
          return _this.__resolveApi();
        });
        this.__infoDf.fail(this.__rejectApi);
        return this.__uploadDf.fail(this.__rejectApi);
      };

      BaseFile.prototype.promise = function() {
        if (!this.__uploadStarted) {
          this.__uploadStarted = true;
          this.__startUpload();
        }
        return this.apiPromise;
      };

      return BaseFile;

    })();
  });

}).call(this);
(function() {
  var $, debug, namespace, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = uploadcare.namespace, $ = uploadcare.jQuery, utils = uploadcare.utils, debug = uploadcare.debug;

  namespace('uploadcare.files', function(ns) {
    return ns.EventFile = (function(_super) {

      __extends(EventFile, _super);

      function EventFile(settings, __file) {
        this.__file = __file;
        EventFile.__super__.constructor.apply(this, arguments);
        this.fileId = utils.uuid();
        this.fileSize = this.__file.size;
        this.fileName = this.__file.name;
        this.previewUrl = utils.createObjectUrl(this.__file);
        this.__notifyApi();
      }

      EventFile.prototype.__startUpload = function() {
        var fail, formData, targetUrl, xhr,
          _this = this;
        targetUrl = "" + this.settings.urlBase + "/iframe/";
        if (this.fileSize > (100 * 1024 * 1024)) {
          this.__uploadDf.reject('size', this);
          return;
        }
        formData = new FormData();
        formData.append('UPLOADCARE_PUB_KEY', this.settings.publicKey);
        formData.append('UPLOADCARE_FILE_ID', this.fileId);
        formData.append('file', this.__file);
        fail = function() {
          return _this.__uploadDf.reject('upload', _this);
        };
        xhr = new XMLHttpRequest();
        xhr.addEventListener('loadend', function() {
          if ((xhr != null) && !xhr.status) {
            return fail();
          }
        });
        xhr.upload.addEventListener('progress', function(event) {
          _this.__loaded = event.loaded;
          _this.fileSize = event.totalSize || event.total;
          return _this.__uploadDf.notify(_this.__loaded / _this.fileSize, _this);
        });
        $.ajax({
          xhr: function() {
            return xhr;
          },
          crossDomain: true,
          type: 'POST',
          url: "" + this.settings.urlBase + "/iframe/?jsonerrors=1",
          xhrFields: {
            withCredentials: true
          },
          headers: {
            'X-PINGOTHER': 'pingpong'
          },
          contentType: false,
          processData: false,
          data: formData,
          dataType: 'json',
          error: fail,
          success: function(data) {
            if (data != null ? data.error : void 0) {
              debug(data.error.content);
              return fail();
            }
            return _this.__uploadDf.resolve(_this);
          }
        });
        return this.__uploadDf.always(function() {
          var _xhr;
          _xhr = xhr;
          xhr = null;
          return _xhr.abort();
        });
      };

      return EventFile;

    })(ns.BaseFile);
  });

}).call(this);
(function() {
  var $, namespace, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = uploadcare.namespace, $ = uploadcare.jQuery, utils = uploadcare.utils;

  namespace('uploadcare.files', function(ns) {
    return ns.InputFile = (function(_super) {

      __extends(InputFile, _super);

      function InputFile(settings, __input) {
        this.__input = __input;
        InputFile.__super__.constructor.apply(this, arguments);
        this.fileId = utils.uuid();
        this.fileName = $(this.__input).val().split('\\').pop();
        this.__notifyApi();
      }

      InputFile.prototype.__startUpload = function() {
        var formParam, iframeId, targetUrl,
          _this = this;
        targetUrl = "" + this.settings.urlBase + "/iframe/";
        this.__uploadDf.always(function() {
          return _this.__cleanUp();
        });
        iframeId = "uploadcare-iframe-" + this.fileId;
        this.__iframe = $('<iframe>').attr({
          id: iframeId,
          name: iframeId
        }).css('display', 'none').appendTo('body').on('load', function() {
          return _this.__uploadDf.resolve(_this);
        }).on('error', function() {
          return _this.__uploadDf.reject('upload', _this);
        });
        formParam = function(name, value) {
          return $('<input>').attr({
            type: 'hidden',
            name: name
          }).val(value);
        };
        $(this.__input).clone(true).insertBefore(this.__input);
        $(this.__input).attr('name', 'file');
        return this.__iframeForm = $('<form>').attr({
          method: 'POST',
          action: targetUrl,
          enctype: 'multipart/form-data',
          target: iframeId
        }).append(formParam('UPLOADCARE_PUB_KEY', this.settings.publicKey)).append(formParam('UPLOADCARE_FILE_ID', this.fileId)).append(this.__input).css('display', 'none').appendTo('body').submit();
      };

      InputFile.prototype.__cleanUp = function() {
        var _ref, _ref1;
        if ((_ref = this.__iframe) != null) {
          _ref.off('load error').remove();
        }
        if ((_ref1 = this.__iframeForm) != null) {
          _ref1.remove();
        }
        this.__iframe = null;
        return this.__iframeForm = null;
      };

      return InputFile;

    })(ns.BaseFile);
  });

}).call(this);
(function() {
  var $, debug, namespace, pusher, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = uploadcare.namespace, $ = uploadcare.jQuery, utils = uploadcare.utils, debug = uploadcare.debug;

  pusher = uploadcare.utils.pusher;

  namespace('uploadcare.files', function(ns) {
    var PollWatcher, PusherWatcher;
    ns.UrlFile = (function(_super) {

      __extends(UrlFile, _super);

      function UrlFile(settings, __url) {
        this.__url = __url;
        UrlFile.__super__.constructor.apply(this, arguments);
        this.__shutdown = true;
        this.previewUrl = this.__url;
        this.__tmpFinalPreviewUrl = this.__url;
        this.fileName = utils.parseUrl(this.__url).pathname.split('/').pop() || null;
        this.__notifyApi();
      }

      UrlFile.prototype.__startUpload = function() {
        var fail,
          _this = this;
        this.__pollWatcher = new PollWatcher(this, this.settings);
        this.__pusherWatcher = new PusherWatcher(this, this.settings);
        this.__state('start');
        fail = function() {
          return _this.__state('error');
        };
        $.ajax("" + this.settings.urlBase + "/from_url/", {
          data: {
            pub_key: this.settings.publicKey,
            source_url: this.__url
          },
          dataType: 'jsonp'
        }).fail(fail).done(function(data) {
          if (data.error) {
            return fail();
          }
          _this.__token = data.token;
          _this.__pollWatcher.watch(_this.__token);
          _this.__pusherWatcher.watch(_this.__token);
          return $(_this.__pusherWatcher).on('started', function() {
            return _this.__pollWatcher.stopWatching();
          });
        });
        this.__uploadDf.always(function() {
          _this.__shutdown = true;
          _this.__pusherWatcher.stopWatching();
          return _this.__pollWatcher.stopWatching();
        });
        return this.__uploadDf.promise();
      };

      UrlFile.prototype.__state = function(state, data) {
        var _this = this;
        return {
          start: function() {
            return _this.__shutdown = false;
          },
          progress: function(data) {
            if (_this.__shutdown) {
              return;
            }
            _this.fileSize = data.total;
            return _this.__uploadDf.notify(data.done / data.total, _this);
          },
          success: function(data) {
            var _ref;
            if (_this.__shutdown) {
              return;
            }
            _this.__state('progress', data);
            _ref = [data.original_filename, data.file_id], _this.fileName = _ref[0], _this.fileId = _ref[1];
            return _this.__uploadDf.resolve(_this);
          },
          error: function() {
            return _this.__uploadDf.reject('upload', _this);
          }
        }[state](data);
      };

      return UrlFile;

    })(ns.BaseFile);
    PusherWatcher = (function() {

      function PusherWatcher(uploader, settings) {
        this.uploader = uploader;
        this.settings = settings;
        this.pusher = pusher.getPusher(this.settings.pusherKey, 'url-upload');
      }

      PusherWatcher.prototype.watch = function(token) {
        var ev, onStarted, _fn, _i, _len, _ref,
          _this = this;
        this.token = token;
        debug('started url watching with pusher');
        this.channel = this.pusher.subscribe("task-status-" + this.token);
        onStarted = function() {
          var ev, _i, _len, _ref, _results;
          $(_this).trigger('started');
          _ref = ['progress', 'success'];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            ev = _ref[_i];
            _results.push(_this.channel.unbind(ev, onStarted));
          }
          return _results;
        };
        _ref = ['progress', 'success'];
        _fn = function(ev) {
          _this.channel.bind(ev, onStarted);
          return _this.channel.bind(ev, function(data) {
            return _this.uploader.__state(ev, data);
          });
        };
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          ev = _ref[_i];
          _fn(ev);
        }
        return this.channel.bind('fail', function(data) {
          return _this.uploader.__state('error');
        });
      };

      PusherWatcher.prototype.stopWatching = function() {
        if (this.pusher) {
          this.pusher.release();
        }
        return this.pusher = null;
      };

      return PusherWatcher;

    })();
    return PollWatcher = (function() {

      function PollWatcher(uploader, settings) {
        this.uploader = uploader;
        this.settings = settings;
      }

      PollWatcher.prototype.watch = function(token) {
        var _this = this;
        this.token = token;
        return this.interval = setInterval(function() {
          return _this.__checkStatus(function(data) {
            var _ref;
            if ((_ref = data.status) === 'progress' || _ref === 'success' || _ref === 'error') {
              return _this.uploader.__state(data.status, data);
            }
          });
        }, 250);
      };

      PollWatcher.prototype.stopWatching = function() {
        if (this.interval) {
          clearInterval(this.interval);
        }
        return this.interval = null;
      };

      PollWatcher.prototype.__error = function() {
        this.stopWatching();
        return this.uploader.__state('error');
      };

      PollWatcher.prototype.__checkStatus = function(callback) {
        var fail,
          _this = this;
        fail = function() {
          return _this.__error();
        };
        return $.ajax("" + this.settings.urlBase + "/status/", {
          data: {
            'token': this.token
          },
          dataType: 'jsonp'
        }).fail(fail).done(function(data) {
          if (data.error) {
            return fail();
          }
          return callback(data);
        });
      };

      return PollWatcher;

    })();
  });

}).call(this);
(function() {
  var $, namespace, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = uploadcare.namespace, $ = uploadcare.jQuery, utils = uploadcare.utils;

  namespace('uploadcare.files', function(ns) {
    return ns.UploadedFile = (function(_super) {

      __extends(UploadedFile, _super);

      function UploadedFile(settings, fileIdOrUrl) {
        var id, modifiers;
        UploadedFile.__super__.constructor.apply(this, arguments);
        id = utils.uuidRegex.exec(fileIdOrUrl);
        if (id) {
          this.fileId = id[0];
          modifiers = utils.cdnUrlModifiersRegex.exec(fileIdOrUrl);
          if (modifiers) {
            this.cdnUrlModifiers = modifiers[0];
          }
          this.cdnUrl = "" + this.settings.cdnBase + "/" + this.fileId + "/" + (this.cdnUrlModifiers || '');
          this.__buildPreviewUrl();
          this.__uploadDf.resolve(this);
        } else {
          this.__uploadDf.reject('baddata', this);
        }
      }

      UploadedFile.prototype.__startUpload = function() {};

      return UploadedFile;

    })(ns.BaseFile);
  });

}).call(this);
(function() {
  var $, f, namespace, utils;

  namespace = uploadcare.namespace, utils = uploadcare.utils, $ = uploadcare.jQuery, f = uploadcare.files;

  namespace('uploadcare', function(ns) {
    var converters;
    ns.fileFrom = function(type, data, settings) {
      if (settings == null) {
        settings = {};
      }
      return converters[type](settings, data).promise();
    };
    return converters = {
      event: function(settings, e) {
        var files;
        if (utils.abilities.canFileAPI) {
          files = e.type === 'drop' ? e.originalEvent.dataTransfer.files : e.target.files;
          return new f.EventFile(settings, files[0]);
        } else {
          return this.input(settings, e.target);
        }
      },
      input: function(settings, input) {
        return new f.InputFile(settings, input);
      },
      url: function(settings, url) {
        var cdn;
        cdn = new RegExp("^" + settings.cdnBase + "/" + utils.uuidRegex.source, 'i');
        if (utils.fullUuidRegex.test(url) || cdn.test(url)) {
          return new f.UploadedFile(settings, url);
        } else {
          return new f.UrlFile(settings, url);
        }
      },
      uploaded: function(settings, uuid) {
        return new f.UploadedFile(settings, uuid);
      }
    };
  });

}).call(this);
(function() {
  var $, namespace, utils;

  namespace = uploadcare.namespace, utils = uploadcare.utils, $ = uploadcare.jQuery;

  namespace('uploadcare.widget.dragdrop', function(ns) {
    var active, delayedDragState, offDelay, onDelay, __dragState;
    if (!utils.abilities.fileDragAndDrop) {
      return ns.receiveDrop = function() {};
    } else {
      ns.receiveDrop = function(upload, el) {
        return $(el).on('dragover', function(e) {
          e.stopPropagation();
          e.preventDefault();
          e.originalEvent.dataTransfer.dropEffect = 'copy';
          return false;
        }).on('drop', function(e) {
          var dt, uris;
          e.stopPropagation();
          e.preventDefault();
          delayedDragState(false, 0);
          dt = e.originalEvent.dataTransfer;
          if (dt.files.length) {
            upload('event', e);
          } else {
            uris = dt.getData('text/uri-list');
            if (uris) {
              uris = uris.replace(/\n$/, '');
              upload('url', uris);
            }
          }
          return false;
        });
      };
      onDelay = 0;
      offDelay = $.browser.opera ? 200 : 1;
      active = false;
      $(function() {
        var _this = this;
        $(window).on('mouseenter dragend', function() {
          return delayedDragState(false, offDelay);
        });
        $('body').on('dragenter', function(e) {
          return delayedDragState(true, onDelay);
        });
        return $('body').on('dragleave', function(e) {
          if (e.target !== e.currentTarget) {
            return;
          }
          return delayedDragState(false, offDelay);
        });
      });
      delayedDragState = function(newActive, delay) {
        if (delayedDragState.timeout != null) {
          clearTimeout(delayedDragState.timeout);
          delayedDragState.timeout = null;
        }
        if (delay > 0) {
          return delayedDragState.timeout = setTimeout((function() {
            return __dragState(newActive);
          }), delay);
        } else {
          return __dragState(newActive);
        }
      };
      return __dragState = function(newActive) {
        if (active !== newActive) {
          active = newActive;
          $('@uploadcare-drop-area').trigger('dragstatechange.uploadcare', active);
          return $('body').toggleClass('uploadcare-draging', active);
        }
      };
    }
  });

}).call(this);
(function() {
  var $, files, namespace, tpl;

  namespace = uploadcare.namespace, files = uploadcare.files, $ = uploadcare.jQuery;

  tpl = uploadcare.templates.tpl;

  namespace('uploadcare.ui.progress', function(ns) {
    return ns.Circle = (function() {

      function Circle(element) {
        this.element = element;
        this.element = $(this.element);
        this.element.html(tpl('circle'));
        this.pie = this.element.find('@uploadcare-widget-status');
        this.element.addClass('uploadcare-widget-circle');
        this.size = Math.min(this.element.width(), this.element.height());
        this.pie.width(this.size).height(this.size);
        this.color = this.__getSegmentColor();
        this.angleOffset = -90;
        this.raphael = this.__initRaphael();
        this.path = this.raphael.path();
        this.path.attr({
          segment: 0,
          stroke: false
        });
        this.fullDelay = 500;
        this.__update(0, true);
        this.observed = null;
      }

      Circle.prototype.listen = function(file, selector) {
        var selectorFn,
          _this = this;
        if (selector == null) {
          selector = 'uploadProgress';
        }
        this.reset();
        selectorFn = selector != null ? function(info) {
          return info[selector];
        } : function(x) {
          return x;
        };
        this.observed = file;
        if (this.observed.state() === "resolved") {
          return this.__update(1, true);
        } else {
          return this.observed.progress(function(progress) {
            if (file === _this.observed) {
              return _this.__update(selectorFn(progress));
            }
          }).done(function(uploadedFile) {
            if (file === _this.observed) {
              return _this.__update(1, false);
            }
          });
        }
      };

      Circle.prototype.reset = function(filled) {
        if (filled == null) {
          filled = false;
        }
        this.observed = null;
        return this.__update((filled ? 100 : 0), true);
      };

      Circle.prototype.__update = function(val, instant) {
        var delay,
          _this = this;
        if (instant == null) {
          instant = false;
        }
        if (val > 1) {
          val = 1;
        }
        delay = this.fullDelay * Math.abs(val - this.value);
        this.value = val;
        if (instant) {
          return this.path.attr({
            segment: this.__segmentVal(this.value)
          });
        } else {
          return (function(value) {
            return _this.path.animate({
              segment: _this.__segmentVal(value)
            }, delay, 'linear', function() {
              if (_this.value !== value) {
                return _this.__update(_this.value, true);
              }
            });
          })(this.value);
        }
      };

      Circle.prototype.__segmentVal = function(value) {
        return 360 * (value < 1 ? value : 0.99999999);
      };

      Circle.prototype.__getSegmentColor = function() {
        var color;
        this.pie.addClass('uploadcare-widget-circle-active');
        color = this.pie.css('background-color');
        this.pie.removeClass('uploadcare-widget-circle-active');
        return color;
      };

      Circle.prototype.__initRaphael = function() {
        var angleOffset, color, raphael, size;
        raphael = uploadcare.Raphael(this.pie.get(0), this.size, this.size);
        color = this.color;
        size = this.size;
        angleOffset = this.angleOffset;
        raphael.customAttributes.segment = function(angle) {
          var a1, a2, flag, r, x, y;
          x = size / 2;
          y = size / 2;
          r = size / 2;
          a1 = 0;
          a2 = angle;
          a1 += angleOffset;
          a2 += angleOffset;
          flag = (a2 - a1) > 180;
          a1 = (a1 % 360) * Math.PI / 180;
          a2 -= 0.00001;
          a2 = (a2 % 360) * Math.PI / 180;
          return {
            path: [["M", x, y], ["l", r * Math.cos(a1), r * Math.sin(a1)], ["A", r, r, 0, +flag, 1, x + r * Math.cos(a2), y + r * Math.sin(a2)], ["z"]],
            fill: color
          };
        };
        return raphael;
      };

      return Circle;

    })();
  });

}).call(this);
(function() {
  var $, namespace, progress, t, tpl, utils, _ref;

  namespace = uploadcare.namespace, $ = uploadcare.jQuery, utils = uploadcare.utils, (_ref = uploadcare.ui, progress = _ref.progress);

  t = uploadcare.locale.t;

  tpl = uploadcare.templates.tpl;

  namespace('uploadcare.widget', function(ns) {
    return ns.Template = (function() {

      function Template(settings, element) {
        this.settings = settings;
        this.element = element;
        this.content = $(tpl('widget'));
        this.content.css('display', 'none');
        this.element.after(this.content);
        this.circle = new progress.Circle(this.content.find('@uploadcare-widget-status'));
        this.statusText = this.content.find('@uploadcare-widget-status-text');
        this.buttonsContainer = this.content.find('@uploadcare-widget-buttons');
        this.dropArea = this.content.find('@uploadcare-drop-area');
        this.labels = [];
      }

      Template.prototype.pushLabel = function(label) {
        this.labels.push(this.statusText.text());
        return this.statusText.text(label);
      };

      Template.prototype.popLabel = function() {
        return this.statusText.text(this.labels.pop());
      };

      Template.prototype.addState = function(state) {
        return this.content.addClass("uploadcare-widget-state-" + state);
      };

      Template.prototype.removeState = function(state) {
        return this.content.removeClass("uploadcare-widget-state-" + state);
      };

      Template.prototype.addButton = function(name, caption) {
        var li;
        if (caption == null) {
          caption = '';
        }
        li = $(tpl('widget-button', {
          name: name,
          caption: caption
        }));
        this.buttonsContainer.append(li);
        return li;
      };

      Template.prototype.setStatus = function(status) {
        var form;
        this.content.attr('data-status', status);
        form = this.element.closest('@uploadcare-upload-form');
        return form.trigger("" + status + ".uploadcare");
      };

      Template.prototype.reset = function() {
        this.statusText.text(t('ready'));
        this.circle.reset();
        return this.setStatus('ready');
      };

      Template.prototype.loaded = function() {
        this.setStatus('loaded');
        return this.circle.reset(true);
      };

      Template.prototype.listen = function(file) {
        var _this = this;
        this.__file = file;
        this.circle.listen(file);
        this.setStatus('started');
        return file.progress(function(info) {
          if (file === _this.__file) {
            switch (info.state) {
              case 'uploading':
                return _this.statusText.text(t('uploading'));
              case 'uploaded':
                return _this.statusText.text(t('loadingInfo'));
            }
          }
        });
      };

      Template.prototype.error = function(type) {
        this.statusText.text(t("errors." + (type || 'default')));
        this.circle.reset();
        return this.setStatus('error');
      };

      Template.prototype.setFileInfo = function(info) {
        var name, size;
        name = utils.fitText(info.name, 16);
        size = Math.ceil(info.size / 1024).toString();
        return this.statusText.html(tpl('widget-file-name', {
          name: name,
          size: size
        }));
      };

      return Template;

    })();
  });

}).call(this);
(function() {
  var $, files, namespace, t, tpl, utils;

  namespace = uploadcare.namespace, utils = uploadcare.utils, files = uploadcare.files, $ = uploadcare.jQuery;

  t = uploadcare.locale.t;

  tpl = uploadcare.templates.tpl;

  namespace('uploadcare', function(ns) {
    var Dialog, currentDialogPr;
    currentDialogPr = null;
    ns.isDialogOpened = function() {
      return currentDialogPr !== null;
    };
    ns.closeDialog = function() {
      return currentDialogPr != null ? currentDialogPr.reject() : void 0;
    };
    ns.openDialog = function(currentFile, tab, settings) {
      var dialog;
      if ($.isPlainObject(tab)) {
        settings = tab;
        tab = null;
      }
      ns.closeDialog();
      settings = utils.buildSettings(settings);
      dialog = new Dialog(settings, currentFile, tab);
      return currentDialogPr = dialog.publicPromise().always(function() {
        return currentDialogPr = null;
      });
    };
    return Dialog = (function() {

      function Dialog(settings, currentFile, tab) {
        var _this = this;
        this.settings = settings;
        if (currentFile) {
          this.settings = $.extend({}, this.settings, {
            previewStep: true
          });
        }
        this.dfd = $.Deferred();
        this.dfd.always(function() {
          return _this.__closeDialog();
        });
        this.content = $(tpl('dialog')).hide().appendTo('body');
        this["__bind"]();
        this.__prepareTabs();
        this.switchTab(tab || this.settings.tabs[0]);
        this.__setFile(currentFile);
        this.__updateFirstTab();
        this.content.fadeIn('fast');
      }

      Dialog.prototype.publicPromise = function() {
        var promise;
        promise = this.dfd.promise();
        promise.reject = this.dfd.reject;
        return promise;
      };

      Dialog.prototype["__bind"] = function() {
        var isPartOfWindow, reject,
          _this = this;
        reject = function() {
          return _this.dfd.reject(_this.currentFile);
        };
        isPartOfWindow = function(el) {
          return $(el).is('.uploadcare-dialog-panel') || $(el).parents('.uploadcare-dialog-panel').size();
        };
        this.content.on('click', function(e) {
          if (!(isPartOfWindow(e.target) || $(e.target).is('a'))) {
            return reject();
          }
        });
        $(window).on('keydown', function(e) {
          if (e.which === 27) {
            return reject();
          }
        });
        return this.content.on('click', '@uploadcare-dialog-switch-tab', function(e) {
          return _this.switchTab($(e.target).data('tab'));
        });
      };

      Dialog.prototype.__prepareTabs = function() {
        var tabName, _i, _len, _ref, _results,
          _this = this;
        this.tabs = {};
        this.tabs.preview = this.addTab('preview');
        this.tabs.preview.onDone.add(function() {
          return _this.dfd.resolve(_this.currentFile);
        });
        this.tabs.preview.onBack.add(function() {
          return _this.__setFile(null);
        });
        this.__hideTab('preview');
        _ref = this.settings.tabs;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          tabName = _ref[_i];
          if (!(!(tabName in this.tabs))) {
            continue;
          }
          this.tabs[tabName] = this.addTab(tabName);
          if (this.tabs[tabName]) {
            _results.push(this.tabs[tabName].onSelected.add(function(fileType, data) {
              return _this.__setFile(ns.fileFrom(fileType, data, _this.settings));
            }));
          } else {
            throw new Error("No such tab: " + tabName);
          }
        }
        return _results;
      };

      Dialog.prototype.__closeDialog = function() {
        var _this = this;
        return this.content.fadeOut('fast', function() {
          return _this.content.off().remove();
        });
      };

      Dialog.prototype.__setFile = function(currentFile) {
        this.currentFile = currentFile;
        if (this.settings.previewStep) {
          if (this.currentFile) {
            this.tabs.preview.setFile(this.currentFile);
            this.__showTab('preview');
            return this.switchTab('preview');
          } else {
            return this.__hideTab('preview');
          }
        } else {
          if (this.currentFile) {
            return this.dfd.resolve(this.currentFile);
          }
        }
      };

      Dialog.prototype.addTab = function(name) {
        var tab, tabCls, tabs,
          _this = this;
        tabs = uploadcare.widget.tabs;
        tabCls = (function() {
          switch (name) {
            case 'file':
              return tabs.FileTab;
            case 'url':
              return tabs.UrlTab;
            case 'facebook':
              return tabs.RemoteTabFor('facebook');
            case 'dropbox':
              return tabs.RemoteTabFor('dropbox');
            case 'gdrive':
              return tabs.RemoteTabFor('gdrive');
            case 'instagram':
              return tabs.RemoteTabFor('instagram');
            case 'preview':
              return tabs.PreviewTab;
          }
        })();
        if (!tabCls) {
          return false;
        }
        tab = new tabCls(this.dfd.promise(), this.settings);
        $('<div>').addClass("uploadcare-dialog-tab uploadcare-dialog-tab-" + name).attr('title', t("tabs." + name + ".title")).on('click', function() {
          return _this.switchTab(name);
        }).appendTo(this.content.find('.uploadcare-dialog-tabs'));
        tab.setContent($('<div>').hide().addClass('uploadcare-dialog-tabs-panel').addClass("uploadcare-dialog-tabs-panel-" + name).append(tpl("tab-" + name, {
          avalibleTabs: this.settings.tabs
        })).appendTo(this.content.find('.uploadcare-dialog-body')));
        return tab;
      };

      Dialog.prototype.switchTab = function(currentTab) {
        this.currentTab = currentTab;
        this.content.find('.uploadcare-dialog-body').find('.uploadcare-dialog-selected-tab').removeClass('uploadcare-dialog-selected-tab').end().find(".uploadcare-dialog-tab-" + this.currentTab).addClass('uploadcare-dialog-selected-tab').end().find('.uploadcare-dialog-tabs-panel').hide().filter(".uploadcare-dialog-tabs-panel-" + this.currentTab).show();
        return this.dfd.notify(this.currentTab);
      };

      Dialog.prototype.__updateFirstTab = function() {
        var className;
        className = 'uploadcare-dialog-first-tab';
        this.content.find("." + className).removeClass(className);
        return this.content.find(".uploadcare-dialog-tab").filter(function() {
          return $(this).css('display') !== 'none';
        }).first().addClass(className);
      };

      Dialog.prototype.__showTab = function(tab) {
        this.content.find(".uploadcare-dialog-tab-" + tab).show();
        return this.__updateFirstTab();
      };

      Dialog.prototype.__hideTab = function(tab) {
        if (this.currentTab === tab) {
          this.switchTab(this.settings.tabs[0]);
        }
        this.content.find(".uploadcare-dialog-tab-" + tab).hide();
        return this.__updateFirstTab();
      };

      return Dialog;

    })();
  });

}).call(this);
(function() {
  var $, namespace;

  namespace = uploadcare.namespace, $ = uploadcare.jQuery;

  namespace('uploadcare.widget.tabs', function(ns) {
    return ns.BaseFileTab = (function() {

      function BaseFileTab(dialog, settings) {
        this.dialog = dialog;
        this.settings = settings;
        this.onSelected = $.Callbacks();
      }

      BaseFileTab.prototype.setContent = function(content) {
        throw new Error('not implemented');
      };

      return BaseFileTab;

    })();
  });

}).call(this);
(function() {
  var $, dragdrop, namespace, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = uploadcare.namespace, utils = uploadcare.utils, $ = uploadcare.jQuery;

  dragdrop = uploadcare.widget.dragdrop;

  namespace('uploadcare.widget.tabs', function(ns) {
    return ns.FileTab = (function(_super) {

      __extends(FileTab, _super);

      function FileTab() {
        return FileTab.__super__.constructor.apply(this, arguments);
      }

      FileTab.prototype.setContent = function(content) {
        this.content = content;
        this.__setupFileButton();
        return this.__initDragNDrop();
      };

      FileTab.prototype.__initDragNDrop = function() {
        var className, dropArea;
        dropArea = this.content.find('@uploadcare-drop-area');
        if (utils.abilities.fileDragAndDrop) {
          dragdrop.receiveDrop(this.onSelected.fire, dropArea);
          className = 'draganddrop';
        } else {
          className = 'no-draganddrop';
        }
        return this.content.addClass("uploadcare-" + className);
      };

      FileTab.prototype.__setupFileButton = function() {
        var fileButton,
          _this = this;
        fileButton = this.content.find('@uploadcare-dialog-browse-file');
        return utils.fileInput(fileButton, this.settings.multiple, function(e) {
          return _this.onSelected.fire('event', e);
        });
      };

      return FileTab;

    })(ns.BaseFileTab);
  });

}).call(this);
(function() {
  var $, namespace, t,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = uploadcare.namespace, $ = uploadcare.jQuery;

  t = uploadcare.locale.t;

  namespace('uploadcare.widget.tabs', function(ns) {
    return ns.UrlTab = (function(_super) {
      var fixUrl, urlRegexp;

      __extends(UrlTab, _super);

      function UrlTab() {
        return UrlTab.__super__.constructor.apply(this, arguments);
      }

      urlRegexp = /^(http|https):\/\/.+\..+$/i;

      fixUrl = function(url) {
        url = $.trim(url);
        if (urlRegexp.test(url)) {
          return url;
        } else if (urlRegexp.test('http://' + url)) {
          return 'http://' + url;
        } else {
          return null;
        }
      };

      UrlTab.prototype.setContent = function(content) {
        var button, input,
          _this = this;
        this.content = content;
        input = this.content.find('@uploadcare-dialog-url-input');
        input.on('change keyup input', function() {
          return button.attr('disabled', !fixUrl($(this).val()));
        });
        button = this.content.find('@uploadcare-dialog-url-submit').attr('disabled', true);
        return this.content.find('@uploadcare-dialog-url-form').on('submit', function() {
          var url;
          if (url = fixUrl(input.val())) {
            _this.onSelected.fire('url', url);
          }
          return false;
        });
      };

      return UrlTab;

    })(ns.BaseFileTab);
  });

}).call(this);
(function() {
  var $, locale, namespace, utils,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  namespace = uploadcare.namespace, locale = uploadcare.locale, utils = uploadcare.utils, $ = uploadcare.jQuery;

  namespace('uploadcare.widget.tabs', function(ns) {
    return ns.RemoteTabFor = function(service) {
      var RemoteTab;
      return RemoteTab = (function(_super) {

        __extends(RemoteTab, _super);

        function RemoteTab() {
          return RemoteTab.__super__.constructor.apply(this, arguments);
        }

        RemoteTab.prototype.setContent = function(content) {
          var _this = this;
          this.content = content;
          this.dialog.progress(function(tab) {
            if (tab === service) {
              return _this.createIframe();
            }
          });
          return this.dialog.fail(function() {
            return _this.cleanup();
          });
        };

        RemoteTab.prototype.createIframe = function() {
          var src;
          if (!this.iframe) {
            this.windowId = utils.uuid();
            this.createWatcher();
            src = ("" + this.settings.socialBase + "/window/" + this.windowId + "/") + ("" + service + "?lang=" + locale.lang + "&public_key=" + this.settings.publicKey) + ("&widget_version=" + (encodeURIComponent(uploadcare.version)));
            return this.iframe = $('<iframe>').attr('src', src).css({
              width: '100%',
              height: '100%',
              border: 0,
              visibility: 'hidden'
            }).appendTo(this.content).on('load', function() {
              return $(this).css('visibility', 'visible');
            });
          }
        };

        RemoteTab.prototype.createWatcher = function() {
          var _this = this;
          if (!this.watcher) {
            this.watcher = new utils.pubsub.PubSub(this.settings, 'window', this.windowId);
            $(this.watcher).on('done', function(e, state) {
              _this.cleanup();
              return _this.onSelected.fire('url', state.url);
            });
            return this.watcher.watch();
          }
        };

        RemoteTab.prototype.cleanup = function() {
          var _ref, _ref1;
          if ((_ref = this.watcher) != null) {
            _ref.stop();
          }
          this.watcher = null;
          if ((_ref1 = this.iframe) != null) {
            _ref1.remove();
          }
          return this.iframe = null;
        };

        return RemoteTab;

      })(ns.BaseFileTab);
    };
  });

}).call(this);
(function() {
  var $, CropWidget, namespace, progress, t, tpl, utils, _ref, _ref1, _ref2, _ref3;

  namespace = uploadcare.namespace, utils = uploadcare.utils, (_ref = uploadcare.ui, progress = _ref.progress), (_ref1 = uploadcare.templates, tpl = _ref1.tpl), $ = uploadcare.jQuery, (_ref2 = uploadcare.crop, CropWidget = _ref2.CropWidget), (_ref3 = uploadcare.locale, t = _ref3.t);

  namespace('uploadcare.widget.tabs', function(ns) {
    return ns.PreviewTab = (function() {
      var PREFIX;

      PREFIX = '@uploadcare-dialog-preview-';

      function PreviewTab(dialog, settings) {
        this.dialog = dialog;
        this.settings = settings;
        this.onDone = $.Callbacks();
        this.onBack = $.Callbacks();
        this.__doCrop = this.settings.__cropParsed.enabled;
      }

      PreviewTab.prototype.setContent = function(content) {
        var notDisabled;
        this.content = content;
        notDisabled = ':not(.uploadcare-disabled-el)';
        this.content.on('click', PREFIX + 'back' + notDisabled, this.onBack.fire);
        return this.content.on('click', PREFIX + 'done' + notDisabled, this.onDone.fire);
      };

      PreviewTab.prototype.setFile = function(file) {
        var _this = this;
        this.file = file;
        this.__setState('unknown');
        file = this.file;
        return this.file.done(function(info) {
          if (file === _this.file) {
            if (info.isImage) {
              return _this.__setState('image');
            } else {
              return _this.__setState('regular');
            }
          }
        }).fail(function(error) {
          if (file === _this.file) {
            return _this.__setState('error', {
              error: error
            });
          }
        });
      };

      PreviewTab.prototype.__setState = function(state, data) {
        var _this = this;
        return this.file.progress(utils.once(function(progressInfo) {
          data = $.extend({
            file: progressInfo.incompleteFileInfo
          }, data);
          _this.content.empty().append(tpl("tab-preview-" + state, data));
          return _this.__afterRender(state);
        }));
      };

      PreviewTab.prototype.__afterRender = function(state) {
        if (state === 'unknown') {
          this.__initCircle();
          if (this.__doCrop) {
            this.__hideDoneButton();
          }
        }
        if (state === 'image' && this.__doCrop) {
          return this.__initCrop();
        }
      };

      PreviewTab.prototype.__hideDoneButton = function() {
        return this.content.find(PREFIX + 'done').hide();
      };

      PreviewTab.prototype.__initCrop = function() {
        var _this = this;
        return setTimeout((function() {
          var container, doneButton, img, widget;
          img = _this.content.find(PREFIX + 'image');
          container = img.parent();
          doneButton = _this.content.find(PREFIX + 'done');
          widget = new CropWidget($.extend({}, _this.settings.__cropParsed, {
            container: container,
            controls: false
          }));
          _this.file.done(function(info) {
            return widget.croppedImageModifiers(img.attr('src'), info.cdnUrlModifiers).done(function(opts) {
              return _this.file = _this.file.then(function(info) {
                var prefix;
                prefix = _this.settings.cdnBase;
                info.cdnUrlModifiers = opts.modifiers;
                info.cdnUrl = "" + prefix + "/" + info.uuid + "/" + (opts.modifiers || '');
                info.crop = opts.crop;
                return info;
              });
            });
          });
          doneButton.addClass('uploadcare-disabled-el');
          widget.onStateChange.add(function(state) {
            if (state === 'loaded') {
              return doneButton.removeClass('uploadcare-disabled-el').click(function() {
                return widget.forceDone();
              });
            }
          });
          img.remove();
          return _this.content.find('.uploadcare-dialog-title').text(t('dialog.tabs.preview.crop.title'));
        }), 100);
      };

      PreviewTab.prototype.__initCircle = function() {
        var circle, circleEl;
        circleEl = this.content.find('@uploadcare-dialog-preview-circle');
        if (circleEl.length) {
          circle = new progress.Circle(circleEl);
          return circle.listen(this.file);
        }
      };

      return PreviewTab;

    })();
  });

}).call(this);
(function() {
  var $, namespace, t, uploads, utils,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  namespace = uploadcare.namespace, utils = uploadcare.utils, uploads = uploadcare.uploads, $ = uploadcare.jQuery;

  t = uploadcare.locale.t;

  namespace('uploadcare.widget', function(ns) {
    return ns.Widget = (function() {

      function Widget(element) {
        this.__openDialogWithFile = __bind(this.__openDialogWithFile, this);

        this.__fail = __bind(this.__fail, this);

        this.reloadInfo = __bind(this.reloadInfo, this);

        this.__setFile = __bind(this.__setFile, this);

        this.__reset = __bind(this.__reset, this);

        var __onUploadComplete,
          _this = this;
        this.element = $(element);
        this.settings = utils.buildSettings(this.element.data());
        this.__onChange = $.Callbacks();
        this.onChange = utils.publicCallbacks(this.__onChange);
        __onUploadComplete = $.Callbacks();
        this.onUploadComplete = utils.publicCallbacks(__onUploadComplete);
        this.__onChange.add(function(file) {
          return file != null ? file.done(function(info) {
            return __onUploadComplete.fire(info);
          }) : void 0;
        });
        this.__setupWidget();
        this.currentFile = null;
        this.template.reset();
        this.element.on('change.uploadcare', function() {
          return _this.reloadInfo();
        });
        this.reloadInfo();
      }

      Widget.prototype.__reset = function(keepValue) {
        var _ref;
        if (keepValue == null) {
          keepValue = false;
        }
        if ((_ref = this.currentFile) != null) {
          _ref.cancel();
        }
        this.currentFile = null;
        this.template.reset();
        if (!keepValue) {
          return this.__setValue('');
        }
      };

      Widget.prototype.__setFile = function(newFile, keepValue) {
        var _this = this;
        if (keepValue == null) {
          keepValue = false;
        }
        if (newFile === this.currentFile) {
          if (newFile) {
            if (!keepValue) {
              this.__updateValue();
            }
          }
          return;
        }
        this.__reset(keepValue);
        if (newFile) {
          this.currentFile = newFile;
          this.template.listen(this.currentFile);
          this.currentFile.fail(function(error) {
            if (newFile === _this.currentFile) {
              return _this.__fail(error);
            }
          }).done(function(info) {
            if (newFile === _this.currentFile) {
              _this.template.setFileInfo(info);
              return _this.template.loaded();
            }
          });
          if (!keepValue) {
            return this.__updateValue();
          }
        }
      };

      Widget.prototype.__updateValue = function() {
        var file,
          _this = this;
        file = this.currentFile;
        return this.currentFile.done(function(info) {
          if (file === _this.currentFile) {
            return _this.__setValue(info.cdnUrlModifiers || _this.settings.pathValue ? info.cdnUrl : info.uuid);
          }
        });
      };

      Widget.prototype.__setValue = function(value) {
        if (this.element.val() !== value) {
          this.element.val(value);
          return this.__onChange.fire(this.currentFile);
        }
      };

      Widget.prototype.value = function(value) {
        if (value != null) {
          if (this.element.val() !== value) {
            this.__setFile(value.done && value.fail ? value : uploadcare.fileFrom('url', value, this.settings));
          }
          return this;
        } else {
          return this.currentFile;
        }
      };

      Widget.prototype.reloadInfo = function() {
        var file;
        if (this.element.val()) {
          file = uploadcare.fileFrom('url', this.element.val(), this.settings);
          this.__setFile(file, true);
        } else {
          this.__reset();
        }
        return this;
      };

      Widget.prototype.__fail = function(error) {
        this.__reset();
        return this.template.error(error);
      };

      Widget.prototype.__setupWidget = function() {
        var dialogButton, fileButton,
          _this = this;
        this.template = new ns.Template(this.settings, this.element);
        this.template.addButton('cancel', t('buttons.cancel')).on('click', function() {
          return _this.__reset();
        });
        this.template.addButton('remove', t('buttons.remove')).on('click', function() {
          return _this.__reset();
        });
        if (this.settings.tabs.length > 0) {
          if (__indexOf.call(this.settings.tabs, 'file') >= 0) {
            fileButton = this.template.addButton('file');
            fileButton.on('click', function() {
              return _this.openDialog('file');
            });
          }
          dialogButton = this.template.addButton('dialog');
          dialogButton.on('click', function() {
            return _this.openDialog();
          });
        }
        ns.dragdrop.receiveDrop(this.__openDialogWithFile, this.template.dropArea);
        this.template.dropArea.on('dragstatechange.uploadcare', function(e, active) {
          if (!(active && uploadcare.isDialogOpened())) {
            return _this.template.dropArea.toggleClass('uploadcare-dragging', active);
          }
        });
        return this.template.content.on('click', '@uploadcare-widget-file-name', function() {
          return _this.openDialog();
        });
      };

      Widget.prototype.__openDialogWithFile = function(type, data) {
        var file;
        file = uploadcare.fileFrom(type, data, this.settings);
        if (this.settings.previewStep) {
          return uploadcare.openDialog(file, this.settings).done(this.__setFile);
        } else {
          return this.__setFile(file);
        }
      };

      Widget.prototype.openDialog = function(tab) {
        var _this = this;
        return uploadcare.openDialog(this.currentFile, tab, this.settings).done(this.__setFile).fail(function(file) {
          if (file !== _this.currentFile) {
            return _this.__setFile(null);
          }
        });
      };

      Widget.prototype.api = function() {
        if (!this.__api) {
          this.__api = utils.bindAll(this, ['openDialog', 'reloadInfo', 'value']);
          this.__api.onChange = this.onChange;
          this.__api.onUploadComplete = this.onUploadComplete;
        }
        return this.__api;
      };

      return Widget;

    })();
  });

}).call(this);
(function() {
  var $, cleanup, dataAttr, initialize, initializeWidget, live;

  $ = uploadcare.jQuery;

  dataAttr = 'uploadcareWidget';

  uploadcare.initialize = function(container) {
    if (container == null) {
      container = 'body';
    }
    return initialize($(container).find('@uploadcare-uploader'));
  };

  initialize = function(targets) {
    var target, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = targets.length; _i < _len; _i++) {
      target = targets[_i];
      _results.push(uploadcare.Widget(target));
    }
    return _results;
  };

  uploadcare.Widget = function(target) {
    var el;
    el = $(target).eq(0);
    return initializeWidget(el);
  };

  initializeWidget = function(el) {
    var widget;
    widget = el.data(dataAttr);
    if (!widget || el[0] !== widget.element[0]) {
      cleanup(el);
      widget = new uploadcare.widget.Widget(el);
      el.data(dataAttr, widget);
      widget.template.content.data(dataAttr, widget.template);
    }
    return widget.api();
  };

  cleanup = function(el) {
    var template;
    el.off('.uploadcare');
    el = el.next('.uploadcare-widget');
    template = el.data(dataAttr);
    if (el.length && (!template || el[0] !== template.content[0])) {
      return el.remove();
    }
  };

  live = function() {
    return initialize($('@uploadcare-uploader'));
  };

  if (uploadcare.defaults.live) {
    $(function() {
      return setInterval(live, 100);
    });
  } else {
    $(live);
  }

}).call(this);
(function() {
  var $, canSubmit, cancelEvents, submitPreventionState, submittedForm;

  $ = uploadcare.jQuery;

  canSubmit = function(form) {
    var notSubmittable;
    notSubmittable = '[data-status=started], [data-status=error]';
    return !form.find('.uploadcare-widget').is(notSubmittable);
  };

  submitPreventionState = function(form, prevent) {
    form.attr('data-uploadcare-submitted', prevent);
    return form.find(':submit').attr('disabled', prevent);
  };

  $(document).on('submit', '@uploadcare-upload-form', function() {
    var form;
    form = $(this);
    if (canSubmit(form)) {
      return true;
    } else {
      submitPreventionState(form, true);
      return false;
    }
  });

  submittedForm = '@uploadcare-upload-form[data-uploadcare-submitted]';

  $(document).on('loaded.uploadcare', submittedForm, function() {
    return $(this).submit();
  });

  cancelEvents = 'ready.uploadcare error.uploadcare';

  $(document).on(cancelEvents, submittedForm, function() {
    var form;
    form = $(this);
    if (canSubmit(form)) {
      return submitPreventionState(form, false);
    }
  });

}).call(this);
(function() {
  var expose, key,
    __hasProp = {}.hasOwnProperty;

  uploadcare.version = '0.6.9.2';

  expose = uploadcare.expose;

  expose('whenReady');

  expose('defaults');

  expose('initialize');

  expose('fileFrom');

  expose('locales', (function() {
    var _ref, _results;
    _ref = uploadcare.locale.translations;
    _results = [];
    for (key in _ref) {
      if (!__hasProp.call(_ref, key)) continue;
      _results.push(key);
    }
    return _results;
  })());

  expose('openDialog');

  expose('Circle', uploadcare.ui.progress.Circle);

  expose('Widget');

}).call(this);
}({}));
