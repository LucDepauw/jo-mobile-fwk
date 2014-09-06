/**
 * 
 * @type Number
 */
var SEC = 1000;
/**
 * 
 * @type Number 
 */
var MIN = 60 * SEC;
/**
 * @type Number 
 */
var HOUR = 60 * MIN;
/**
 * 
 * @type Number 
 */
var DAY = 24 * HOUR;

/**
	joTime
	======
	
	Time utility functions. More will be added, but only as needed by the
	framework. There are entire libraries dedicated to extensive datetime
	manipulation, and Jo doesn't pretend to be one of them.
	
	Methods
	-------
	
	- `timestamp()`
	
	  Returns a current timestamp in milliseconds from 01/01/1970 from
	  the system clock.

	Constants
	---------

	- `SEC`, `MIN`, `HOUR`, `DAY`

	  Convenience global constants which make it easier to manipulate
	  timestamps.
	
	Use
	---
	
		var twoHoursLater = joTime.timestamp() + (HOUR * 2);
	
*/

/**
 * Time utility functions. More will be added, but only as needed by the
 *	framework. There are entire libraries dedicated to extensive datetime
 *	manipulation, and Jo doesn't pretend to be one of them.
 * @function
 */
joTime = {
	/**
	 * Returns a current timestamp in milliseconds from 01/01/1970 from
	 *  the system clock.
	 * @return {Object}
	 */
	timestamp: function() {
		var now = new Date();
		return now / 1;
	}
};

