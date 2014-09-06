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
