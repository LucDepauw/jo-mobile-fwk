/**
	joLabel
	=======
	
	Label view, purely a visual presentation. Usually placed in front
	of input fields and other controls.
	
	Extends
	-------
	
	- joView
	
*/
/**
 * Label view, purely a visual presentation. Usually placed in front
 *	of input fields and other controls.
 * @constructor
 * @extends joControl
 * @param {} data
 */
joLabel = function(data) {
	joControl.apply(this, arguments);
};
joLabel.extend(joControl, {
	tagName: "jolabel"
});

