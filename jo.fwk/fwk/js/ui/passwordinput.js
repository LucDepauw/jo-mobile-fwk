/**
	joPasswordInput
	===============
	
	Secret data input field (e.g. displays `******` instead of `secret`).
	
	Extends
	-------
	
	- joInput
	
	> Note that this requires CSS3 which is known not to be currently supported
	> in Opera or Internet Explorer.

*/
/**
 * Secret data input field (e.g. displays `******` instead of `secret`).
 * <b>Note:</b> that this requires CSS3 which is known not to be currently supported
 * in Opera or Internet Explorer.
 * @constructor
 * @extends joInput
 * @param {} data
 */
joPasswordInput = function(data) {
	joInput.apply(this, arguments);
};
joPasswordInput.extend(joInput, {
	className: "password",
	type: "password"
});

