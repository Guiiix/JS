var Rect = function (v, w, h) {


    this.origin = v;
    Object.defineProperty ( this, "width", { writable: false, value : w });
    Object.defineProperty ( this, "height", { writable: false, value : h });

};


Rect.prototype.move = function (v) {
    this.origin = this.origin.add(v);
};



Rect.prototype.mDiff = function (r) {

    var orig = new Vector (r.origin.x - this.origin.x - this.width,
			   r.origin.y - this.origin.y - this.height);
    return new Rect(orig, this.width + r.width, this.height + r.height);

};

Rect.prototype.hasOrigin = function () {

    return (this.origin.x < 0 && this.origin.x + this.width > 0)
	&& (this.origin.y < 0 && this.origin.y + this.height > 0);

};
