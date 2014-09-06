/**
	joTabBar
	=========
	
	Tab bar widget.
	
	Extends
	-------
	
	- joList

	Model
	-----
	
	Data is expected to be an array of `{ type: "", label: ""}` objects,
	in the display order for the bar.

*/
/**
 * Tab bar widget.
 * Data is expected to be an array of `{ type: "", label: ""}` objects,
 *	in the display order for the bar.
 * @constructor
 * @extends joList
 */
joTabBar = function() {
	joList.apply(this, arguments);
};
joTabBar.extend(joList, {
	tagName: "jotabbar",
	/**
	 * @memberOf joTabBar
	 * @param {} data
	 * @param {} index
	 * @return {Object}
	 */
	formatItem: function(data, index) {
		var o = document.createElement("jotab");

		if (data.label)
			o.innerHTML = data.label;
		
		if (data.type)
			o.className = data.type;

		o.setAttribute("index", index);
		
		return o;
	}
});
