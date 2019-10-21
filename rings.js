class Rings {
  constructor(player, scl, ringColor, initX, initY) {
    this.scl = scl;
    this.ringColor = ringColor;
    //if we don't pass in an x or a y, just leave them as is
    if (typeof(initX) === 'undefined' || typeof(initY) === 'undefined') {
      this.x = player.x;
      this.y = player.y;
    } else {
      //else transfer them to the leader
      this.x = initX;
      this.y = initY;
    }
    // the player that THIS ring follows
    this.player = player;
    // how far we are along the line (lerp)
    this.spectrum = 0;
    // how far we are in time
    this.time = 0;
    // function to define the curve we want
    this.easing = createBezierCurve(0.55, 0.055, 0.675, 0.19);
    //
    this.numDeadTicks = 0;
  }
  //function to manage the rings when they reach the edge of the screen
  updateLocation(newX, newY) {
    this.x = newX;
    this.y = newY;
  }

  move() {
    //this.x and this.y of the rings
    let v1 = createVector(this.x, this.y);
    //this.x and this.y of a player
    let v2 = createVector(this.player.x, this.player.y);
    let lerp = p5.Vector.lerp(v1, v2, this.spectrum);
    this.x = lerp.x;
    this.y = lerp.y;
    if (this.spectrum >= 1) {
      this.spectrum = 1;
    } else {
      // Incrememt t because it's how far we are along in time
      this.time = this.time + 0.01;
      // set spectrum equal to the easing function of time at the current time
      this.spectrum = this.easing(this.time);
    }
  }

  draw(radius) {
    push();
    stroke(this.ringColor);
    ellipse(this.x, this.y, radius);
    pop();
  }

  drawDeadRing(initialRadius) {
    this.numDeadTicks++;
    push();
    stroke(this.ringColor);
    strokeWeight(Math.max(0, 3 - this.numDeadTicks / 8));
    ellipse(this.x, this.y, initialRadius);
    pop();
  }
}
