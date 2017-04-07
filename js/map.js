var Map = function (game) {
	this.tiles = {};
	this.game = game;
};

Map.prototype.load = function () {
	console.log("Parsing map");
	return this.loadMapFile().then( (json) => {
		for (var i in json) {
			this.tiles[i] = {};
			for (var j in json[i]) {
				if (json[i][j] >= 0) {
					this.tiles[i][j] = new Tile(this.game, j*this.game.sprites_config.width, 
						i*this.game.sprites_config.height, 
						this.game.sprites_config.tiles[json[i][j]].crossable,
						this.game.sprites_config.tiles[json[i][j]].fixed,
						this.game.sprites_config.tiles[json[i][j]].lethal,
						this.game.sprites_config.tiles[json[i][j]].img,
						this.game.sprites_config.tiles[json[i][j]].win,
						this.game.sprites_config.tiles[json[i][j]].special,
						this.game.sprites_config.tiles[json[i][j]].oneshot,
						this.game.sprites_config.tiles[json[i][j]].function
						);
				}
			}
		}

		this.width = (parseInt(j)+1) * this.game.sprites_config.width;
		this.height = (parseInt(i)+1) * this.game.sprites_config.height;
		var _this = this;
		["player_container", "game_container"].forEach(function(s) {
			document.getElementById(s).width = _this.width;
			document.getElementById(s).height = _this.height;
		});
		$("#hit_div").width(this.width).height(this.height);
		$("#visible_area").width(this.width).height(this.height);
	});
};

Map.prototype.draw = function () {
	var promises = [];
	new Promise ((ok) => {
		for (var i in this.tiles) {
			for (var j in this.tiles[i]) {
				promises.push(this.tiles[i][j].draw());
			}
		}
	
		$.when.apply($, promises).then(function() {
			ok();
		});
	});
}

Map.prototype.loadMapFile = function () {
	return new Promise ( (ok) => {
		$.getJSON( 'conf/map.json', function (data) {
			ok(data);
		});
	});
}