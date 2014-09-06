/**
	joSlider
	========
	
	Slider control, horizontal presentation (may be extended later to allow for
	vertical and x/y).
	
	Extends
	-------
	
	- joControl
	
	Methods
	-------
	
	- `setRange(min, max, snap)`
	
	Where `min`/`max` is a number, either integer or decimal, doesn't matter. If `max`
	and `min` are integers, then `snap` defaults to `1`, otherwise it is set to `0` (no
	snap, which allows free movement).
	
	The optional `snap` value adjusts the granularuty of choices. Set to `0` for
	free-floating, or any other positive number. Any `snap` that is less than `0`
	or greater than the total range of possible values will be ignored.
	
	Use
	---
	
		// basic slider, will allow any decimal value
		// between 0 and 1, defaults to 0
		var x = new joSlider();
		
		// custom range and default value set
		var y = new joSlider(0).setRange(-10, 10);
		
		// percent slider, with 5% snap
		var z = new joSlider(0).setRange(0, 100, 5);
		
		// responding to change events
		var r = new joSlider().changEvent.subscribe(function(value) {
			console.log(value);
		}, this);

*/
/**
 * Slider control, horizontal presentation (may be extended later to allow for
 *	vertical and x/y).
 * @constructor
 * @extends joControl
 * @param {} value
 * @example
 * <pre>
 * 		// basic slider, will allow any decimal value
 *		// between 0 and 1, defaults to 0
 *		var x = new joSlider();
 *		
 *		// custom range and default value set
 *		var y = new joSlider(0).setRange(-10, 10);
 *		
 *		// percent slider, with 5% snap
 *		var z = new joSlider(0).setRange(0, 100, 5);
 *		
 *		// responding to change events
 *		var r = new joSlider().changEvent.subscribe(function(value) {
 *			console.log(value);
 *		}, this);
 *
 * </pre>
 */
