/**
	joLog
	=====
	
	Wrapper for `console.log()` (or whatever device-specific logging you have). Also could
	be extended to send log information to a RESTful service as well, handy for devices
	which don't have decent logging abilities.
	
	Use
	---
	
	It's an all-in-one utility that's smart enough to ferret out whatever you throw at it
	and display it in the console.
	
		joLog("x=", x, "listdata=", listdata);
	
	Basically, fill it up with strings, variables, objects, arrays and the function will
	produce a string version of each argument (where appropriate; browser debuggers tend to
	display objects nicely) in the same console line. Simple, effective, easy to use.

*/
/**
 * Wrapper for `console.log()` (or whatever device-specific logging you have). Also could
 *	be extended to send log information to a RESTful service as well, handy for devices
 *	which don't have decent logging abilities.
 *@example
 *<pre>
 *It's an all-in-one utility that's smart enough to ferret out whatever you throw at it
 *	and display it in the console.
 *	
 *		joLog("x=", x, "listdata=", listdata);
 *	
 *	Basically, fill it up with strings, variables, objects, arrays and the function will
 *	produce a string version of each argument (where appropriate; browser debuggers tend to
 *	display objects nicely) in the same console line. Simple, effective, easy to use.
 *</pre>	
 * @function
 */
joLog = function() {
	var strings = [];
	
	for (var i = 0; i < arguments.length; i++) {
		// TODO: stringify for objects and arrays
		strings.push(arguments[i]);
	}
	
	// spit out our line
	console.log(strings.join(" "));
};



/**
	- - -

	jo
	==

	Singleton which the framework uses to store global infomation. It also is
	responsible for initializing the rest of the framework, detecting your environment,
	and notifying your application when jo is ready to use.
	
	Methods
	-------
	
	- `load()`
	
	  This method should be called after your DOM is loaded and before your app uses
	  jo. Typically, you can call this function from your document's `onLoad` method,
	  but it is recommended you use more device-specific "ready" notification if
	  they are available.
	
	- `getPlatform()`
	
	  Returns the platform you're running in as a string. Usually this is not needed,
	  but can be useful.
	
	- `getVersion()`
	
	  Returns the version of jo you loaded in the form of a string (e.g. `0.1.1`).
	
	- `matchPlatform(string)`
	  
	  Feed in a string list of desired platforms (e.g. `"mozilla chrome ipad"`),
	  and returns true if the identified platform is in the test list.

	Events
	------
	
	- `loadEvent`
	- `unloadEvent`
	
	  These events are fired after jo loads or unloads, and can be used in your
	  application to perform initialization or cleanup tasks.

	Function
	========
	
	jo extends the Function object to add a few goodies which augment JavaScript
	in a farily non-intrusive way.
	
	Methods
	-------
	
	- `extend(superclass, prototype)`
	
	  Gives you an easy way to extend a class using JavaScript's natural prototypal
	  inheritance. See Class Patterns for more information.
	
	- `bind(context)`

	  Returns a private function wrapper which automagically resolves context
	  for `this` when your method is called.
	
	HTMLElement
	===========
	
	This is a standard DOM element for JavaScript. Most of the jo views, continers
	and controls deal with these so your application doesn't need to.

	Methods
	-------
	
	Not a complete list by any means, but the useful ones for our
	purposes are:
	
	- `appendChild(node)`
	- `insertChild(before, node)`
	- `removeChild(node)`
	
	Properties
	----------
	
	jo uses these properties quite a bit:
	
	- `innerHTML`
	- `className`
	- `style`

*/

// syntactic sugar to make it easier to extend a class
/**
 * Gives you an easy way to extend a class using JavaScript's natural prototypal
 * inheritance. See Class Patterns for more information.
 * @extends Function
 * @param {} superclass
 * @param {} proto
 */
Function.prototype.extend = function(superclass, proto) {
	// create our new subclass

	if (typeof Object.create !== "undefined")
		this.prototype = Object.create(superclass.prototype);
	else
		this.prototype = new superclass();

	// optional subclass methods and properties
	if (proto) {
		for (var i in proto)
			this.prototype[i] = proto[i];
	}
};

// add bind() method if we don't have it already
/**
 * Returns a private function wrapper which automagically resolves context
 * for `this` when your method is called.
 */
if (typeof Function.prototype.bind === 'undefined') {
	Function.prototype.bind = function(context) {
		var self = this;

		function callbind() {
			return self.apply(context, arguments);
		}

		return callbind;
	};
}

// hacky kludge for hacky browsers
if (typeof HTMLElement === 'undefined')
	HTMLElement = Object;

// no console.log? sad...
if (typeof console === 'undefined')
	console = { };
if (typeof console.log !== 'function')
	console.log = function(msg) { };

// just a place to hang our hat
/**
 * Singleton which the framework uses to store global infomation. It also is
 * responsible for initializing the rest of the framework, detecting your environment,
 * and notifying your application when jo is ready to use.
 * @static
 */	
jo = {
	platform: "webkit",
	version: "0.5.0",
	
	useragent: [
		'ipad',
		'iphone',
		'ipod',
		'playbook',
		'bb10',
		'webos',
		'hpwos',
		'bada',
		'ouya',
		'tizen',
		'android',
		'kindle',
		'silk',
		'iemobile',
		'msie',
		'opera',
		'chrome',
		'safari',
		'firefox',
		'mozilla',
		'gecko'
	],
	
	osMap: {
		ipad: "ios",
		iphone: "ios",
		ipod: "ios",
		webos: "webos",
		hpwos: "webos",
		silk: "android",
		ouya: "android",
		kindle: "android",
		msie: "windows",
		iemobile: "windows",
		safari: "osx"
	},

	debug: false,
	setDebug: function(state) {
		this.debug = state;
	},
	
	flag: {
		stopback: false
	},
	
	/**
	 * 	  This method should be called after your DOM is loaded and before your app uses
	 *    jo. Typically, you can call this function from your document's `onLoad` method,
	 *    but it is recommended you use more device-specific "ready" notification if
	 *    they are available.
	 * @param {} call
	 * @param {} context
	 */
	load: function(call, context) {
		joDOM.enable();
		/** 
		 * This event is fired after jo loads, and can be used in your
	     * application to perform initialization tasks.
		 * @function 
		 * */
		this.loadEvent = new joSubject(this);
		/** 
		 * This event is fired after jo unloads, and can be used in your
	     * application to perform cleanup tasks.
		 * @function 
		 * */
		this.unloadEvent = new joSubject(this);

		// capture these events, prevent default for applications
		document.body.onMouseDown = function(e) { e.preventDefault(); };
		document.body.onDragStart = function(e) { e.preventDefault(); };

		// quick test to see which environment we're in
		if (typeof navigator == 'object' && navigator.userAgent) {
			var agent = navigator.userAgent.toLowerCase();
			for (var i = 0; i < this.useragent.length; i++) {
				if (agent.indexOf(this.useragent[i]) >= 0) {
					this.platform = this.useragent[i];
					break;
				}
			}
		}

		this.os = this.osMap[this.platform] || this.platform;

		if (joEvent) {
			// detect if we're on a touch or mouse based browser
			var o = document.createElement('div');
			var test = ("ontouchstart" in o);
			if (!test) {
				o.setAttribute("ontouchstart", 'return;');
				test = (typeof o.ontouchstart === 'function');
			}
			joEvent.touchy = test;
			o = null;
		}
		
		if (joGesture)
			joGesture.load();

		var s = (typeof joScroller !== "undefined") ? joScroller.prototype : null;
		var d = joDOM;

		if (s && this.matchPlatform("tizen msie chrome safari bb10 firefox")) {
			// native scrolling
			joDOM.addCSSClass(document.body, "nativescroll");
			s.onDown = function() {};
			s.setEvents = function() {};
			s.onUp = function() {};
			s.onMove = function() {};
			s.onClick = function() {};
			s.setPosition = s.setPositionNative;
		}

		// setup transition css hooks for the scroller
		if (typeof document.body.style.webkitTransition !== "undefined") {
			joEvent.map.transitionend = "webkitTransitionEnd";
			d.transform = function(node, arg) {
				node.style.webkitTransform = arg;
			};
			d.transformOrigin = function(node, arg) {
				node.style.webkitTransformOrigin = arg;
			};
			d.transition = function(node, arg) {
				node.style.webkitTransition = arg;
			};
		}
		else if (typeof document.body.style.MozTransition !== "undefined") {
			// mozilla with transitions
			if (s) s.setPosition = function(x, y, node) {
				node.style.MozTransform = "translate(" + x + "px," + y + "px)";
			};
			d.transform = function(node, arg) {
				node.style.MozTransform = arg;
			};
			d.transformOrigin = function(node, arg) {
				node.style.MozTransformOrigin = arg;
			};
			d.transition = function(node, arg) {
				node.style.MozTransition = arg;
			};
		}
		else if (typeof document.body.style.msTransform !== "undefined") {
			// IE9 with transitions
			if (s) s.setPosition = function(x, y, node) {
				node.style.msTransform = "translate(" + x + "px," + y + "px)";
			};
			d.transform = function(node, arg) {
				node.style.msTransform = arg;
			};
			d.transformOrigin = function(node, arg) {
				node.style.msTransformOrigin = arg;
			};
			d.transition = function(node, arg) {
				node.style.msTransition = arg;
			};
		}
		else if (typeof document.body.style.OTransition !== "undefined") {
			// opera with transitions
			if (s) s.setPosition = function(x, y, node) {
				node.style.OTransform = "translate(" + x + "px," + y + "px)";
			};
			joEvent.map.transitionend = "otransitionend";
			d.transform = function(node, arg) {
				node.style.OTransform = arg;
			};
			d.transformOrigin = function(node, arg) {
				node.style.OTransformOrigin = arg;
			};
			d.transition = function(node, arg) {
				node.style.OTransition = arg;
			};
		}
		else {
			// no transitions, disable flick scrolling
			s.velocity = 0;
			s.bump = 0;
			if (s) s.setPosition = function(x, y, node) {
				if (this.vertical)
					node.style.top = y + "px";
				
				if (this.horizontal)
					node.style.left = x + "px";
			};
		}

		if (!window.requestAnimationFrame) {
			console.log("jo: swapping requestanimationframe with settimeout");
			jo.requestAnimationFrame = false;
			window.requestAnimationFrame = function(call) {
				setTimeout(call, 17);
			}
		}
		else {
			jo.requestAnimationFrame = true;
		}

		joLog("Jo", this.version, "loaded for", this.platform, "environment");

		this.loadEvent.fire();
	},
	
	tagMap: {},
	tagMapLoaded: false,
	
	// make a map of node.tagName -> joView class constructor
	/**
	 * 
	 */
	initTagMap: function() {
		// we only do this once per session
		if (this.tagMapLoaded)
			return;

		var key = this.tagMap;
		
		// defaults
		key.JOVIEW = joView;
		key.BODY = joScreen;

		// run through all our children of joView
		// and add to our joCollect.view object
		for (var p in window) {
			var o = window[p];
			if (typeof o === 'function'
			&& o.prototype
			&& typeof o.prototype.tagName !== 'undefined'
			&& o.prototype instanceof joView) {
				var tag = o.prototype.tagName.toUpperCase();
				
				if (o.prototype.type) {
					// handle tags with multiple types
					if (!key[tag])
						key[tag] = {};
						
					key[tag][o.prototype.type] = o;
				}
				else {
					key[tag] = o;
				}
			}
		}
	},
	/**
	 * 	  Returns the platform you're running in as a string. Usually this is not needed,
	 *    but can be useful.
	 * @return {Object}
	 */
	getPlatform: function() {
		return this.platform;
	},
	/**
	 * 
	 * @param {} test
	 * @return {Object}
	 */
	matchPlatform: function(test) {
		return (test.indexOf(this.platform) >= 0);
	},
	/**
	 * Returns the version of jo you loaded in the form of a string (e.g. `0.1.1`).
	 * @return {Object}
	 */
	getVersion: function() {
		return this.version;
	},
	/**
	 * Returns the language.
	 * @return {Object}
	 */
	getLanguage: function() {
		return this.language;
	}
};

/**
 * @name Spectra
 * @static
 * @extends jo 
 */
Spectra = jo;

/**
	joDOM
	======
	
	Singleton with utility methods for manipulating DOM elements.
	
	Methods
	-------

	- `get(id)`

	  Returns an HTMLElement which has the given id or if the
	  id is not a string returns the value of id.
	
	- `create(type, style)`
	
	  Type is a valid HTML tag type. Style is the same as `setStyle()`
	  method. Returns an HTMLElement.

			// simple
			var x = joDOM.create("div", "mycssclass");

			// more interesting
			var x = joDOM.create("div", {
				id: "name",
				className: "selected",
				background: "#fff",
				color: "#000"
			});

	- `setStyle(tag, style)`
	
	  Style can be an object literal with
	  style information (including "id" or "className") or a string. If
	  it's a string, it will simply use the style string as the className
	  for the new element.
	  
	  Note that the preferred and most cross-platform method for working
	  with the DOM is to use `className` and possibly `id` and put your
	  actual style information in your CSS file. That said, sometimes it's
	  easier to just set the background color in the code. Up to you.
	
	- `getParentWithin(node, ancestor)`

	  Returns an HTMLElement which is
	  the first child of the ancestor which is a parent of a given node.
	
	- `addCSSClass(HTMLElement, classname)`

	  Adds a CSS class to an element unless it is already there.
	
	- `removeCSSClass(HTMLElement, classname)`

	  Removes a CSS class from an element if it exists.
	
	- `toggleCSSClass(HTMLElement, classname)`

	  Auto add or remove a class from an element.
	
	- `pageOffsetLeft(HTMLElement)` and `pageOffsetHeight(HTMLElement)`
	
	  Returns the "true" left and top, in pixels, of a given element relative
	  to the page.
	
	- `applyCSS(css, stylenode)`
	
	  Applies a `css` string to the app. Useful for quick changes, like backgrounds
	  and other goodies. Basically creates an inline `<style>` tag. This method
	  returns a reference to the new `<style>` tag, which you can use with `removeCSS()`
	  and subsequent calls to `applyCSS()` as the `stylenode` argument.
	
	- `loadCSS(filename)`
	
	  Works the same as `applyCSS()` but loads the CSS from a file instead of a string.
	
	- `removeCSS(stylenode)`
	
	  Removes a `<style>` tag created with `applyCSS()` or `loadCSS()`.

*/
/**
 * Singleton with utility methods for manipulating DOM elements.
 * @static
 * @class
 */
joDOM = {
	/**
	 * @type Boolean
	 */
	enabled: false,
	/**
	 * Returns an HTMLElement which has the given id or if the
	 * id is not a string returns the value of id.
	 * @param {} id
	 * @return {Object}
	 */
	get: function(id) {
		if (typeof id === "string") {
			return joCache.exists(id) ? joCache.get(id) : document.getElementById(id);
		}
		else if (typeof id === 'object') {
			if (id instanceof joView)
				return id.container;
			else
				return id;
		}
	},
	/**
	 * Remove
	 * @param {} node
	 */
	remove: function(node) {
		if (node.parentNode)
			node.parentNode.removeChild(node);
	},
	/**
	 * Enable
	 */
	enable: function() {
		this.enabled = true;
	},
	/**
	 * Returns an HTMLElement which is
	 * the first child of the ancestor which is a parent of a given node.
	 * @param {} node
	 * @param {} ancestor
	 * @return {Object}
	 */
	getParentWithin: function(node, ancestor) {
		while (node.parentNode !== window && node.parentNode !== ancestor) {
			node = node.parentNode;
		}

		return node;
	},
	/**
	 * Adds a CSS class to an element unless it is already there.
	 * @param {HTMLElement} node
	 * @param {String} classname
	 */
	addCSSClass: function(node, classname) {
		node = joDOM.get(node);

		if (typeof node.className !== "undefined") {
			var n = node.className.split(/\s+/);

			for (var i = 0, l = n.length; i < l; i++) {
				if (n[i] == classname)
					return;
			}

			n.push(classname);
			node.className = n.join(" ");
		}
		else {
			node.className = classname;
		}
	},
	/**
	 * Removes a CSS class from an element if it exists.
	 * @param {HTMLElement} node
	 * @param {String} classname
	 * @param {Boolean} toggle
	 */
	removeCSSClass: function(node, classname, toggle) {
		node = joDOM.get(node);

		if (typeof node.className !== "undefined") {
			var n = node.className.split(/\s+/);

			for (var i = 0, l = n.length; i < l; i++) {
				if (n[i] == classname) {
					if (l == 1) {
						node.className = "";
					}
					else {
						n.splice(i, 1);
						node.className = n.join(" ");
					}

					return;
				}
			}

			if (toggle) {
				n.push(classname);
				node.className = n.join(" ");
			}
		}
		else {
			node.className = classname;
		}
	},
	/**
	 * Auto add or remove a class from an element.
	 * @param {HTMLElement} node
	 * @param {String} classname
	 */
	toggleCSSClass: function(node, classname) {
		this.removeCSSClass(node, classname, true);
	},
	/**
	 * Type is a valid HTML tag type. Style is the same as `setStyle()`
	 * method. Returns an HTMLElement.
	 *@example
	 *<pre>		
	 *		// simple
	 *		var x = joDOM.create("div", "mycssclass");
	 *
	 *		// more interesting
	 *		var x = joDOM.create("div", {
	 *			id: "name",
	 *			className: "selected",
	 *			background: "#fff",
	 *			color: "#000"
	 *		});
	 *</pre>
	 * @param {object|string} tag
	 * @param {} style
	 * @return {HTMLElement}
	 */
	create: function(tag, style) {
		if (!this.enabled)
			return null;

		var o;
		
		if (typeof tag === "object" && typeof tag.tagName === "string") {
			// being used to create a container for a joView
			o = document.createElement(tag.tagName);

			if (tag.className)
				this.setStyle(o, tag.className);
		}
		else {
			o = document.createElement(tag);

			if (style)
				this.setStyle(o, style);
		}
		
		return o;
	},
	/**
	 * Style can be an object literal with
	 * style information (including "id" or "className") or a string. If
	 * it's a string, it will simply use the style string as the className
	 * for the new element.
	 * 
	 * Note that the preferred and most cross-platform method for working
	 * with the DOM is to use `className` and possibly `id` and put your
	 * actual style information in your CSS file. That said, sometimes it's
	 * easier to just set the background color in the code. Up to you.
	 * @param {} node
	 * @param {} style
	 */
	setStyle: function(node, style) {
		node = joDOM.get(node);
		
		if (typeof style === "string") {
			node.className = style;
		}
		else if (typeof style === "object") {
			for (var i in style) {
				switch (i) {
				case "id":
				case "className":
					node[i] = style[i];
					break;
				default:
					node.style[i] = style[i];
				}
			}
		}
		else if (typeof style !== "undefined") {
			throw("joDOM.setStyle(): unrecognized type for style argument; must be object or string.");
		}
	},
	/**
	 * Applies a `css` string to the app. Useful for quick changes, like backgrounds
	 * and other goodies. Basically creates an inline `<style>` tag. This method
	 * returns a reference to the new `<style>` tag, which you can use with `removeCSS()`
	 * and subsequent calls to `applyCSS()` as the `stylenode` argument.
	 * @param {String} style
	 * @param {HTMLElement} oldnode
	 * @return {HTMLElement}
	 */
	applyCSS: function(style, oldnode) {
		// TODO: should insert before and then remove the old node
		if (oldnode)
			document.body.removeChild(oldnode);

		var css = joDOM.create('jostyle');
		css.innerHTML = '<style>' + style + '</style>';

		document.body.appendChild(css);

		return css;
	},
	/**
	 * Removes the child nodes from the node.
	 * @param {HTMLElement} node
	 */
	removeCSS: function(node) {
		document.body.removeChild(node);
	},
	/**
	 * 
	 * @param {String} filename
	 * @param {HTMLElement} oldnode
	 * @return {HTMLElement} css
	 */
	loadCSS: function(filename, oldnode) {
		// you can just replace the source for a given
		// link if one is passed in
		var css = (oldnode) ? oldnode : joDOM.create('link');

		css.rel = 'stylesheet';
		css.type = 'text/css';
		css.href = filename + (jo.debug ? ("?" + joTime.timestamp()) : "");

		if (!oldnode)
			document.body.appendChild(css);
		
		return css;
	},
	/**
	 * Removes a `<style>` tag created with `applyCSS()` or `loadCSS()`.
	 * @param {String} style
	 * @param {HTMLElement} oldnode
	 * @return {HTMLElement}
	 */
	applyCSS: function(style, oldnode) {
		var css = oldnode || joDOM.create('jostyle');
		css.innerHTML = '<style>' + style + '</style>';

		if (!oldnode)
			document.body.appendChild(css);

		return css;
	},
	/**
	 * Add meta data
	 * @param {String} name
	 * @param {String} content
	 */
	addMeta: function(name, content) {
		var meta = joDOM.create("meta");
		meta.setAttribute("name", name);
		meta.setAttribute("content", content);
		document.head.appendChild(meta);
	},
	/**
	 * Returns the "true" left, in pixels, of a given element relative
	 * to the page.
	 * @param {HTMLElement} node
	 * @return {Number} In pixels
	 */
	pageOffsetLeft: function(node) {
		var l = 0;
		
		while (typeof node !== 'undefined' && node && node.parentNode !== window) {
			if (node.offsetLeft)
				l += node.offsetLeft;

			node = node.parentNode;
		}

		return l;
	},
	/**
	 * Returns the "true" top, in pixels, of a given element relative
	 * to the page.
	 * @param {HTMLElement} node
	 * @return {Number} In pixels
	 */
	pageOffsetTop: function(node) {
		var t = 0;
		
		while (typeof node !== 'undefined' && node && node.parentNode !== window) {
			if (node.offsetTop)
				t += node.offsetTop;
				
			node = node.parentNode;
		}

		return t;
	},
	/**
	 * Returns the bounds of a node.
	 * @param {HTMLElement} node
	 * @return {Object} Returns an object with top, left, bottom, right, center.x and center.y
	 */
	getBounds: function(node) {
		var top = joDOM.pageOffsetTop(node);
		var left = joDOM.pageOffsetLeft(node);
		var bottom = top + node.offsetHeight;
		var right = left + node.offsetWidth;
		
		return {
			top: top,
			left: left,
			bottom: bottom,
			right: right,
			center:{
				x: left + (right - left) / 2,
				y: top + (bottom - top) / 2
			}			
		};
	},
	/**
	 * Sets the position of a node
	 * @param {HTMLElement} o
	 * @param {Number} x  x in pixels
	 * @param {Number} y  y in pixels
	 * @param {Number} w  width in pixels 
	 * @param {Number} h  height in pixels
	 */
	setPosition: function(o, x, y, w, h) {
		o.style.position = "absolute";

		o.style.left = Math.floor(x) + "px";
		o.style.top = Math.floor(y) + "px";

		if (w && h) {
			o.style.width = Math.floor(w) + "px";
			o.style.height = Math.floor(h) + "px";
		}
	},
	/**
	 * Attach a node to a parent node
	 * @param {HTMLElement} node
	 * @param {HTMLElement} parent
	 */
	attach: function(node, parent) {
		parent.appendChild(node);
	},
	/**
	 * Detach a node from it's parent node
	 * @param {HTMLElement} node
	 * @param {HTMLElement} parent
	 */
	detach: function(node, parent) {
		if (!parent)
			parent = node.parentNode;

		if (parent)
			parent.removeChild(node);
	}
};
/**
 * @constructor joCSSRule
 * @param {} data
 */
joCSSRule = function(data) {
	this.setData(data);
};

joCSSRule.prototype = {
	/**
	 * 
	 * @type Object
	 */
	container: null,
	/**
	 * Set the data
	 * @param {} data
	 */
	setData: function(data) {
		this.data = data || "";
		this.enable();
	},
	/**
	 * Clear
	 */
	clear: function() {
		this.setData();
	},
	/**
	 * Disable
	 */
	disable: function() {
		joDOM.removeCSS(this.container);
	},
	/**
	 * Enable
	 */
	enable: function() {
		this.container = joDOM.applyCSS(this.data, this.container);
	}
};


/**
	joEvent
	========
	
	Singleton with DOM event model utility methods. Ideally, application-level
	code shouldn't have to use this, but library code does.
	
	Methods
	-------
	- `on(HTMLElement, event, Function, context, data)`
	
	  Set a DOM event listener for an HTMLElement which calls a given Function
	  with an optional context for `this` and optional static data. Returns a
	  reference to the handler function, which is required if you need to `remove()`
	  later.
	
	- `capture(HTMLElement, event, function, context, data)`
	
	  This is the same os `on()`, but captures the event at the node before its
	  children. If in doubt, use `on()` instead.
	
	- `remove(HTMLElement, event, handler)`
	
	  Removes a previously declared DOM event. Note that `handler` is the return
	  value of the `on()` and `capture()` methods.
	
	- `stop(event)`
	
	   Stop event propogation.
	
	- `preventDefault(event)`
	
	  Prevent default action for this event.
	
	- `block(event)`
	
	  Useful for preventing dragging the window around in some browsers, also highlighting
	  text in a desktop browser.
	
	- `getTarget(event)`
	
	  Returns the HTMLElement which a DOM event relates to.

*/
/**
 * Singleton with DOM event model utility methods. Ideally, application-level
 * code shouldn't have to use this, but library code does.
 * @static
 * @class
 */
joEvent = {
	eventMap: {
		"mousedown": "touchstart",
		"mousemove": "touchmove",
		"mouseup": "touchend",
		"mouseout": "touchcancel"
	},

	map: {
		click: "click",
		transitionend: "transitionend"
	},

	touchy: false,
	/**
	 * Returns the HTMLElement which a DOM event relates to.
	 * @param {} e Event
	 * @return {Object}
	 */
	getTarget: function(e) {
		if (!e)
			e = window.event;
		
		return e.target ? e.target : e.srcElement;
	},
	/**
	 * This is the same os `on()`, but captures the event at the node before its
	 * children. If in doubt, use `on()` instead.
	 * @param {HTMLElement} element
	 * @param {String} event
	 * @param {function} call
	 * @param {} context
	 * @param {} data
	 * @return {Object}
	 */
	capture: function(element, event, call, context, data) {
		return this.on(element, event, call, context, data, true);
	},
	/**
	 * Set a DOM event listener for an HTMLElement which calls a given Function
	 * with an optional context for `this` and optional static data. Returns a
	 * reference to the handler function, which is required if you need to `remove()`
	 * later.
	 * @param {HTMLElement} element
	 * @param {} event
	 * @param {function} call
	 * @param {} context
	 * @param {} data
	 * @param {} capture
	 * @return {Boolean}
	 */
	on: function(element, event, call, context, data, capture) {
		if (!call || !element)
			return false;
			
		if (this.touchy) {
			if (this.eventMap[event])
				event = this.eventMap[event];
		}

		element = joDOM.get(element);
//		data = data || "";

		function wrappercall(e) {
			// support touchy platforms,
			// might reverse this to turn non-touch into touch
			if (e.touches && e.touches.length == 1) {
				var touches = e.touches[0];
				e.pageX = touches.pageX;
				e.pageY = touches.pageY;
				e.screenX = touches.screenX;
				e.screenY = touches.screenY;
				e.clientX = touches.clientX;
				e.clientY = touches.clientY;
			}
			
			if (context)
				call.call(context, e, data);
			else
				call(e, data);
		}
		
		// annoying kludge for Mozilla
		wrappercall.capture = capture || false;

		if (!window.addEventListener)
			element.attachEvent("on" + event, wrappercall);
		else
			element.addEventListener(event, wrappercall, capture || false);
			
		return wrappercall;
	},
	/**
	 * Removes a previously declared DOM event. Note that `handler` is the return
	 * value of the `on()` and `capture()` methods.
	 * @param {HTMLElement} element
	 * @param {String} event
	 * @param {function} call
	 * @param {} capture
	 */
	remove: function(element, event, call, capture) {
		if (this.touchy) {
			if (this.eventMap[event]) {
				event = this.eventMap[event];
			}
		}

		if (typeof element.removeEventListener !== 'undefined')
			element.removeEventListener(event, call, capture || false);
	},
	/**
	 * Stop event propagation.
	 * @param {} e Event
	 */	
	stop: function(e) {
		if (e.stopPropagation)
			e.stopPropagation();
		else
			e.cancelBubble = true;
	},
	/**
	 * Prevent default action for this event.
	 * @param {} e Event
	 */
	preventDefault: function(e) {
		e.preventDefault();
	},
	/**
	 * Useful for preventing dragging the window around in some browsers, also highlighting
	 * text in a desktop browser.
	 * @param {} e Event
	 * @return {Boolean}
	 */
	block: function(e) {
		if (window.event)
			e = window.event;

		if (typeof e.target == 'undefined')
			e.target = e.srcElement;

		switch (e.target.nodeName.toLowerCase()) {
		case 'input':
		case 'textarea':
			return true;
		default:
			return false;
		}
	}
};



