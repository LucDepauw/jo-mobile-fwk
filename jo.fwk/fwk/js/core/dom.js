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

