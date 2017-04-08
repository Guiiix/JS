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

/* Chargement de la configuration des tiles */
Game.prototype.loadConfig = function () {
	return new Promise ( (resolve) => {
		$.getJSON( 'conf/sprites.json', function (data) {
			resolve(data);
		});
	});
}

/* Chargement du jeu (conf, map, player) */
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
		return _this.map.draw();
	})
	.then( () => {
		return _this.player.load();
	})
	.then( () => {
		return _this.start();
	});
}

/* Lancement des boucles du jeu */
Game.prototype.start = function() {
	console.log("Starting game...");
	var game = this;
	var id = setInterval(function() {
		game.keysActions();
		game.player.update();
	}, 1000/60);
	setInterval(function() {
		game.player.draw();
		game.moveCamera();
		this.frames++;
	}, 1000/60);
	setInterval(function() {
		$("#fps").html(this.frames);
		this.frames = 0;
	}, 1000);
};

/* Mise à jour du tableau de touches */
Game.prototype.press = function (e) {
	if (e.code == "Space" || e.code == "ArrowUp" || e.code == "ArrowRight" || e.code == "ArrowLeft") {
		this.keys[e.code] = true;
		e.preventDefault();
	}
};

/* Mise à jour du tableau de touches */
Game.prototype.unpress = function (e) {
	if (e.code == "Space" || e.code == "ArrowUp" || e.code == "ArrowRight" || e.code == "ArrowLeft") {
		this.keys[e.code] = false;
		e.preventDefault();
	}
};

/* Actions relatives au touches */
Game.prototype.keysActions = function () {
	if (this.keys.ArrowUp) {
		this.player.jump();
	}

	if (this.keys.ArrowRight || this.keys.ArrowLeft) {
		if (this.keys.ArrowRight) this.player.moveRight();
		if (this.keys.ArrowLeft) this.player.moveLeft();
	}
	else this.player.stopHorizontalMovement();

	if (this.keys.Space) this.player.run();
	else this.player.walk();
};

/* Déplacement de la caméra */
Game.prototype.moveCamera = function () {
	/* Calcul de l'offset x pour centrer le joueur */
	var left = - (this.player.x - ($("#canvas_container").width() / 2));

	/* Calcul de l'offset y pour center le joueur */
	var top = - (this.player.y - ($("#canvas_container").height() / 2));

	/* Calcul de l'offset x max pour ne pas faire sortir la caméra de la zone de jeu */
	var max_x = this.map.width - $("#canvas_container").width();

	/* Calcul de l'offset y max pour ne pas faire sortir la caméra de la zone de jeu */
	var max_y = this.map.height - $("#canvas_container").height();

	if (left > 0)
		left = 0;
	
	if (top > 0)
		top = 0;
	
	if (left < -max_x)
		left = -max_x;

	if (top < -max_y)
		top = -max_y;

	/* Mouvement de caméra */
	$("#visible_area").css('left', left);
	$("#visible_area").css('top', top);
};

/* Affichage de l'ecran de victoire */
Game.prototype.win = function () {
	$("#win_div").width($("#canvas_container").width());
	$("#win_div").height($("#canvas_container").height());
	$("#win_div p").css("line-height", $("#canvas_container").height() + "px");
	$("#win_div").show();
};

Game.prototype.die = function () {
	$("#dead_div").width($("#canvas_container").width());
	$("#dead_div").height($("#canvas_container").height());
	$("#dead_div p").css("line-height", $("#canvas_container").height() + "px");
	$("#dead_div").show();
}