/**
	joSubject
	==========
	
	Class for custom events using the Observer Pattern. This is designed to be used
	inside a subject to create events which observers can subscribe to. Unlike
	the classic observer pattern, a subject can fire more than one event when called,
	and each observer gets data from the subject. This is very similar to YUI 2.x
	event model.
	
	You can also "lock" the notification chain by using the `capture()` method, which
	tells the event to only notify the most recent subscriber (observer) which requested
	to capture the event exclusively.
	
	Methods
	-------
	
	- `subscribe(Function, context, data)`

	  Both `context` and `data` are optional. Also, you may use the `Function.bind(this)`
	  approach instead of passing in the `context` as a separate argument.
	  All subscribers will be notified when the event is fired.

	- `unsubscribe(Function, context)`
	
	  Does what you'd think. The `context` is only required if you used one when
	  you set up a subscriber.

	- `capture(Function, context, data)`
	
	  Only the last subscriber to capture this event will be notified until it is
	  released. Note that you can stack `capture()` calls to produce a modal event
	  heiarchy. Used in conjunction with the `resume()` method, you can build an
	  event chain where each observer can fire the next based on some decision making.
	
	- `release(Function, context)`
	
	  Removes the most recent subscription called with `capture()`, freeing up the next
	  subscribers in the list to be notified the next time the event is fired.

	- `fire(data)`

	  Calls subscriber methods for all observers, and passes in: `data` from the subject,
	  a reference to the `subject` and any static `data` which was passed in the
	  `subscribe()` call.
	
	- `resume(data)`
	
	  If you used `capture()` to subscribe to this event, you can continue notifying
	  other subscribers in the chain with this method. The `data` parameter, as in
	  `fire()`, is optional.
	
	Use
	---
	
	### In the subject (or "publisher") object
	
		// inside the Subject, we setup an event observers can subscribe to
		this.changeEvent = new joSubject(this);
		
		// to fire the event inside the Subject
		this.changeEvent.fire(somedata);

	### In the observer (or "subscriber") object

		// simple case, using Function.bind()
		somesubject.changeEvent.subscribe(this.mymethod.bind());
		
		// explicit context (this)
		somesubject.changeEvent.subscribe(this.mymethod, this);
		
		// optional data which gets passed with the event fires
		somesubject.changeEvent.subscribe(this.mymethod, this, "hello");

	This is a very flexible way to handle messages between objects. Each subject
	may have multiple events which any number of observer objects can subscribe
	to.

*/
/**
 * Class for custom events using the Observer Pattern. This is designed to be used
 *	inside a subject to create events which observers can subscribe to. Unlike
 *	the classic observer pattern, a subject can fire more than one event when called,
 *	and each observer gets data from the subject. This is very similar to YUI 2.x
 * 	event model.
 *	
 *	You can also "lock" the notification chain by using the `capture()` method, which
 *	tells the event to only notify the most recent subscriber (observer) which requested
 *	to capture the event exclusively.
 * @example
 * <pre>
 * 	### In the subject (or "publisher") object
 *	
 *		// inside the Subject, we setup an event observers can subscribe to
 *		this.changeEvent = new joSubject(this);
 *		
 *		// to fire the event inside the Subject
 *		this.changeEvent.fire(somedata);
 *
 *	### In the observer (or "subscriber") object
 *
 *		// simple case, using Function.bind()
 *		somesubject.changeEvent.subscribe(this.mymethod.bind());
 *		
 *		// explicit context (this)
 *		somesubject.changeEvent.subscribe(this.mymethod, this);
 *		
 *		// optional data which gets passed with the event fires
 *		somesubject.changeEvent.subscribe(this.mymethod, this, "hello");
 *
 *	This is a very flexible way to handle messages between objects. Each subject
 *	may have multiple events which any number of observer objects can subscribe
 *	to.
 * </pre>
 * @constructor
 * @param {} subject
 */
joSubject = function(subject) {
	this.subscriptions = [];
	this.subject = subject;	
};
joSubject.prototype = {
	/**
	 * 
	 * @type Number
	 */
	last: -1,
	/**
	 * Both `context` and `data` are optional. Also, you may use the `Function.bind(this)`
	 * approach instead of passing in the `context` as a separate argument.
	 * All subscribers will be notified when the event is fired.
	 * @memberOf joSubject
	 * @param {} call
	 * @param {} observer
	 * @param {} data
	 * @return {Boolean}
	 */
	subscribe: function(call, observer, data) {
		if (!call)
			return false;
		
		var o = { call: call };

		if (observer)
			o.observer = observer;

		if (data)
			o.data = data;
		
		this.subscriptions.push(o);
	
		return this.subject;
	},
	/**
	 * Does what you'd think. The `context` is only required if you used one when
	 * you set up a subscriber.
	 * @memberOf joSubject
	 * @param {} call
	 * @param {} observer
	 * @return {Boolean}
	 */
	unsubscribe: function(call, observer) {
		if (!call)
			return false;

		for (var i = 0, l = this.subscriptions.length; i < l; i++) {
			var sub = this.subscriptions[i];
			if (sub.call === call && (typeof sub.observer === 'undefined' || sub.observer === observer)) {
				this.subscriptions.splice(i, 1);
				break;
			}
		}
		
		return this.subject;
	},
	/**
	 * If you used `capture()` to subscribe to this event, you can continue notifying
	 * other subscribers in the chain with this method. The `data` parameter, as in
	 * `fire()`, is optional.
	 * @memberOf joSubject
	 * @param {} data
	 * @return {Object}
	 */
	resume: function(data) {
		if (this.last != -1)
			this.fire(data, true);
			
		return this.subject;
	},
	/**
	 * Calls subscriber methods for all observers, and passes in: `data` from the subject,
	 * a reference to the `subject` and any static `data` which was passed in the
	 * `subscribe()` call.
	 * @memberOf joSubject
	 * @param {} data
	 * @param {} resume
	 * @return {Object}
	 */
	fire: function(data, resume) {
		if (typeof data === 'undefined')
			data = "";
		
		var i = (resume) ? (this.last || 0) : 0;

		// reset our call stack
		this.last = -1;
			
		for (var l = this.subscriptions.length; i < l; i++) {
			var sub = this.subscriptions[i];
			var subjectdata = (typeof sub.data !== 'undefined') ? sub.data : null;
			
			if (sub.observer)
				sub.call.call(sub.observer, data, this.subject, subjectdata);
			else
				sub.call(data, this.subject, subjectdata);
			
			// if this subscriber wants to capture events,
			// stop calling other subscribers
			if (sub.capture) {
				this.last = i + 1;
				break;
			}
		}
		
		return this.subject;
	},
	/**
	 * Only the last subscriber to capture this event will be notified until it is
	 * released. Note that you can stack `capture()` calls to produce a modal event
	 * hiearchy. Used in conjunction with the `resume()` method, you can build an
	 * event chain where each observer can fire the next based on some decision making.
	 * @memberOf joSubject
	 * @param {} call
	 * @param {} observer
	 * @param {} data
	 * @return {Boolean}
	 */
	capture: function(call, observer, data) {
		if (!call)
			return false;

		var o = { call: call, capture: true };

		if (observer)
			o.observer = observer;

		if (data)
			o.data = data;
			
		this.subscriptions.unshift(o);

		return this.subject;
	},
	/**
	 * Removes the most recent subscription called with `capture()`, freeing up the next
	 * subscribers in the list to be notified the next time the event is fired.
	 * @memberOf joSubject
	 * @param {} call
	 * @param {} observer
	 * @return {Object}
	 */
	release: function(call, observer) {
		return this.unsubscribe(call, observer);
	}
};



/**
 * 
 * @type Number
 */
var SEC = 1000;
/**
 * 
 * @type Number 
 */
var MIN = 60 * SEC;
/**
 * @type Number 
 */
var HOUR = 60 * MIN;
/**
 * 
 * @type Number 
 */
var DAY = 24 * HOUR;

/**
	joTime
	======
	
	Time utility functions. More will be added, but only as needed by the
	framework. There are entire libraries dedicated to extensive datetime
	manipulation, and Jo doesn't pretend to be one of them.
	
	Methods
	-------
	
	- `timestamp()`
	
	  Returns a current timestamp in milliseconds from 01/01/1970 from
	  the system clock.

	Constants
	---------

	- `SEC`, `MIN`, `HOUR`, `DAY`

	  Convenience global constants which make it easier to manipulate
	  timestamps.
	
	Use
	---
	
		var twoHoursLater = joTime.timestamp() + (HOUR * 2);
	
*/

/**
 * Time utility functions. More will be added, but only as needed by the
 *	framework. There are entire libraries dedicated to extensive datetime
 *	manipulation, and Jo doesn't pretend to be one of them.
 * @function
 */
joTime = {
	/**
	 * Returns a current timestamp in milliseconds from 01/01/1970 from
	 *  the system clock.
	 * @return {Object}
	 */
	timestamp: function() {
		var now = new Date();
		return now / 1;
	}
};


/**
	joDefer
	=======
	
	Utility function which calls a given method within a given context after `n`
	milliseconds with optional static data.

	Use
	-----
	
		joDefer(Function, context, delay, data);
	
	Note that delay defaults to 100ms if not specified, and `data` is optional.

	joYield
	=======
	
	Deprecated, use joDefer instead.

*/
/**
 * Utility function which calls a given method within a given context after `n`
 * milliseconds with optional static data.
 * @example
 * <pre>
 * Use
 *	-----
 *	
 *		joDefer(Function, context, delay, data);
 *	
 *	Note that delay defaults to 100ms if not specified, and `data` is optional.
 * </pre>
 * @function
 * @param {} call
 * @param {} context
 * @param {} delay
 * @param {} data
 * @return {Object}
 */
function joDefer(call, context, delay, data) {
	if (!delay)
		delay = 100;

	if (!context)
		context = this;
		
	var timer = window.setTimeout(function() {
		call.call(context, data);
	}, delay);
	
	return timer;
}

joDefer.cancel = function(timer) {
	window.clearTimeout(timer);
}

joYield = joDefer;

/**
	joCache
	=======
	
	A singleton which makes it easy to setup deferred object creation and cached
	results. This is a performance menchanism initially designed for UI views, but
	could be extended to handle data requests and other object types.
	
	Methods
	-------
	
	- `set(key, call, context)`
	
	  Defines a factory (`call`) for building an object keyed from the `key` string.
	  The `context` argument is optional, but provides a reference for `this`.
	
	- `get(key)`
	
	  Returns an object based on the `key` string. If an object has not been created
	  which corresponds to the `key`, joCache will call the constructor defined to
	  create it and store the reference for future calls to `get()`.

	- `clear(key)`

	  Frees up the object held by joCache for a given key. The goal is to free up
	  memory. Note that for your object (probably a view) to be truly free, you
	  should make sure you don't have any global references pointing to it. There
	  isn't a practical way to do this at the framework level, it requires some
	  careful coding.

	  A potentially useful side effect of this is you can force a fresh build of
	  your view by doing `joCache.clear("prefs").get("prefs")`.
	
	Use
	---
	
	Defining a view for on-demand use:
	
		joCache.set("home", function() {
			return new joCard([
				new joTitle("Home"),
				new joMenu([
					"Top Stories",
					"Latest News",
					"Old News",
					"No News"
				])
			]);
		});
	
	Displaying a view later:
	
		mystack.push(joCache.get("home"));
		
		// the first call to get() will instantiate
		// the view, subsequent calls will return the
		// view that was created the first time
		
		// you can pass parameters into your view factory
		var x = joCache.get("home", "My Title");
		
		// note that if you want to use joCache to cache
		// views which differ based on parameters passed in,
		// you probably want your own caching mechanism instead.

	Clearing cache data:

		// useful if you want to free up memory
		joCache.clear("home");
*/

/**
 * A singleton which makes it easy to setup deferred object creation and cached
 * results. This is a performance menchanism initially designed for UI views, but
 * could be extended to handle data requests and other object types.
 * @example
 * <pre>
 * Defining a view for on-demand use:
 *	
 *		joCache.set("home", function() {
 *			return new joCard([
 *				new joTitle("Home"),
 *				new joMenu([
 *					"Top Stories",
 *					"Latest News",
 *					"Old News",
 *					"No News"
 *				])
 *			]);
 *		});
 *	
 *	Displaying a view later:
 *	
 *		mystack.push(joCache.get("home"));
 *		
 *		// the first call to get() will instantiate
 *		// the view, subsequent calls will return the
 *		// view that was created the first time
 *		
 *		// you can pass parameters into your view factory
 *		var x = joCache.get("home", "My Title");
 *		
 *		// note that if you want to use joCache to cache
 *		// views which differ based on parameters passed in,
 *		// you probably want your own caching mechanism instead.
 *
 *	Clearing cache data:
 *
 *		// useful if you want to free up memory
 *		joCache.clear("home");
 *</pre>
 * @static
 * @class
 */
joCache = {
	cache: {},
	/**
	 * Defines a factory (`call`) for building an object keyed from the `key` string.
	  The `context` argument is optional, but provides a reference for `this`.
	 * @param key
	 * @param call
	 * @param context
	 * @returns {___anonymous2295_2841}
	 */
	set: function(key, call, context) {
		if (call)
			this.cache[key] = { call: call, context: context || this };
			
		return this;
	},
	/**
	 * Returns an object based on the `key` string. If an object has not been created
	 * which corresponds to the `key`, joCache will call the constructor defined to
	 * create it and store the reference for future calls to `get()`.
	 * @param key
	 * @returns {Object}
	 */
	get: function(key) {
		var cache = this.cache[key] || null;
		if (cache) {
			if (!cache.view)
				cache.view = cache.call.apply(cache.context, arguments);
				
			return cache.view;
		}

		return null;
	},

	/**
	 * Returns the object if it exists in the cache.
	 * @param key
	 * @returns {Object}
	 */
	exists: function(key) {
		return this.cache[key];
	},

	/**
	 * Frees up the object held by joCache for a given key. The goal is to free up
	 * memory. Note that for your object (probably a view) to be truly free, you
	 * should make sure you don't have any global references pointing to it. There
	 * isn't a practical way to do this at the framework level, it requires some
	 * careful coding.
     *
	 * A potentially useful side effect of this is you can force a fresh build of
	 * your view by doing `joCache.clear("prefs").get("prefs")`.
	 * @param key
	 * @returns {___anonymous2295_3181}
	 */
	clear: function(key) {
		if (typeof this.cache[key] === 'object')
			this.cache[key].view = null;
		
		return this;
	}
};


/**
	joClipboard
	===========
	
	Singleton which abstracts the system clipboard. Note that this is a platform
	dependant interface. By default, the class will simply store the contents in
	a special joPreference named "joClipboardData" to provide clipboard capabilities
	within your app.
	
	> Even if you think you're just going to use the default behavior, it is
	> recommended that you never manipulate the "joClipboardData" preference directly.
	
	Methods
	-------
	
	- `get()`
	- `set(String)`

	  Low level methods which use just strings. At this time, you will need to
	  stringify your own data when setting, and extract your data when getting.
	
	- `cut(joControl)`
	- `copy(joControl)`
	- `paste(joControl)`

	  High level methods which work with any joControl or subclass. If a control
	  supports selections, `cut()` will automatically remove the selection after
	  copying its contents. Otherwise, `cut()` will work the same as `copy()`.
	
	> Note: this is not working yet, steer clear (or contribute some working code!)
	
*/
/**
 * Singleton which abstracts the system clipboard. Note that this is a platform
 *	dependant interface. By default, the class will simply store the contents in
 *	a special joPreference named "joClipboardData" to provide clipboard capabilities
 *	within your app.
 *	
 *<pre>
 *	> Even if you think you're just going to use the default behavior, it is
 *	> recommended that you never manipulate the "joClipboardData" preference directly.
 *</pre>
 *@static
 *@class
 */
joClipboard = {
	/**
	 * 
	 * @type String
	 */
	data: "",
	/**
	 * Low level methods which use just strings. At this time, you will need to
	 * stringify your own data when setting, and extract your data when getting.
	 * @return {Object}
	 */
	get: function() {
		return joPreference.get("joClipboardData") || this.data;
	},
	/**
	 * Low level methods which use just strings. At this time, you will need to
	 * stringify your own data when setting, and extract your data when getting.
	 * @param {} clip
	 */
	set: function(clip) {
		// don't feed it junk; stringify it first
		// TODO: detect non-strings and stringify them
		this.data = clip;
		joPreference.set("joClipboardData");
	}
};

/*
	not used at this time
*/


/**
	joTimer
	=======
	
	Timer interval with events.
	
	Methods
	-------
	
	- `start()`

	  Start the timer from the last value.

	- `stop()`

	  Stop the timer, does not reset it. You can restart it with `start()`

	- `reset()`

	  Reset the timer to its original time.
	
	Use
	---
	
		var x = new joTimer(time, resolution);

	Where
	-----

	- `time` in seconds, the start time
	- `resolution` interval resolution in ms
	
*/
/**
 * Timer interval with events.
 * @example
 * <pre>
 * 	var x = new joTimer(time, resolution);
 *
 *	Where
 *	-----
 *
 *	- `time` in seconds, the start time
 *	- `resolution` interval resolution in ms
 * </pre>
 * @constructor
 * @param {} sec
 * @param {} resolution
 */
joTimer = function(sec, resolution) {
	this.setDuration(sec || 60);
	
	this.expiredEvent = new joSubject(this);
	this.startEvent = new joSubject(this);
	this.stopEvent = new joSubject(this);
	this.updateEvent = new joSubject(this);
	this.resetEvent = new joSubject(this);
	
	this.resolution = resolution || 100;
	
	this.init();
	this.started = 0;
	this.paused = 0;
};
joTimer.prototype = {
	/**
	 * Start the timer from the last value
	 * @memberOf joTimer
	 * @param {} silent
	 * @return {Object}
	 */
	start: function(silent) {
		var paused = this.paused;

		this.init();
		
		if (paused)
			this.started = joTime.timestamp() - paused;
		else
			this.started = joTime.timestamp();
		
		this.paused = 0;

		var self = this;
		
		this.interval = setInterval(function() {
			joDefer(self.update, self);
		}, this.resolution);
		
		if (!silent)
			this.startEvent.fire();

		return this;
	},
	/**
	 * Initializes the timer
	 * @memberOf joTimer
	 * @return {Object} This instance
	 * @private
	 */
	init: function() {
		if (this.interval)
			clearInterval(this.interval);

		this.interval = null;
		this.lastRemaining = null;

		return this;
	},
	/**
	 * Stop the timer, does not reset it. You can restart it with `start()`
	 * @memberOf joTimer
	 * @param {} silent
	 * @return {Object}
	 */
	stop: function(silent) {
		this.init();
		this.paused = joTime.timestamp() - this.started;

		if (!silent)
			this.stopEvent.fire();

		return this;
	},
	/**
	 * Pause the timer
	 * @memberOf joTimer
	 * @private
	 */
	pause: function() {
		if (this.interval) {
			clearInterval(this.interval);
			this.interval = 0;
		}
	},
	/**
	 * Resume timer after pause
	 * @memberOf joTimer
	 * @private
	 */
	resume: function() {
		if (this.interval || this.paused)
			return;

		var self = this;
		this.interval = setInterval(function() {
			joDefer(self.update, self);
		}, this.resolution);
	},
	/**
	 * Reset the timer to its original time.
	 * @memberOf joTimer
	 * @param {} silent
	 * @return {Object}
	 */
	reset: function(silent) {
		this.started = joTime.timestamp();
		this.paused = 0;
		
		if (!silent)
			this.resetEvent.fire();

		return this;
	},
	/**
	 * Set the duration
	 * @memberOf joTimer
	 * @private
	 * @param {} sec
	 * @return {Object}
	 */
	setDuration: function(sec) {
		this.duration = sec * 1000;

		return this;
	},
	/**
	 * Update timer function
	 * @memberOf joTimer
	 * @private
	 * @return {Object}
	 */
	update: function() {
		var remaining = Math.round((this.duration - (joTime.timestamp() - this.started)) / 1000);

		if (this.lastRemaining == null || remaining < this.lastRemaining)
			this.updateEvent.fire(remaining);

		if (remaining <= 0)
			this.expired();

		this.lastRemaining = remaining;

		return this;
	},
	/**
	 * Expire the timer
	 * @memberOf joTimer
	 */
	expired: function() {
		this.stop();
//		this.update();

		this.expiredEvent.fire();
	}
};


/**
 * JoQueue
 * @constructor
 */
joQueue = function() {
	this.queue = [];

	this.doneEvent = new joSubject(this);
};
joQueue.prototype = {
	/**
	 * @memberOf joQueue
	 * @param {} call
	 * @param {} delay
	 * @param {} context
	 * @param {} data
	 */
	push: function(call, delay, context, data) {
		this.queue.push({
			delay: delay,
			call: call,
			context: context,
			data: data
		});
	},
	/**
	 * @memberOf joQueue
	 */
	tick: function() {
		var t = (new Date() * 1);

		if (this.next == 0 || t >= this.next) {
			var c = this.queue.shift();
			if (c.context)
				c.call.call(c.context, c.data || null);
			else
				c.call(c.data || null);

			if (this.queue.length)
				this.next = t + this.queue[0].delay;
		}

		if (this.queue.length) {
			var self = this;
			window.requestAnimationFrame(function() {
				self.tick.call(self);
			});
		}
		else {
			this.stop();
		}
	},
	/**
	 * @memberOf joQueue
	 * @return {}
	 */
	start: function() {
		this.working = true;
		this.next = 0;

		if (this.queue.length) {
			joDefer(this.tick, this);
		}

		return this;
	},
	/**
	 * @memberOf joQueue
	 */
	stop: function() {
		this.working = false;
		this.next = 0;

		this.doneEvent.fire();
	},
	/**
	 * @memberOf joQueue
	 * @param {} last
	 * @return {Object}
	 */
	getElapsed: function(last) {
		return (new Date() * 1) - last;
	},
	/**
	 * @memberOf joQueue
	 * @return {Object}
	 */
	getTime: function() {
		return (new Date() * 1);
	},
	/**
	 * @memberOf joQueue
	 * @param {} time
	 * @return {Object}
	 */
	setLast: function(time) {
		if (!time)
			time = (new Date() * 1);

		this.last = time;

		return this;
	}
};



/**
	joDataSource
	=============

	Wraps data acquisition in an event-driven class. Objects can
	subscribe to the `changeEvent` to update their own data.

	This base class can be used as-is as a data dispatcher, but is
	designed to be extended to handle asynchronous file or SQL queries.

	Methods
	-------
	- `set()`
	- `get()`
	- `clear()`
	- `setQuery(...)`
	- `getQuery()`
	- `load()`
	- `refresh()`

	Events
	------

	- `changeEvent`
	- `errorEvent`
	
	> Under construction, use with care.
	
*/
/**
 * Wraps data acquisition in an event-driven class. Objects can
 *	subscribe to the `changeEvent` to update their own data.
 *
 *	This base class can be used as-is as a data dispatcher, but is
 *	designed to be extended to handle asynchronous file or SQL queries.
 * @constructor
 * @param {} data
 */
joDataSource = function(data) {
	this.changeEvent = new joSubject(this);	
	this.errorEvent = new joSubject(this);

	if (typeof data !== "undefined")
		this.setData(data);
	else
		this.data = "";
};
joDataSource.prototype = {
	/**
	 * 
	 * @type Boolean
	 */
	autoSave: true,
	/**
	 * 
	 * @type  Object
	 */
	data: null,
	/**
	 * 
	 * @param {} query
	 * @return {Object}
	 */
	setQuery: function(query) {
		this.query = query;
		
		return this;
	},
	/**
	 * 
	 * @param {} state
	 * @return {Object}
	 */
	setAutoSave: function(state) {
		this.autoSave = state;
		
		return this;
	},
	/**
	 * 
	 * @param {} data
	 * @return {Object}
	 */
	setData: function(data) {
		var last = this.data;
		this.data = data;

		if (data !== last)
			this.changeEvent.fire(data);
			
		return this;
	},
	/**
	 * 
	 * @return {Object}
	 */
	getData: function() {
		return this.data;
	},
	/**
	 * 
	 * @return {Object}
	 */
	getDataCount: function() {
		return this.getData().length;
	},
	/**
	 * 
	 * @return {Object}
	 */
	getPageCount: function() {
		if (this.pageSize)
			return Math.floor(this.getData().length / this.pageSize) + 1;
		else
			return 1;
	},
	/**
	 * 
	 * @param {} index
	 * @return {Object}
	 */
	getPage: function(index) {
		var start = index * this.pageSize;
		var end = start + this.pageSize;
		
		if (end > this.getData().length)
			end = this.getData().length;
			
		if (start < 0)
			start = 0;

		return this.data.slice(start, end);
	},
	/**
	 * Refresh
	 */
	refresh: function() {
		// needs to make a new query object
	},
	/**
	 * 
	 * @param {} length
	 * @return {Object}
	 */
	setPageSize: function(length) {
		this.pageSize = length;
		
		return this;
	},
	/**
	 * 
	 * @return {Object}
	 */
	getPageSze: function() {
		return this.pageSize;
	},
	/**
	 * 
	 * @param {} data
	 * @return {Object}
	 */
	load: function(data) {
		this.data = data;
		this.changeEvent.fire(data);
		
		return this;
	},
	/**
	 * 
	 * @param {} msg
	 */
	error: function(msg) {
		this.errorEvent.fire(msg);
	}
};

