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
