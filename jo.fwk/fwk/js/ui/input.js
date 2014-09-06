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