/**
	joRecord
	========
	
	An event-driven wrapper for an object and its properties. Useful as a
	data interface for forms and other collections of UI controls.
	
	Extends
	-------
	
	- joDataSource
	
	Methods
	-------
	
	- `link(property)`
	
	  Returns a reference to a joProperty object which can be used with UI
	  controls (children of joControl) to automatically save or load data
	  based on user interaction.
	
	- `save()`
	
	  Saves the object's data. The base class does not itself save the data;
	  you will need to make your own action for the save method, or have
	  something which subscribes to the `saveEvent`.
	
	- `load()`
	
	  Loads the object's data, and fires off notifications to any UI controls
	  which are linked to this joRecord object. Same as the `save()` method,
	  you will have to make this function do some actual file loading if that's
	  what you want it to do.
	
	- `getProperty(property)`
	- `setProperty(property, value)`
	
	  Get or set a given property. Used in conjunction with `setAutoSave()`,
	  `setProprty()` will also trigger a call to the `save()` method.

	- `getDelegate(property)`
	
	  Returns a reference to the joProperty object which fires off events
	  for data changes for that property. If none exists, one is created.
	  This method is used by the `link()` method, and can be overriden if
	  you extend this class to provide some other flavor of a joDataSource
	  to manage events for your properties.

	Use
	---
	
		// setup a joRecord
		var r = new joRecord({
			user: "Jo",
			password: "1234",
			active: true
		});
		
		// bind it to some fields
		var x = new joGroup([
			new joLabel("User"),
			new joInput(r.link("user")),
			new joLabel("Password"),
			new joPasswordInput(r.link("password")),
			new joFlexBox([
				new joLabel("Active"),
				new joToggle(r.link("active"))
			])
		]);

	And if you want the data to be persistent, or interact with some
	cloud service, you'll need to do something like this:
	
		// make something happen to load the data
		r.load = function() {
			// some AJAX or SQL call here
		};
		
		// make something happen to save the data
		r.save = function() {
			// some AJAX or SQL call here
		};
	
	You could also make your own subclass of joRecord with your own save
	and load methods using `extend()` like this:
	
		var preferences = function() {
			// call to the superclass constructor
			joRecord.apply(this, arguments);
		};
		preferences.extend(joRecord, {
			save: function() {
				// do an AJAX or SQL call here
			},
			
			load: function() {
				// do an AJAX or SQL call here
			}
		});

	See Class Patterns for more details on this method of "subclassing"
	in JavaScript.

*/
/**
 * An event-driven wrapper for an object and its properties. Useful as a
 *	data interface for forms and other collections of UI controls.
 * @constructor
 * @extends joDataSource
 * @param {} data
 * @example
 * <pre>
 * 		// setup a joRecord
 *		var r = new joRecord({
 *			user: "Jo",
 *			password: "1234",
 *			active: true
 *		});
 *		
 *		// bind it to some fields
 *		var x = new joGroup([
 *			new joLabel("User"),
 *			new joInput(r.link("user")),
 *			new joLabel("Password"),
 *			new joPasswordInput(r.link("password")),
 *			new joFlexBox([
 *				new joLabel("Active"),
 *				new joToggle(r.link("active"))
 *			])
 *		]);
 *
 *	And if you want the data to be persistent, or interact with some
 *	cloud service, you'll need to do something like this:
 *	
 *		// make something happen to load the data
 *		r.load = function() {
 *			// some AJAX or SQL call here
 *		};
 *		
 *		// make something happen to save the data
 *		r.save = function() {
 * 			// some AJAX or SQL call here
 *		};
 *	
 *	You could also make your own subclass of joRecord with your own save
 *	and load methods using `extend()` like this:
 *	
 *		var preferences = function() {
 *			// call to the superclass constructor
 *			joRecord.apply(this, arguments);
 *		};
 *		preferences.extend(joRecord, {
 *			save: function() {
 *				// do an AJAX or SQL call here
 *			},
 *			
 *			load: function() {
 *				// do an AJAX or SQL call here
 *			}
 *		});
 *
 *	See Class Patterns for more details on this method of "subclassing"
 *	in JavaScript.
 * </pre>
 */
joRecord = function(data) {
	joDataSource.call(this, data || {});
	this.delegate = {};
};
joRecord.extend(joDataSource, {
	/**
	 * 
	 * Returns a reference to a joProperty object which can be used with UI
	 * controls (children of joControl) to automatically save or load data
	 * based on user interaction.
	 * @memberOf joRecord
	 * @param {joProperty} p
	 * @return {Object}
	 */
	link: function(p) {
		return this.getDelegate(p);
	},
	/**
	 * Returns a reference to the joProperty object which fires off events
	 * for data changes for that property. If none exists, one is created.
	 * This method is used by the `link()` method, and can be overriden if
	 * you extend this class to provide some other flavor of a joDataSource
	 * to manage events for your properties.
	 * @memberOf joRecord
	 * @param {} p
	 * @return {Object}
	 */
	getDelegate: function(p) {
		if (typeof this.data[p] === "undefined")
			this.data[p] === null;
		
		if (!this.delegate[p])
			this.delegate[p] = new joProperty(this, p);
			
		return this.delegate[p];
	},
	/**
	 * Get a given property. .
	 * @memberOf joRecord
	 * @param {} p
	 * @return {Object}
	 */
	getProperty: function(p) {
		return this.data[p];
	},
	/**
	 * Set a given property. Used in conjunction with `setAutoSave()`,
	 * `setProprty()` will also trigger a call to the `save()` method.
	 * @memberOf joRecord
	 * @param {} p
	 * @param {} data
	 */
	setProperty: function(p, data) {
		if (typeof this.data[p] !== 'undefined' && this.data[p] === data)
			return;
		
		this.data[p] = data;
		this.changeEvent.fire(p);
		
		if (this.autoSave)
			this.save();

		return this;
	},
	/**
	 * Loads the object's data, and fires off notifications to any UI controls
	 * which are linked to this joRecord object. Same as the `save()` method,
	 * you will have to make this function do some actual file loading if that's
	 * what you want it to do.
	 * @memberOf joRecord
	 * @return {Object}
	 */
	load: function() {
		console.log("TODO: extend the load() method");
		return this;
	},
	/**
	 * Saves the object's data. The base class does not itself save the data;
	 * you will need to make your own action for the save method, or have
	 * something which subscribes to the `saveEvent`.
	 * @memberOf joRecord
	 * @return {Object}
	 */
	save: function() {
		console.log("TODO: extend the save() method");
		return this;
	}
});
	
/**
	joProperty
	==========
	
	Used by joRecord to provide an event-driven binding to properties.
	This class is instantiated by joRecord and not of much use on its own.
	
	Extends
	-------
	
	- joDataSource
	
	Use
	---
	
	See joRecord for examples.
*/
/**
 * Used by joRecord to provide an event-driven binding to properties.
 * This class is instantiated by joRecord and not of much use on its own.
 * @constructor
 * @extends joDataSource
 * @param {} datasource
 * @param {} p
 * @see joRecord
 */
joProperty = function(datasource, p) {
	joDataSource.call(this);

	this.changeEvent = new joSubject(this);
	datasource.changeEvent.subscribe(this.onSourceChange, this);

	this.datasource = datasource;
	this.p = p;
};
joProperty.extend(joDataSource, {
	/**
	 * Set data
	 * @memberOf joProperty
	 * @param {} data
	 * @return {Object}
	 */
	setData: function(data) {
		if (this.datasource)
			this.datasource.setProperty(this.p, data);
		
		return this;
	},
	/**
	 * Get Data
	 * @memberOf joProperty
	 * @return {Object}
	 */
	getData: function() {
		if (!this.datasource)
			return null;

		return this.datasource.getProperty(this.p);
	},
	/**
	 * triggered when source changes
	 * @memberOf joProperty
	 */
	onSourceChange: function() {
		this.changeEvent.fire(this.getData());
	}
});



/**
	- - -

	joDatabase
	===========

	Wrapper class for WebKit SQLite database.
	
	Methods
	-------
	
	- `open(datafile, size)`
	
	  `datafile` is a filename, `size` is an optional parameter for initial
	  allocation size for the database.
	
	- `close()`
	
	- `now()`
	
	  *Deprecated* convenience method which returns a SQLite-formatted date
	  string for use in queries. Should be replaced with a utility function
	  in joTime.
*/
/**
 * Wrapper class for WebKit SQLite database.
 * @constructor
 * @param {String} datafile
 * @param {Number} size
 * @since 0.5.0
 */
joDatabase = function(datafile, size) {
	this.openEvent = new joSubject(this);
	this.closeEvent = new joSubject(this);
	this.errorEvent = new joSubject(this);

	this.datafile = datafile;
	this.size = size || 256000;
	this.db = null;
};
joDatabase.prototype = {
	/**
	 * Open the database.
	 * datafile` is a filename, `size` is an optional parameter for initial
	 * allocation size for the database.
	 * @return {joDatabase}
	 */
	open: function() {
		this.db = openDatabase(this.datafile, "1.0", this.datafile, this.size);

		if (this.db) {
			this.openEvent.fire();
		}
		else {
			joLog("DataBase Error", this.db);
			this.errorEvent.fire();
		}
		
		return this;
	},
	/**
	 * Close the database.
	 * @return {Object}
	 */
	close: function() {
		this.db.close();
		this.closeEvent.fire();
		
		return this;
	},
	/**
	 * 
	 * @deprecated
	 * @param {} offset
	 * @return {Object} convenience method which returns a SQLite-formatted date
	 * string for use in queries. Should be replaced with a utility function
	 * in joTime.
	 */
	now: function(offset) {
		var date = new Date();
		
		if (offset)
			date.setDate(date.valueOf() + (offset * 1000 * 60 * 60 * 24));
		
		return date.format("yyyy-mm-dd");
	}
};


/**
	joFileSource
	============
	
	A special joDataSource which loads and handles a file. This class
	wraps joFile.
	
	Extends
	-------
	
	- `joDataSource`
	
*/
/**
 * A special joDataSource which loads and handles a file. This class
 *	wraps joFile.
 * @constructor
 * @extends joDataSource
 * @param {} url
 * @param {} timeout
 */
joFileSource = function(url, timeout) {
	this.changeEvent = new joSubject(this);
	this.errorEvent = new joSubject(this);
	
	if (timeout)
		this.setTimeout(timeout);
		
	if (url)
		this.setQuery(url);
};
joFileSource.extend(joDataSource, {
	baseurl: '',
	query: '',
	/**
	 * @memberOf joFileSource
	 * @return {Object}
	 */
	load: function() {
		var get = this.baseurl + this.query;

		joFile(get, this.callBack, this);
		
		return this;
	},
	/**
	 * @memberOf joFileSource
	 * @param {} data
	 * @param {} error
	 */
	callBack: function(data, error) {
		if (error)
			this.errorEvent.fire(error);
		else
			this.setData(data);
	}
});

/**
	joFile
	======
	
	A utility method which uses XMLHttpRequest to load a text-like file
	from either a remote server or a local file.
	
	> Note that some browsers and mobile devices will *not* allow you to
	> load from just any URL, and some will restrict use with local files
	> especially (I'm looking at you, FireFox).
	>
	> If your aim is to load JavaScript-like data (also, JSON), you may want
	> to look at joScript instead, which uses script tags to accomplish the job.
	
	Calling
	-------
	
		joFile(url, call, context, timeout)
	
	Where
	-----
	
	- `url` is a well-formed URL, or, in most cases, a relative url to a local
	  file

	- `call` is a function to call when the operation completes

	- `context` is an optional scope for the function to call (i.e. value of `this`).
	  You can also ignore this parameter (or pass in `null` and use `Function.bind(this)`
	  instead.

	- `timeout` is an optional parameter which tells joFile to wait, in seconds,
	  for a response before throwing an error.
	
	Use
	---
	
		// simple call with a global callback
		var x = joFile("about.html", App.loadAbout);
		
		// an inline function
		var y = joFile("http://joapp.com/index.html", function(data, error) {
			if (error) {
				console.log("error loading file");
				return;
			}
			
			console.log(data);
		});
*/
/**
 * A utility method which uses XMLHttpRequest to load a text-like file
 *	from either a remote server or a local file.
 *	
 *	> Note that some browsers and mobile devices will *not* allow you to
 *	> load from just any URL, and some will restrict use with local files
 *	> especially (I'm looking at you, FireFox).
 *	>
 *	> If your aim is to load JavaScript-like data (also, JSON), you may want
 *	> to look at joScript instead, which uses script tags to accomplish the job.
 * @example
 * <pre>
 * 	Use
 *	---
 *	
 *		// simple call with a global callback
 *		var x = joFile("about.html", App.loadAbout);
 *		
 *		// an inline function
 *		var y = joFile("http://joapp.com/index.html", function(data, error) {
 *			if (error) {
 *				console.log("error loading file");
 *				return;
 *			}
 *			
 *			console.log(data);
 *		});
 * </pre>
 * @constructor	
 * @param {} url is a well-formed URL, or, in most cases, a relative url to a local file
 * @param {} call is a function to call when the operation completes
 * @param {} context is an optional scope for the function to call (i.e. value of `this`). You can also ignore this parameter (or pass in `null` and use `Function.bind(this)` instead.
 * @param {} timeout is an optional parameter which tells joFile to wait, in seconds, for a response before throwing an error.
 * @return {Object}
 */
joFile = function(url, call, context, timeout) {
	var req = new XMLHttpRequest();

	if (!req)
		return onerror();

	// 30 second default on requests
	if (!timeout)
		timeout = 60 * SEC;
		
	var timer = (timeout > 0) ? setTimeout(onerror, timeout) : null;

	req.open('GET', url, true);
	req.onreadystatechange = onchange;
	req.onError = onerror;
	req.send(null);

	function onchange(e) {
		if (timer)
			timer = clearTimeout(timer);

		if (req.readyState == 4)
			handler(req.responseText, 0);
	}
	function onerror() {
		handler(null, true);
	}
	function handler(data, error) {
		if (call) {
			if (context)
				call.call(context, data, error);
			else
				call(data, error);
		}
	}
};



/**
	joSQLDataSource
	================

	SQL flavor of joDataSource which uses "HTML5" SQL found in webkit.

	Methods
	-------

	- `setDatabase(joDatabase)`
	- `setQuery(query)`
	- `setParameters(arguments)`
	- `execute(query, arguments)`
	
	Events
	------
	
	- `changeEvent`
	
	  Fired when data is loaded after an `execute()` or when data is cleared.
	
	- `errorEvent`
	
	  Fired when some sort of SQL error happens.

	Extends
	-------

	- joDataSource
*/
/**
 * SQL flavor of joDataSource which uses "HTML5" SQL found in webkit.
 * @constructor
 * @param {} db
 * @param {} query
 * @param {} args
 */
joSQLDataSource = function(db, query, args) {
	this.db = db;
	this.query = (typeof query === 'undefined') ? "" : query;
	this.args = (typeof args === 'undefined') ? [] : args;
	/**
	 * Fired when data is loaded after an `execute()` or when data is cleared.
	 * @event changeEvent
	 */
	this.changeEvent = new joSubject(this);
	/**
	 * Fired when some sort of SQL error happens.
	 * @event errorEvent
	 */
	this.errorEvent = new joSubject(this);
};
joSQLDataSource.prototype = {
	/**
	 * 
	 * @param {} db
	 * @return {Object}
	 */
	setDatabase: function(db) {
		this.db = db;
		return this;
	},
	/**
	 * 
	 * @param {} query
	 * @return {Object}
	 */
	setQuery: function(query) {
		this.query = query;
		return this;
	},
	/**
	 * 
	 * @param {} data
	 * @return {Object}
	 */
	setData: function(data) {
		this.data = data;
		this.changeEvent.fire();
		return this;
	},
	/**
	 * 
	 * @return {Object}
	 */
	clear: function() {
		this.data = [];
		this.changeEvent.fire();
		return this;
	},
	/**
	 * 
	 * @param {} args
	 * @return {Object}
	 */
	setParameters: function(args) {
		this.args = args;
		return this;
	},
	/**
	 * 
	 * @param {} query
	 * @param {} args
	 * @return {Object}
	 */
	execute: function(query, args) {
		this.setQuery(query || "");
		this.setParameters(args);
		
		if (this.query)
			this.refresh();
			
		return this;
	},
	/**
	 * 
	 * @return {Object}
	 */
	refresh: function() {
		if (!this.db) {
			this.errorEvent.fire();
//			joLog("query error: no db!");
			return this;
		}
		
		var self = this;
		var args;

		if (arguments.length) {
			args = [];
			for (var i = 0; i < arguments.length; i++)
				args.push(arguments[i]);
		}
		else {
			args = this.args;
		}
		
		var query = this.query;

		function success(t, result) {
			self.data = [];

			for (var i = 0, l = result.rows.length; i < l; i++) {
				var row = result.rows.item(i);

				self.data.push(row);
			}
			
			self.changeEvent.fire(self.data);
		}
		
		function error() {
			joLog('SQL error', query, "argument count", args.length);
			self.errorEvent.fire();
		}
		
		this.db.db.transaction(function(t) {
			t.executeSql(query, args, success, error);
		});
		
		return this;
	}
};


/**
	joScript
	========
	
	Script tag loader function which can be used to dynamically load script
	files or make RESTful calls to many JSON services (provided they have some
	sort of callback ability). This is a low-level utility function.
	
	> Need a URL with some examples of this.
	
	Calling
	-------

	`joScript(url, callback, context)`
	
	- url
	- callback is a function (supports bind, in which case context is optional)
	- context (usually `this`, and is optional)

	Returns
	-------
	
	Calls your handler method and passes a truthy value if there was an error.
	
	Use
	---
	
		joScript("myscript.js", function(error, url) {
			if (error)
				console.log("script " + url + " didn't load.");
		}, this);

*/
/**
 * Script tag loader function which can be used to dynamically load script
 *	files or make RESTful calls to many JSON services (provided they have some
 *	sort of callback ability). This is a low-level utility function.
 * @param {} url to call
 * @param {} call is a function (supports bind, in which case context is optional)
 * @param {} context (usually `this`, and is optional)
 * @example
 * <pre>
 * 		joScript("http://jsonplaceholder.typicode.com/posts", function(error, url) {
 *			if (error)
 *				console.log("script " + url + " didn't load.");
 *		}, this);
 * </pre>
 */
function joScript(url, call, context) {
	var node = joDOM.create('script');

	if (!node)
		return;

	node.onload = onload;
	node.onerror = onerror;
	node.src = url;
	document.body.appendChild(node);

	function onerror() {
		handler(true);
	}
	
	function onload() {
		handler(false);
	}
	
	function handler(error) {
		if (call) {
			if (context)
				call.call(context, error, url);
			else
				call(error, url);
		}

		document.body.removeChild(node);
		node = null;
	}
}	

/**
 * Make RESTful calls to many JSON services (provided they have some
 *	sort of callback ability). This is a low-level utility function.
 * @param {} url to call
 * @param {} call is a function (supports bind, in which case context is optional)
 * @param {} context (usually `this`, and is optional)
 * @example
 * <pre>
 * 		joREST("http://jsonplaceholder.typicode.com/posts", function(error, url) {
 *			if (error)
 *				console.log("script " + url + " didn't load.");
 *		}, this);
 * </pre>
 */
joREST = joScript;



/**
	joPreference
	============

	A class used for storing and retrieving preferences in your application.

	*The interface for this is changing.* joPreference will become a specialized
	application-level extension of joRecord in the near future. Until then, you
	should use joRecord to achieve this use-case.
	
	Extends
	-------
	
	- joRecord

*/

// placeholder for now
/**
 * 	A class used for storing and retrieving preferences in your application.
 *
 *	*The interface for this is changing.* joPreference will become a specialized
 *	application-level extension of joRecord in the near future. Until then, you
 *	should use joRecord to achieve this use-case.
 * @constructor 
 * @extends joRecord
 */
joPreference = joRecord;

/**
	joYQL
	=====
	
	A joDataSource geared for YQL RESTful JSON calls. YQL is like SQL, but for cloud
	services. Pretty amazing stuff:
	
	> The Yahoo! Query Language is an expressive SQL-like language that lets you query,
	> filter, and join data across Web services. With YQL, apps run faster with fewer lines of
	> code and a smaller network footprint.
	>
	> Yahoo! and other websites across the Internet make much of their structured data
	> available to developers, primarily through Web services. To access and query these
	> services, developers traditionally endure the pain of locating the right URLs and
	> documentation to access and query each Web service.
	>
	> With YQL, developers can access and shape data across the Internet through one
	> simple language, eliminating the need to learn how to call different APIs.

	[Yahoo! Query Language Home](http://developer.yahoo.com/yql/)
	
	Use
	---
	
	A simple one-shot use would look like:
	
		// setup our data source
		var yql = new joYQL("select * from rss where url='http://davebalmer.wordpress.com'");
		
		// subscribe to load events
		yql.loadEvent.subscribe(function(data) {
			joLog("received data!");
		});

		// kick off our call
		yql.exec();
	
	A more robust example with parameters in the query could look something
	like this:
	
		// quick/dirty augmentation of the setQuery method
		var yql = new joYQL();
		yql.setQuery = function(feed, limit) {
			this.query = "select * from rss where url='"
				+ feed + "' limit " + limit
				+ " | sort(field=pubDate)";
		};
		
		// we can hook up a list to display the results
		var list = new joList(yql).attach(document.body);
		list.formatItem = function(data, index) {
			var html = new joListItem(data.title + " (" + data.pubDate + ")", index);
		};
		
		// later, we make our call with our parameters
		yql.exec("http://davebalmer.wordpress.com", 10);
	
	Methods
	-------
	- `setQuery()`
	
	  Designed to be augmented, see the example above.
	
	- `exec()`
	
	Extends
	-------
	
	- joDataSource

*/
/**
 * 	A joDataSource geared for YQL RESTful JSON calls. YQL is like SQL, but for cloud
 *	services. Pretty amazing stuff:
 *	
 *	> The Yahoo! Query Language is an expressive SQL-like language that lets you query,
 *	> filter, and join data across Web services. With YQL, apps run faster with fewer lines of
 *	> code and a smaller network footprint.
 *	>
 *	> Yahoo! and other websites across the Internet make much of their structured data
 *	> available to developers, primarily through Web services. To access and query these
 *	> services, developers traditionally endure the pain of locating the right URLs and
 *	> documentation to access and query each Web service.
 *	>
 *	> With YQL, developers can access and shape data across the Internet through one
 *	> simple language, eliminating the need to learn how to call different APIs.
 *
 *	[Yahoo! Query Language Home](http://developer.yahoo.com/yql/)
 * @constructor
 * @extends joDataSource
 * @param {} query
 * @param {} itemPath
 * @example
 * <pre>
 * 	A simple one-shot use would look like:
 *	
 *		// setup our data source
 *		var yql = new joYQL("select * from rss where url='http://davebalmer.wordpress.com'");
 *		
 *		// subscribe to load events
 *		yql.loadEvent.subscribe(function(data) {
 *			joLog("received data!");
 *		});
 *
 *		// kick off our call
 *		yql.exec();
 *	
 *	A more robust example with parameters in the query could look something
 *	like this:
 *	
 *		// quick/dirty augmentation of the setQuery method
 *		var yql = new joYQL();
 *		yql.setQuery = function(feed, limit) {
 *			this.query = "select * from rss where url='"
 *				+ feed + "' limit " + limit
 *				+ " | sort(field=pubDate)";
 *		};
 *		
 *		// we can hook up a list to display the results
 *		var list = new joList(yql).attach(document.body);
 *		list.formatItem = function(data, index) {
 *			var html = new joListItem(data.title + " (" + data.pubDate + ")", index);
 *		};
 *		
 *		// later, we make our call with our parameters
 *		yql.exec("http://davebalmer.wordpress.com", 10);
 * </pre>
 */
joYQL = function(query,itemPath) {
	joDataSource.call(this);

	/**
	 * Designed to be augmented, see the example above.
	 */
	this.setQuery(query);
	this.setItemPath(itemPath);
};
joYQL.extend(joDataSource, {
	baseurl: 'http://query.yahooapis.com/v1/public/yql?',
	format: 'json',
	query: '',
	/**
	 * @memberOf joYQL
	 * @return {Object}
	 */
	exec: function() {
		var get = this.baseurl + "q=" + encodeURIComponent(this.query)
			+ "&format=" + this.format + "&callback=" + joDepot(this.load, this);

		joScript(get, this.callBack, this);
		
		return this;
	},
	/**
	 * 
	 * @memberOf joYQL
	 * @param {} itemPath
	 */
	setItemPath: function(itemPath) {
		this.itemPath = itemPath;
	},
	/**
	 * 
	 * @memberOf joYQL
	 * @param {} data
	 * @return {Object}
	 */
	load: function(data) {
		
		if (this.itemPath) {
			data.query.results.item = function (p, o) {
				var p = p.split(".");
				for(var i = 0; i < p.length; i++)
					o = (o.hasOwnProperty(p[i])) ? o[p[i]] : undefined;
				return o;
			}(this.itemPath,data.query.results);
		}
				
		var results = data.query && data.query.results && data.query.results.item;
		
		if (!results)
			this.errorEvent.fire(data);
		else {
			this.data = results;
			this.changeEvent.fire(results);
		}
		
		return this;
	},
	/**
	 * 
	 * @memberOf joYQL
	 * @param {} error
	 */
	callBack: function(error) {
		if (error)
			this.errorEvent.fire();
	}
});


/*
	Used by joYQL for RESTful calls, may be abstracted into
	a restful superclass, but that will be dependant on a
	callback paramter as well.
*/
joDepotCall = [];
/**
 * Used by joYQL for RESTful calls, may be abstracted into
 *	a restful superclass, but that will be dependant on a
 *	callback paramter as well.
 * @param {} call
 * @param {} context
 * @return {Object}
 */
joDepot = function(call, context) {
	joDepotCall.push(handler);
		
	function handler(data) {
		if (context)
			call.call(context, data);
		else
			call(data);
	}
	
	return "joDepotCall[" + (joDepotCall.length - 1) + "]";
};

