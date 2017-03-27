var Tile = function (x, y, c, f, l, i) {
	this.x = x;
	this.y = y;
	this.crossable = c;
	this.fixed = f;
	this.lethal = l;
	this.img = i;
};

Tile.prototype.draw = function() {
	var _this = this;
	this.loadImage(this.img).then(function(img) {
		context.drawImage(img, _this.x, _this.y, sprites_config.width, sprites_config.height);
	});
};

Tile.prototype.loadImage = function (name) {
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
};