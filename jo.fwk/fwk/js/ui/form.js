/**
 * @constructor
 * @extends joContainer
 * @since 0.5.0
 */
joForm = function() {
	joContainer.apply(this, arguments);
};
joForm.extend(joContainer, {
	tagName: "form"
});