/**
	joDispatch
	==========
	
	Feed it a URL, and it routes to other sections of your code. Think of
	it as a mini "server" for handling local URL patterns. joDispatch does
	not load file on its own, keeping it flexible. There may be cases where
	you want to process a URL by loading several files, or by pulling from
	a remote server, or generating data -- you get the idea.
	
	This implication here is you could have an application which is almost
	entirely driven by URL requsts without having to leave your app's page.
	
	A basic use case would be an HTML help system with local files (or
	remote, all up to how you process the URLs).
	
	Use
	---
	
		// simple dispatcher, fires off loadEvent for every URL
		var x = new joDispatch();

		// setup a handler in your application
		x.loadEvent.subscribe(MyApp.loadHTML, MyApp);
		
		// process a URL through our dispatcher
		x.load("sample.html");
		
		// add a special handler for URLs which start with help
		x.addHandler("help/", function(param, url) {
			// param has everything PAST the 'help/' URL pattern
			return new joHTML(new joFileSource(param + ".html"));
		});
		
		// make a handler which, based on URL prefixed with 'remote/',
		// fetches data from your sever instead of a local file
		x.addHandler("remote/", function(param, url) {
			return new joHTML(new joFileSource("http://myserve.com" + param));
		});
	
*/
/**
 * Feed it a URL, and it routes to other sections of your code. Think of
 *	it as a mini "server" for handling local URL patterns. joDispatch does
 *	not load file on its own, keeping it flexible. There may be cases where
 *	you want to process a URL by loading several files, or by pulling from
 *	a remote server, or generating data -- you get the idea.
 *	
 *	This implication here is you could have an application which is almost
 *	entirely driven by URL requsts without having to leave your app's page.
 *	
 *	A basic use case would be an HTML help system with local files (or
 *	remote, all up to how you process the URLs).
 * @example
 * <pre>
 * 	Use
 *	---
 *	
 *		// simple dispatcher, fires off loadEvent for every URL
 *		var x = new joDispatch();
 *
 *		// setup a handler in your application
 *		x.loadEvent.subscribe(MyApp.loadHTML, MyApp);
 *		
 *		// process a URL through our dispatcher
 *		x.load("sample.html");
 *		
 *		// add a special handler for URLs which start with help
 *		x.addHandler("help/", function(param, url) {
 *			// param has everything PAST the 'help/' URL pattern 
 *			return new joHTML(new joFileSource(param + ".html"));
 *		});
 *		
 *		// make a handler which, based on URL prefixed with 'remote/',
 *		// fetches data from your sever instead of a local file
 *		x.addHandler("remote/", function(param, url) {
 *			return new joHTML(new joFileSource("http://myserve.com" + param));
 *		});
 * </pre>
 * @constructor
 * @param {} handler
 */
joDispatch = function(handler) {
	this.handlers = [];
	this.loadEvent = new joSubject(this);
	this.errorEvent = new joSubject(this);
};

joDispatch.prototype = {
	/**
	 * 
	 * @param {} url
	 * @return {Object}
	 */
	load: function(url) {
		var h = this.getHandler(url);
		
		if (!h) {
			joLog("joDispatch: no handler for URL", url);
			this.errorEvent.fire(url);
		}
		else {
			var p = url.substr(h.url.length);

			if (h.context)
				this.loadEvent.fire(h.call.call(h.context, p, url));
			else
				this.loadEvent.fire(h.call(p, url));
		}
		
		return this;
	},
	/**
	 * 
	 * @param {} url
	 * @param {} call
	 * @param {} context
	 */
	addHandler: function(url, call, context) {
		if (typeof url === 'undefined')
			return;
			
		this.handlers.push({
			url: url.toLowerCase(),
			call: call,
			context: (typeof context !== undefined) ? context : null
		});
		this.handlers = this.handlers.sort(compare);
		
		function compare(a, b) {
			if (a.url < b.url)
				return 1;
			else if (a.url == b.url)
				return 0;
			else return -1;
		}
		
		return this;
	},
	/**
	 * 
	 * @param {} url
	 * @return {Object}
	 */
	getHandler: function(url) {
		var h = this.handlers;
		url = url.toLowerCase();

		for (var i = 0, l = h.length; i < l; i++) {
			if (url.indexOf(h[i].url, 0) === 0)
				return h[i];
		}
		
		return null;
	}	
};

/**
 * @constructor
 * @param {} template
 */
joTemplate = function(template) {
	this.setTemplate(template || "");
};
joTemplate.prototype = {
	/**
	 * 
	 * @param {} template
	 * @return {Object}
	 */
	setTemplate: function(template) {
		if (template && typeof template == 'object' && template instanceof Array)
			this.template = template.join(" ");
		else
			this.template = template + "";

		return this;
	},
	/**
	 * 
	 * @param {} data
	 * @return {Object}
	 */
	apply: function(data) {
		var str = this.template + "";

		// pretty wasteful, but this is quick/dirty
		for (var i in data) {
			var key = "__" + i + "__";
			var reg = new RegExp(key, "g");
			str = str.replace(reg, data[i]);
		}

		return str;
	}
};

/**
	joCollect
	=========
	
	*DEPRECATED* use joInterface instead. This function is planned
	to die when jo goes beta.

*/
/**
 * @deprecated
 */
joCollect = {
	get: function(parent) {
		// this is what happens when you announced something not
		// quite fully baked
		return new joInterface(parent);
	}
};


/**
	joInterface
	===========
	
	*EXPERIMENTAL*

	> This utility method is experimental! Be very careful with it. *NOTE* that
	> for now, this class requires you to remove whitespace in your HTML. If you
	> don't know a good approach offhand to do that, then this thing probably isn't
	> ready for you yet.
	
	This class parses the DOM tree for a given element and attempts to
	attach appropriate joView subclasses to all the relevant HTML nodes.
	Returns an object with references to all elements with the `id`
	attribute set. This method helps turn HTML into HTML + JavaScript.
	
	Use
	---
	
		// an HTML element by its ID
		var x = new joInterface("someid");
		
		// a known HTML element
		var y = new joInterface(someHTMLElement);
		
		// the entire document body (careful, see below)
		var z = new joInterface();
	
	Returns
	-------
	
	A new object with a property for each element ID found. For example:
	
		<!-- this DOM structure -->
		<jocard id="login">
			<jotitle>Login</jotitle>
			<jogroup>
				<jolabel>Username</jolabel>
				<input id="username" type="text">
				<jolabel>Password</jolabel>
				<input id="password" type="password">
			</jogroup>
			<jobutton id="loginbutton">Login</jobutton>
		</jocard>
	
	Parsed with this JavaScript:
	
		// walk the DOM, find nodes, create controls for each
		var x = new joInterface("login");

	Produces these properties:
	
	- `x.login` is a reference to a `new joCard`
	- `x.username` is a reference to a `new joInput`
	- `x.password` is a reference to a `new joPassword`
	- `x.loginbutton` is a reference to a `new joButton`
	
	This in essence flattens your UI to a single set of properties you can
	use to access the controls that were created from your DOM structure.
	
	In addition, any unrecognized tags which have an `id` attribute set will
	also be loaded into the properties.
	
	Parsing complex trees
	---------------------
	
	Yes, you can make a joInterface that encapsulates your entire UI with HTML.
	This is not recommended for larger or more complex applications, some
	reasons being:
	
	- Rendering speed: if you're defining multiple views within a `<jostack>`
	  (or another subclass of joContainer), your users will see a flicker and
	  longer load time while the window renders your static tags and the extra
	  views for the stack are removed from view.
	
	- Double rendering: again with `<jostack>` tags, you're going to see a separate
	  render when the first view is redrawn (has to).
	
	- Load time: especially if you're doing a mobile app, this could be a biggie.
	  You are almost always going to be better off building the app controls with
	  JavaScript (especially in conjunction with joCache, which only creates DOM
	  nodes for a given view structure on demand).
	
	If you really want to use HTML as your primary means of defining your UI, you're
	better off putting your major UI components inside of a `<div>` (or other tag)
	with `display: none` set in its CSS property. Like this:
	
		<!-- in your CSS: .hideui { display: none } -->
		<div class="hideui" id="cards">
			<jocard id="about">
				<jotitle>About this app</jotitle>
				<johtml>
					This is my app, it is cool.
				</johtml>
				<jobutton>Done</jobutton>
			</jocard>
			<jocard id="login">
				... etc ...
			</jocard>
		</div>
		
	Then in your JavaScript:
	
		// pull in all our card views from HTML
		var cards = new joInterface("cards");
		
	Definitely use this class judiciously or you'll end up doing a lot of recatoring
	as your application grows.
	
	Flattening UI widget references
	-------------------------------
	
	This is both good and bad, depending on your coding style and complexity of
	your app. Because all the tags with an ID attribute (regardless of where they
	are in your tag tree) get a single corresponding property reference, things
	could get very messy in larger apps. Again, be smart.
	
*/
/**
 * @deprecated
 * @param {} parent
 * @return {Object}
 */
joInterface = function(parent) {
	// initialize our tag lookup object
	jo.initTagMap();
	
	// surprise! we're only using our prototype once and
	// just returning references to the nodes with ID attributes
	return this.get(parent);
};
joInterface.prototype = {
	get: function(parent) {
		parent = joDOM.get(parent);

		if (!parent)
			parent = document.body;

		var ui = {};

		// pure evil -- seriously
		var setContainer = joView.setContainer;
		var draw = joView.draw;
		
		parse(parent);

		// evil purged
		joView.setContainer = setContainer;
		joView.draw = draw;
		
		function parse(node) {
			if (!node)
				return;
			
			var args = "";

			// handle all the leaves first
			if (node.childNodes && node.firstChild) {
				// spin through child nodes, build our list
				var kids = node.childNodes;
				args = [];
				
				for (var i = 0, l = kids.length; i < l; i++) {
					var p = parse(kids[i]);

					if (p)
						args.push(p);
				}
			}

			// make this control
			return newview(node, args);
		}
		
		// create appropriate joView widget from the tag type,
		// otherwise return the node itself
		function newview(node, args) {
			var tag = node.tagName;
			var view = node;

//			console.log(tag, node.nodeType);
			
			if (jo.tagMap[tag]) {
				if (args instanceof Array && args.length) {
					if (args.length == 1)
						args = args[0];
				}

				if (args instanceof Text)
					args = node.nodeData;
				
				if (!args)
					args = node.value || node.checked || node.innerText || node.innerHTML;

//				console.log(args);
				
				joView.setContainer = function() {
					this.container = node;

					return this;
				};
				
				var o;
				
				if (typeof jo.tagMap[tag] === "function") {
					o = jo.tagMap[tag];
				}
				else {
					var t = node.type || node.getAttribute("type");
					o = jo.tagMap[tag][t];
				}
				
				if (typeof o === "function")
					view = new o(args);
				else
					joLog("joInterface can't process ", tag, "'type' attribute?");
			}
			
			// keep track of named controls
			if (node.id)
				ui[node.id] = view;
				
			return view;
		}
		
		// send back our object with named controls as properties
//		console.log(ui);
		return ui;
	}
};

/**
	joView
	=======
	
	Base class for all other views, containers, controls and other visual doo-dads.
	
	Use
	-----
	
		var x = new joView(data);
	
	Where `data` is either a text or HTML string, an HTMLElement, or any joView object
	or subclass.
		
	Methods
	-------
	
	- `setData(data)`
	- `getData()`
	- `createContainer(type, classname)`
	- `setContainer(HTMLElement)`
	- `getContainer()`
	- `clear()`
	- `refresh()`

	- `attach(HTMLElement or joView)`
	- `detach(HTMLElement or joView)`
	
	  Convenience methods which allow you to append a view or DOM node to the
	  current view (or detach it).
	
*/
/**
 * Base class for all other views, containers, controls and other visual doo-dads.
 * @constructor
 * @param {} data
 * @example
 * <pre>
 * var x = new joView(data);
 * </pre>
 */
joView = function(data) {
	this.changeEvent = new joSubject(this);

	this.container = null;
	this.setContainer();

	if (data)
		this.setData(data);
	else
		this.data = null;
};
joView.prototype = {
	tagName: "joview",
	/**
	 * 
	 * @return {Object}
	 */
	getContainer: function() {
		return this.container;
	},
	/**
	 * 
	 * @param {HTMLElement} container
	 * @return {Object}
	 */
	setContainer: function(container) {
		this.container = joDOM.get(container);
			
		if (!this.container)
			this.container = this.createContainer();
		
		this.setEvents();
		
		return this;
	},
	/**
	 * 
	 * @return {Object}
	 */
	createContainer: function() {
		return joDOM.create(this);
	},
	/**
	 * 
	 * @return {Object}
	 */
	clear: function() {
		this.data = "";
		
		if (this.container)
			this.container.innerHTML = "";

		this.changeEvent.fire();
		
		return this;
	},
	/**
	 * 
	 * @param {} data
	 * @return {Object}
	 */
	setData: function(data) {
		this.data = data;
		this.refresh();
		
		return this;
	},
	/**
	 * 
	 * @return {Object}
	 */
	getData: function() {
		return this.data;
	},
	/**
	 * 
	 * @return {Object}
	 */
	refresh: function() {
		if (!this.container || typeof this.data === "undefined")
			return this;

		this.container.innerHTML = "";
		this.draw();

		this.changeEvent.fire(this.data);
		
		return this;
	},

	draw: function() {
		this.container.innerHTML = this.data;
	},
	
	setStyle: function(style) {
		joDOM.setStyle(this.container, style);
		
		return this;
	},
	/**
	 * Convenience methods which allow you to append a view or DOM node to the
	 * current view (or detach it).
	 * @param {HTMLElement|joView} parent
	 * @return {Object}
	 */
	attach: function(parent) {
		if (!this.container)
			return this;
		
		var node = joDOM.get(parent) || document.body;
		node.appendChild(this.container);
		
		return this;
	},
	/**
	 * Convenience methods which allow you to append a view or DOM node to the
	 *  current view (or detach it).
	 * @param {HTMLElement|joView} parent
	 * @return {Object}
	 */
	detach: function(parent) {
		if (!this.container)
			return this;

		var node = joDOM.get(parent) || document.body;
		
		if (this.container && this.container.parentNode === node)
			node.removeChild(this.container);
		
		return this;
	},

	setSize: function(w, h) {
		this.container.style.width = w + "px";
		this.container.style.height = h + "px";

		return this;
	},

	setPosition: function(x, y) {
		this.container.style.position = "absolute";
		this.container.style.left = x + "px";
		this.container.style.top = y + "px";

		return this;
	},

	setId: function(id) {
		this.container.id = id;
		return this;
	},

	setEvents: function() {}
};

/**
	joContainer
	============
	
	A view which is designed to contain other views and controls. Subclass to provide
	different layout types. A container can be used to intantiate an entire tree of
	controls at once, and is a very powerful UI component in jo.
	
	Use
	---
	
			// plain container
			var x = new joContainer();
			
			// HTML or plain text
			var y = new joContainer("Some HTML");
			
			// HTMLElement
			var w = new joContainer(joDOM.get("mydiv"));
			
			// nested inline structure with text, HTML, joViews or HTMLElements
			var z = new joContainer([
				new joTitle("Hello"),
				new joList([
					"Red",
					"Green",
					"Blue"
				]),
				new joFieldset([
					"Name", new joInput(joPreference.bind("name")),
					"Phone", new joInput(joPreference.bind("phone"))
				]),
				new joButton("Done")
			]);
			
			// set an optional title string, used with joNavbar
			z.setTitle("About");
	
	Extends
	-------
	
	- joView
	
	Events
	------
	
	- `changeEvent`
	
	Methods
	-------
	
	- `setData(data)`

	  The constructor calls this method if you provide `data` when you instantiate
	  (see example above)
	
	- `push(data)`
	
	  Same support as `setData()`, but places the new content at the end of the
	  existing content.
	
	- `setTitle(string)`
	- `getTitle(string)`
	
	  Titles are optional, but used with joStack & joStackScroller to update a
	  joNavbar control automagically.

*/
/**
 * A view which is designed to contain other views and controls. Subclass to provide
 *	different layout types. A container can be used to intantiate an entire tree of
 *	controls at once, and is a very powerful UI component in jo.
 * @constructor
 * @extends joView	
 * @param {} data
 * @example
 * <pre>
 * 			// plain container
 *			var x = new joContainer();
 *			
 *			// HTML or plain text
 *			var y = new joContainer("Some HTML");
 *			
 *			// HTMLElement
 *			var w = new joContainer(joDOM.get("mydiv"));
 *			
 *			// nested inline structure with text, HTML, joViews or HTMLElements
 *			var z = new joContainer([
 *				new joTitle("Hello"),
 *				new joList([
 *					"Red",
 *					"Green",
 *					"Blue"
 *				]),
 *				new joFieldset([
 *					"Name", new joInput(joPreference.bind("name")),
 *					"Phone", new joInput(joPreference.bind("phone"))
 *				]),
 *				new joButton("Done")
 *			]);
 *			
 *			// set an optional title string, used with joNavbar
 *			z.setTitle("About");
 * </pre>
 */
joContainer = function(data) {
	joView.apply(this, arguments);
	this.title = null;
};
joContainer.extend(joView, {
	tagName: "jocontainer",
	/**
	 * @memberOf joContainer
	 * @return {Object}
	 */
	getContent: function() {
		return this.container.childNodes;
	},
	/**
	 * Titles are optional, but used with joStack & joStackScroller to update a
	 * joNavbar control automagically.
	 * @memberOf joContainer
	 * @param {} title
	 * @return {Object}
	 */
	setTitle: function(title) {
		this.title = title;
		return this;
	},
	/**
	 * The constructor calls this method if you provide `data` when you instantiate
	 * (see example above)
	 * @memberOf joContainer
	 * @param {} data
	 * @return {Object}
	 */
	setData: function(data) {
		this.data = data;
		return this.refresh();
	},
	/**
	 * Activate
	 * @memberOf joContainer
	 */
	activate: function() {},
	/**
	 * Deactivate
	 * @memberOf joContainer
	 */
	deactivate: function() {},
	/**
	 * Same support as `setData()`, but places the new content at the end of the
	 * existing content.
	 * @memberOf joContainer
	 * @param {} data
	 * @return {Object}
	 */
	push: function(data) {
		if (typeof data === 'object') {
			if (data instanceof Array) {
				// we have a list of stuff
				for (var i = 0; i < data.length; i++)
					this.push(data[i]);
			}
			else if (data instanceof joView && data.container !== this.container) {
				// ok, we have a single widget here
				this.container.appendChild(data.container);
			}
			else if (data instanceof HTMLElement) {
				// DOM element attached directly
				this.container.appendChild(data);
			}
		}
		else if (typeof data === 'string') {
			// shoving html directly in does work
			var o = document.createElement("div");
			o.innerHTML = data;
			this.container.appendChild(o);
		}
		
		return this;
	},
	/**
	 * Titles are optional, but used with joStack & joStackScroller to update a
	 * joNavbar control automagically.
	 * @memberOf joContainer
	 * @return {Object}
	 */
	getTitle: function() {
		return this.title;
	},
	/**
	 * Refresh
	 * @memberof joContainer
	 * @return {Object}
	 */
	refresh: function() {
		if (this.container)
			this.container.innerHTML = "";

		this.draw();
		this.changeEvent.fire();
		
		return this;
	},
	/**
	 * Draw
	 * @memberOf joContainer
	 */
	draw: function() {
		this.push(this.data);
	}
});

/**
	joControl
	=========
	
	Interactive, data-driven control class which may be bound to a joDataSource,
	can receive focus events, and can fire off important events which other objects
	can listen for and react to.
	
	Extends
	-------
	
	- joView
	
	Events
	------
	
	- `changeEvent`
	- `selectEvent`
	
	Methods
	-------
	
	- `setValue(value)`
	
	  Many controls have a *value* in addition to their *data*. This is
	  particularly useful for `joList`, `joMenu`, `joOption` and other controls
	  which has a list of possibilities (the data) and a current seletion from those
	  (the value).
	
	- `enable()`
	- `disable()`
	
	  Enable or disable the control, pretty much does what you'd expect.
	
	- `focus()`
	- `blur()`
	
	  Manually control focus for this control.
	
	- `setDataSource(joDataSource)`
	
	  Tells this control to bind its data to any `joDataSource` or subclass.
	
	- `setValueSource(joDataSource)`
	
	  Tells this control to bind its *value* to any `joDataSource` type.
	
	- `setReadOnly(state)`
	
	  Certain controls can have their interaction turned off. State is either `true`
	  or `false`.
	
	See Also
	--------
	
	- joRecord and joProperty are specialized joDataSource classes which
	  make it simple to bind control values to a data structure.

*/
/**
 * Interactive, data-driven control class which may be bound to a joDataSource,
 *	can receive focus events, and can fire off important events which other objects
 *	can listen for and react to.
 * @constructor 
 * @extends joView
 * @param {} data
 * @param {} value
 * @see JoRecord
 * @see JoProperty
 */
joControl = function(data, value) {
	this.selectEvent = new joSubject(this);
	this.enabled = true;
	this.value = null;

	if (typeof value !== "undefined" && value !== null) {
		if (value instanceof joDataSource)
			this.setValueSource(value);
		else
			this.value = value;
	}

	if (typeof data !== "undefined" && data instanceof joDataSource) {
		// we want to bind directly to some data
		joView.call(this);
		this.setDataSource(data);
	}
	else {
		joView.apply(this, arguments);
	}
};
joControl.extend(joView, {
	tagName: "jocontrol",
	/**
	 * Set events
	 * @memberOf joControl
	 */
	setEvents: function() {
		// not sure what we want to do here, want to use
		// gesture system, but that's not defined
		joEvent.capture(this.container, "click", this.onMouseDown, this);
		joEvent.on(this.container, "blur", this.onBlur, this);
		joEvent.on(this.container, "focus", this.onFocus, this);
	},
	/**
	 * On mouse down
	 * @memberOf joControl
	 * @param {} e
	 */
	onMouseDown: function(e) {
		this.select(e);
	},
	/**
	 * Select
	 * @memberOf joControl
	 * @param {} e
	 * @return {Object}
	 */
	select: function(e) {
		if (e)
			joEvent.stop(e);

		if(this.enabled) {
			this.selectEvent.fire(this.data);
		}
		
		return this;
	},
	/**
	 * Enable
	 * @memberOf joControl
	 * @return {Object}
	 */
	enable: function() {
		joDOM.removeCSSClass(this.container, 'disabled');
		this.container.contentEditable = true;
		this.enabled = true;
		
		return this;
	},
	/**
	 * 
	 * @memberOf joControl
	 * @return {Object}
	 */
	disable: function() {
		joDOM.addCSSClass(this.container, 'disabled');
		this.container.contentEditable = false;
		this.enabled = false;
		
		return this;
	},
	/**
	 * Certain controls can have their interaction turned off. State is either `true`
	 * or `false`.
	 * @memberOf joControl
	 * @param {} value
	 * @return {Object}
	 */
	setReadOnly: function(value) {
		if (typeof value === 'undefined' || value)
			this.container.setAttribute('readonly', '1');
		else 
			this.container.removeAttribute('readonly');
		
		return this;
	},

	/**
	 * 
	 * @memberOf joControl
	 * @param {} e
	 */
	onFocus: function(e) {
		joEvent.stop(e);
		
		if (this.enabled)
			joFocus.set(this);
	},
	/**
	 * 
	 * @memberOf joControl
	 * @param {} e
	 */
	onBlur: function(e) {
		this.data = (this.container.value) ? this.container.value : this.container.innerHTML;
		joEvent.stop(e);

		if (this.enabled) {
			this.blur();

			this.changeEvent.fire(this.data);
		}
	},
	
	/**
	 * 
	 * @memberOf joControl
	 * @param {} e
	 */
	focus: function(e) {
		if (!this.enabled)
			return;
		
		joDOM.addCSSClass(this.container, 'focus');

		if (!e)
			this.container.focus();
			
		return this;
	},
	/**
	 * Many controls have a *value* in addition to their *data*. This is
	 * particularly useful for `joList`, `joMenu`, `joOption` and other controls
	 * which has a list of possibilities (the data) and a current seletion from those
	 * (the value).
	 * @memberOf joControl
	 * @param {} value
	 * @return {Object}
	 */
	setValue: function(value) {
		this.value = value;
		this.changeEvent.fire(value);

		return this;
	},
	/**
	 * 
	 * @memberOf joControl
	 * @return {Object}
	 */	
	getValue: function() {
		return this.value;
	},
	
	/**
	 * 
	 * @memberOf joControl
	 * @return {}
	 */
	blur: function() {
		joDOM.removeCSSClass(this.container, 'focus');
		
		return this;
	},
	/**
	 * Tells this control to bind its data to any `joDataSource` or subclass.
	 * @memberOf joControl
	 * @param {} source
	 * @return {Object}
	 */
	setDataSource: function(source) {
		this.dataSource = source;
		source.changeEvent.subscribe(this.setData, this);

		var data = source.getData();
		this.setData((data !== 'undefined') ? data : null);
		this.changeEvent.subscribe(source.setData, source);
		
		return this;
	},
	/**
	 * Tells this control to bind its *value* to any `joDataSource` type.
	 * @memberOf joControl
	 * @param {} source
	 * @return {Object}
	 */
	setValueSource: function(source) {
		this.valueSource = source;
		source.changeEvent.subscribe(this.setValue, this);
		
		var value = source.getData();
		this.setValue((value !== 'undefined') ? value : null);
		this.selectEvent.subscribe(source.setData, source);
		
		return this;
	}
});

/**
	joButton
	========
	
	Button control.
	
		// simple invocation
		var x = new joButton("Done");
		
		// optionally pass in a CSS classname to style the button
		var y = new joButton("Cancel", "cancelbutton");
		
		// like other controls, you can pass in a joDataSource
		// which could be useful, so why not
		var z = new joButton(joPreference.bind("processname"));
	
	Extends
	-------
	
	- joControl
	
	Methods
	-------
	
	- enable()
	- disable()
	
*/
/**
 * Button control.
 * @constructor
 * @extends joControl
 * @param {} data
 * @param {} classname
 * @example
 * <pre>
 * 		// simple invocation
 *		var x = new joButton("Done");
 *		
 *		// optionally pass in a CSS classname to style the button
 *		var y = new joButton("Cancel", "cancelbutton");
 *		
 *		// like other controls, you can pass in a joDataSource
 *		// which could be useful, so why not
 *		var z = new joButton(joPreference.bind("processname"));
 * </pre>
 */
joButton = function(data, classname) {
	// call super
	joControl.apply(this, arguments);
	this.enabled = true;
	
	if (classname)
		this.container.className = classname;
};


joButton.extend(joControl, {
	tagName: "jobutton",
	
	/**
	 * @memberOf joButton
	 * @return {}
	 */
	createContainer: function() {
		var o = joDOM.create(this.tagName);

		if (o)
			o.setAttribute("tabindex", "1");
		
		return o;
	},
	/**
	 * 
	 * @memberOf joButton
	 * @return {}
	 */
	enable: function() {
		this.container.setAttribute("tabindex", "1");
		return joControl.prototype.enable.call(this);
	},
	/**
	 * 
	 * @memberOf joButton
	 * @return {}
	 */
	disable: function() {
		// this doesn't seem to work in safari doh
		this.container.removeAttribute("tabindex");
		return joControl.prototype.disable.call(this);
	}
});

/**
	joList
	=======
	
	A widget class which expects an array of any data type and renders the
	array as a list. The list control handles DOM interactions with only a
	single touch event to determine which item was selected.
	
	Extends
	-------
	
	- joControl
	
	Events
	------
	
	- `selectEvent`
	
	  Fired when an item is selected from the list. The data in the call is the
	  index of the item selected.
	
	- `changeEvent`
	
	  Fired when the data is changed for the list.
	
	Methods
	-------

	- `formatItem(data, index)`
	
	  When subclassing or augmenting, this is the method responsible for
	  rendering a list item's data.
	
	- `compareItems(a, b)`
	
	  For sorting purposes, this method is called and should be overriden
	  to support custom data types.
	
			// general logic and approriate return values
			if (a > b)
				return 1;
			else if (a == b)
				return 0;
			else
				return -1

	- `setIndex(index)`
	- `getIndex()`
	
	  *DEPRECATED* USe `setValue()` and `getValue()` instead, see joControl.
	
	- `refresh()`
	
	- `setDefault(message)`
	
	  Will present this message (HTML string) when the list is empty.
	  Normally the list is empty; this is a convenience for "zero state"
	  UI requirements.

	- `getNodeData(index)`
	
	- `getLength()`
	
	- `next()`

	- `prev()`
	
	- `setAutoSort(boolean)`

*/
/**
 * A widget class which expects an array of any data type and renders the
 * array as a list. The list control handles DOM interactions with only a
 * single touch event to determine which item was selected.
 * @constructor
 * @extends joControl
 * @since 0.5.0
 */
