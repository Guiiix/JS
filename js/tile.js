var Tile = function (g, x, y, c, f, l, i, w, s, os, fun) {
	this.game = g;
	this.x = x;
	this.y = y;
	this.crossable = c;
	this.fixed = f;
	this.lethal = l;
	this.img = i;
	this.win = w;
	this.special = s;
	if (this.lethal) this.oneshot = os;
	if (this.special) this.fun = this[fun];
};

/* Dessine l'image du bloc et renvoi une promesse */
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

/* Supprime une tile de la map */
Tile.prototype.break = function () {
	// Récupération de l'index
	var index_x = this.y / this.game.sprites_config.height;
	var index_y = this.x / this.game.sprites_config.width;

	// Créaton d'une nouvelle tile type air (index 0 du fichier sprites)
	this.game.map.tiles[index_x][index_y] = new Tile(
		this.game, this.x,
		this.y, 
		this.game.sprites_config.tiles[0].crossable,
		this.game.sprites_config.tiles[0].fixed,
		this.game.sprites_config.tiles[0].lethal,
		this.game.sprites_config.tiles[0].img,
		this.game.sprites_config.tiles[0].win,
		this.game.sprites_config.tiles[0].special,
		this.game.sprites_config.tiles[0].oneshot,
		this.game.sprites_config.tiles[0].function
	);

	this.clear();
}

/* Efface l'image de la tile */
Tile.prototype.clear = function () {
	var context = this.game.game_canvas.getContext('2d');
	context.clearRect(this.x, this.y, this.game.sprites_config.width, this.game.sprites_config.height);
}

/* Charge une image et renvoi une promesse */
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

/* Fonction spéciale simulant un tremplin */
Tile.prototype.bounce = function () {
	if (this.game.player.speed_y < 0) {
		this.game.player.movement_y = false;
		this.game.player.jump_acceleration = this.game.player._jump_acceleration * 2;
		this.game.player.y = this.y - this.game.player.height - 1;
		this.game.player.jump();
		this.game.player.jump_acceleration = this.game.player._jump_acceleration;
	}
}

/* Fonction spéciale soignant le joueur */
Tile.prototype.heal = function () {
	this.game.player.heal();
}