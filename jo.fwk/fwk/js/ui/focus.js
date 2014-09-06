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

