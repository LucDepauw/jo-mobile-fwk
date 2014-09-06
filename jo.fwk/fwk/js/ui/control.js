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
