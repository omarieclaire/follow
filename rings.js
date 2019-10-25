class Rings {
  constructor(player, scl, ringColor, initX, initY, targets) {
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

    this.multiTargetMode = typeof(targets) !== 'undefined';
    this.currentTarget = 0;

    //
    this.targets = targets;
  }
  //function to manage the rings when they reach the edge of the screen
  updateLocation(newX, newY) {
    this.x = newX;
    this.y = newY;
  }

  moveRing(sourceVector, destinationVector) {
    let lerp = p5.Vector.lerp(sourceVector, destinationVector, this.spectrum);
    this.x = lerp.x;
    this.y = lerp.y;
    if (this.spectrum >= 1) {
      this.spectrum = 1;
    } else {
      // Incrememt t because it's how far we are along in time
      this.time = this.time + 0.01;
      // set spectrum equal to the easing function of time at the current time
      if(this.multiTargetMode) {
        if(this.currentTarget == 0) {
          // linearly increase spectrum for the first target.
          this.spectrum = this.time;
        }
        if(this.currentTarget == 1) {
          this.spectrum = this.easing(this.time);
        }
      } else {
        this.spectrum = this.easing(this.time);
      }
    }
  }

  move() {
    if(this.multiTargetMode) {
      var target = this.targets[this.currentTarget];
      if(this.currentTarget == 0) {
        //this.x and this.y of the rings
        let v1 = createVector(this.x, this.y);
        // now v2 will be the target
        let v2 = createVector(target.x, target.y);
        let d = dist(v1.x, v1.y, v2.x, v2.y);
        this.moveRing(v1, v2);
        if(this.currentTarget == 0 && (d <= 3 || this.spectrum >= 0.5)) {
          this.currentTarget++;
          this.spectrum = 0.5;
          this.time = 0.5;
        }
      } else {
        let v1 = createVector(target.x, target.y);
        let v2 = createVector(this.player.x, this.player.y);
        this.moveRing(v1, v2);
      }
    } else {
      //this.x and this.y of the rings
      let v1 = createVector(this.x, this.y);
      //this.x and this.y of a player
      let v2 = createVector(this.player.x, this.player.y);
      this.moveRing(v1, v2);
    }
  }

  draw(radius) {
    push();
    strokeWeight(2);
    stroke(this.ringColor);
    ellipse(this.x, this.y, radius);
    pop();
  }

  drawDeadRing(initialRadius) {
    this.numDeadTicks++;


    //
    // push();
    // stroke(this.ringColor);
    // strokeWeight(Math.max(0, 1 - this.numDeadTicks / 8));
    // ellipse(this.x, this.y, initialRadius);
    // pop();

    push();
    stroke(255, 0, 0);
    strokeWeight(Math.max(0, 3 - this.numDeadTicks / 30));
    ellipse(this.x, this.y, initialRadius + 5);
    pop();

  }
}
