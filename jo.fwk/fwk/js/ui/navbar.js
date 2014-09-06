/**
	joNavbar
	========
	
	Floating navigation control. Usually tied to a joStack or joStackScroller.
	Will handle display of a "back" button (controllable in CSS) and show the
	title string of the current view in a stack (if it exists).

	Use
	---
	
		// make a stack
		var stack = new joStackScroller();
		
		// new navbar
		var x = new joNavbar();
		
		// link to a stack
		x.setStack(stack);
		
	Methods
	-------
	
	- `back()`
	
	  Signals the associated stack to move back in its stack (i.e. calls
	  the stack's `pop()` method).
	
	- `setStack(joStack or joStackScroller)`
	
	  Links this control to a stack.
	
*/
/**
 * 	Floating navigation control. Usually tied to a joStack or joStackScroller.
 *	Will handle display of a "back" button (controllable in CSS) and show the
 * 	title string of the current view in a stack (if it exists).
 * @constructor
 * @extends joContainer
 * @param {} title
 * @example
 * <pre>
 * 		// make a stack
 *		var stack = new joStackScroller();
 *		
 *		// new navbar
 *		var x = new joNavbar();
 *		
 *		// link to a stack
 *		x.setStack(stack);
 * </pre>
 */
joNavbar = function(title) {
	if (title)
		this.firstTitle = title;
	
	var ui = [
		this.titlebar = new joView(title || '&nbsp;').setStyle('title'),
		new joFlexrow([this.back = new joBackButton('Back').selectEvent.subscribe(this.back, this), ""])
	];
	
	joContainer.call(this, ui);
};

joNavbar.extend(joContainer, {
	tagName: "jonavbar",
	stack: null,
	/**
	 * Signals the associated stack to move back in its stack (i.e. calls
	 * the stack's `pop()` method).
	 * @memberOf joNavbar
	 * @return {Object}
	 */
	back: function() {
		if (this.stack)
			this.stack.pop();

		return this;
	},
	/**
	 * Links this control to a stack.
	 * @memberOf joNavbar
	 * @param {} stack
	 * @return {Object}
	 */
	setStack: function(stack) {
		if (this.stack) {
			this.stack.pushEvent.unsubscribe(this.update, this);
			this.stack.popEvent.unsubscribe(this.update, this);
		}
		
		if (!stack) {
			this.stack = null;
			return this;
		}
		
		this.stack = stack;
		
		stack.pushEvent.subscribe(this.update, this);
		stack.popEvent.subscribe(this.update, this);

		this.refresh();
		
		return this;
	},
	/**
	 * Update
	 * @memberOf joNavbar
	 * @return {}
	 */
	update: function() {
		if (!this.stack)
			return this;
		
		joDOM.removeCSSClass(this.back, 'selected');
		joDOM.removeCSSClass(this.back, 'focus');

//		console.log('update ' + this.stack.data.length);
		
		if (this.stack.data.length > 1)
			joDOM.addCSSClass(this.back, 'active');
		else
			joDOM.removeCSSClass(this.back, 'active');
			
		var title = this.stack.getTitle();

		if (typeof title === 'string')
			this.titlebar.setData(title);
		else
			this.titlebar.setData(this.firstTitle);
			
		return this;
	},
	/**
	 * Set the title
	 * @memberOf joNavbar
	 * @param {} title
	 * @return {Object}
	 */
	setTitle: function(title) {
		this.titlebar.setData(title);
		this.firstTitle = title;
		
		return this;
	}
});


/**
	joBackButton
	============
	
	A "back" button, which can be made to be shown only in appropriate
	platforms (e.g. iOS, Safari, Chrome) through CSS styling.
	
	See joNavbar for more information.
	
	Extends
	-------
	
	- joButton
	
*/
/**
 * A "back" button, which can be made to be shown only in appropriate
 *	platforms (e.g. iOS, Safari, Chrome) through CSS styling.
 * @constructor
 * @extends joButton
 * @see joNavbar
 */
joBackButton = function() {
	joButton.apply(this, arguments);
};
joBackButton.extend(joButton, {
	tagName: "jobackbutton"
});


