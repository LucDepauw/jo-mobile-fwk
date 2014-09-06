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
