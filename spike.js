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
    this.numTicks = 0;
    // every this-many-ticks increase the speed.
    this.speedIncreaseCondition = 1000;
  }

  //choose random location
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
    this.numTicks++;
    if(this.numTicks % this.speedIncreaseCondition === 0) {
      this.speed++;
    }
    this.moveSpike();
    push();
    stroke(this.spikeColor);
    ellipse(this.x, this.y, 3, 3);
    strokeWeight(1);
    noFill();
    // translate changes the origin point for everything after it
    translate(this.spikeLocation.x, this.spikeLocation.y);
    rotate(this.angle);
    for (var i = 0; i < this.total; i++) {
      // line(10, 10, 50, 50);
      triangle(-scl / 2.5, scl / 5.5, scl / 2.5, scl / 5.5, 0, - scl / 1.5);
      triangle(-scl / 2.5, - scl / 5.5, scl / 2.5, - scl / 5.5, 0, scl / 1.5); //upside down
      this.angle = this.angle + 3;
    }
    this.angle = this.angle + 3;
    pop();
  }
}
