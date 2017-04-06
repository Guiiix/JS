var Renderer = function (e) {
    this.engine = e;
};


Renderer.prototype.update = function (dt) {

    this.engine.update(dt);
    this.engine.bodies.forEach(function (b) {
        b.draw();
    });
};
