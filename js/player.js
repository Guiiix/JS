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

	this._jump_acceleration = 25;
	this.jump_acceleration = this._jump_acceleration;

	this._horizontal_acceleration = 5;
	this.horizontal_acceleration = this._horizontal_acceleration;
	this._lifes = 3;
	this.lifes = this._lifes;
	this.refreshLifes();
	this.immortal = false;
};

/* Charge les images du joueur et le dessine */
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

/* Dessine le joueur */
Player.prototype.draw = function() {
	var player_context = this.game.player_canvas.getContext('2d');
	player_context.clearRect(0, 0, this.game.player_canvas.width, this.game.player_canvas.height);
	player_context.drawImage(this.img, this.x, this.y, this.width, this.height);
}

/* Charge une image */
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

/* Appelé chaque soixantieme de seconde */
Player.prototype.update = function () {
	this.move();
};

/* Fait sauter le personnage */
Player.prototype.jump = function () {
	if (!this.movement_y) {
		this.movement_y = true;
		this.speed_y = this.jump_acceleration;
	}
};

/* Déplace le joueur vers la gauche */
Player.prototype.moveLeft = function () {
	this.speed_x = -this.horizontal_acceleration;
	this.movement_x = true;
	this.img = this.img_l;
};

/* Déplace le joueur vers la droite */
Player.prototype.moveRight = function () {
	this.speed_x = this.horizontal_acceleration;
	this.img = this.img_r;
	this.movement_x = true;
};

/* Arrête un mouvement horizontal */
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

/* Met à jour la position du joueur en fonction de sa vitesse */
Player.prototype.move = function () {
	if (this.movement_y) {
		/* Application de la gravité au joueur */
		this.speed_y -= this.game.gravity;

		/* Limite de vitesse */
		if (this.speed_y > 40)
			this.speed_y = 40;
		if (this.speed_y < -40)
			this.speed_y = -40;
		this.y -= this.speed_y;
	}

	if (this.movement_x) {
		this.x += this.speed_x;
	}

	/* On empêche le joueur de sortir de la map */
	if (this.x < 0) this.x = 0;
	if (this.x > this.game.map.width - this.width) this.x = this.game.map.width - this.width;
	
	this.collisions();
};

/* Vérification des collisions et corrections de la position du joueur */
Player.prototype.collisions = function () {
	/* Mouvement vers la droite, on vérifie les collision des points de droite du joueur */
	if (this.speed_x > 0) {
		if (this.checkCollision(this.x + this.width, this.y) ||
			this.checkCollision(this.x + this.width, this.y + this.height-1)) {
			this.speed_x = 0;
			this.x -= (this.x + this.width) % this.game.sprites_config.width + this.horizontal_acceleration;
		}
	}

	/* Mouvement vers la gauche, on vérifie les collision des points de gauche du joueur */
	else if (this.speed_x < 0) {
		if (this.checkCollision(this.x, this.y) || 
			this.checkCollision(this.x, this.y + this.height-1)) {
			this.speed_x = 0;
			this.x -= (this.x % this.game.sprites_config.width) - this.game.sprites_config.width;
		}
	}

	/* Mouvement vers le haut, on vérifie les collision des points du haut du joueur */
	if (this.speed_y > 0) {
		if (this.checkCollision(this.x, this.y) ||
			this.checkCollision(this.x + this.width, this.y)) {
				this.speed_y = 0;
				this.y -= (this.y % this.game.sprites_config.height) - this.game.sprites_config.height;
		}

		else { // Par défaut le joueur est en chutte libre
			this.movement_y = true;
		}
	}

	/* Vérif de collisions des points du bas du joueur, en cas de collision, le joueur n'est plus en chutte
	libre */
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

/* Verification des collisions */
Player.prototype.checkCollision = function (x, y) {
	// On récupère l'index du bloc présent aux coordonnées en paramètres */
	var index_x = parseInt(y / this.game.sprites_config.height)
	var index_y = parseInt(x / this.game.sprites_config.width);
	var line = this.game.map.tiles[index_x];
	if (line != undefined) {
		var tile = this.game.map.tiles[index_x][index_y];
		if (tile != undefined) {
			if (tile.lethal) {
				if (tile.oneshot) this.game.die();
				else this.hit();
			}

			if (tile.win) this.game.win();
			
			if (tile.special) {
				tile.fun();
			}

			if (!tile.fixed) tile.break();

			if (!tile.crossable){
				return true;
			}
		}
	}
	
	return false;
}

/* Décrémente une vie au joueur et le rend invincible 2 secondes */
Player.prototype.hit = function () {
	if (!this.immortal) {
		this.lifes--;
		this.refreshLifes();
		if (this.lifes == 0) {
			this.game.die();
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

/* Soigne le joueur */
Player.prototype.heal = function () {
	this.lifes++;
	this.refreshLifes();
}

/* Affiche le nombre de vies restantes */
Player.prototype.refreshLifes = function () {
	$("#lifes").html(this.lifes);
}