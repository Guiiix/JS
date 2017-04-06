$(document).ready(function() {
	g = new Game(map_j);
	g.load();

	document.onkeydown = function(e) {
		g.press(e);
	}

	document.onkeyup = function(e) {
		g.unpress(e);
	}
});
