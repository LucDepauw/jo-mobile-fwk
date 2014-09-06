/**
	joStack
	========
	
	A UI container which keeps an array of views which can be pushed and popped.
	The DOM elements for a given view are removed from the DOM tree when popped
	so we keep the render tree clean.

	Extends
	-------
	
	- joView

	Methods
	-------
	
	- `push(joView | HTMLElement)`	
	
	  Pushes a new joView (or HTMLELement) onto the stack.
	
	- `pop()`
	
	  Pulls the current view off the stack and goes back to the previous view.

	- `home()`
	
	  Return to the first view, pop everything else off the stack.

	- `show()`
	- `hide()`

	  Controls the visibility of the entire stack.

	- `forward()`
	- `back()`
	
	  Much like your browser forward and back buttons, only for the stack.
	
	- `setLocked(boolean)`
	
	  The `setLocked()` method tells the stack to keep the first view pushed onto the
	  stack set; that is, `pop()` won't remove it. Most apps will probably use this,
	  so setting it as a default for now.
	
	Events
	------
	
	- `showEvent`
	- `hideEvent`
	- `homeEvent`
	- `pushEvent`
	- `popEvent`
	
	Notes
	-----
	
	Should set classNames to new/old views to allow for CSS transitions to be set
	(swiping in/out, cross fading, etc). Currently, it does none of this.
	
	Also, some weirdness with the new `forward()` and `back()` methods in conjuction
	with `push()` -- need to work on that, or just have your app rigged to `pop()`
	on back to keep the nesting simple.
	
*/
/**
 * A UI container which keeps an array of views which can be pushed and popped.
 *	The DOM elements for a given view are removed from the DOM tree when popped
 *	so we keep the render tree clean.
 * @constructor
 * @extends joContainer
 * @param {} data
 */
