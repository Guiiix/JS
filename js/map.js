var Map = function (json) {
	this.tiles = {};
	console.log("Initializing map");
	this.generate(json);
};

Map.prototype.generate = function (json) {
	console.log("Parsing map");
	for (var i in json) {
		this.tiles[i] = {};
		for (var j in json[i]) {
			if (json[i][j] > 0) {
				this.tiles[i][j] = new Tile(j*sprites_config.width, 
					i*sprites_config.height, 
					sprites_config.tiles[json[i][j]].crossable,
					sprites_config.tiles[json[i][j]].fixed,
					sprites_config.tiles[json[i][j]].lethal,
					sprites_config.tiles[json[i][j]].img);
				this.tiles[i][j].draw();
			}
		}
	}
};