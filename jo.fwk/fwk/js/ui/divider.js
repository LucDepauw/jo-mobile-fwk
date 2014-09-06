/**
	joDivider
	=========
	
	Simple visual divider.
	
	Extends
	-------
	
	- joView

*/
/**
 * Simple visual divider.
 * @constructor
 * @extends joView
 * @param {} data
 */
joDivider = function(data) {
	joView.apply(this, arguments);
};
joDivider.extend(joView, {
	tagName: "jodivider"
});

