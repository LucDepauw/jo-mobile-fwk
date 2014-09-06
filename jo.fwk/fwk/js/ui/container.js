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
