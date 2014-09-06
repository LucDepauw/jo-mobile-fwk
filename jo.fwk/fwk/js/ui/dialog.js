/**
	joDialog
	========
	
	This is a higher level container that wraps a joPopup with a joShim.
*/
/**
 * This is a higher level container that wraps a joPopup with a joShim.
 * @constructor
 * @extends joShim
 * @param {} data
 */
joDialog = function(data) {
	joShim.call(this, new joFlexcol([
		'',
		new joPopup(
			new joScroller(data)
		).setStyle("show"),
		''
	]));
};
joDialog.extend(joShim, {
});
