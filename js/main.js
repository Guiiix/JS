$(document).ready(function() {
	game_canvas = document.getElementById('game_container');
	player_canvas = document.getElementById('player_container');
	
	context = game_canvas.getContext('2d');
	player_context = player_canvas.getContext('2d');
	
	g = new Game(map_j);
	g.start();
});
