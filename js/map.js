var Map = function (json) {
	console.log("Initializing map");
	this.generate(json);
};

Map.prototype.generate = function (json) {
	console.log("Parsing map");
	console.log(json);
	this.insertTile(0,0);
};

Map.prototype.insertTile = function (i, j) {
	if (map_j[i][j] > 0) {
		this.loadImage(sprites_config.images[map_j[i][j]]).then(function(img) {
			context.drawImage(img, j*sprites_config.width, i*sprites_config.height, sprites_config.width, sprites_config.height);
		});
	}

	if (j == map_j[i].length-1) {
		if (i == map_j.length-1) {
			console.log("Map loaded");
		} else {
			this.insertTile(i+1, 0);
		}
	}

	else {
		this.insertTile(i, j+1);
	}
}

Map.prototype.loadImage = function (name) {
	console.log("Loading image " + name);
	return new Promise ((ok, error) => {
		var img = new Image();
		img.src = sprites_config.folder + '/' + name;
		img.onload = function() {
			ok(img);
		};
		img.onerror = function() {
			error(img);
		}
	});
}
