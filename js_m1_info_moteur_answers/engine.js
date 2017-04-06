var Engine = function () {
    this.bodies = [];
};


Engine.prototype.addBody = function (b) {
    this.bodies.push(b);
};


Engine.prototype.removeBody = function (b) {
    var i = this.bodies.findIndex (function (e) { return e == b; });
    if (i >= 0)
	this.bodies.splice(i, 1);
};

Engine.prototype.update = function (dt) {

    for (var i = 0; i < this.bodies.length; i ++) {

        var body = this.bodies[i];



        // On regarde si avec une telle vitesse il peut y avoir collision avec les autres objets.
        for (var j = i+1; j < this.bodies.length; j++) {

            var otherBody = this.bodies[j];

            var res = body.collision(otherBody);

            if (res != null) {
                // mise à jour des vitesses
                body.velocity = res.velocity1;
                otherBody.velocity = res.velocity2;

            };
        };


	/* begin extra */
	body.force = body.force.add(Constants.gravity);
	/* end extra */

        // On calcule la nouvelle accéleration :
        var a = body.force.mult(body.invMass);
        body.force = Vector.ZERO;
        var delta_v = a.mult(dt);
        body.velocity = body.velocity.add(delta_v);

        // On met à jour la position.
        body.move(body.velocity.mult(dt));

    };

};
