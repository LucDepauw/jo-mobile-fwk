/**
	joSelectList
	============
	
	A selection list of options used by joSelect.
	
	Extends
	-------
	
	- joList
*/
/**
 * A selection list of options used by joSelect.
 * @constructor
 * @extends joList
 */
joSelectList = function() {
	joList.apply(this, arguments);
};
joSelectList.extend(joList, {
	tagName: "joselectlist"
});
