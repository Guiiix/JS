var Game = function (map) {
	this.map = new Map(map);
};

Game.prototype.start = function() {
	console.log("Starting game...");
};