joStack = function(data) {
	this.visible = false;

	if (data) {
		if (!(data instanceof Array))
			data = [ data ];
		else if (data.length > 1)
			data = [ data[0] ];
	}

	if (this.container && this.container.firstChild)
		this.container.innerHTML = "";

	// default to keep first card on the stack; won't pop() off
	this.setLocked(true);
	/**
	 * @event pushEvent
	 */
	this.pushEvent = new joSubject(this);
	/**
	 * @event popEvent
	 */
	this.popEvent = new joSubject(this);
	/**
	 * @event homeEvent
	 */
	this.homeEvent = new joSubject(this);
	/**
	 * @event showEvent
	 */
	this.showEvent = new joSubject(this);
	/**
	 * @event hideEvent
	 */
	this.hideEvent = new joSubject(this);
	/**
	 * @event backEvent
	 */
	this.backEvent = new joSubject(this);
	/**
	 * @event forwardEvent
	 */
	this.forwardEvent = new joSubject(this);

	joContainer.call(this, data || []);

	this.index = 0;
	this.lastIndex = 0;
	this.lastNode = null;
};
joStack.extend(joContainer, {
	tagName: "jostack",
	type: "fixed",
	/**
	 * @memberOf joStack
	 */
	setEvents: function() {
		// do not setup DOM events for the stack
	},
	/**
	 * @memberOf joStack
	 * @param {} e
	 */
	onClick: function(e) {
		joEvent.stop(e);
	},
	/**
	 * @memberOf joStack
	 * @return {}
	 */
	forward: function() {
		if (this.index < this.data.length - 1) {
			this.index++;
			this.draw();
			this.forwardEvent.fire();
		}
		
		return this;
	},
	/**
	 * @memberOf joStack
	 * @return {Object}
	 */
	back: function() {
		if (this.index > 0) {
			this.index--;
			this.draw();
			this.backEvent.fire();
		}
		
		return this;
	},
	/**
	 * @memberOf joStack
	 */
	draw: function() {
		if (!this.container)
			this.createContainer();
			
		if (!this.data || !this.data.length)
			return;

		// short term hack for webos
		// not happy with it but works for now
		jo.flag.stopback = this.index ? true : false;

		var container = this.container;
		var oldchild = this.lastNode;
		var newnode = getnode(this.data[this.index]);
		var newchild = this.getChildStyleContainer(newnode);

		function getnode(o) {
			return (o instanceof joView) ? o.container : o;
		}
		
		if (!newchild)
			return;
		
		var oldclass, newclass;
		
		if (this.index > this.lastIndex) {
			oldclass = "prev";
			newclass = "next";
			joDOM.addCSSClass(newchild, newclass);
		}
		else if (this.index < this.lastIndex) {
			oldclass = "next";
			newclass = "prev";
			joDOM.addCSSClass(newchild, newclass);
		}

		this.appendChild(newnode);

		var self = this;
		var transitionevent = null;

		joDefer(animate, this, 20);
		
		function animate() {
			// FIXME: AHHH must have some sort of transition for this to work,
			// need to check computed style for transition to make this
			// better
			if (typeof window.onwebkittransitionend !== 'undefined')
				transitionevent = joEvent.on(newchild, joEvent.map.transitionend, cleanup, self);
			else
				joDefer(cleanup, this, 500);

			if (newclass && newchild)
				joDOM.removeCSSClass(newchild, newclass);

			if (oldclass && oldchild)
				joDOM.addCSSClass(oldchild, oldclass);
		}
		
		function cleanup() {
			if (oldchild) {
				joDOM.removeCSSClass(oldchild, "next");
				joDOM.removeCSSClass(oldchild, "prev");
				self.removeChild(oldchild);
			}

			if (newchild) {
				if (transitionevent)
					joEvent.remove(newchild, joEvent.map.transitionend, transitionevent);

				joDOM.removeCSSClass(newchild, "next");
				joDOM.removeCSSClass(newchild, "prev");
			}
		}

		if (typeof this.data[this.index].activate !== "undefined")
			this.data[this.index].activate.call(this.data[this.index]);
		
		this.lastIndex = this.index;
		this.lastNode = newchild;
		
		return this;
	},
	/**
	 * @memberOf joStack
	 * @param {} child
	 */
	appendChild: function(child) {
		this.container.appendChild(child);
	},
	/**
	 * @memberOf joStack
	 * @param {} child
	 * @return {Object}
	 */
	getChildStyleContainer: function(child) {
		return child;
	},
	/**
	 * @memberOf joStack
	 * @return {Object}
	 */
	getChild: function() {
		return this.container.firstChild;
	},
	/**
	 * @memberOf joStack
	 * @return {Object}
	 */
	getContentContainer: function() {
		return this.container;
	},
	/**
	 * @memberOf joStack
	 * @param {} child
	 */
	removeChild: function(child) {
		if (child && child.parentNode === this.container)
			this.container.removeChild(child);
	},
	/**
	 * @memberOf joStack
	 * @return {}
	 */
	isVisible: function() {
		return this.visible;
	},
	
	/**
	 * Pushes a new joView (or HTMLELement) onto the stack.
	 * @memberOf joStack
	 * @param {joView|HTMLElement} o
	 * @return {Object}
	 */
	push: function(o) {
		if (typeof o === "string")
			o = joDOM.get(o);

//		if (!this.data || !this.data.length || o !== this.data[this.data.length - 1])
//			return;

		// don't push the same view we already have
		if (this.data && this.data.length && this.data[this.data.length - 1] === o)
			return this;
			
		this.data.push(o);
		this.index = this.data.length - 1;
		this.draw();
		this.pushEvent.fire(o);

		this.captureBack();
		
		return this;
	},

	/**
	 * lock the stack so the first pushed view stays put
	 * @memberOf joStack
	 * @param {} state
	 * @return {Object}
	 */
	setLocked: function(state) {
		this.locked = (state) ? 1 : 0;
		
		return this;
	},
	/**
	 * Pulls the current view off the stack and goes back to the previous view.
	 * @memberOf joStack
	 * @return {Object}
	 */
	pop: function() {
		if (this.data.length > this.locked) {
			var o = this.data.pop();
			this.index = this.data.length - 1;

			this.draw();
			
			if (typeof o.deactivate === "function")
				o.deactivate.call(o);

			if (!this.data.length)
				this.hide();
		}

		this.captureBack();

		if (this.data.length > 0)
			this.popEvent.fire();
			
		return this;
	},
	/**
	 * Return to the first view, pop everything else off the stack.
	 * @memberOf joStack
	 * @return {Object}
	 */
	home: function() {
		if (this.data && this.data.length && this.data.length > 1) {
			var o = this.data[0];
			var c = this.data[this.index];
			
			if (o === c)
				return this;
			
			this.data = [o];
			this.lastIndex = 1;
			this.index = 0;
//			this.lastNode = null;
			this.draw();

			this.captureBack();
						
			this.popEvent.fire();
			this.homeEvent.fire();
		}
		
		return this;
	},
	/**
	 * @memberOf joStack
	 * @return {Object}
	 */
	showHome: function() {
		this.home();
		
		if (!this.visible) {
			this.visible = true;
			joDOM.addCSSClass(this.container, "show");
			this.showEvent.fire();
		}
		
		return this;
	},
	/**
	 * @memberOf joStack
	 * @return {Object}
	 */
	getTitle: function() {
		var c = this.data[this.index];
		if (typeof c.getTitle === 'function')
			return c.getTitle();
		else
			return false;
	},
	/**
	 * Controls the visibility of the entire stack.
	 * @memberOf joStack
	 * @return {Object}
	 */
	show: function() {
		if (!this.visible) {
			this.visible = true;
			joDOM.addCSSClass(this.container, "show");

			joDefer(this.showEvent.fire, this.showEvent, 500);
		}
		
		return this;
	},
	/**
	 * @memberOf joStack
	 * @return {Object}
	 */
	hide: function() {
		if (this.visible) {
			this.visible = false;
			joDOM.removeCSSClass(this.container, "show");			

			joDefer(this.hideEvent.fire, this.hideEvent, 500);
		}
		
		return this;
	},
	/**
	 * @memberOf joStack
	 */
	captureBack: function() {
		if (this.index > 0)
			joGesture.backEvent.capture(this.pop, this);
		else if (this.index <= 0)
			joGesture.backEvent.release(this.pop, this);
	}
});
