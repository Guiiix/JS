var Body = function (v, w, h, m) {
    Rect.call(this, v, w, h);
    this.mass = m || 0;
    this.invMass = 1/this.mass;
    this.velocity = Vector.ZERO;
    this.force = Vector.ZERO;

    /* begin en bonus */
    this.hasCollision = false;
    /* end en bonus */
};

Body.prototype = Object.create(Rect.prototype);
Body.prototype.constructor = Body;



/* begin en bonus */

Body.prototype.setCollision = function (b) {
    this.hasCollision = b;
};

/* end en bonus */



/* Dectection de collision entre l'objet courrant et l'objet b.

   Renvoie null si pas de collision, sinon renvoie les nouveau vecteur vitesses
   pour l'objet courant et pour b
*/



Body.prototype.collision = function (b) {

    var mdiff = this.mDiff(b);
    if (mdiff.hasOrigin()) {

	var vectors = [ new Vector (0,mdiff.origin.y),
			new Vector (0,mdiff.origin.y+mdiff.height),
			new Vector (mdiff.origin.x, 0),
			new Vector (mdiff.origin.x + mdiff.width, 0) ];

	var n = vectors[0];

	for (var i = 1; i < vectors.length; i++) {
	    if (vectors[i].norm() < n.norm())
		n = vectors[i];
	};

	var norm_v = this.velocity.norm();
	var norm_vb = b.velocity.norm();
	var kv = norm_v / (norm_v + norm_vb);
	var kvb = norm_vb / (norm_v + norm_vb);

	if (norm_v == 0 && norm_vb == 0) {
	    if (this.invMass == 0 && this.invMass == 0)
		return null;
	    else {
		if (this.mass <= b.mass)
		    kv = 1;
		else
		    kvb = 1
	    }

	};

	this.move(n.mult(kv));
	b.move(n.mult(-kvb));

	n = n.normalize();

        // (2) On calcule l'impulsion j :
        var v = this.velocity.sub(b.velocity);
        var e = Constants.elasticity; // pour les étudiants, juste faire var e = 1;

        var j = -(1 + e) * v.dot(n) / (this.invMass + b.invMass);

        // (3) On calcule les nouvelle vitesse:
        var new_v = this.velocity.add(n.mult(j  * this.invMass));
        var new_bv = b.velocity.sub(n.mult(j * b.invMass));

	b.setCollision(true);
	this.setCollision(true);

        return { velocity1 : new_v, velocity2 : new_bv };

    } else {
        return null;
    }
};
