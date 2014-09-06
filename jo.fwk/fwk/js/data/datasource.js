/**
	joDataSource
	=============

	Wraps data acquisition in an event-driven class. Objects can
	subscribe to the `changeEvent` to update their own data.

	This base class can be used as-is as a data dispatcher, but is
	designed to be extended to handle asynchronous file or SQL queries.

	Methods
	-------
	- `set()`
	- `get()`
	- `clear()`
	- `setQuery(...)`
	- `getQuery()`
	- `load()`
	- `refresh()`

	Events
	------

	- `changeEvent`
	- `errorEvent`
	
	> Under construction, use with care.
	
*/
/**
 * Wraps data acquisition in an event-driven class. Objects can
 *	subscribe to the `changeEvent` to update their own data.
 *
 *	This base class can be used as-is as a data dispatcher, but is
 *	designed to be extended to handle asynchronous file or SQL queries.
 * @constructor
 * @param {} data
 */
joDataSource = function(data) {
	this.changeEvent = new joSubject(this);	
	this.errorEvent = new joSubject(this);

	if (typeof data !== "undefined")
		this.setData(data);
	else
		this.data = "";
};
joDataSource.prototype = {
	/**
	 * 
	 * @type Boolean
	 */
	autoSave: true,
	/**
	 * 
	 * @type  Object
	 */
	data: null,
	/**
	 * 
	 * @param {} query
	 * @return {Object}
	 */
	setQuery: function(query) {
		this.query = query;
		
		return this;
	},
	/**
	 * 
	 * @param {} state
	 * @return {Object}
	 */
	setAutoSave: function(state) {
		this.autoSave = state;
		
		return this;
	},
	/**
	 * 
	 * @param {} data
	 * @return {Object}
	 */
	setData: function(data) {
		var last = this.data;
		this.data = data;

		if (data !== last)
			this.changeEvent.fire(data);
			
		return this;
	},
	/**
	 * 
	 * @return {Object}
	 */
	getData: function() {
		return this.data;
	},
	/**
	 * 
	 * @return {Object}
	 */
	getDataCount: function() {
		return this.getData().length;
	},
	/**
	 * 
	 * @return {Object}
	 */
	getPageCount: function() {
		if (this.pageSize)
			return Math.floor(this.getData().length / this.pageSize) + 1;
		else
			return 1;
	},
	/**
	 * 
	 * @param {} index
	 * @return {Object}
	 */
	getPage: function(index) {
		var start = index * this.pageSize;
		var end = start + this.pageSize;
		
		if (end > this.getData().length)
			end = this.getData().length;
			
		if (start < 0)
			start = 0;

		return this.data.slice(start, end);
	},
	/**
	 * Refresh
	 */
	refresh: function() {
		// needs to make a new query object
	},
	/**
	 * 
	 * @param {} length
	 * @return {Object}
	 */
	setPageSize: function(length) {
		this.pageSize = length;
		
		return this;
	},
	/**
	 * 
	 * @return {Object}
	 */
	getPageSze: function() {
		return this.pageSize;
	},
	/**
	 * 
	 * @param {} data
	 * @return {Object}
	 */
	load: function(data) {
		this.data = data;
		this.changeEvent.fire(data);
		
		return this;
	},
	/**
	 * 
	 * @param {} msg
	 */
	error: function(msg) {
		this.errorEvent.fire(msg);
	}
};
