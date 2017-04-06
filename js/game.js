var Game = function (map) {
	this.map = new Map(map);
	this.sprites_config = sprites_config;
	this.frames = 0;

	var _this = this;
	new Player(0, 0, sprites_config.player.img_r, sprites_config.player.img_l, sprites_config.player.width, sprites_config.player.height)
	.then(function(res) {
		_this.player = res;
		_this.keys = {
			"ArrowRight": false,
			"ArrowLeft": false,
			"Space": false
		}
		g.start();
	});
	
};

Game.prototype.start = function() {
	console.log("Starting game...");
	var game = this;
	var id = setInterval(function() {
		game.keysActions();
		game.player.update(game);
		this.frames++;
	}, 1000/60);
	setInterval(function() {
		$("#fps").html(this.frames);
		this.frames = 0;
	}, 1000);
};

Game.prototype.press = function (e) {
	if (e.code == "Space" || e.code == "ArrowUp" || e.code == "ArrowRight" || e.code == "ArrowLeft") {
		this.keys[e.code] = true;
		e.preventDefault();
	}
};

Game.prototype.unpress = function (e) {
	if (e.code == "Space" || e.code == "ArrowUp" || e.code == "ArrowRight" || e.code == "ArrowLeft") {
		this.keys[e.code] = false;
		e.preventDefault();
	}
};

Game.prototype.keysActions = function () {
	if (this.keys.ArrowUp) {
		this.player.jump();
		if (!this.player.movement_y) {
			this.movement_y = true;
			this.player.speed_y = 9;
		}
	}

	if (this.keys.ArrowRight || this.keys.ArrowLeft) {
		if (this.keys.ArrowRight) this.player.moveRight();
		if (this.keys.ArrowLeft) this.player.moveLeft();
	}
	else this.player.stopHorizontalMovement();

	if (this.keys.Space) this.player.run();
	else this.player.walk();
};
