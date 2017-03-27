var Player = function (x, y, img) {
	this.x = x;
	this.y = y;
	var _this = this;
	this.loadImage(img).then(function(res){
		_this.img = res;
		_this.draw();
	});
};

Player.prototype.draw = function() {
	console.log(this.img);
	player_context.clearRect(0, 0, player_canvas.width, player_canvas.height);
	player_context.drawImage(this.img, this.x, this.y, sprites_config.width, sprites_config.height);
}

Player.prototype.loadImage = function (name) {
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