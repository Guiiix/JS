var Vector = function (x, y) {
    Object.defineProperty ( this, "x", { writable: false, value : x });
    Object.defineProperty ( this, "y", { writable: false, value : y });
};

Vector.prototype.add = function (v) {
    return new Vector(this.x + v.x, this.y + v.y );
};

Vector.prototype.sub = function (v) {
    return new Vector(this.x - v.x, this.y - v.y );
};

Vector.prototype.mult = function (k) {
    return new Vector(this.x * k, this.y * k );
};

Vector.prototype.dot = function (v) {
    return this.x * v.x + this.y * v.y;
};

Vector.prototype.norm = function () {
    return Math.sqrt(this.dot(this));
};

Vector.prototype.normalize = function () {
    return this.mult(1/this.norm ());
};

Vector.ZERO = new Vector (0,0);
Vector.UNIT_X = new Vector (1,0);
Vector.UNIT_Y = new Vector (0,1);
Vector.MINUS_UNIT_X = new Vector (-1, 0);
Vector.MINUS_UNIT_Y = new Vector (0, -1);
