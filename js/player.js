var Player = function (g, x, y, img_r, img_l, w, h) {
	this.game = g;
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.img_r = img_r;
	this.img_l = img_l;

	this.movement_y = true;
	this.movement_x = true;
	this.speed_x = 0;
	this.speed_y = 0;

	this.jump_acceleration = 25;
	this._horizontal_acceleration = 5;
	this.horizontal_acceleration = this._horizontal_acceleration;
	this._lifes = 3;
	this.lifes = this._lifes;
	this.refreshLifes();
	this.immortal = false;
};

Player.prototype.load = function() {
	var _this = this;
	return new Promise((ok) => {
		_this.loadImage(_this.img_r)
		.then( (res) => {
			_this.img_r = res;
			_this.img = res;
			return _this.loadImage(_this.img_l);
		})
		.then( (res) => {
			_this.img_l = res;
			_this.draw();
			ok();
		});
	});
}

Player.prototype.draw = function() {
	var player_context = this.game.player_canvas.getContext('2d');
	player_context.clearRect(0, 0, this.game.player_canvas.width, this.game.player_canvas.height);
	player_context.drawImage(this.img, this.x, this.y, this.width, this.height);
}

Player.prototype.loadImage = function (name) {
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

Player.prototype.update = function () {
	this.move();
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

Player.prototype.move = function () {
	if (this.movement_y) {
		this.speed_y -= this.game.gravity;
		if (this.speed_y > 40)
			this.speed_y = 40;
		if (this.speed_y < -40)
			this.speed_y = -40;
		this.y -= this.speed_y;
	}

	if (this.movement_x) {
		this.x += this.speed_x;
	}

	if (this.x < 0) this.x = 0;

	if (this.x > this.game.map.width - this.width) this.x = this.game.map.width - this.width;
	
	this.collisions();
};

Player.prototype.collisions = function () {
	// Mouvement vers la droite
	if (this.speed_x > 0) {
		if (this.checkCollision(this.x + this.width, this.y) ||
			this.checkCollision(this.x + this.width, this.y + this.height-1)) {
			this.speed_x = 0;
			this.x -= (this.x + this.width) % this.game.sprites_config.width + this.horizontal_acceleration;
		}
	}

	// Mouvement vers la gauche
	else if (this.speed_x < 0) {
		if (this.checkCollision(this.x, this.y) || 
			this.checkCollision(this.x, this.y + this.height-1)) {
			this.speed_x = 0;
			this.x -= (this.x % this.game.sprites_config.width) - this.game.sprites_config.width;
		}
	}

	// Mouvement vers le haut
	if (this.speed_y > 0) {
		if (this.checkCollision(this.x, this.y) ||
			this.checkCollision(this.x + this.width, this.y)) {
				this.speed_y = 0;
				this.y -= (this.y % this.game.sprites_config.height) - this.game.sprites_config.height;
		}

		else {
			this.movement_y = true;
		}
	}

	if (this.checkCollision(this.x, this.y + this.height) ||
		this.checkCollision(this.x + this.width, this.y + this.height)) {
		this.speed_y = 0;
		this.movement_y = false;
		this.y -= (this.y + this.height) % this.game.sprites_config.height;

	}

	else {
		this.movement_y = true;
	}
}

Player.prototype.checkCollision = function (x, y) {
	var index_x = parseInt(y / this.game.sprites_config.height)
	var index_y = parseInt(x / this.game.sprites_config.width);
	var line = this.game.map.tiles[index_x];
	if (line != undefined) {
		var tile = this.game.map.tiles[index_x][index_y];
		if (tile != undefined) {
			if (tile.lethal) {
				if (tile.oneshot) this.die();
				else this.hit();
			}

			if (tile.win) this.game.win();

			if (!tile.crossable) return true;
		}
	}
	
	return false;
}

Player.prototype.die = function () {
	this.lifes = this._lifes;
	this.refreshLifes();
	this.x = 0;
	this.y = 0;
}

Player.prototype.hit = function () {
	if (!this.immortal) {
		this.lifes--;
		this.refreshLifes();
		if (this.lifes == 0) {
			this.die();
		}
		else {
			this.immortal = true;
			$("#hit_div").show();
			var _this = this;
			setTimeout(function() {
				$("#hit_div").hide();
				_this.immortal = false;
			}, 2000);
		}
	}
}

Player.prototype.refreshLifes = function () {
	$("#lifes").html(this.lifes);
}