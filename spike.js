class Spike {
  constructor(temp_scl) {
    this.spikeColor = [255, 0, 0, 250]; //red
    this.scl = temp_scl;
    this.total = 3;
    this.angle = 0;
    this.speed = 3;
    this.spikeLocation = this.makeRandomVector();
    this.x = this.spikeLocation.x;
    this.y = this.spikeLocation.y;
  }

  //picking place for spikes
  makeRandomVector() {
    var cols = floor(windowWidth - 2 * this.scl);
    var vector = createVector(floor(random(cols)), 0);
    return vector;
  }
  //initialize spike location with a random point
  location(player1, player2) {
    this.spikeLocation = this.makeRandomVector();
    var player1Distance = dist(this.spikeLocation.x, this.spikeLocation.y, player1.x, player1.y);
    var player2Distance = dist(this.spikeLocation.x, this.spikeLocation.y, player2.x, player2.y);

    while(player1Distance < player1.currentDiameter() || player2Distance < player2.currentDiameter()) {
      this.spikeLocation = this.makeRandomVector();
      player1Distance = dist(this.spikeLocation.x, this.spikeLocation.y, player1.x, player1.y);
      player2Distance = dist(this.spikeLocation.x, this.spikeLocation.y, player2.x, player2.y);
    }

    this.x = this.spikeLocation.x;
    this.y = this.spikeLocation.y;

  }

  moveSpike() {
    this.spikeLocation.y = this.spikeLocation.y + this.speed;
    if(this.spikeLocation.y > windowHeight) {
      this.spikeLocation = this.makeRandomVector();
      this.x = this.spikeLocation.x;
    }
    this.y = this.spikeLocation.y;
  }

  show() {
    this.moveSpike();
    push();
    stroke(this.spikeColor);
    ellipse(this.x, this.y, 3, 3);
    strokeWeight(.5);
    noFill();
    // translate changes the origin point for everything after it
    translate(this.spikeLocation.x, this.spikeLocation.y);
    rotate(this.angle);
    for (var i = 0; i < this.total; i++) {
      // line(10, 10, 50, 50);
      triangle(-scl / 3, scl / 6, scl / 3, scl / 6, 0, - scl / 2);
      triangle(-scl / 3, - scl / 6, scl / 3, - scl / 6, 0, scl / 2); //upside down
      this.angle = this.angle + 3;
    }
    this.angle = this.angle + 3;
    pop();

  }
}
