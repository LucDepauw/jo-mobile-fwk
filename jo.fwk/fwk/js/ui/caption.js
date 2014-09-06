/**
	joCaption
	=========
	
	Basically, a paragraph of text.
	
	Extends
	-------
	
	- joControl
	
*/
/**
 * Basically, a paragraph of text.
 * @constructor
 * @extends joControl
 * @param {} data
 */
joCaption = function(data) {
	joControl.apply(this, arguments);
};
joCaption.extend(joControl, {
	tagName: "jocaption"
});

