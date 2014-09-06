/**
	joGroup
	=======
	
	Group of controls, purely visual.
	
	Extends
	-------

	- joContainer
	
*/
/**
 * Group of controls, purely visual.
 * @constructor
 * @extends joContainer
 * @param {} data
 */
joGroup = function(data) {
	joContainer.apply(this, arguments);
};
joGroup.extend(joContainer, {
	tagName: "jogroup"
});
