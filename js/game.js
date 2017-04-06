var Game = function (map) {
	this.sprites_config = sprites_config;
	this.gravity = 2;
	this.frames = 0;
	this.game_canvas = document.getElementById('game_container');
	this.player_canvas = document.getElementById('player_container');
	this.map = new Map(this);
	this.player = new Player(this, 0, 0, sprites_config.player.img_r, sprites_config.player.img_l, sprites_config.player.width, sprites_config.player.height);	
	this.keys = {
		"ArrowRight": false,
		"ArrowLeft": false,
		"Space": false
	};
};

Game.prototype.load = function () {
	var _this = this;

	this.map.load(map_j)
	.then( () => {
		_this.player.load()
	})
	.then( () => {
		_this.start();
	});
}

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
