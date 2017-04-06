var Player = function (x, y, img_r, img_l, w, h) {
	var _this = this;
	return new Promise((ok, error) => {
		_this.x = x;
		_this.y = y;
		_this.width = w;
		_this.height = h;

		_this.speed_x = 0;
		_this.speed_y = 0;
		_this.gravity = 2;
		_this.movement_y = true;
		_this.movement_x = true;

		// CONST
		_this.jump_acceleration = 25;
		_this._horizontal_acceleration = 5;
		_this.horizontal_acceleration = _this._horizontal_acceleration;

		
		_this.loadImage(img_r)
		.then(function(res){
			_this.img_r = res;
			_this.img = res;
		})
		.then(function() {
			return _this.loadImage(img_l);
		})
		.then(function(res) {
			_this.img_l = res;
			_this.draw();
			ok(_this);
		});
	});
	
};

Player.prototype.draw = function() {
	player_context.clearRect(0, 0, player_canvas.width, player_canvas.height);
	player_context.drawImage(this.img, this.x, this.y, this.width, this.height);
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

Player.prototype.update = function (game) {
	this.move(game)
	this.draw();
};

Player.prototype.jump = function () {
	if (!this.movement_y) {
		this.movement_y = true;
		this.speed_y = this.jump_acceleration;
	}
};

Player.prototype.moveLeft = function () {
	this.speed_x = -this.horizontal_acceleration;
	this.movement_x = true;
	this.img = this.img_l;
};

Player.prototype.moveRight = function () {
	this.speed_x = this.horizontal_acceleration;
	this.img = this.img_r;
	this.movement_x = true;
};

Player.prototype.stopHorizontalMovement = function () {
	this.speed_x = 0;
	this.movement_x = false;
};

Player.prototype.run = function () {
	this.horizontal_acceleration = this._horizontal_acceleration * 2;
}

Player.prototype.walk = function () {
	this.horizontal_acceleration = this._horizontal_acceleration;
}

Player.prototype.move = function (game) {
	if (this.movement_y) {
		this.speed_y -= this.gravity;
		if (this.speed_y > 40)
			this.speed_y = 40;
		if (this.speed_y < -40)
			this.speed_y = -40;
		this.y -= this.speed_y;
	}

	if (this.movement_x) {
		this.x += this.speed_x;
	}

	if (this.x < 0) {
		this.x = 0;
	}
	
	this.collisions(game);
};

Player.prototype.collisions = function (game) {
	// Mouvement vers la droite
	if (this.speed_x > 0) {
		if (this.checkCollision(game, this.x + this.width, this.y) ||
			this.checkCollision(game, this.x + this.width, this.y + this.height-1)) {
			this.speed_x = 0;
			this.x -= (this.x + this.width) % game.sprites_config.width + this.horizontal_acceleration;
		}
	}

	// Mouvement vers la gauche
	else if (this.speed_x < 0) {
		if (this.checkCollision(game, this.x, this.y) || 
			this.checkCollision(game, this.x, this.y + this.height-1)) {
			this.speed_x = 0;
			this.x -= (this.x % game.sprites_config.width) - game.sprites_config.width;
		}
	}

	// Mouvement vers le haut
	if (this.speed_y > 0) {
		if (this.checkCollision(game, this.x, this.y) ||
			this.checkCollision(game, this.x + this.width, this.y)) {
				this.speed_y = 0;
				this.y -= (this.y % game.sprites_config.height) - game.sprites_config.height;
		}

		else {
			this.movement_y = true;
		}
	}

	if (this.checkCollision(game, this.x, this.y + this.height) ||
		this.checkCollision(game, this.x + this.width, this.y + this.height)) {
		this.speed_y = 0;
		this.movement_y = false;
		this.y -= (this.y + this.height) % game.sprites_config.height;

	}

	else {
		this.movement_y = true;
	}

	
}

Player.prototype.checkCollision = function (game, x, y) {
	var tile = game.map.tiles[parseInt(y / game.sprites_config.height)][parseInt(x / game.sprites_config.width)];
	if (tile != undefined) {
		if (tile.lethal) this.die();
		if (!tile.crossable) {
			return true;
		}
	}
	return false;
}

Player.prototype.die = function () {
	this.x = 0;
	this.y = 0;
}
