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