joSlider = function(value) {
	this.min = 0;
	this.max = 1;
	this.snap = 0;
	this.range = 1;
	this.thumb = null;
	this.horizontal = 1;
	this.vertical = 0;
	this.moved = false;
	this.jump = true;
	/**
	 * @event slideStartEvent
	 */
	this.slideStartEvent = new joSubject();
	/**
	 * @event slideEndEvent
	 */
	this.slideEndEvent = new joSubject();

	joControl.call(this, null, value);
};
joSlider.extend(joControl, {
	tagName: "joslider",
	/**
	 * 	Where `min`/`max` is a number, either integer or decimal, doesn't matter. If `max`
	 * and `min` are integers, then `snap` defaults to `1`, otherwise it is set to `0` (no
	 * snap, which allows free movement).
	 *
	 * The optional `snap` value adjusts the granularuty of choices. Set to `0` for
	 * free-floating, or any other positive number. Any `snap` that is less than `0`
	 * or greater than the total range of possible values will be ignored.
	 * @memberOf joSlider
	 * @param {} min
	 * @param {} max
	 * @param {} snap
	 * @return {Object}
	 */
	setRange: function(min, max, snap) {
		if (min >= max) {
			joLog("WARNING: joSlider.setRange, min must be less than max.");
			return this;
		}
		
		this.min = min || 0;
		this.max = max || 1;
		
		if (min < 0 && max >= 0)
			this.range = Math.abs(min) + max;
		else if (min < 0 && max <= 0)
			this.range = min - max;
		else
			this.range = max - min;

		if (typeof snap !== 'undefined')
			this.snap = (snap >= 0 && snap <= this.range) ? snap : 0;
		else
			this.snap = 0;
			
		this.setValue(this.value);
			
		return this;
	},
	/**
	 * @memberOf joSlider
	 * @param {} value
	 * @param {} silent
	 * @return {Object}
	 */
	setValue: function(value, silent) {
		var v = this.adjustValue(value);
		
		if (v != this.value) {
			joControl.prototype.setValue.call(this, v);
			if (!silent)
				this.draw();
		}
			
		return this;
	},
	/**
	 * @memberOf joSlider
	 * @param {} v
	 * @return {Object}
	 */
	adjustValue: function(v) {
		var value = v;
		
		if (this.snap)
			value = Math.floor(value / this.snap) * this.snap;

		if (value < this.min)
			value = this.min;
		else if (value > this.max)
			value = this.max;
			
		return value;
	},
	/**
	 * @memberOf joSlider
	 * @return {Object}
	 */
	createContainer: function() {
		var o = joDOM.create(this.tagName);

		if (o)
			o.setAttribute("tabindex", "1");
			
		var t = joDOM.create("josliderthumb");
		o.appendChild(t);
		this.thumb = t;
		
		return o;
	},
	/**
	 * @memberOf joSlider
	 * @param {} e
	 */	
	onDown: function(e) {
		joEvent.stop(e);

		this.reset();
		joDOM.addCSSClass(this.container, "live");
				
		var node = this.container.firstChild;
		
		this.inMotion = true;
		this.moved = false;
		this.slideStartEvent.fire(this.value);

		if (!this.mousemove) {
			this.mousemove = joEvent.on(document.body, "mousemove", this.onMove, this);
			this.mouseup = joEvent.capture(document.body, "mouseup", this.onUp, this);
		}
	},
	/**
	 * @memberOf joSlider
	 */
	reset: function() {
		this.moved = false;
		this.inMotion = false;
		this.firstX = -1;
		this.firstY = -1;
	},
	/**
	 * @memberOf joSlider
	 * @param {} e
	 */
	onMove: function(e) {
		if (!this.inMotion)
			return;

		joEvent.stop(e);
		e.preventDefault();

		var point = this.getMouse(e);

		var y = point.y;
		var x = point.x;
		
		if (this.firstX == -1) {
			this.firstX = x;
			this.firstY = y;
			
			this.ox = this.thumb.offsetLeft;
			this.oy = this.thumb.offsetTop;
		}		

		x = (x - this.firstX) + this.ox;
		y = (y - this.firstY) + this.oy;
		
		if (x > 4 || y > 4)
			this.moved = true;
		
		var t = this.thumb.offsetWidth;
		var w = this.container.offsetWidth - t;

		if (x < 0)
			x = 0;
		else if (x > w)
			x = w;

		if (!this.snap)
			this.moveTo(x);

		this.setValue((x / w) * this.range + this.min, !this.snap);
	},
	/**
	 * @memberOf joSlider
	 * @param {} x
	 * @return {Object}
	 */
	moveTo: function(x) {
		this.thumb.style.left = x + "px";
		
		return this;
	},
	/**
	 * @memberOf joSlider
	 * @param {} value
	 * @return {Object}
	 */
	initValue: function(value) {
		if (!this.container)
			return this;
		
		var t = this.container.firstChild.offsetWidth;
		var w = this.container.offsetWidth - t;

		var x = Math.floor((Math.abs(this.min-this.value) / this.range) * w);
		
		this.moveTo(x);
		
		return this;
	},
	/**
	 * @memberOf joSlider
	 * @param {} e
	 */
	onUp: function (e) {
		if (!this.inMotion)
			return;

		joEvent.remove(document.body, "mousemove", this.mousemove);
		joEvent.remove(document.body, "mouseup", this.mouseup, true);
		this.mousemove = null;

		joEvent.stop(e);
		joEvent.preventDefault(e);
		
		joDefer(function() {
			this.reset();
			this.slideEndEvent.fire(this.value);
		}, this);
	},
	/**
	 * @memberOf joSlider
	 */
	setEvents: function() {
		joEvent.on(this.container, "click", this.onClick, this);
		joEvent.on(this.thumb, "mousedown", this.onDown, this);
		
		// we have to adjust if the window changes size
		joGesture.resizeEvent.subscribe(this.draw, this);
	},
	/**
	 * @memberOf joSlider
	 * @param {} e
	 */
	onClick: function(e) {
		if (this.inMotion || this.moved)
			return;
		
		joEvent.stop(e);
		joEvent.preventDefault(e);
		
		var point = this.getMouse(e);
		var x = Math.floor(point.x);
		var t = this.thumb.offsetWidth;

		joDOM.removeCSSClass(this.container, "live");
		
		x = x - t;
		
		var w = this.container.offsetWidth - t;

		if ((x < t && this.snap) || x < 0)
			x = 0;
		else if (x > w)
			x = w;

		this.setValue((x / w) * this.range + this.min);
	},
	/**
	 * @memberOf joSlider
	 * @param {} e
	 * @return {Object}
	 */
	getMouse: function(e) {
		return { 
			x: (this.horizontal) ? e.screenX : 0,
			y: (this.vertical) ? e.screenY : 0
		};
	},
	/**
	 * @memberOf joSlider
	 */
	draw: function() {
		if (!this.container)
			return;
			
		this.initValue(this.getValue());
	}
});