joList = function() {
	// these are being deprecated in the BETA
	// for now, we'll keep references to the new stuff
	this.setIndex = this.setValue;
	this.getIndex = this.getValue;
	
	joControl.apply(this, arguments);
};
joList.extend(joControl, {
	tagName: "jolist",
	defaultMessage: "",
	lastNode: null,
	value: null,
	autoSort: false,
	/**
	 * Will present this message (HTML string) when the list is empty.
	 * Normally the list is empty; this is a convenience for "zero state"
	 * UI requirements.
	 * @memberOf joList
	 * @param {} msg
	 * @return {Object}
	 */
	setDefault: function(msg) {
		this.defaultMessage = msg;
		
		if (typeof this.data === 'undefined' || !this.data || !this.data.length) {
			if (typeof msg === 'object') {
				this.innerHTML = "";
				if (msg instanceof joView)
					this.container.appendChild(msg.container);
				else if (msg instanceof HTMLElement)
					this.container.appendChild(msg);
			}
			else {
				this.innerHTML = msg;
			}
		}
		
		return this;
	},
	/**
	 * Draw
	 * @memberOf joList
	 */
	draw: function() {
		var html = "";
		var length = 0;

		if (typeof this.data === 'undefined' || !this.data || !this.data.length) {
			if (this.defaultMessage)
				this.container.innerHTML = this.defaultMessage;

			return;
		}

		for (var i = 0, l = this.data.length; i < l; i++) {
			var element = this.formatItem(this.data[i], i, length);

			if (!element)
				continue;
			
			if (typeof element === "string")
				html += element;
			else
				this.container.appendChild((element instanceof joView) ? element.container : element);

			++length;
		}
		
		// support setting the contents with innerHTML in one go,
		// or getting back HTMLElements ready to append to the contents
		if (html.length)
			this.container.innerHTML = html;
		
		// refresh our current selection
		if (this.value >= 0)
			this.setValue(this.value, true);
			
		return;
	},
	/**
	 * Deselect
	 * @memberOf joList
	 */
	deselect: function() {
		if (typeof this.container == 'undefined'
		|| !this.container['childNodes'])
			return;

		var node = this.getNode(this.value);
		if (node) {
			if (this.lastNode) {
				joDOM.removeCSSClass(this.lastNode, "selected");
				this.value = null;
			}
		}
		
		return this;
	},
	/**
	 * Set value
	 * @memberOf joList
	 * @param {} index
	 * @param {} silent
	 */
	setValue: function(index, silent) {
		this.value = index;

		if (index === null)
			return;

		if (typeof this.container === 'undefined'
		|| !this.container
		|| !this.container.firstChild) {
			return this;
		}

		var node = this.getNode(this.value);
		if (node) {
			if (this.lastNode)
				joDOM.removeCSSClass(this.lastNode, "selected");

			joDOM.addCSSClass(node, "selected");
			this.lastNode = node;
		}
		
		if (index >= 0 && !silent)
			this.fireSelect(index);
			
		return this;
	},
	/**
	 * Get node
	 * @memberOf joList
	 * @param {} index
	 * @return {Object}
	 */
	getNode: function(index) {
		return this.container.childNodes[index];
	},

	/**
	 * Fired when an item is selected from the list. The data in the call is the
	 * index of the item selected.
	 * @memberOf joList
	 * @event selectEvent
	 * @param {Number} index of item selected
	 */
	fireSelect: function(index) {
		this.selectEvent.fire(index);
	},
	/**
	 * Get value
	 * @memberOf joList
	 * @return {Object}
	 */
	getValue: function() {
		return this.value;
	},
	/**
	 * On mouse down
	 * @memberOf joList
	 * @param {} e
	 */
	onMouseDown: function(e) {
		joEvent.stop(e);

		var node = joEvent.getTarget(e);
		var index = -1;
		
		while (index == -1 && node !== this.container) {
			index = node.getAttribute("index") || -1;
			node = node.parentNode;
		}

		if (index >= 0)
			this.setValue(index);
	},
	/**
	 * Refresh
	 * @memberOf joList
	 * @return {}
	 */
	refresh: function() {
//		this.value = null;
//		this.lastNode = null;

		if (this.autoSort)
			this.sort();

		return joControl.prototype.refresh.apply(this);
	},
	/**
	 * Get node data
	 * @memberOf joList
	 * @param {} index
	 * @return {}
	 */
	getNodeData: function(index) {
		if (this.data && this.data.length && index >= 0 && index < this.data.length)
			return this.data[index];
		else
			return null;
	},
	/**
	 * Get Length
	 * @memberOf joList
	 * @return {}
	 */
	getLength: function() {
		return this.length || this.data.length || 0;
	},
	/**
	 * Sort
	 * @memberOf joList
	 */
	sort: function() {
		this.data.sort(this.compareItems);
	},
	/**
	 * Get node index
	 * @memberOf joList
	 * @param {} element
	 * @return {}
	 */
	getNodeIndex: function(element) {
		var index = element.getAttribute('index');
		if (typeof index !== "undefined" && index !== null)
			return parseInt(index);
		else
			return -1;
	},
	/**
	 * When subclassing or augmenting, this is the method responsible for
	 * rendering a list item's data.
	 * @memberOf joList
	 * @param {} itemData
	 * @param {} index
	 * @return {Object}
	 */
	formatItem: function(itemData, index) {
		var element = document.createElement('jolistitem');
		element.innerHTML = itemData;
		element.setAttribute("index", index);

		return element;
	},
	/**
	 * For sorting purposes, this method is called and should be overriden
     * to support custom data types.
     *	@example
     *<pre>
     *			// general logic and approriate return values
     *			if (a > b)
     *				return 1;
     *			else if (a == b)
     *				return 0;
     *			else
     *				return -1
     *</pre>
     * @memberOf joList
	 * @param {} a
	 * @param {} b
	 * @return {Number}
	 */
	compareItems: function(a, b) {
		if (a > b)
			return 1;
		else if (a == b)
			return 0;
		else
			return -1;
	},
	/**
	 * Set auto sort
	 * @memberOf joList
	 * @param {} state
	 * @return {}
	 */
	setAutoSort: function(state) {
		this.autoSort = state;
		return this;
	},
	/**
	 * Next
	 * @memberOf joList
	 * @return {}
	 */
	next: function() {
		if (this.getValue() < this.getLength() - 1)
			this.setValue(this.value + 1);
		
		return this;
	},
	/**
	 * Prev
	 * @memberOf joList
	 * @return {}
	 */
	prev: function() {
		if (this.getValue() > 0)
			this.setValue(this.value - 1);
			
		return this;
	}
});

/**
	- - -

	joBusy
	======
	
	The idea here is to make a generic "spinner" control which you
	can overlay on other controls. It's still in flux, don't use it
	just yet.
	
	Extends
	-------
	
	- joView
	
	Methods
	-------
	
	- `setMessage(status)`
	
	  You can update the status message in this busy box so users
	  have a better idea why the busy box is showing.
*/
/**
 * The idea here is to make a generic "spinner" control which you
 *	can overlay on other controls. It's still in flux, don't use it
 *	just yet.
 * @constructor
 * @extends joContainer
 * @param {} data
 */	
joBusy = function(data) {
	joContainer.apply(this, arguments);
};
joBusy.extend(joContainer, {
	tagName: "jobusy",
	
	draw: function() {
		this.container.innerHTML = "";
		for (var i = 0; i < 9; i++)
			this.container.appendChild(joDom.create("jobusyblock"));
	},
	/**
	 * You can update the status message in this busy box so users
	 * have a better idea why the busy box is showing.
	 * @memberOf joBusy
	 * @param {} msg
	 * @return {Object}
	 */
	setMessage: function(msg) {
		this.message = msg || "";
		
		return this;
	},
	
	setEvents: function() {
		return this;
	}
});

/**
	joCaption
	=========
	
	Basically, a paragraph of text.
	
	Extends
	-------
	
	- joControl
	
*/
/**
 * Basically, a paragraph of text.
 * @constructor
 * @extends joControl
 * @param {} data
 */
joCaption = function(data) {
	joControl.apply(this, arguments);
};
joCaption.extend(joControl, {
	tagName: "jocaption"
});


/**
	joCard
	======
	
	Special container for card views, more of an application-level view.
	
	Extends
	-------
	
	- joContainer
	
	Methods
	-------
	
	- `activate()`
	- `deactivate()`
	
	  These methods are called automatically by various joView objects, for
	  now joStack is the only one which does. Basically, allows you to add
	  application-level handlers to initialize or cleanup a joCard.
	
*/
/**
 * Special container for card views, more of an application-level view.
 * @constructor
 * @extends joContainer
 * @param {} data
 */
joCard = function(data) {
	joContainer.apply(this, arguments);
};
joCard.extend(joContainer, {
	tagName: "jocard"
});


/**
	joStack
	========
	
	A UI container which keeps an array of views which can be pushed and popped.
	The DOM elements for a given view are removed from the DOM tree when popped
	so we keep the render tree clean.

	Extends
	-------
	
	- joView

	Methods
	-------
	
	- `push(joView | HTMLElement)`	
	
	  Pushes a new joView (or HTMLELement) onto the stack.
	
	- `pop()`
	
	  Pulls the current view off the stack and goes back to the previous view.

	- `home()`
	
	  Return to the first view, pop everything else off the stack.

	- `show()`
	- `hide()`

	  Controls the visibility of the entire stack.

	- `forward()`
	- `back()`
	
	  Much like your browser forward and back buttons, only for the stack.
	
	- `setLocked(boolean)`
	
	  The `setLocked()` method tells the stack to keep the first view pushed onto the
	  stack set; that is, `pop()` won't remove it. Most apps will probably use this,
	  so setting it as a default for now.
	
	Events
	------
	
	- `showEvent`
	- `hideEvent`
	- `homeEvent`
	- `pushEvent`
	- `popEvent`
	
	Notes
	-----
	
	Should set classNames to new/old views to allow for CSS transitions to be set
	(swiping in/out, cross fading, etc). Currently, it does none of this.
	
	Also, some weirdness with the new `forward()` and `back()` methods in conjuction
	with `push()` -- need to work on that, or just have your app rigged to `pop()`
	on back to keep the nesting simple.
	
*/
/**
 * A UI container which keeps an array of views which can be pushed and popped.
 *	The DOM elements for a given view are removed from the DOM tree when popped
 *	so we keep the render tree clean.
 * @constructor
 * @extends joContainer
 * @param {} data
 */
joStack = function(data) {
	this.visible = false;

	if (data) {
		if (!(data instanceof Array))
			data = [ data ];
		else if (data.length > 1)
			data = [ data[0] ];
	}

	if (this.container && this.container.firstChild)
		this.container.innerHTML = "";

	// default to keep first card on the stack; won't pop() off
	this.setLocked(true);
	/**
	 * @event pushEvent
	 */
	this.pushEvent = new joSubject(this);
	/**
	 * @event popEvent
	 */
	this.popEvent = new joSubject(this);
	/**
	 * @event homeEvent
	 */
	this.homeEvent = new joSubject(this);
	/**
	 * @event showEvent
	 */
	this.showEvent = new joSubject(this);
	/**
	 * @event hideEvent
	 */
	this.hideEvent = new joSubject(this);
	/**
	 * @event backEvent
	 */
	this.backEvent = new joSubject(this);
	/**
	 * @event forwardEvent
	 */
	this.forwardEvent = new joSubject(this);

	joContainer.call(this, data || []);

	this.index = 0;
	this.lastIndex = 0;
	this.lastNode = null;
};
joStack.extend(joContainer, {
	tagName: "jostack",
	type: "fixed",
	/**
	 * @memberOf joStack
	 */
	setEvents: function() {
		// do not setup DOM events for the stack
	},
	/**
	 * @memberOf joStack
	 * @param {} e
	 */
	onClick: function(e) {
		joEvent.stop(e);
	},
	/**
	 * @memberOf joStack
	 * @return {}
	 */
	forward: function() {
		if (this.index < this.data.length - 1) {
			this.index++;
			this.draw();
			this.forwardEvent.fire();
		}
		
		return this;
	},
	/**
	 * @memberOf joStack
	 * @return {Object}
	 */
	back: function() {
		if (this.index > 0) {
			this.index--;
			this.draw();
			this.backEvent.fire();
		}
		
		return this;
	},
	/**
	 * @memberOf joStack
	 */
	draw: function() {
		if (!this.container)
			this.createContainer();
			
		if (!this.data || !this.data.length)
			return;

		// short term hack for webos
		// not happy with it but works for now
		jo.flag.stopback = this.index ? true : false;

		var container = this.container;
		var oldchild = this.lastNode;
		var newnode = getnode(this.data[this.index]);
		var newchild = this.getChildStyleContainer(newnode);

		function getnode(o) {
			return (o instanceof joView) ? o.container : o;
		}
		
		if (!newchild)
			return;
		
		var oldclass, newclass;
		
		if (this.index > this.lastIndex) {
			oldclass = "prev";
			newclass = "next";
			joDOM.addCSSClass(newchild, newclass);
		}
		else if (this.index < this.lastIndex) {
			oldclass = "next";
			newclass = "prev";
			joDOM.addCSSClass(newchild, newclass);
		}

		this.appendChild(newnode);

		var self = this;
		var transitionevent = null;

		joDefer(animate, this, 20);
		
		function animate() {
			// FIXME: AHHH must have some sort of transition for this to work,
			// need to check computed style for transition to make this
			// better
			if (typeof window.onwebkittransitionend !== 'undefined')
				transitionevent = joEvent.on(newchild, joEvent.map.transitionend, cleanup, self);
			else
				joDefer(cleanup, this, 500);

			if (newclass && newchild)
				joDOM.removeCSSClass(newchild, newclass);

			if (oldclass && oldchild)
				joDOM.addCSSClass(oldchild, oldclass);
		}
		
		function cleanup() {
			if (oldchild) {
				joDOM.removeCSSClass(oldchild, "next");
				joDOM.removeCSSClass(oldchild, "prev");
				self.removeChild(oldchild);
			}

			if (newchild) {
				if (transitionevent)
					joEvent.remove(newchild, joEvent.map.transitionend, transitionevent);

				joDOM.removeCSSClass(newchild, "next");
				joDOM.removeCSSClass(newchild, "prev");
			}
		}

		if (typeof this.data[this.index].activate !== "undefined")
			this.data[this.index].activate.call(this.data[this.index]);
		
		this.lastIndex = this.index;
		this.lastNode = newchild;
		
		return this;
	},
	/**
	 * @memberOf joStack
	 * @param {} child
	 */
	appendChild: function(child) {
		this.container.appendChild(child);
	},
	/**
	 * @memberOf joStack
	 * @param {} child
	 * @return {Object}
	 */
	getChildStyleContainer: function(child) {
		return child;
	},
	/**
	 * @memberOf joStack
	 * @return {Object}
	 */
	getChild: function() {
		return this.container.firstChild;
	},
	/**
	 * @memberOf joStack
	 * @return {Object}
	 */
	getContentContainer: function() {
		return this.container;
	},
	/**
	 * @memberOf joStack
	 * @param {} child
	 */
	removeChild: function(child) {
		if (child && child.parentNode === this.container)
			this.container.removeChild(child);
	},
	/**
	 * @memberOf joStack
	 * @return {}
	 */
	isVisible: function() {
		return this.visible;
	},
	
	/**
	 * Pushes a new joView (or HTMLELement) onto the stack.
	 * @memberOf joStack
	 * @param {joView|HTMLElement} o
	 * @return {Object}
	 */
	push: function(o) {
		if (typeof o === "string")
			o = joDOM.get(o);

//		if (!this.data || !this.data.length || o !== this.data[this.data.length - 1])
//			return;

		// don't push the same view we already have
		if (this.data && this.data.length && this.data[this.data.length - 1] === o)
			return this;
			
		this.data.push(o);
		this.index = this.data.length - 1;
		this.draw();
		this.pushEvent.fire(o);

		this.captureBack();
		
		return this;
	},

	/**
	 * lock the stack so the first pushed view stays put
	 * @memberOf joStack
	 * @param {} state
	 * @return {Object}
	 */
	setLocked: function(state) {
		this.locked = (state) ? 1 : 0;
		
		return this;
	},
	/**
	 * Pulls the current view off the stack and goes back to the previous view.
	 * @memberOf joStack
	 * @return {Object}
	 */
	pop: function() {
		if (this.data.length > this.locked) {
			var o = this.data.pop();
			this.index = this.data.length - 1;

			this.draw();
			
			if (typeof o.deactivate === "function")
				o.deactivate.call(o);

			if (!this.data.length)
				this.hide();
		}

		this.captureBack();

		if (this.data.length > 0)
			this.popEvent.fire();
			
		return this;
	},
	/**
	 * Return to the first view, pop everything else off the stack.
	 * @memberOf joStack
	 * @return {Object}
	 */
	home: function() {
		if (this.data && this.data.length && this.data.length > 1) {
			var o = this.data[0];
			var c = this.data[this.index];
			
			if (o === c)
				return this;
			
			this.data = [o];
			this.lastIndex = 1;
			this.index = 0;
//			this.lastNode = null;
			this.draw();

			this.captureBack();
						
			this.popEvent.fire();
			this.homeEvent.fire();
		}
		
		return this;
	},
	/**
	 * @memberOf joStack
	 * @return {Object}
	 */
	showHome: function() {
		this.home();
		
		if (!this.visible) {
			this.visible = true;
			joDOM.addCSSClass(this.container, "show");
			this.showEvent.fire();
		}
		
		return this;
	},
	/**
	 * @memberOf joStack
	 * @return {Object}
	 */
	getTitle: function() {
		var c = this.data[this.index];
		if (typeof c.getTitle === 'function')
			return c.getTitle();
		else
			return false;
	},
	/**
	 * Controls the visibility of the entire stack.
	 * @memberOf joStack
	 * @return {Object}
	 */
	show: function() {
		if (!this.visible) {
			this.visible = true;
			joDOM.addCSSClass(this.container, "show");

			joDefer(this.showEvent.fire, this.showEvent, 500);
		}
		
		return this;
	},
	/**
	 * @memberOf joStack
	 * @return {Object}
	 */
	hide: function() {
		if (this.visible) {
			this.visible = false;
			joDOM.removeCSSClass(this.container, "show");			

			joDefer(this.hideEvent.fire, this.hideEvent, 500);
		}
		
		return this;
	},
	/**
	 * @memberOf joStack
	 */
	captureBack: function() {
		if (this.index > 0)
			joGesture.backEvent.capture(this.pop, this);
		else if (this.index <= 0)
			joGesture.backEvent.release(this.pop, this);
	}
});

/**
	joScroller
	==========
	
	A scroller container. Ultimately, mobile webkit implementations
	should properly support scrolling elements that have the CSS
	`overflow` property set to `scroll` or `auto`. Why don't they,
	anyway? Until some sanity is adopted, we need to handle this scrolling
	issue ourselves. joScroller expects a single child to manage
	scrolling for.
	
	Use
	---
	
		// make a scroller and set its child later
		var x = new joScroller();
		x.setData(myCard);
		
		// or define things inline, not always a good idea
		var y = new joScroller(new joList(mydata));
		
		// you can dump a big hunk of HTML in there, too
		// since jo wraps strings in a container element, this works
		var z = new joScroller('Some giant HTML as a string');

	Extends
	-------
	
	- joContainer
	
	Methods
	-------
	
	- `scrollBy(position)`
	- `scrollTo(position or joView or HTMLElement)`
	
	  Scrolls to the position or the view or element. If you
	  specify an element or view, make sure that element is a
	  child node, or you'll get interesting results.
	
	- `setScroll(horizontal, vertical)`
	
	  Tells this scroller to allow scrolling the vertical, horizontal, both or none.
	
		// free scroller
		z.setScroll(true, true);
		
		// horizontal
		z.setScroll(true, false);
		
		// no scrolling
		z.setScroll(false, false);
	
*/
/**
 * A scroller container. Ultimately, mobile webkit implementations
 *	should properly support scrolling elements that have the CSS
 *	`overflow` property set to `scroll` or `auto`. Why don't they,
 *	anyway? Until some sanity is adopted, we need to handle this scrolling
 *	issue ourselves. joScroller expects a single child to manage
 *	scrolling for.
 * @constructor
 * @extends joContainer
 * @param {} data
 * @example
 * <pre>
 * 		// make a scroller and set its child later
 *		var x = new joScroller();
 *		x.setData(myCard);
 *		
 *		// or define things inline, not always a good idea
 *		var y = new joScroller(new joList(mydata));
 *		
 *		// you can dump a big hunk of HTML in there, too
 *		// since jo wraps strings in a container element, this works
 *		var z = new joScroller('Some giant HTML as a string');
 * </pre>
 */
joScroller = function(data) {
	this.points = [];
	this.eventset = false;

	this.horizontal = 0;
	this.vertical = 1;
	this.inMotion = false;
	this.moved = false;
	this.mousemove = null;
	this.mouseup = null;
	this.bumpHeight = 0;
	this.bumpWidth = 0;

	// Call Super
	joContainer.apply(this, arguments);
};
joScroller.extend(joContainer, {
	tagName: "joscroller",
	velocity: 1.6,
	bumpRatio: 0.5,
	interval: 100,
	transitionEnd: "webkitTransitionEnd",
	/**
	 * @memberOf joScroller
	 */
	setEvents: function() {
//		joEvent.capture(this.container, "click", this.onClick, this);
		joEvent.on(this.container, "mousedown", this.onDown, this);
	},
	/**
	 * @memberOf joScroller
	 * @param {} e
	 */
	onFlick: function(e) {
		// placeholder
	},
	/**
	 * @memberOf joScroller
	 * @param {} e
	 */
	onClick: function(e) {
		if (this.moved) {
			this.moved = false;
			joEvent.stop(e);
			joEvent.preventDefault(e);
		}
	},
	/**
	 * @memberOf joScroller
	 * @param {} e
	 */
	onDown: function(e) {
//		joEvent.stop(e);

		this.reset();
		this.bumpHeight = this.bumpRatio * this.container.offsetHeight;
		this.bumpWidth = this.bumpRatio * this.container.offsetWidth;

		var node = this.container.firstChild;
		
		joDOM.removeCSSClass(node, "flick");
		joDOM.removeCSSClass(node, "flickback");
		joDOM.removeCSSClass(node, "flickfast");

		this.start = this.getMouse(e);
		this.points.unshift(this.start);
		this.inMotion = true;

		if (!this.mousemove) {
			this.mousemove = joEvent.capture(document.body, "mousemove", this.onMove, this);
			this.mouseup = joEvent.on(document.body, "mouseup", this.onUp, this);
		}
	},
	/**
	 * @memberOf joScroller
	 */
	reset: function() {
		this.points = [];
		this.moved = false;
		this.inMotion = false;
	},
	/**
	 * @memberOf joScroller
	 * @param {} e
	 */
	onMove: function(e) {
		if (!this.inMotion)
			return;
		
		joEvent.stop(e);
		e.preventDefault();
		
		var point = this.getMouse(e);
		
		var y = point.y - this.points[0].y;
		var x = point.x - this.points[0].x;

//		if (y == 0)
//			return;
		
		this.points.unshift(point);

		if (this.points.length > 7)
			this.points.pop();

		// cleanup points if the user drags slowly to avoid unwanted flicks
		var self = this;
		
		if (this.timer)
			window.clearTimeout(this.timer);
		
		this.timer = window.setTimeout(function() {
			if (self.inMotion && self.points.length > 1)
				self.points.pop();
			
			self.timer = null;
		}, this.interval);
		
		if (this.moved)
			this.scrollBy(x, y, true);

		if (!this.moved && this.points.length > 3)
			this.moved = true;
	},
	/**
	 * @memberOf joScroller
	 * @param {} e
	 */
	onUp: function (e) {
		if (!this.inMotion)
			return;

		joEvent.remove(document.body, "mousemove", this.mousemove, true);
		joEvent.remove(document.body, "mouseup", this.mouseup, false);

		this.mousemove = null;
		this.inMotion = false;

//		joEvent.stop(e);
//		joEvent.preventDefault(e);

		var end = this.getMouse(e);
		var node = this.container.firstChild;

		var top = this.getTop();
		var left = this.getLeft();
		
		var dy = 0;
		var dx = 0;
		
		for (var i = 0; i < this.points.length - 1; i++) {
			dy += (this.points[i].y - this.points[i + 1].y);
			dx += (this.points[i].x - this.points[i + 1].x);
		}

		var max = 0 - node.offsetHeight + this.container.offsetHeight;
		var maxx = 0 - node.offsetWidth + this.container.offsetWidth;
		
		// if the velocity is "high" then it was a flick
		if ((Math.abs(dy) * this.vertical > 4 || Math.abs(dx) * this.horizontal > 4)) {
			var flick = dy * (this.velocity * (node.offsetHeight / this.container.offsetHeight));
			var flickx = dx * (this.velocity * (node.offsetWidth / this.container.offsetWidth));

			// we want to move quickly if we're going to land past
			// the top or bottom
			if ((flick + top < max || flick + top > 0)
			|| (flickx + left < maxx || flickx + left > 0)) {
				joDOM.addCSSClass(node, "flickfast");
			}
			else {
				joDOM.addCSSClass(node, "flick");
			}

			this.scrollBy(flickx, flick, false);

			joDefer(this.snapBack, this, 3000);
		}
		else {
			joDefer(this.snapBack, this, 10);
		}

	},
	/**
	 * @memberOf joScroller
	 * @param {} e
	 * @return {Object}
	 */
	getMouse: function(e) {
		return { 
			x: (this.horizontal) ? e.screenX : 0,
			y: (this.vertical) ? e.screenY : 0
		};
	},
	/**
	 * Scrolls to the position or the view or element. If you
	 * specify an element or view, make sure that element is a
	 * child node, or you'll get interesting results.
	 * @memberOf joScroller
	 * @param {} x
	 * @param {} y
	 * @param {} test
	 * @return {Object}
	 */
	scrollBy: function(x, y, test) {
		var node = this.container.firstChild;

		var top = this.getTop();
		var left = this.getLeft();

		var dy = Math.floor(top + y);
		var dx = Math.floor(left + x);
		
		if (this.vertical && (node.offsetHeight <= this.container.offsetHeight))
			return this;
			
		var max = 0 - node.offsetHeight + this.container.offsetHeight;
		var maxx = 0 - node.offsetWidth + this.container.offsetWidth;

		var ody = dy;
		var odx = dx;
		
		if (this.bumpHeight) {
			if (dy > this.bumpHeight)
				dy = this.bumpHeight;
			else if (dy < max - this.bumpHeight)
				dy = max - this.bumpHeight;
		}
		
		if (this.bumpWidth) {
			if (dx > this.bumpWidth)
				dx = this.bumpWidth;
			else if (dy < maxx - this.bumpWidth)
				dx = maxx - this.bumpWidth;
		}

		if (!this.eventset)
			this.eventset = joEvent.capture(node, this.transitionEnd, this.snapBack, this);

		if (top != dx || left != dy)
			this.moveTo(dx, dy);
			
		return this;
	},
	/**
	 * Scrolls to the position or the view or element. If you
	 * specify an element or view, make sure that element is a
	 * child node, or you'll get interesting results.
	 * @memberOf joScroller
	 * @param {} y
	 * @param {} instant
	 * @return {Object}
	 */
	scrollTo: function(y, instant) {
		var node = this.container.firstChild;
		
		if (!node)
			return this;

		if (typeof y === 'object') {
			var e;
			if (y instanceof HTMLElement)
				e = y;
			else if (y instanceof joView)
				e = y.container;
				
			var t = 0 - e.offsetTop;
			var h = e.offsetHeight + 80;

			var top = this.getTop();
			var bottom = top - this.container.offsetHeight;
			y = top;

			if (t - h < bottom)
				y = (t - h) + this.container.offsetHeight;

			if (y < t)
				y = t;
		}
		
		if (y < 0 - node.offsetHeight)
			y = 0 - node.offsetHeight;
		else if (y > 0)
			y = 0;

		if (!instant) {
			joDOM.addCSSClass(node, 'flick');
		}
		else {
			joDOM.removeCSSClass(node, 'flick');
			joDOM.removeCSSClass(node, 'flickback');
		}

		this.moveTo(0, y);
		
		return this;
	},

	// called after a flick transition to snap the view
	// back into our container if necessary.
	/**
	 * called after a flick transition to snap the view
	 * back into our container if necessary.
	 * @memberOf joScroller
	 */
	snapBack: function() {
		var node = this.container.firstChild;
		var top = this.getTop();
		var left = this.getLeft();

		var dy = top;
		var dx = left;

		var max = 0 - node.offsetHeight + this.container.offsetHeight;
		var maxx = 0 - node.offsetWidth + this.container.offsetWidth;

		if (this.eventset)
			joEvent.remove(node, this.transitionEnd, this.eventset);
		
		this.eventset = null;

		joDOM.removeCSSClass(node, 'flick');
		
		if (dy > 0)
			dy = 0;
		else if (dy < max)
			dy = max;

		if (dx > 0)
			dx = 0;
		else if (dx < maxx)
			dx = maxx;

		if (dx != left || dy != top) {
			joDOM.addCSSClass(node, 'flickback');
			this.moveTo(dx, dy);
		}
	},

	/**
	 * Tells this scroller to allow scrolling the vertical, horizontal, both or none.
	 * @example
	 * <pre>	
	 *		// free scroller
	 *		z.setScroll(true, true);
	 *		
	 *		// horizontal
	 *		z.setScroll(true, false);
	 *		
	 *		// no scrolling
	 *		z.setScroll(false, false);
	 * </pre>
	 * @memberOf joScroller
	 * @param {} x
	 * @param {} y
	 * @return {Object}
	 */
	setScroll: function(x, y) {
		this.horizontal = x ? 1 : 0;
		this.vertical = y ? 1 : 0;
		
		return this;
	},
	/**
	 * @memberOf joScroller
	 * @param {} x
	 * @param {} y
	 * @return {Object}
	 */
	moveTo: function(x, y) {
		var node = this.container.firstChild;
		
		if (!node)
			return this;
		
		this.setPosition(x * this.horizontal, y * this.vertical, node);

		node.jotop = y;
		node.joleft = x;
	},
	/**
	 * @memberOf joScroller
	 * @param {} x
	 * @param {} y
	 * @param {} node
	 * @return {Object}
	 */
	setPositionNative: function(x, y, node) {
		node.scrollTop = y;

		return this;
	},
	/**
	 * @memberOf joScroller
	 * @param {} x
	 * @param {} y
	 * @param {} node
	 * @return {Object}
	 */
	setPosition: function(x, y, node) {
		node.style.webkitTransform = "translate3d(" + x + "px, " + y + "px, 0)";
		
		return this;
	},
	/**
	 * @memberOf joScroller
	 * @return {Object}
	 */
	getTop: function() {
		return this.container.firstChild.jotop || 0;
	},
	/**
	 * @memberOf joScroller
	 * @return {Object}
	 */
	getLeft: function() {
		return this.container.firstChild.joleft || 0;
	},
	/**
	 * @memberOf joScroller
	 * @param {} data
	 * @return {Object}
	 */
	setData: function(data) {
		return joContainer.prototype.setData.apply(this, arguments);
	}
});


