var Game = function () {
	this.gravity = 2;
	this.frames = 0;
	this.game_canvas = document.getElementById('game_container');
	this.player_canvas = document.getElementById('player_container');
	this.keys = {
		"ArrowRight": false,
		"ArrowLeft": false,
		"Space": false
	};
};

Game.prototype.loadConfig = function () {
	return new Promise ( (resolve) => {
		$.getJSON( 'conf/sprites.json', function (data) {
			resolve(data);
		});
	});
}

Game.prototype.load = function () {
	
	var _this = this;
	this.loadConfig()
	.then( (sprites) => {
		_this.sprites_config = sprites;
		_this.map = new Map(_this);
		_this.player = new Player(_this, 0, 0, _this.sprites_config.player.img_r, _this.sprites_config.player.img_l, _this.sprites_config.player.width, _this.sprites_config.player.height);	
	})
	.then( () => {
		return _this.map.load();
	})
	.then( () => {
		return _this.player.load();
	})
	.then( () => {
		return _this.start();
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
