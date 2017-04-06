$(document).ready(function() {
	g = new Game();
	g.load();

	document.onkeydown = function(e) {
		g.press(e);
	}

	document.onkeyup = function(e) {
		g.unpress(e);
	}
});
