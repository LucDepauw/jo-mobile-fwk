/**
	joTitle
	=======
	
	Title view, purely a visual presentation.
	
	Extends
	-------
	
	- joContainer

*/
/**
 * Title view, purely a visual presentation.
 * @constructor
 * @extends joView
 * @param {} data
 */
joTitle = function(data) {
	joView.apply(this, arguments);
};
joTitle.extend(joView, {
	tagName: "jotitle"
});

