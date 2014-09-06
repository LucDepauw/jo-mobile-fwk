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
