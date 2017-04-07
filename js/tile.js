var Tile = function (g, x, y, c, f, l, i, w, os) {
	this.game = g;
	this.x = x;
	this.y = y;
	this.crossable = c;
	this.fixed = f;
	this.lethal = l;
	this.img = i;
	this.win = w;
	if (this.lethal)
		this.oneshot = os;
};

Tile.prototype.draw = function() {
	var context = this.game.game_canvas.getContext('2d');
	var _this = this;

	return new Promise ((ok) => {
		this.loadImage(this.img).then(function(img) {
			context.drawImage(img, _this.x, _this.y, _this.game.sprites_config.width, _this.game.sprites_config.height);
			ok();
		});
	});
	
	
};

Tile.prototype.loadImage = function (name) {
	return new Promise ((ok, error) => {
		var img = new Image();
		img.src = this.game.sprites_config.folder + '/' + name;
		img.onload = function() {
			ok(img);
		};
		img.onerror = function() {
			error(img);
		}
	});
};