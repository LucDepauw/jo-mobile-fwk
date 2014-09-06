/**
	joSQLDataSource
	================

	SQL flavor of joDataSource which uses "HTML5" SQL found in webkit.

	Methods
	-------

	- `setDatabase(joDatabase)`
	- `setQuery(query)`
	- `setParameters(arguments)`
	- `execute(query, arguments)`
	
	Events
	------
	
	- `changeEvent`
	
	  Fired when data is loaded after an `execute()` or when data is cleared.
	
	- `errorEvent`
	
	  Fired when some sort of SQL error happens.

	Extends
	-------

	- joDataSource
*/
/**
 * SQL flavor of joDataSource which uses "HTML5" SQL found in webkit.
 * @constructor
 * @param {} db
 * @param {} query
 * @param {} args
 */
joSQLDataSource = function(db, query, args) {
	this.db = db;
	this.query = (typeof query === 'undefined') ? "" : query;
	this.args = (typeof args === 'undefined') ? [] : args;
	/**
	 * Fired when data is loaded after an `execute()` or when data is cleared.
	 * @event changeEvent
	 */
	this.changeEvent = new joSubject(this);
	/**
	 * Fired when some sort of SQL error happens.
	 * @event errorEvent
	 */
	this.errorEvent = new joSubject(this);
};
joSQLDataSource.prototype = {
	/**
	 * 
	 * @param {} db
	 * @return {Object}
	 */
	setDatabase: function(db) {
		this.db = db;
		return this;
	},
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
	 * @param {} data
	 * @return {Object}
	 */
	setData: function(data) {
		this.data = data;
		this.changeEvent.fire();
		return this;
	},
	/**
	 * 
	 * @return {Object}
	 */
	clear: function() {
		this.data = [];
		this.changeEvent.fire();
		return this;
	},
	/**
	 * 
	 * @param {} args
	 * @return {Object}
	 */
	setParameters: function(args) {
		this.args = args;
		return this;
	},
	/**
	 * 
	 * @param {} query
	 * @param {} args
	 * @return {Object}
	 */
	execute: function(query, args) {
		this.setQuery(query || "");
		this.setParameters(args);
		
		if (this.query)
			this.refresh();
			
		return this;
	},
	/**
	 * 
	 * @return {Object}
	 */
	refresh: function() {
		if (!this.db) {
			this.errorEvent.fire();
//			joLog("query error: no db!");
			return this;
		}
		
		var self = this;
		var args;

		if (arguments.length) {
			args = [];
			for (var i = 0; i < arguments.length; i++)
				args.push(arguments[i]);
		}
		else {
			args = this.args;
		}
		
		var query = this.query;

		function success(t, result) {
			self.data = [];

			for (var i = 0, l = result.rows.length; i < l; i++) {
				var row = result.rows.item(i);

				self.data.push(row);
			}
			
			self.changeEvent.fire(self.data);
		}
		
		function error() {
			joLog('SQL error', query, "argument count", args.length);
			self.errorEvent.fire();
		}
		
		this.db.db.transaction(function(t) {
			t.executeSql(query, args, success, error);
		});
		
		return this;
	}
};

