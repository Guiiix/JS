$(document).ready(function() {
	var canvas = document.getElementById('game_container');
	context = canvas.getContext('2d');
	var g = new Game(map_j);
	g.start();
});
