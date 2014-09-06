/**
	joToolbar
	=========

	Locks UI controls to the bottom of whatever you put this container into.
	
	Extends
	-------
	
	- joContainer

*/
/**
 * Locks UI controls to the bottom of whatever you put this container into.
 * @constructor
 * @extends joContainer
 * @param {} data
 */
joToolbar = function(data) {
	joContainer.apply(this, arguments);
};
joToolbar.extend(joContainer, {
	tagName: "jotoolbar"
});