/**
	joDivider
	=========
	
	Simple visual divider.
	
	Extends
	-------
	
	- joView

*/
/**
 * Simple visual divider.
 * @constructor
 * @extends joView
 * @param {} data
 */
joDivider = function(data) {
	joView.apply(this, arguments);
};
joDivider.extend(joView, {
	tagName: "jodivider"
});


/**
	joExpando
	=========
	
	A compound UI element which allows the user to hide/show its contents.
	The first object passed in becomes the trigger control for the container,
	and the second becomes the container which expands and contracts. This
	action is controlled in the CSS by the presence of the "open" class.
	
	Use
	---
	
	This is a typical pattern:
	
		// normal look & feel
		var x = new joExpando([
			new joExpandoTitle("Options"),
			new joExpandoContent([
				new joLabel("Label"),
				new joInput("sample field")
			])
		]);
	
	Note that joExpando doesn't care what sort of controls you tell it
	to use. In this example, we have a joButton that hides and shows a
	DOM element:
		
		// you can use other things though
		var y = new joExpando([
			new joButton("More..."),
			joDOM.get("someelementid")
		]);
	
	Extends
	-------
	
	- joContainer
	
	Methods
	-------
	
	- `open()`
	- `close()`
	- `toggle()`
	
	Events
	------
	
	- `openEvent`
	- `closeEvent`

*/
/**
 * A compound UI element which allows the user to hide/show its contents.
 *	The first object passed in becomes the trigger control for the container,
 *	and the second becomes the container which expands and contracts. This
 *	action is controlled in the CSS by the presence of the "open" class.
 * @constructor
 * @extends joContainer
 * @param {} data
 * @example
 * <pre>
 * 	This is a typical pattern:
 *	
 *		// normal look & feel
 *		var x = new joExpando([
 *			new joExpandoTitle("Options"),
 *			new joExpandoContent([
 *				new joLabel("Label"),
 *				new joInput("sample field")
 *			])
 *		]);
 *	
 *	Note that joExpando doesn't care what sort of controls you tell it
 *	to use. In this example, we have a joButton that hides and shows a
 *	DOM element:
 *		
 *		// you can use other things though
 *		var y = new joExpando([
 *			new joButton("More..."),
 *			joDOM.get("someelementid")
 *		]);
 * </pre>
 */
joExpando = function(data) {
	/**
	 * @event openEvent
	 */
	this.openEvent = new joSubject(this);
	/**
	 * @event closeEvent
	 */
	this.closeEvent = new joSubject(this);
	
	joContainer.apply(this, arguments);
};
joExpando.extend(joContainer, {
	tagName: "joexpando",
	
	/**
	 * @memberOf joExpando
	 */
	draw: function() {
		if (!this.data || !this.container)
			return;
		
		joContainer.prototype.draw.apply(this, arguments);
		this.setToggleEvent();
	},
	/**
	 * @memberOf joExpando
	 */
	setEvents: function() {
	},
	
	/**
	 * @memberOf joExpando
	 */
	setToggleEvent: function() {
		joEvent.on(this.container.childNodes[0], "click", this.toggle, this);
	},
	/**
	 * @memberOf joExpando
	 * @return {Object}
	 */
	toggle: function() {
		if (this.container.className.indexOf("open") >= 0)
			return this.close();
		else
			return this.open();
	},
	/**
	 * @memberOf joExpando
	 * @return {Object}
	 */
	open: function() {
		joDOM.addCSSClass(this.container, "open");
		this.openEvent.fire();
		
		return this;
	},
	/**
	 * @memberOf joExpando
	 * @return {Object}
	 */
	close: function() {
		joDOM.removeCSSClass(this.container, "open");
		this.closeEvent.fire();
		
		return this;
	}
});


/**
	joExpandoContent
	================
	
	New widget to contain expando contents. This is normally used with
	joExpando, but not required.
	
	Extends
	-------
	- joContainer
*/
/**
 * New widget to contain expando contents. This is normally used with
 *	joExpando, but not required.
 * @constructor
 * @extends joContainer
 */
joExpandoContent = function() {
	joContainer.apply(this, arguments);
};
joExpandoContent.extend(joContainer, {
	tagName: "joexpandocontent"
});



/**

	joExpandoTitle
	==============
	
	Common UI element to trigger a joExpando. Contains a stylable
	arrow image which indicates open/closed state.
	
	Extends
	-------
	
	- joControl
	
	Use
	---
	
	See joExpando use.
	
*/
/**
 * Common UI element to trigger a joExpando. Contains a stylable
 *	arrow image which indicates open/closed state.
 * @constructor
 * @extends joControl
 * @param {} data
 * @see joExpando
 */
joExpandoTitle = function(data) {
	joControl.apply(this, arguments);
};
joExpandoTitle.extend(joControl, {
	tagName: "joexpandotitle",
	/**
	 * @memberOf joExpandoTitle
	 * @return {}
	 */
	setData: function() {
		joView.prototype.setData.apply(this, arguments);
		this.draw();
		
		return this;
	},
	/**
	 * @memberOf joExpandoTitle
	 */	
	draw: function() {
		if (this.data && this.container)
			this.container.innerHTML = this.data + "<joicon></joicon>";
	}
});

/**
	joFlexrow
	=========
	
	Uses the flexible box model in CSS to stretch elements evenly across a row.
	
	Use
	---
	
		// a simple row of things
		var x = new joFlexrow([
			new joButton("OK"),
			new joButton("Cancel")
		]);
		
		// making a control stretch
		var y = new joFlexrow(new joInput("Bob"));
		
	Extends
	-------
	
	- joContainer

*/
/**
 * Uses the flexible box model in CSS to stretch elements evenly across a row.
 * @constructor
 * @extends joContainer
 * @param {} data
 * @example
 * <pre>
 * 		// a simple row of things
 *		var x = new joFlexrow([
 *			new joButton("OK"),
 * 			new joButton("Cancel")
 *		]);
 *		
 *		// making a control stretch
 *		var y = new joFlexrow(new joInput("Bob"));
 * </pre>
 */
joFlexrow = function(data) {
	joContainer.apply(this, arguments);
};
joFlexrow.extend(joContainer, {
	tagName: "joflexrow"
});

/**
	joFlexcol
	=========
	
	Uses the flexible box model in CSS to stretch elements evenly across a column.
	
	Use
	---
	
		// fill up a vertical space with things
		var x = new joFlexcol([
			new joNavbar(),
			new joStackScroller()
		]);
	
	Extends
	-------
	
	- joContainer

*/
/**
 * Uses the flexible box model in CSS to stretch elements evenly across a column.
 * @constructor
 * @extends joContainer
 * @param {} data
 * @example
 * <pre>
 * 		// fill up a vertical space with things
 *		var x = new joFlexcol([
 *			new joNavbar(),
 *			new joStackScroller()
 *		]);
 * </pre>
 */
joFlexcol = function(data) {
	joContainer.apply(this, arguments);
};
joFlexcol.extend(joContainer, {
	tagName: "joflexcol"
});

/**
	joFocus
	=======
	
	Singleton which manages global input and event focus among joControl objects.
	
	Methods
	-------
	
	- `set(joControl)`
	
	  Unsets focus on the last control, and sets focus on the control passed in.
	
	- `clear()`
	
	  Unsets focus on the last control.
	
	- `refresh()`
	
	  Sets focus back to the last control that was focused.

*/

/**
 * Singleton which manages global input and event focus among joControl objects.
 * @static 
 */
joFocus = {
	last: null,
	/**
	 * Unsets focus on the last control, and sets focus on the control passed in.
	 * @param {} control
	 */
	set: function(control) {
		if (this.last && this.last !== control)
			this.last.blur();
	
		if (control && control instanceof joControl) {
			control.focus();
			this.last = control;
		}
	},
	/**
	 * Get control which has focus
	 * @param {} control
	 * @return {Object} focus object
	 */
	get: function(control) {
		return this.last;
	},
	/**
	 * Sets focus back to the last control that was focused.
	 */
	refresh: function() {
//		joLog("joFocus.refresh()");
		if (this.last)
			this.last.focus();
	},
	/**
	 * Unsets focus on the last control.
	 */
	clear: function() {
		this.set();
	}
};


/**
	joFooter
	======
	
	Attempt to make a filler object which pushed subsequent joView objects
	further down in the container if possible (to attach its contents to
	the bottom of a card, for eaxmple).
	
	> This behavior requires a working box model to attach properly to the bottom
	> of your container view.
	
	Extends
	-------
	
	- joContainer

*/
/**
 * Attempt to make a filler object which pushed subsequent joView objects
 *	further down in the container if possible (to attach its contents to
 *	the bottom of a card, for eaxmple).
 *	
 *	> This behavior requires a working box model to attach properly to the bottom
 *	> of your container view.
 * @constructor
 * @extends joContainer
 * @param {} data
 */
joFooter = function(data) {
	joContainer.apply(this, arguments);
};
joFooter.extend(joContainer, {
	tagName: "jofooter"
});

/**
	joGesture
	=========
	
	Global gesture handler.

	Events
	------
	
	- `defaultEvent`
	
	  Fired when `return` or `enter` key is pressed.
	
	- `backEvent`

	  Fired when `ESC` key is pressed (on webOS, the back gesture fires an `ESC` key),
	  also used to hook in hardware back buttons for different platforms (e.g.
	  Tizen, Android).
	
	- `resizeEvent`
	
	  Fired on window resize.

	- `forwardEvent`
	- `upEvent`
	- `downEvent`
	- `leftEvent`
	- `rightEvent`

	- `homeEvent`
	- `closeEvent`
	- `activateEvent`
	- `deactivateEvent`

*/
/**
 * Global gesture handler.
 * @static
 * @fires upEvent
 * @fires downEvent
 * @fires leftEvent
 * @fires rightEvent
 * @fires forwardEvent
 * @fires backEvent
 * @fires homeEvent
 * @fires closeEvent
 * @fires activateEvent
 * @fires desactivateEvent
 * @fires resizeEvent
 * @fires defaultEvent Fired when `return` or `enter` key is pressed.
 * @fires backEvent Fired when `ESC` key is pressed (on webOS, the back gesture fires an `ESC` key), also used to hook in hardware back buttons for different platforms (e.g. Tizen, Android).
 * @fires resizeEvent Fired on window resize.
 */
joGesture = {
	load: function() {
		/**
		 * @event upEvent
		 */
		this.upEvent = new joSubject(this);
		/**
		 * @event downEvent
		 */
		this.downEvent = new joSubject(this);
		/**
		 * @event leftEvent
		 */
		this.leftEvent = new joSubject(this);
		/**
		 * @event rightEvent
		 */
		this.rightEvent = new joSubject(this);
		/**
		 * @event forwardEvent
		 */
		this.forwardEvent = new joSubject(this);
		/**
		 * @event defaultEvent
		 * */
		this.defaultEvent = new joSubject(this);
		/**
		 * @event backEven
		 */
		this.backEvent = new joSubject(this);
		/**
		 * @event homeEvent
		 */
		this.homeEvent = new joSubject(this);
		/**
		 * @event closeEvent
		 */
		this.closeEvent = new joSubject(this);
		/**
		 * @event activateEvent
		 */
		this.activateEvent = new joSubject(this);
		/**
		 * @event deactivateEvent
		 */
		this.deactivateEvent = new joSubject(this);
		/**
		 * @event resizeEvent
		 */
		this.resizeEvent = new joSubject(this);
		
		this.setEvents();
	},
	
	// by default, set for browser
	setEvents: function() {
		joEvent.on(document.body, "keydown", this.onKeyDown, this);
		joEvent.on(document.body, "keyup", this.onKeyUp, this);
		
		joEvent.on(document.body, "unload", this.closeEvent, this);
		joEvent.on(window, "activate", this.activateEvent, this);
		joEvent.on(window, "deactivate", this.deactivateEvent, this);
		
		joEvent.on(window, "resize", this.resize, this);
	},

	resize: function() {
		this.resizeEvent.fire(window);
	},

	onKeyUp: function(e) {
		if (!e)
			e = window.event;
	
		if (e.keyCode == 18) {
			this.altkey = false;

			return;
		}

		if (e.keyCode == 27) {
			if (jo.flag.stopback) {
				joEvent.stop(e);
				joEvent.preventDefault(e);
			}

			this.backEvent.fire("back");
			return;
		}

		if (e.keyCode == 13) {
			joEvent.stop(e);
			joEvent.preventDefault(e);

			this.defaultEvent.fire("default");
			return;
		}

		// from here on, these are for simulating device events on a browser
		if (!this.altkey)
			return;
		
		joEvent.stop(e);
		
		switch (e.keyCode) {
			case 37:
				this.leftEvent.fire("left");
				break;
			case 38:
				this.upEvent.fire("up");
				break;
			case 39:
				this.rightEvent.fire("right");
				break;
			case 40:
				this.downEvent.fire("down");
				break;
			case 27:
				this.backEvent.fire("back");
				break;
			case 13:
				this.forwardEvent.fire("forward");
				break;
		}
	},
	
	onKeyDown: function(e) {
		if (!e)
			e = window.event;
			
		if (e.keyCode == 27) {
			joEvent.stop(e);
			joEvent.preventDefault(e);
		}
		else if (e.keyCode == 13 && joFocus.get() instanceof joInput) {
			joEvent.stop(e);
		}
		else if (e.keyCode == 18) {
			this.altkey = true;
		}
		
		return;
	}
};

/**
	joGroup
	=======
	
	Group of controls, purely visual.
	
	Extends
	-------

	- joContainer
	
*/
/**
 * Group of controls, purely visual.
 * @constructor
 * @extends joContainer
 * @param {} data
 */
joGroup = function(data) {
	joContainer.apply(this, arguments);
};
joGroup.extend(joContainer, {
	tagName: "jogroup"
});

/**
	joHTML
	======
	
	A simple HTML content control. One interesting feature is it intercepts all
	`<a>` tag interactions and fires off a `selectEvent` with the contents of
	the tag's `href` property.
	
	This is a relatively lightweight approach to displaying arbitrary HTML
	data inside your app, but it is _not_ recommended you allow external
	JavaScript inside the HTML chunk in question.
	
	Also keep in mind that your app document already _has_ `<html>`, `<head>` and
	`<body>` tags. When you use the `setData()` method on this view, _make sure
	you don't use any of these tags_ to avoid weird issues.
	
	> In a future version, it is feasible to load in stylesheets references in
	> the HTML document's `<head>` section. For now, that entire can of worms
	> will be avoided, and it's left up to you, the developer, to load in any
	> required CSS files using `joDOM.loadCSS()`.
	
	Extends
	-------
	
	- joControl
	
	Use
	---
	
		// simple html string
		var x = new joHTML("<h1>Hello World!</h1><p>Sup?</p>");
		
		// use a joDataSource like a file loader
		var y = new joHTML(new joFileSource("sample.html"));
	
*/
/**
 * 	A simple HTML content control. One interesting feature is it intercepts all
 *	`&lt;a&gt;` tag interactions and fires off a `selectEvent` with the contents of
 *	the tag's `href` property.
 *	
 *	This is a relatively lightweight approach to displaying arbitrary HTML
 *	data inside your app, but it is _not_ recommended you allow external
 *	JavaScript inside the HTML chunk in question.
 *	
 *	Also keep in mind that your app document already _has_ `&lt;html&gt;`, `&lt;head&gt;` and
 *	`&lt;body&gt;` tags. When you use the `setData()` method on this view, _make sure
 *	you don't use any of these tags_ to avoid weird issues.
 *	
 *	> In a future version, it is feasible to load in stylesheets references in
 *	> the HTML document's `&lt;head&gt;` section. For now, that entire can of worms
 *	> will be avoided, and it's left up to you, the developer, to load in any
 *	> required CSS files using `joDOM.loadCSS()`.
 * @constructor
 * @extends joControl
 * @example
 * <pre>
 * 		// simple html string
		var x = new joHTML("<h1>Hello World!</h1><p>Sup?</p>");
		
		// use a joDataSource like a file loader
		var y = new joHTML(new joFileSource("sample.html"));
 * </pre>
 */
joHTML = function(data) {
	joControl.apply(this, arguments);
};
joHTML.extend(joControl, {
	tagName: "johtml",
	/**
	 * @memberOf joHTML
	 */
	setEvents: function() {
		// limited events, no focus for example
		joEvent.on(this.container, "click", this.onClick, this);
	},
	
	/**
	 * special sauce -- we want to trap any a href click events
	 * and return them in our select event -- don't need to be
	 * refreshing our entire page, after all
	 * @memberOf joHTML
	 * @param {} e
	 */
	onClick: function(e) {
		joEvent.stop(e);
		joEvent.preventDefault(e);
		
		// figure out what was clicked, look for an href
		var container = this.container;
		var hrefnode = findhref(joEvent.getTarget(e));
		
		if (hrefnode) {
			// whoa we have an <a> tag clicked
			this.selectEvent.fire(hrefnode.href);
		}
		
		function findhref(node) {
			if (!node)
				return null;

			if (node.href)
				return node;
				
			if (typeof node.parentNode !== "undefined" && node.parentNode !== container)
				return findhref(node.parentNode);
			else
				return null;
		}
	}
});


/**
	joInput
	=======
	
	Single-line text input control. When you instantiate or use `setData()`, you can
	either pass in an initial value or a reference to a joDataSource object which it,
	like other joControl instances, will bind to.
	
	Use
	---
	
		// simple value, simple field
		var x = new joInput(a);
		
		// OR set up a simple joRecord instance with some default data
		var pref = new joRecord({
			username: "Bob",
			password: "password"
		});
				
		// AND attach the value to a data structure property
		var y = new joInput(pref.link("username"));

		// set an input with a placehlder string
		var z = new joInput(b, "Placeholder");
	
	Extends
	-------
	
	- joControl
	
	Methods
	-------
	
	- `focus()`
	- `blur()`
	
	  You can manually set focus or call the `blur()` method (which also
	  triggers a data save).
	
	- `setData(string)`
	
	  Pass in either some arbitrary value for the control, or a reference to
	  a joDataSource if you want to automatically bind to a storage system
	  (e.g. joPreference).

	- `setPlaceholder(string)`
	
	  Display placeholder text on an empty input control (* not all
	  browsers support this).
	
*/
/**
 * Single-line text input control. When you instantiate or use `setData()`, you can
 *	either pass in an initial value or a reference to a joDataSource object which it,
 *	like other joControl instances, will bind to.
 * @constructor
 * @extends joControl
 * @param {} data
 * @param {} placeholder
 * @example
 * <pre>
 * 		// simple value, simple field
 *		var x = new joInput(a);
 *		
 *		// OR set up a simple joRecord instance with some default data
 *		var pref = new joRecord({
 *			username: "Bob",
 *			password: "password"
 *		});
 *				
 *		// AND attach the value to a data structure property
 *		var y = new joInput(pref.link("username"));
 *
 *		// set an input with a placehlder string
 *		var z = new joInput(b, "Placeholder");
 * </pre>
 */
joInput = function(data, placeholder) {
	joControl.apply(this, arguments);

	if (placeholder)
		this.setPlaceholder(placeholder);
};
joInput.extend(joControl, {
	tagName: "input",
	type: "text",
	/**
	 *  Pass in either some arbitrary value for the control, or a reference to
	 * a joDataSource if you want to automatically bind to a storage system
	 * (e.g. joPreference).
	 * @memberOf joInput
	 * @param {} data
	 * @return {Object}
	 */
	setData: function(data) {
		if (data !== this.data) {
			this.data = data;
			
			if (typeof this.container.value !== "undefined")
				this.container.value = data;
			else
				this.container.innerHTML = data;

			this.changeEvent.fire(this.data);
		}
		
		return this;
	},
	/**
	 * Display placeholder text on an empty input control (* not all
	 * browsers support this).
	 * @memberOf joInput
	 * @param {} placeholder
	 */
	setPlaceholder: function(placeholder) {
		if (typeof this.container !== "undefined")
			this.container.setAttribute("placeholder", placeholder);
	},
	/**
	 * @memberOf joInput
	 * @return {Object}
	 */	
	getData: function() {
		if (typeof this.container.value !== "undefined")
			return this.container.value;
		else
			return this.container.innerHTML;
	},
	/**
	 * Enable
	 * @memberOf joInput
	 * @return {}
	 */
	enable: function() {
		this.container.setAttribute("tabindex", "1");
		return joControl.prototype.enable.call(this);
	},
	/**
	 * Disable
	 * @memberOf joInput
	 * @return {}
	 */
	disable: function() {
		this.container.removeAttribute("tabindex");
		return joControl.prototype.disable.call(this);
	},	
	/**
	 * Creates a container
	 * @memberOf joInput
	 */
	createContainer: function() {
		var o = joDOM.create(this);
		
		if (!o)
			return;
	
		o.setAttribute("type", this.type);
		o.setAttribute("tabindex", "1");
		o.contentEditable = this.enabled;
		
		return o;
	},
	/**
	 * Set events
	 * @memberOf joInput
	 */
	setEvents: function() {
		if (!this.container)
			return;
		
		joControl.prototype.setEvents.call(this);
		joEvent.on(this.container, "keydown", this.onKeyDown, this);
	},
	/**
	 * On key down
	 * @memberOf joInput
	 * @param {} e
	 * @return {Boolean}
	 */
	onKeyDown: function(e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			joEvent.stop(e);
		}
		return false;
	},
	/**
	 * Draw
	 * @memberOf joInput
	 */
	draw: function() {
		if (this.container.value)
			this.value = this.data;
		else
			this.innerHTML = this.value;
	},
	/**
	 * On mouse down
	 * @memberOf joInput
	 * @param {} e
	 */
	onMouseDown: function(e) {
		joEvent.stop(e);
		this.focus();
	},
	/**
	 * Store data
	 * @memberOf joInput
	 */
	storeData: function() {
		this.data = this.getData();
		if (this.dataSource)
			this.dataSource.set(this.value);
	}
});


/**
	joLabel
	=======
	
	Label view, purely a visual presentation. Usually placed in front
	of input fields and other controls.
	
	Extends
	-------
	
	- joView
	
*/
/**
 * Label view, purely a visual presentation. Usually placed in front
 *	of input fields and other controls.
 * @constructor
 * @extends joControl
 * @param {} data
 */
joLabel = function(data) {
	joControl.apply(this, arguments);
};
joLabel.extend(joControl, {
	tagName: "jolabel"
});


