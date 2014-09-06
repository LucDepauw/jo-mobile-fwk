/**
 * JoQueue
 * @constructor
 */
joQueue = function() {
	this.queue = [];

	this.doneEvent = new joSubject(this);
};
joQueue.prototype = {
	/**
	 * @memberOf joQueue
	 * @param {} call
	 * @param {} delay
	 * @param {} context
	 * @param {} data
	 */
	push: function(call, delay, context, data) {
		this.queue.push({
			delay: delay,
			call: call,
			context: context,
			data: data
		});
	},
	/**
	 * @memberOf joQueue
	 */
	tick: function() {
		var t = (new Date() * 1);

		if (this.next == 0 || t >= this.next) {
			var c = this.queue.shift();
			if (c.context)
				c.call.call(c.context, c.data || null);
			else
				c.call(c.data || null);

			if (this.queue.length)
				this.next = t + this.queue[0].delay;
		}

		if (this.queue.length) {
			var self = this;
			window.requestAnimationFrame(function() {
				self.tick.call(self);
			});
		}
		else {
			this.stop();
		}
	},
	/**
	 * @memberOf joQueue
	 * @return {}
	 */
	start: function() {
		this.working = true;
		this.next = 0;

		if (this.queue.length) {
			joDefer(this.tick, this);
		}

		return this;
	},
	/**
	 * @memberOf joQueue
	 */
	stop: function() {
		this.working = false;
		this.next = 0;

		this.doneEvent.fire();
	},
	/**
	 * @memberOf joQueue
	 * @param {} last
	 * @return {Object}
	 */
	getElapsed: function(last) {
		return (new Date() * 1) - last;
	},
	/**
	 * @memberOf joQueue
	 * @return {Object}
	 */
	getTime: function() {
		return (new Date() * 1);
	},
	/**
	 * @memberOf joQueue
	 * @param {} time
	 * @return {Object}
	 */
	setLast: function(time) {
		if (!time)
			time = (new Date() * 1);

		this.last = time;

		return this;
	}
};


