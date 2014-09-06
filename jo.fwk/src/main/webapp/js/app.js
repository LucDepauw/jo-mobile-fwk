/**
 * @include  "/jo.fwk/src/main/webapp/js/jo-flattery.js"
 * @class 
 */
App = {
	nav: new joNavbar(),
	load: function() {
		// loading Jo is required
		jo.load();		
		var x = new joBackButton();
		
		// typical card stack, nav and footer
		this.screen = new joScreen(
			new joFlexcol([
				this.nav = new joNavbar(),
				this.stack = new joStackScroller(),
				this.toolbar = new joToolbar("This is a toolbar")
			])
		);
		
		// attach the nav to our stack
		this.nav.setStack(this.stack);

		// push our menu card
		this.stack.push(joCache.get("menu"));
	}
};