/**
	joMenu
	======
	
	Simple menu class with optional icons.
	
	Extends
	-------
	
	- joList
	
	Methods
	-------
	
	- `setData(menudata)`
	
	  See the example below for the format of the menu data.
	
	Use
	---
	
		// simple inline menu; you can always setup the menu items (or change
		// them) but using the `setData()` method, same as any joView
		var menu = new joMenu([
			{ title: "About" },
			{ title: "Frequently Asked Questions", id: "faq" },
			{ title: "Visit our website", id: "visit", icon: "images/web" }
		]);
		
		// simple inline function event handler
		menu.selectEvent.subscribe(function(id) {
			switch (id) {
			case "0":
				// the "About" line; if no id, the index of the menu item is used
				stack.push(aboutCard);
				break;
			case "faq":
				stack.push(faqCard);
				break;
			case "visit":
				stack.push(visitCard);
				break;
			}
		});
	
	Advanced Use
	------------
	
	This could actually be called "more consistent and simple" use. If your menus
	are static, you could always setup an id-based dispatch delegate which pushes
	the appropriate card based on the menu `id` selected.

	You could use the `id` in conjunction with view keys you create with joCache.
	The handler would then be something like:
	
		menu.selectEvent.subscribe(function(id) {
			mystack.push(joCache.get(id));
		});

*/
/**
 * Simple menu class with optional icons.
 * @constructor
 * @extends joList
 * @example
 * <pre>
 * 		// simple inline menu; you can always setup the menu items (or change
 *		// them) but using the `setData()` method, same as any joView
 *		var menu = new joMenu([
 *			{ title: "About" },
 *			{ title: "Frequently Asked Questions", id: "faq" },
 *			{ title: "Visit our website", id: "visit", icon: "images/web" }
 *		]);
 *		
 *		// simple inline function event handler
 *		menu.selectEvent.subscribe(function(id) {
 *			switch (id) {
 *			case "0":
 *				// the "About" line; if no id, the index of the menu item is used
 *				stack.push(aboutCard);
 *				break;
 *			case "faq":
 *				stack.push(faqCard);
 *				break;
 *			case "visit":
 *				stack.push(visitCard);
 *				break;
 *			}
 *		});
 *	
 *	Advanced Use
 *	------------
 *	
 *	This could actually be called "more consistent and simple" use. If your menus
 *	are static, you could always setup an id-based dispatch delegate which pushes
 *	the appropriate card based on the menu `id` selected.
 *
 *	You could use the `id` in conjunction with view keys you create with joCache.
 *	The handler would then be something like:
 *	
 *		menu.selectEvent.subscribe(function(id) {
 *			mystack.push(joCache.get(id));
 *		});
 *
 * </pre>
 */
joMenu = function() {
	joList.apply(this, arguments);
};
joMenu.extend(joList, {
	tagName: "jomenu",
	itemTagName: "jomenuitem",
	value: null,
	/**
	 * @memberOf joMenu
	 * @param {} index
	 */
	fireSelect: function(index) {
		if (typeof this.data[index].id !== "undefined" && this.data[index].id)
			this.selectEvent.fire(this.data[index].id);
		else
			this.selectEvent.fire(index);
	},
	/**
	 * @memberOf joMenu
	 * @param {} item
	 * @param {} index
	 * @return {Object}
	 */
	formatItem: function(item, index) {
		var o = joDOM.create(this.itemTagName);
		
		// TODO: not thrilled with this system of finding the
		// selected item. It's flexible but annoying to code to.
		o.setAttribute("index", index);
		
		// quick/dirty
		if (typeof item === "object") {
			o.innerHTML = item.title;
			if (item.icon) {
				o.style.backgroundImage = "url(" + item.icon + ")";
				joDOM.addCSSClass(o, "icon");
			}
		}
		else {
			o.innerHTML = item;
		}
		
		return o;
	}
});

/**
	joOption
	========
	
	This controls lets the user select one of a few options. Basically, this
	is a menu with a horizontal layout (depending on your CSS).
	
	Use
	---
	
		// simple set of options
		var x = new joOption([
			"Red",
			"Blue",
			"Green"
		]);
		
		// set the current value
		x.setValue(2);
		
		// or, associate the value with a joRecord property
		var pref = new joRecord();
		
		var y = new joOption([
			"Orange",
			"Banana",
			"Grape",
			"Lime"
		], pref.link("fruit"));
		
		// you can even associate the list with a datasource
		var fruits = new joDataSource( ... some query stuff ...);
		var z = new joOption(fruits, pref.link("fruit"));
	
	
	Extends
	-------
	
	- joMenu
	
*/
/**
 * This controls lets the user select one of a few options. Basically, this
 * is a menu with a horizontal layout (depending on your CSS).
 * @constructor
 * @extends joMenu
 * @example
 * <pre>
 * 		// simple set of options
 *		var x = new joOption([
 *			"Red",
 *			"Blue",
 *			"Green"
 *		]);
 *		
 *		// set the current value
 *		x.setValue(2);
 *		
 *		// or, associate the value with a joRecord property
 *		var pref = new joRecord();
 *		
 *		var y = new joOption([
 *			"Orange",
 *			"Banana",
 *			"Grape",
 *			"Lime"
 *		], pref.link("fruit"));
 *		
 *		// you can even associate the list with a datasource
 *		var fruits = new joDataSource( ... some query stuff ...);
 *		var z = new joOption(fruits, pref.link("fruit"));
 * </pre>
 */
joOption = function() {
	joMenu.apply(this, arguments);
};
joOption.extend(joMenu, {
	tagName: "jooption",
	itemTagName: "jooptionitem"
});

/**
	joPasswordInput
	===============
	
	Secret data input field (e.g. displays `******` instead of `secret`).
	
	Extends
	-------
	
	- joInput
	
	> Note that this requires CSS3 which is known not to be currently supported
	> in Opera or Internet Explorer.

*/
/**
 * Secret data input field (e.g. displays `******` instead of `secret`).
 * <b>Note:</b> that this requires CSS3 which is known not to be currently supported
 * in Opera or Internet Explorer.
 * @constructor
 * @extends joInput
 * @param {} data
 */
joPasswordInput = function(data) {
	joInput.apply(this, arguments);
};
joPasswordInput.extend(joInput, {
	className: "password",
	type: "password"
});


/**
	joPopup
	=======
	
	A simple popup control. Pass in the UI contents as you would
	any other subclass of joContainer (e.g. joCard).
	
	Methods
	-------
	
	- `show()`
	- `hide()`
	
	  These do what you'd expect.

	Extends
	-------

	- joContainer
	
	Events
	------
	
	- `showEvent`
	- `hideEvent`
	

*/
/**
 * A simple popup control. Pass in the UI contents as you would
 *	any other subclass of joContainer (e.g. joCard).
 * @constructor
 * @extends joContainer
 */
joPopup = function() {
	/**
	 * @event showEvent
	 */
	this.showEvent = new joSubject(this);
	/**
	 * @event hideEvent
	 */
	this.hideEvent = new joSubject(this);
	
	joContainer.apply(this, arguments);
};
joPopup.extend(joContainer, {
	tagName: "jopopup",
	/**
	 * Set events
	 * @memberOf joPopup
	 */
	setEvents: function() {
		joEvent.on(this.container, "mousedown", this.onClick, this);
	},
	/**
	 * On click
	 * @memberOf joPopup
	 * @param {} e
	 */
	onClick: function(e) {
		joEvent.stop(e);
	},
	/**
	 * Hide the popup
	 * @memberOf joPopup
	 * @return {Object}
	 */
	hide: function() {
		joGesture.backEvent.release(this.hide, this);

		joDefer(function() {
			joEvent.on(this.container, joEvent.map.transitionend, this.onHide, this);
			this.container.className = 'hide';
		}, this);
		
		return this;
	},
	/**
	 * On hide
	 * @memberOf joPopup
	 */
	onHide: function() {
		joEvent.remove(this.container, joEvent.map.transitionend, this.onHide, this);
		this.hideEvent.fire();
	},
	/**
	 * Show the popup.
	 * @memberOf joPopup
	 * @return {Object}
	 */
	show: function() {
		joEvent.remove(this.container, joEvent.map.transitionend, this.onHide, this);
		joDefer(function() {
			this.container.className = 'show';
			this.showEvent.fire();
		}, this);

		joGesture.backEvent.capture(this.hide, this);
		
		return this;
	}
});

/**
	joScreen
	========
	
	Abstraction layer for the device screen. Uses document.body as its
	DOM element and allows other controls to be nested within (usually
	a joStack or other high-level containers or controls).
	
	Methods
	-------
	
	- `alert(title, message, buttons)`
	
	  Simple alert box. The `buttons` parameter is optional; a simple
	  "OK" button is added if nothing is specified.
	
	- `showPopup(joView)`
	- `hidePopup(joView)`
	
	  These methods allow you to do a completely custom modal joPopup.
	  Pass in either a joView, an array of them, or and HTMLElement
	  or a string, the same as you would when you create a joCard or
	  other child of joContainer.
	
	Extends
	-------
	
	- joContainer
	
	Use
	---
	
		var x = new joScreen([
			new joNav(),
			new joStack(),
			new joToolbar()
		]);
		
		// show a simple alert dialog
		x.alert("Hello", "This is an alert");
		
		// a more complex alert
		x.alert("Hola", "Do you like this alert?", [
			{ label: "Yes", action: yesFunction, context: this },
			{ label: "No", action: noFunction, context: this }
		]);
		
		// a completely custom popup
		x.showPopup(myView);
	
	Events
	------
	
	- `resizeEvent`
	- `menuEvent`
	- `activateEvent`
	- `deactivateEvent`
	- `backEvent`
	- `forwardEvent`
	
*/
/**
 * Abstraction layer for the device screen. Uses document.body as its
 *	DOM element and allows other controls to be nested within (usually
 *	a joStack or other high-level containers or controls).
 * @constructor
 * @extends joContainer
 * @example
 * <pre>
 * 		var x = new joScreen([
 *			new joNav(),
 *			new joStack(),
 *			new joToolbar()
 *		]);
 *		
 *		// show a simple alert dialog
 *		x.alert("Hello", "This is an alert");
 *		
 *		// a more complex alert
 *		x.alert("Hola", "Do you like this alert?", [
 *			{ label: "Yes", action: yesFunction, context: this },
 *			{ label: "No", action: noFunction, context: this }
 *		]);
 *		
 *		// a completely custom popup
 *		x.showPopup(myView);
 * </pre>
 */
joScreen = function() {
	/**
	 * @event resizeEvent
	 */
	this.resizeEvent = new joSubject(this);
	/**
	 * @event menuEvent
	 */
	this.menuEvent = new joSubject(this);
	/**
	 * @event activateEvent
	 */
	this.activateEvent = new joSubject(this);
	/**
	 * @event deactivateEvent
	 */
	this.deactivateEvent = new joSubject(this);
	/**
	 * @event backEvent
	 */
	this.backEvent = new joSubject(this);
	/**
	 * @event forwardEvent
	 */
	this.forwardEvent = new joSubject(this);
	
	joContainer.apply(this, arguments);
};
joScreen.extend(joContainer, {
	tagName: "screen",
	/**
	 * @memberOf joScreen
	 */
	setupEvents: function() {
		joEvent.on(window, "resize", this.resizeEvent.fire, this);
		joEvent.on(window, "appmenushow", this.menuEvent.fire, this);
		joEvent.on(window, "activate", this.activateEvent.fire, this);
		joEvent.on(window, "deactivate", this.deactivateEvent.fire, this);
		joEvent.on(window, "back", this.backEvent.fire, this);
	},
	/**
	 * @memberOf joScreen
	 * @return {}
	 */
	createContainer: function() {
		return document.body;
	},
	
	// show a popup made from your own UI controls
	/**
	 * These methods allow you to do a completely custom modal joPopup.
	 * Pass in either a joView, an array of them, or and HTMLElement
	 * or a string, the same as you would when you create a joCard or
	 * other child of joContainer.
	 * @memberOf joScreen
	 * @param {} data
	 * @return {Object}
	 */
	showPopup: function(data) {
		// take a view, a DOM element or some HTML and
		// make it pop up in the screen.
		if (!this.popup) {
			this.shim = new joShim(
				new joFlexcol([
					'&nbsp',
					this.popup = new joPopup(data),
					'&nbsp'
				])
			);
		}
		else {
			this.popup.setData(data);
		}
		this.shim.hideEvent.subscribe(this.hideShim, this);
		this.popup.hideEvent.subscribe(this.hidePopup, this);
		this.shim.show();
		this.popup.show();
		
		return this;
	},
	/**
	 * Hide shim
	 * @memberOf joScreen
	 * @return {Object}
	 */
	hideShim: function() {
		this.shim = null;

		if (this.popup)
			this.popup.hide();

		return this;
	},
	/**
	 * Hide popup.
	 * @memberOf joScreen
	 * @return {Object}
	 */
	hidePopup: function() {
		this.popup = null;

		if (this.shim)
			this.shim.hide();
			
		return this;
	},
	
	// shortcut to a simple alert dialog, not the most efficient
	// way to do this, but for now, it serves its purpose and
	// the API is clean enough.
	/**
	 * Simple alert box. The `buttons` parameter is optional; a simple
	 * "OK" button is added if nothing is specified.
	 * @memberOf joScreen
	 * @param {} title
	 * @param {} msg
	 * @param {} options
	 * @param {} context
	 * @return {Object}
	 */
	alert: function(title, msg, options, context) {
		var buttons = [];
		var callback;
		
		context = (typeof context === 'object') ? context : null;
		
		if (typeof options === 'object') {
			if (options instanceof Array) {
				// we have several options
				for (var i = 0; i < options.length; i++)
					addbutton(options[i]);
			}
			else {
				addbutton(options);
			}
		}
		else if (typeof options === 'string') {
			addbutton({ label: options });
		}
		else {
			if (typeof options === 'function')
				callback = options;

			addbutton();
		}
	
		var view = [
			new joTitle(title),
			new joHTML(msg),
			buttons
		];
		this.showPopup(view);
		
		var self = this;
		
		function addbutton(options) {
			if (!options)
				options = { label: 'OK' };

			var button = new joButton(options.label);
			button.selectEvent.subscribe(
				function() {
					if (options.action)
						options.action.call(options.context);
						
					defaultaction();
				}, options.context || self
			);
			
			buttons.push(button);
		}
		
		function defaultaction() {
			self.hidePopup();
			if (callback) {
				if (context)
					callback.call(context);
				else
					callback();
			}
		}
		
		return this;
	}
});


/**
	joShim
	======
	
	A simple screen dimmer. Used mostly for popups and other
	modal use cases.

	Methods
	-------
	- `show()`
	- `hide()`

	  These do what you'd expect.
	
	Extends
	-------
	- joView
	
	Events
	------
	
	- `showEvent`
	- `hideEvent`

*/
/**
 * A simple screen dimmer. Used mostly for popups and other
 *	modal use cases.
 * @constructor
 * @extends joContainer
 */
joShim = function() {
	/**
	 * @event showEvent
	 */
	this.showEvent = new joSubject(this);
	/**
	 * @event hideEvent
	 */
	this.hideEvent = new joSubject(this);
	/**
	 * @event selectEvent
	 */
	this.selectEvent = new joSubject(this);
	
	joContainer.apply(this, arguments);
};
joShim.extend(joContainer, {
	tagName: "joshim",
	/**
	 * @memberOf joShim
	 */
	setEvents: function() {
		joEvent.on(this.container, "mousedown", this.onMouseDown, this);
	},
	/**
	 * @memberOf joShim
	 * @param {} e
	 */
	onMouseDown: function(e) {
		joEvent.stop(e);
		this.hide();
//		this.selectEvent.fire();
	},
	/**
	 * Hide shim
	 * @memberOf joShim
	 * @return {Object}
	 */
	hide: function() {
		joDefer(function() {
			joEvent.on(this.container, joEvent.map.transitionend, this.onHide, this);
			this.container.className = '';
		}, this);
		
		return this;
	},
	/**
	 * Show shim
	 * @memberOf joShim
	 * @return {Object}
	 */
	show: function() {
		this.attach();

		joEvent.remove(this.container, joEvent.map.transitionend, this.onHide, this);
		joDefer(function() {
			this.container.className = 'show';
		}, this);

		// default parent to the document body
		if (!this.lastParent)
			this.lastParent = document.body;
		
		return this;
	},
	/**
	 * @memberOf joShim
	 */
	onShow: function() {
		this.showEvent.fire();
	},
	/**
	 * @memberOf joShim
	 */
	onHide: function() {
		joEvent.remove(this.container, joEvent.map.transitionend, this.onHide, this);
		this.detach();
		this.hideEvent.fire();
	}
});

/**
	joSound
	========
	
	Play preloaded sound effects using the HTML5 `Audio` object. This module could
	be wildly different for various platforms. Be warned.

	Methods
	-------
	
	- `play()`
	- `pause()`
	- `rewind()`
	- `stop()`
	
	  Basic sound controls.
	
	- `setLoop(n)`
	
	  Tell the joSound to automatically loop `n` times. Set to `-1` to loop
	  continuously until `pause()`.
	
	- `setVolume(level)`
	
	  Level is a decimal value from `0` to `1`. So, half volume would be `0.5`.
	
	Events
	------
	
	- `endedEvent`
	- `errorEvent`

*/
/**
 * Play preloaded sound effects using the HTML5 `Audio` object. <b>Note:</b> This module could
 *	be wildly different for various platforms. Be warned.
 * @constructor
 * @param {} filename
 * @param {} repeat
 */
joSound = function(filename, repeat) {
	/**
	 * @event endedEvent 
	 */
	this.endedEvent = new joSubject(this);
	/**
	 * @event errorEvent
	 */
	this.errorEvent = new joSubject(this);
	
	if (typeof Audio == 'undefined')
		return;

	this.filename = filename;
	this.audio = new Audio();
	this.audio.autoplay = false;
	
	if (!this.audio)
		return;
		
	joDefer(function() {
		this.audio.src = filename;
		this.audio.load();
	}, this, 5);
	
	this.setRepeatCount(repeat);

	joEvent.on(this.audio, "ended", this.onEnded, this);

//	this.pause();
};
joSound.prototype = {
	/**
	 * Play audio
	 * @memberOf joSound
	 */
	play: function() {
		if (!this.audio || this.audio.volume === 0)
			return;

		this.audio.play();
		
		return this;
	},
	/**
	 * @memberOf joSound
	 * @param {} e
	 */
	onEnded: function(e) {
		this.endedEvent.fire(this.repeat);

		if (++this.repeat < this.repeatCount)
			this.play();
		else
			this.repeat = 0;
	},
	/**
	 * Tell the joSound to automatically loop `n` times. Set to `-1` to loop
	 * continuously until `pause()`.
	 * @memberOf joSound
	 * @param {} repeat
	 * @return {Object}
	 */
	setRepeatCount: function(repeat) {
		this.repeatCount = repeat;
		this.repeat = 0;

		return this;
	},
	/**
	 * Pause audio
	 * @memberOf joSound
	 */
	pause: function() {
		if (!this.audio)
			return;

		this.audio.pause();

		return this;
	},
	/**
	 * Rewind audio
	 * @memberOf joSound
	 */
	rewind: function() {
		if (!this.audio)
			return;

		try {
			this.audio.currentTime = 0.0;			
		}
		catch (e) {
			joLog("joSound: can't rewind...");
		}
		
		this.repeat = 0;

		return this;
	},
	/**
	 * Stop audio playing.
	 * @return {Object}
	 * @memberOf joSound
	 */
	stop: function() {
		this.pause();
		this.rewind();
		
		this.repeat = 0;

		return this;
	},
	/**
	 * Set audio volume.
	 * @memberOf joSound
	 * @param {} vol
	 */
	setVolume: function(vol) {
		if (!this.audio || vol < 0 || vol > 1)
			return;

		this.audio.volume = vol;

		return this;
	}
};

/**
	joStackScroller
	===============
	
	What happens when you mix joStack and joScroller? You get this
	class. Use exactly as you would joStack, only it automatically
	puts a scroller in the stack as needed. At some point, this
	might get folded into joStack, but for now it's a special class.
	
	It also handles the `scrollTo()` and `scrollBy()` methods from
	joScroller.
	
	Extends
	-------
	- joStack
	- joScroller
*/

/**
 * 	What happens when you mix joStack and joScroller? You get this
 *	class. Use exactly as you would joStack, only it automatically
 *	puts a scroller in the stack as needed. At some point, this
 *	might get folded into joStack, but for now it's a special class.
 *	
 *	It also handles the `scrollTo()` and `scrollBy()` methods from
 *	joScroller.
 * @constructor
 * @extends joStack
 * @param {} data
 */
joStackScroller = function(data) {
	this.scrollers = [
		new joScroller(),
		new joScroller()
	];
	this.scroller = this.scrollers[0];

	joStack.apply(this, arguments);
	
	this.scroller.attach(this.container);
};
joStackScroller.extend(joStack, {
	type: "scroll",
	scrollerindex: 1,
	scroller: null,
	scrollers: [],
	/**
	 * @memberOf joStackScroller
	 */
	switchScroller: function() {
		this.scrollerindex = this.scrollerindex ? 0 : 1;
		this.scroller = this.scrollers[this.scrollerindex];
	},
	/**
	 * @memberOf joStackScroller
	 * @return {Object}
	 */
	getLastScroller: function() {
		return this.scrollers[this.scrollerindex ? 0 : 1];
	},
	/**
	 * @memberOf joStackScroller
	 * @param {} something
	 * @return {Object}
	 */
	scrollTo: function(something) {
		this.scroller.scrollTo(something);
		
		return this;
	},
	/**
	 * @memberOf joStackScroller
	 * @param {} y
	 * @return {Object}
	 */
	scrollBy: function(y) {
		this.scroller.scrollBy(y);
		
		return this;
	},
	/**
	 * @memberOf joStackScroller
	 * @return {Object}
	 */
	getChildStyleContainer: function() {
		return this.scroller.container;
	},
	/**
	 * @memberOf joStackScroller
	 * @return {Object}
	 */
	getContentContainer: function() {
		return this.scroller.container;
	},
	/**
	 * @memberOf joStackScroller
	 * @param {Object} child
	 */
	appendChild: function(child) {
		var scroller = this.scroller;
		scroller.setData(child);
		this.container.appendChild(scroller.container);
	},
	/**
	 * @memberOf joStackScroller
	 * @return {Object}
	 */
	getChild: function() {
		return this.scroller.container || null;
	},
	/**
	 * @memberOf joStackScroller
	 * @return {Object}
	 */
	forward: function() {
		if (this.index < this.data.length - 1)
			this.switchScroller();
			
		joStack.prototype.forward.call(this);
		
		return this;
	},
	/**
	 * @memberOf joStackScroller
	 * @return {Object}
	 */
	back: function() {
		if (this.index > 0)
			this.switchScroller();

		joStack.prototype.back.call(this);
		
		return this;
	},
	/**
	 * @memberOf joStackScroller
	 * @return {Object}
	 */
	home: function() {
		if (this.data && this.data.length && this.data.length > 1) {
			this.switchScroller();
			joStack.prototype.home.call(this);
		}
		
		return this;
	},
	/**
	 * @memberOf joStackScroller
	 * @param {} o
	 */	
	push: function(o) {
		// don't push the same view we already have
		if (this.data && this.data.length && this.data[this.data.length - 1] === o)
			return;
			
		this.switchScroller();

		joDOM.removeCSSClass(o, 'flick');
		joDOM.removeCSSClass(o, 'flickback');

		this.scroller.setData(o);
		this.scroller.scrollTo(0, true);

		joStack.prototype.push.call(this, o);
		
		return this;
	},
	/**
	 * @memberOf joStackScroller
	 * @return {Object}
	 */
	pop: function() {
		if (this.data.length > this.locked)
			this.switchScroller();

		joStack.prototype.pop.call(this);
		
		return this;
	}
});


/**
	joTabBar
	=========
	
	Tab bar widget.
	
	Extends
	-------
	
	- joList

	Model
	-----
	
	Data is expected to be an array of `{ type: "", label: ""}` objects,
	in the display order for the bar.

*/
/**
 * Tab bar widget.
 * Data is expected to be an array of `{ type: "", label: ""}` objects,
 *	in the display order for the bar.
 * @constructor
 * @extends joList
 */
joTabBar = function() {
	joList.apply(this, arguments);
};
joTabBar.extend(joList, {
	tagName: "jotabbar",
	/**
	 * @memberOf joTabBar
	 * @param {} data
	 * @param {} index
	 * @return {Object}
	 */
	formatItem: function(data, index) {
		var o = document.createElement("jotab");

		if (data.label)
			o.innerHTML = data.label;
		
		if (data.type)
			o.className = data.type;

		o.setAttribute("index", index);
		
		return o;
	}
});

/**
	joTable
	=======
	
	Table control, purely visual representation of tabular data (usually
	an array of arrays).
	
	Use
	---
	
		// simple table with inline data
		var x = new joTable([
			["Nickname", "Phone", "Email"],
			["Bob", "555-1234", "bob@bobco.not"],
			["Jo", "555-3456", "jo@joco.not"],
			["Jane", "555-6789", "jane@janeco.not"]
		]);
		
		// we can respond to touch events in the table
		x.selectEvent.subscribe(function(index, table) {
			// get the current row and column
			joLog("Table cell clicked:", table.getRow(), table.getCol());
			
			// you can also get at the cell HTML element as well
			joDOM.setStyle(table.getNode(), { fontWeight: "bold" });
		});

	Extends
	-------

	- joList

	Methods
	-------

	- `setCell(row, column)`

	  Sets the active cell for the table, also makes it editiable and sets focus.

	- `getRow()`, `getCol()`

	  Return the current row or column
*/
/**
 * Table control, purely visual representation of tabular data (usually
 *	an array of arrays).
 * @constructor
 * @extends joList	
 * @param {} data
 * @example
 * <pre>
 * 		// simple table with inline data
 *		var x = new joTable([
 *			["Nickname", "Phone", "Email"],
 *			["Bob", "555-1234", "bob@bobco.not"],
 *			["Jo", "555-3456", "jo@joco.not"],
 *			["Jane", "555-6789", "jane@janeco.not"]
 *		]);
 *		
 *		// we can respond to touch events in the table
 *		x.selectEvent.subscribe(function(index, table) {
 *			// get the current row and column
 *			joLog("Table cell clicked:", table.getRow(), table.getCol());
 *			
 *			// you can also get at the cell HTML element as well
 *			joDOM.setStyle(table.getNode(), { fontWeight: "bold" });
 *		});
 * </pre>
 */
joTable = function(data) {
	joList.apply(this, arguments);
};
joTable.extend(joList, {
	tagName: "jotable",
	
	// default row formatter
	/**
	 * Default row formatter
	 * @memberOf joTable
	 * @param {} row
	 * @param {} index
	 * @return {Object}
	 */
	formatItem: function(row, index) {
		var tr = document.createElement("tr");
		
		for (var i = 0, l = row.length; i < l; i++) {
			var o = document.createElement(index ? "td" : "th");
			o.innerHTML = row[i];
			
			// this is a little brittle, but plays nicely with joList's select event
			o.setAttribute("index", index * l + i);
			tr.appendChild(o);
		}
		
		return tr;
	},

	// override joList's getNode
	/**
	 * @memberOf joTable
	 * @param {} index
	 * @return {Object}
	 */
	getNode: function(index) {
		var row = this.getRow(index);
		var col = this.getCol(index);
		
		return this.container.childNodes[row].childNodes[col];
	},
	/**
	 * Return the current row
	 * @memberOf joTable
	 * @param {} index
	 * @return {Object}
	 */
	getRow: function(index) {
		if (typeof index === "undefined")
			index = this.getIndex();
			
		var rowsize = this.data[0].length;

		return Math.floor(index / rowsize);
	},
	/**
	 * Return the current column
	 * @memberOf joTable
	 * @param {} index
	 * @return {Object}
	 */
	getCol: function(index) {
		if (typeof index === "undefined")
			index = this.getIndex();
		
		var rowsize = this.data[0].length;

		return index % rowsize;
	}	
});


