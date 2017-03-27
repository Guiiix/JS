var Game = function (map) {
	this.map = new Map(map);
	this.player = new Player(0,0,sprites_config["player"]);
};

Game.prototype.start = function() {
	console.log("Starting game...");
	var game = this;
	var id = setInterval(function() {
		console.log(this);
		game.player.y += 2;
		game.player.draw();
	}, 1/60);
};