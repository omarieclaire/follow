class Spike {
  constructor(temp_scl) {
    this.spikeColor = [255, 0, 0, 250]; //red
    this.scl = temp_scl;
    this.total = 3;
    this.spikeLocation = this.makeRandomVector();
    this.x = this.spikeLocation.x;
    this.y = this.spikeLocation.y;
  }

  //picking place for spikes
  makeRandomVector() {
    var cols = floor(windowWidth / this.scl);
    var rows = floor(windowHeight / this.scl);
    var vector = createVector(floor(random(cols)), floor(random(rows)));
    vector.mult(this.scl);
    return vector;
  }
  //initialize spike location with a random point
  location() {
    this.spikeLocation = this.makeRandomVector();
    this.x = this.spikeLocation.x;
    this.y = this.spikeLocation.y;
  }

  show() {
    stroke(this.spikeColor);
    strokeWeight(.5);
    noFill();
    var angle = 0;
    rotate(angle);
    // translate changes the origin point for everything after it
    translate(this.spikeLocation.x, this.spikeLocation.y);
    // triangle(-scl / 2, scl / 2, 1, -scl / 2, scl / 2, scl / 2);
    for (var i = 0; i < this.total; i++) {
      triangle(-scl / 3, scl / 6, scl / 3, scl / 6, 0, - scl / 2);
      //upsidedown triangle
      triangle(-scl / 3, - scl / 6, scl / 3, - scl / 6, 0, scl / 2);

    }

    // for (var i = 0; i < this.total; i++) {
    //   angle = angle + 3;
    // }
  }
}