/**
	joTextarea
	==========
	
	Multi-line text input control. When you instantiate or use `setData()`, you can
	either pass in an initial value or a reference to a joDataSource object which it,
	like other joControl instances, will bind to.
	
	Basically, this is just a multi-line version of joInput.
	
	Use
	---
	
		// simple multi-line field
		var sample = "This is some sample text to edit.";
		var x = new joTextarea(sample);
		
		// setting the style inline using chaining
		var f = new joTextarea(sample).setStyle({
			minHeight: "100px",
			maxHeight: "300px"
		});
		
		// adding a simple change event handler using chaining
		var h = new joTextarea(sample).changeEvent.subscribe(function(data) {
			joLog("text area changed:", data);
		});

		// attach the value to a preference
		var y = new joTextarea(joPreference.bind("username"));
		
		// attach input control to a custom joDataSource
		var username = new joDataSource("bob");
		var z = new joTextarea(username);
	
	Extends
	-------
	
	- joInput
	
*/
/**
 * Multi-line text input control. When you instantiate or use `setData()`, you can
 * either pass in an initial value or a reference to a joDataSource object which it,
 * like other joControl instances, will bind to.
 * @param {} data
 * @constructor
 * @extends joInput
 * @example
 * <pre>
 * 		// simple multi-line field
 *		var sample = "This is some sample text to edit.";
 *		var x = new joTextarea(sample);
 *		
 *		// setting the style inline using chaining
 *		var f = new joTextarea(sample).setStyle({
 *			minHeight: "100px",
 *			maxHeight: "300px"
 *		});
 *		
 *		// adding a simple change event handler using chaining
 *		var h = new joTextarea(sample).changeEvent.subscribe(function(data) {
 *			joLog("text area changed:", data);
 *		});
 *
 *		// attach the value to a preference
 *		var y = new joTextarea(joPreference.bind("username"));
 *		
 *		// attach input control to a custom joDataSource
 *		var username = new joDataSource("bob");
 *		var z = new joTextarea(username);
 * </pre>
 */
joTextarea = function(data) {
	joInput.apply(this, arguments);
};
joTextarea.extend(joInput, {
	tagName: "textarea",
	
	onKeyDown: function(e) {
		// here we want the enter key to work, overriding joInput's behavior
		return false;
	}
});


/**
	joTitle
	=======
	
	Title view, purely a visual presentation.
	
	Extends
	-------
	
	- joContainer

*/
/**
 * Title view, purely a visual presentation.
 * @constructor
 * @extends joView
 * @param {} data
 */
joTitle = function(data) {
	joView.apply(this, arguments);
};
joTitle.extend(joView, {
	tagName: "jotitle"
});


/**
	joToolbar
	=========

	Locks UI controls to the bottom of whatever you put this container into.
	
	Extends
	-------
	
	- joContainer

*/
/**
 * Locks UI controls to the bottom of whatever you put this container into.
 * @constructor
 * @extends joContainer
 * @param {} data
 */
joToolbar = function(data) {
	joContainer.apply(this, arguments);
};
joToolbar.extend(joContainer, {
	tagName: "jotoolbar"
});

/**
 * @constructor
 * @extends joContainer
 * @since 0.5.0
 */
joForm = function() {
	joContainer.apply(this, arguments);
};
joForm.extend(joContainer, {
	tagName: "form"
});
/**
	joDialog
	========
	
	This is a higher level container that wraps a joPopup with a joShim.
*/
/**
 * This is a higher level container that wraps a joPopup with a joShim.
 * @constructor
 * @extends joShim
 * @param {} data
 */
joDialog = function(data) {
	joShim.call(this, new joFlexcol([
		'',
		new joPopup(
			new joScroller(data)
		).setStyle("show"),
		''
	]));
};
joDialog.extend(joShim, {
});

/**
	joSelectList
	============
	
	A selection list of options used by joSelect.
	
	Extends
	-------
	
	- joList
*/
/**
 * A selection list of options used by joSelect.
 * @constructor
 * @extends joList
 */
joSelectList = function() {
	joList.apply(this, arguments);
};
joSelectList.extend(joList, {
	tagName: "joselectlist"
});

/**
	joNavbar
	========
	
	Floating navigation control. Usually tied to a joStack or joStackScroller.
	Will handle display of a "back" button (controllable in CSS) and show the
	title string of the current view in a stack (if it exists).

	Use
	---
	
		// make a stack
		var stack = new joStackScroller();
		
		// new navbar
		var x = new joNavbar();
		
		// link to a stack
		x.setStack(stack);
		
	Methods
	-------
	
	- `back()`
	
	  Signals the associated stack to move back in its stack (i.e. calls
	  the stack's `pop()` method).
	
	- `setStack(joStack or joStackScroller)`
	
	  Links this control to a stack.
	
*/
/**
 * 	Floating navigation control. Usually tied to a joStack or joStackScroller.
 *	Will handle display of a "back" button (controllable in CSS) and show the
 * 	title string of the current view in a stack (if it exists).
 * @constructor
 * @extends joContainer
 * @param {} title
 * @example
 * <pre>
 * 		// make a stack
 *		var stack = new joStackScroller();
 *		
 *		// new navbar
 *		var x = new joNavbar();
 *		
 *		// link to a stack
 *		x.setStack(stack);
 * </pre>
 */
joNavbar = function(title) {
	if (title)
		this.firstTitle = title;
	
	var ui = [
		this.titlebar = new joView(title || '&nbsp;').setStyle('title'),
		new joFlexrow([this.back = new joBackButton('Back').selectEvent.subscribe(this.back, this), ""])
	];
	
	joContainer.call(this, ui);
};
joNavbar.extend(joContainer, {
	tagName: "jonavbar",
	stack: null,
	/**
	 * Signals the associated stack to move back in its stack (i.e. calls
	 * the stack's `pop()` method).
	 * @memberOf joNavbar
	 * @return {Object}
	 */
	back: function() {
		if (this.stack)
			this.stack.pop();

		return this;
	},
	/**
	 * Links this control to a stack.
	 * @memberOf joNavbar
	 * @param {} stack
	 * @return {Object}
	 */
	setStack: function(stack) {
		if (this.stack) {
			this.stack.pushEvent.unsubscribe(this.update, this);
			this.stack.popEvent.unsubscribe(this.update, this);
		}
		
		if (!stack) {
			this.stack = null;
			return this;
		}
		
		this.stack = stack;
		
		stack.pushEvent.subscribe(this.update, this);
		stack.popEvent.subscribe(this.update, this);

		this.refresh();
		
		return this;
	},
	/**
	 * Update
	 * @memberOf joNavbar
	 * @return {}
	 */
	update: function() {
		if (!this.stack)
			return this;
		
		joDOM.removeCSSClass(this.back, 'selected');
		joDOM.removeCSSClass(this.back, 'focus');

//		console.log('update ' + this.stack.data.length);
		
		if (this.stack.data.length > 1)
			joDOM.addCSSClass(this.back, 'active');
		else
			joDOM.removeCSSClass(this.back, 'active');
			
		var title = this.stack.getTitle();

		if (typeof title === 'string')
			this.titlebar.setData(title);
		else
			this.titlebar.setData(this.firstTitle);
			
		return this;
	},
	/**
	 * Set the title
	 * @memberOf joNavbar
	 * @param {} title
	 * @return {Object}
	 */
	setTitle: function(title) {
		this.titlebar.setData(title);
		this.firstTitle = title;
		
		return this;
	}
});
 

/**
	joBackButton
	============
	
	A "back" button, which can be made to be shown only in appropriate
	platforms (e.g. iOS, Safari, Chrome) through CSS styling.
	
	See joNavbar for more information.
	
	Extends
	-------
	
	- joButton
	
*/
/**
 * A "back" button, which can be made to be shown only in appropriate
 *	platforms (e.g. iOS, Safari, Chrome) through CSS styling.
 * @constructor
 * @extends joButton
 * @see joNavbar
 */
joBackButton = function() {
	joButton.apply(this, arguments);
};
joBackButton.extend(joButton, {
	tagName: "jobackbutton"
});

/**
	joSelect
	========
	
	Multi-select control which presents a set of options for the user
	to choose from.
	
	Methods
	-------
	
	- `setValue(value)`
	
	  Set the current value, based on the index for the option list.
	
	- `getValue()`
	
	  Returns the index of the current selected item.
		
	Extends
	-------
	
	- joExpando
	
	Consumes
	--------
	
	- joSelectTitle
	- joSelectList
	
	Properties
	----------
	
	- `field`
	
	  Reference to the value field for this control.
	
	- `list`
	
	  Reference to the joSelectList for this control.
	
	Use
	---
	
		// pass in an array of options
		var x = new joSelect([ "Apples", "Oranges", "Grapes" ]);
		
		// pass in a current value
		var y = new joSelect([ "Apples", "Oranges", "Grapes" ], 2);
		
		// respond to the change event
		y.changeEvent = function(value, list) {
			console.log("Fruit: " + list.getNodeValue(value));
		});
	
*/
/**
 * Multi-select control which presents a set of options for the user
 *	to choose from.
 * @constructor
 * @extends joExpando
 * @param {} data
 * @param {} value
 * @example
 * <pre>
 * 		// pass in an array of options
 *		var x = new joSelect([ "Apples", "Oranges", "Grapes" ]);
 *		
 * 		// pass in a current value
 *		var y = new joSelect([ "Apples", "Oranges", "Grapes" ], 2);
 * 		
 * 		// respond to the change event
 *		y.changeEvent = function(value, list) {
 * 			console.log("Fruit: " + list.getNodeValue(value));
 *		});
 * </pre>
 */
joSelect = function(data, value) {
	var v = value;
	if (value instanceof joDataSource)
		v = value.getData();
	
	var ui = [
		this.field = new joSelectTitle(v),
		this.list = new joSelectList(data, value)
	];
	
	this.field.setList(this.list);
	/**
	 * @event changeEvent
	 */
	this.changeEvent = this.list.changeEvent;
	/**
	 * @event selectEvent
	 */
	this.selectEvent = this.list.selectEvent;
	
	joExpando.call(this, ui);
	this.container.setAttribute("tabindex", 1);
	
	this.field.setData(this.list.value);

	this.list.selectEvent.subscribe(this.setValue, this);
};
joSelect.extend(joExpando, {
	/**
	 * Set the current value, based on the index for the option list.
	 * @memberOf joSelect
	 * @param {} value
	 * @param {} list
	 * @return {Object}
	 */
	setValue: function(value, list) {
		if (list) {
			this.field.setData(value);
			this.close();
		}
		else {
			this.field.setData(value);
		}
		
		return this;
	},
	/**
	 * Returns the index of the current selected item.
	 * @memberOf joSelect
	 * @return {Object}
	 */
	getValue: function() {
		return this.list.getValue();
	},
	/**
	 * Set events
	 * @memberOf joSelect
	 */
	setEvents: function() {
		joControl.prototype.setEvents.call(this);
	},
	/**
	 * On blur
	 * @memberOf joSelect
	 * @param {} e
	 */
	onBlur: function(e) {
		joEvent.stop(e);
		joDOM.removeCSSClass(this, "focus");
		this.close();
	}
});

/**
	joSelectTitle
	=============
	
	joSelect flavor of joExpandoTitle.
	
	Extends
	-------
	
	- joExpandoTitle
*/
/**
 * joSelect flavor of joExpandoTitle.
 * @constructor
 * @extends joExpandoTitle
 */
joSelectTitle = function() {
	joExpandoTitle.apply(this, arguments);
};
joSelectTitle.extend(joExpandoTitle, {
	list: null,
	/**
	 * @memberOf joSelectTitle
	 * @param {} list
	 * @return {}
	 */
	setList: function(list) {
		this.list = list;
		
		return this;
	},
	/**
	 * @memberOf joSelectTitle
	 * @param {} value
	 * @return {}
	 */
	setData: function(value) {
		if (this.list)
			joExpandoTitle.prototype.setData.call(this, this.list.getNodeData(value) || "Select...");
		else
			joExpandoTitle.prototype.setData.call(this, value);
		
		return this;
	}
});

/**
	joToggle
	========
	
	Boolean widget (on or off).
	
	Methods
	-------
	
	- `setLabels(Array)`
	
	You can change the labels for this control, which default to "Off" and "On".
	
	Extends
	-------
	
	- joControl
	
	Use
	---
	
		// simple
		var x = new joToggle();
		
		// with value
		var y = new joToggle(true);
		
		// with custom labels
		var z = new joToggle().setLabels(["No", "Yes"]);
		
	See Data Driven Controls for more examples.
	
*/
/**
 * Boolean widget (on or off).
 * @constructor
 * @extends joControl
 * @param {} data
 * @example
 * <pre>
 * 		// simple
 *		var x = new joToggle();
 *		
 *		// with value
 *		var y = new joToggle(true);
 *		
 *		// with custom labels
 *		var z = new joToggle().setLabels(["No", "Yes"]);
 *		
 *	See Data Driven Controls for more examples.
 * </pre>
 */
joToggle = function(data) {
	joControl.call(this, data);
};
joToggle.extend(joControl, {
	tagName: "jotoggle",
	button: null,
	labels: ["Off", "On"],
	/**
	 * @memberOf joToggle
	 * @param {} labels
	 * @return {Object}
	 */
	setLabels: function(labels) {
		if (labels instanceof Array)
			this.labels = labels;
		else if (arguments.length == 2)
			this.labels = arguments;

		this.draw();
			
		return this;
	},
	/**
	 * @memberOf joToggle
	 * @param {} e
	 * @return {Object}
	 */
	select: function(e) {
		if (e)
			joEvent.stop(e);

		this.setData((this.data) ? false : true);
		
		return this;
	},
	/**
	 * @memberOf joToggle
	 * @param {} e
	 */
	onBlur: function(e) {
		joEvent.stop(e);
		this.blur();
	},
	/**
	 * @memberOf joToggle
	 */
	draw: function() {
		if (!this.container)
			return;

		if (!this.container.firstChild) {
			this.button = joDOM.create("div");
			this.container.appendChild(this.button);
		}
		
		this.button.innerHTML = this.labels[(this.data) ? 1 : 0];

		joDefer(function() {
			if (this.data)
				joDOM.addCSSClass(this.container, "on");
			else
				joDOM.removeCSSClass(this.container, "on");
		}, this);
	}
});

/**
	joSlider
	========
	
	Slider control, horizontal presentation (may be extended later to allow for
	vertical and x/y).
	
	Extends
	-------
	
	- joControl
	
	Methods
	-------
	
	- `setRange(min, max, snap)`
	
	Where `min`/`max` is a number, either integer or decimal, doesn't matter. If `max`
	and `min` are integers, then `snap` defaults to `1`, otherwise it is set to `0` (no
	snap, which allows free movement).
	
	The optional `snap` value adjusts the granularuty of choices. Set to `0` for
	free-floating, or any other positive number. Any `snap` that is less than `0`
	or greater than the total range of possible values will be ignored.
	
	Use
	---
	
		// basic slider, will allow any decimal value
		// between 0 and 1, defaults to 0
		var x = new joSlider();
		
		// custom range and default value set
		var y = new joSlider(0).setRange(-10, 10);
		
		// percent slider, with 5% snap
		var z = new joSlider(0).setRange(0, 100, 5);
		
		// responding to change events
		var r = new joSlider().changEvent.subscribe(function(value) {
			console.log(value);
		}, this);

*/
/**
 * Slider control, horizontal presentation (may be extended later to allow for
 *	vertical and x/y).
 * @constructor
 * @extends joControl
 * @param {} value
 * @example
 * <pre>
 * 		// basic slider, will allow any decimal value
 *		// between 0 and 1, defaults to 0
 *		var x = new joSlider();
 *		
 *		// custom range and default value set
 *		var y = new joSlider(0).setRange(-10, 10);
 *		
 *		// percent slider, with 5% snap
 *		var z = new joSlider(0).setRange(0, 100, 5);
 *		
 *		// responding to change events
 *		var r = new joSlider().changEvent.subscribe(function(value) {
 *			console.log(value);
 *		}, this);
 *
 * </pre>
 */
joSlider = function(value) {
	this.min = 0;
	this.max = 1;
	this.snap = 0;
	this.range = 1;
	this.thumb = null;
	this.horizontal = 1;
	this.vertical = 0;
	this.moved = false;
	this.jump = true;
	/**
	 * @event slideStartEvent
	 */
	this.slideStartEvent = new joSubject();
	/**
	 * @event slideEndEvent
	 */
	this.slideEndEvent = new joSubject();

	joControl.call(this, null, value);
};
joSlider.extend(joControl, {
	tagName: "joslider",
	/**
	 * 	Where `min`/`max` is a number, either integer or decimal, doesn't matter. If `max`
	 * and `min` are integers, then `snap` defaults to `1`, otherwise it is set to `0` (no
	 * snap, which allows free movement).
	 *
	 * The optional `snap` value adjusts the granularuty of choices. Set to `0` for
	 * free-floating, or any other positive number. Any `snap` that is less than `0`
	 * or greater than the total range of possible values will be ignored.
	 * @memberOf joSlider
	 * @param {} min
	 * @param {} max
	 * @param {} snap
	 * @return {Object}
	 */
	setRange: function(min, max, snap) {
		if (min >= max) {
			joLog("WARNING: joSlider.setRange, min must be less than max.");
			return this;
		}
		
		this.min = min || 0;
		this.max = max || 1;
		
		if (min < 0 && max >= 0)
			this.range = Math.abs(min) + max;
		else if (min < 0 && max <= 0)
			this.range = min - max;
		else
			this.range = max - min;

		if (typeof snap !== 'undefined')
			this.snap = (snap >= 0 && snap <= this.range) ? snap : 0;
		else
			this.snap = 0;
			
		this.setValue(this.value);
			
		return this;
	},
	/**
	 * @memberOf joSlider
	 * @param {} value
	 * @param {} silent
	 * @return {Object}
	 */
	setValue: function(value, silent) {
		var v = this.adjustValue(value);
		
		if (v != this.value) {
			joControl.prototype.setValue.call(this, v);
			if (!silent)
				this.draw();
		}
			
		return this;
	},
	/**
	 * @memberOf joSlider
	 * @param {} v
	 * @return {Object}
	 */
	adjustValue: function(v) {
		var value = v;
		
		if (this.snap)
			value = Math.floor(value / this.snap) * this.snap;

		if (value < this.min)
			value = this.min;
		else if (value > this.max)
			value = this.max;
			
		return value;
	},
	/**
	 * @memberOf joSlider
	 * @return {Object}
	 */
	createContainer: function() {
		var o = joDOM.create(this.tagName);

		if (o)
			o.setAttribute("tabindex", "1");
			
		var t = joDOM.create("josliderthumb");
		o.appendChild(t);
		this.thumb = t;
		
		return o;
	},
	/**
	 * @memberOf joSlider
	 * @param {} e
	 */	
	onDown: function(e) {
		joEvent.stop(e);

		this.reset();
		joDOM.addCSSClass(this.container, "live");
				
		var node = this.container.firstChild;
		
		this.inMotion = true;
		this.moved = false;
		this.slideStartEvent.fire(this.value);

		if (!this.mousemove) {
			this.mousemove = joEvent.on(document.body, "mousemove", this.onMove, this);
			this.mouseup = joEvent.capture(document.body, "mouseup", this.onUp, this);
		}
	},
	/**
	 * @memberOf joSlider
	 */
	reset: function() {
		this.moved = false;
		this.inMotion = false;
		this.firstX = -1;
		this.firstY = -1;
	},
	/**
	 * @memberOf joSlider
	 * @param {} e
	 */
	onMove: function(e) {
		if (!this.inMotion)
			return;

		joEvent.stop(e);
		e.preventDefault();

		var point = this.getMouse(e);

		var y = point.y;
		var x = point.x;
		
		if (this.firstX == -1) {
			this.firstX = x;
			this.firstY = y;
			
			this.ox = this.thumb.offsetLeft;
			this.oy = this.thumb.offsetTop;
		}		

		x = (x - this.firstX) + this.ox;
		y = (y - this.firstY) + this.oy;
		
		if (x > 4 || y > 4)
			this.moved = true;
		
		var t = this.thumb.offsetWidth;
		var w = this.container.offsetWidth - t;

		if (x < 0)
			x = 0;
		else if (x > w)
			x = w;

		if (!this.snap)
			this.moveTo(x);

		this.setValue((x / w) * this.range + this.min, !this.snap);
	},
	/**
	 * @memberOf joSlider
	 * @param {} x
	 * @return {Object}
	 */
	moveTo: function(x) {
		this.thumb.style.left = x + "px";
		
		return this;
	},
	/**
	 * @memberOf joSlider
	 * @param {} value
	 * @return {Object}
	 */
	initValue: function(value) {
		if (!this.container)
			return this;
		
		var t = this.container.firstChild.offsetWidth;
		var w = this.container.offsetWidth - t;

		var x = Math.floor((Math.abs(this.min-this.value) / this.range) * w);
		
		this.moveTo(x);
		
		return this;
	},
	/**
	 * @memberOf joSlider
	 * @param {} e
	 */
	onUp: function (e) {
		if (!this.inMotion)
			return;

		joEvent.remove(document.body, "mousemove", this.mousemove);
		joEvent.remove(document.body, "mouseup", this.mouseup, true);
		this.mousemove = null;

		joEvent.stop(e);
		joEvent.preventDefault(e);
		
		joDefer(function() {
			this.reset();
			this.slideEndEvent.fire(this.value);
		}, this);
	},
	/**
	 * @memberOf joSlider
	 */
	setEvents: function() {
		joEvent.on(this.container, "click", this.onClick, this);
		joEvent.on(this.thumb, "mousedown", this.onDown, this);
		
		// we have to adjust if the window changes size
		joGesture.resizeEvent.subscribe(this.draw, this);
	},
	/**
	 * @memberOf joSlider
	 * @param {} e
	 */
	onClick: function(e) {
		if (this.inMotion || this.moved)
			return;
		
		joEvent.stop(e);
		joEvent.preventDefault(e);
		
		var point = this.getMouse(e);
		var x = Math.floor(point.x);
		var t = this.thumb.offsetWidth;

		joDOM.removeCSSClass(this.container, "live");
		
		x = x - t;
		
		var w = this.container.offsetWidth - t;

		if ((x < t && this.snap) || x < 0)
			x = 0;
		else if (x > w)
			x = w;

		this.setValue((x / w) * this.range + this.min);
	},
	/**
	 * @memberOf joSlider
	 * @param {} e
	 * @return {Object}
	 */
	getMouse: function(e) {
		return { 
			x: (this.horizontal) ? e.screenX : 0,
			y: (this.vertical) ? e.screenY : 0
		};
	},
	/**
	 * @memberOf joSlider
	 */
	draw: function() {
		if (!this.container)
			return;
			
		this.initValue(this.getValue());
	}
});


/**
	joImage
	=======
	
	Convenience wrapper for an image tag, handles image load
	and failure.
	
	Extends
	-------
	
	- joControl
	
	Methods
	-------

	- `setData(image)`
	
	  `image` can be a URL (including local files), base64 image data
	  string, or a reference to an `Image` object.
	  
	Events
	------
	
	- `loadEvent()`
	- `errorEvent()`
	
*/
/**
 * Convenience wrapper for an image tag, handles image load
 *	and failure.
 * @constructor
 * @extends joLabel
 * @param {} url
 */
function joImage(url) {
	var container = new Image();

	this.image = container;
	this.container = container;
	var self = this;

	/**
	 * @event loadEvent
	 */
	this.loadEvent = new joSubject(this);
	/**
	 * @event errorEvent
	 */
	this.errorEvent = new joSubject(this);

	function onload() {
		self.loadEvent.fire();
	}

	function onerror() {
		self.errorEvent.fire();
	}

	container.onload = onload;
	container.onerror = onerror;
	container.src = url;
}
joImage.extend(joLabel, {
	tagName: "img",
	/**
	 * `image` can be a URL (including local files), base64 image data
	 * string, or a reference to an `Image` object.
	 * @memberOf joImage
	 * @param {} image
	 */
	setImage: function(image) {
//		console.log("image", image);
		this.container.src = "url(" + image + ")";
	}
});


/**
	joCanvas
	========

	Simple canvas wrapper control.
*/
/**
 * Simple canvas wrapper control.
 * @constructor
 * @param {} w
 * @param {} h
 */
function joCanvas(w, h) {
	this.canvas = joDOM.create("canvas");

	if (this.canvas)
		this.ctx = this.canvas.getContext("2d");

	this.ctx.imageSmoothingEnabled = false;
	this.ctx.mozImageSmoothingEnabled = false;
	this.ctx.oImageSmoothingEnabled = false;
	this.ctx.webkitImageSmoothingEnabled = false;

	if (w || h)
		this.setSize(w, h);
}
joCanvas.prototype = {
	getImage: function() {
		return this.canvas.toDataURL();
	},

	getCSSImage: function() {
		return "url(" + this.canvas.toDataURL() + ")";
	},

	clear: function() {
		this.ctx.clearRect(0, 0, this.width, this.height);
	},

	setSize: function(w, h) {
		if (!w)
			w = 50;

		if (!h)
			h = 50;

		this.canvas.setAttribute("width", w);
		this.canvas.setAttribute("height", h);

		this.width = w;
		this.height = h;

		return this;
	},

	getContext: function() {
		return this.ctx;
	},

	roundRect: function(sx, sy, ex, ey, r) {
		var r2d = Math.PI / 180;

		if ((ex - sx) - (2 * r) < 0)
			r = ((ex - sx) / 2);

		if ((ey - sy) - (2 * r) < 0 )
			r = ((ey - sy) / 2);

		var ctx = this.ctx;

		ctx.beginPath();
		ctx.moveTo(sx + r, sy);
		ctx.lineTo(ex - r, sy);
		ctx.arc(ex - r, sy + r, r, r2d * 270, r2d * 360);
		ctx.lineTo(ex, ey - r);
		ctx.arc(ex - r, ey - r, r, 0, r2d * 90);
		ctx.lineTo(sx + r, ey);
		ctx.arc(sx + r, ey - r, r, r2d * 90, r2d * 180);
		ctx.lineTo(sx, sy + r);
		ctx.arc(sx + r, sy + r, r, r2d * 180, r2d * 270);
		ctx.closePath();

		return this;
	},

	setFont: function(font) {
		this.ctx.font = font;

		return this;
	},

	ellipse: function(sx, sy, r) {
		this.ctx.beginPath();
		this.ctx.arc(sx, sy, r, 0, Math.PI * 2);
		this.ctx.closePath();

		return this;
	},

	getNode: function() {
		return this.canvas;
	}
};


