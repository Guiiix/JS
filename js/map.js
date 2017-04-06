var Map = function (game) {
	this.tiles = {};
	this.game = game;
};

Map.prototype.load = function () {
	console.log("Parsing map");
	var promises = [];
	return this.loadMapFile().then( (json) => {
			new Promise ((ok) => {
			for (var i in json) {
				this.tiles[i] = {};
				for (var j in json[i]) {
					if (json[i][j] > 0) {
						this.tiles[i][j] = new Tile(this.game, j*this.game.sprites_config.width, 
							i*this.game.sprites_config.height, 
							this.game.sprites_config.tiles[json[i][j]].crossable,
							this.game.sprites_config.tiles[json[i][j]].fixed,
							this.game.sprites_config.tiles[json[i][j]].lethal,
							this.game.sprites_config.tiles[json[i][j]].img);
						promises.push(this.tiles[i][j].draw());
					}
				}
			}
			
			$.when.apply($, promises).then(function() {
				ok();
			});	
		});
	});
};

Map.prototype.loadMapFile = function () {
	return new Promise ( (ok) => {
		$.getJSON( 'conf/map.json', function (data) {
			ok(data);
		});
	});
}