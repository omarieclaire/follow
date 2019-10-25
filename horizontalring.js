class HorizontalRing {
  constructor(source, target, ringColor, scl, spacer) {
    this.source = source;
    this.target = target;
    this.scl = scl;
    this.spacer = spacer;
    this.ringColor = ringColor;
    this.numDeadTicks = 0;

    this.x = this.source.x;
    this.y = this.source.y;

    this.completed = false;

    this.speed = 10;
    this.threshold = 15;
    this.easingThreshold = 300;

    var loopDiff = this.source.numLoops - this.target.numLoops;

    this.easing = createBezierCurve(0.55, 0.055, 0.675, 0.19);

    if(loopDiff == 0) {
      if(this.source.direction === "right") {
        if(this.source.x > this.target.x) {
          this.direction = "left";
        } else {
          this.direction = "right";
        }
      } else if (this.source.direction === "left") {
        if(this.source.x < this.target.x) {
          this.direction = "right";
        } else {
          this.direction = "left";
        }
      } else {
        console.log("this is bad");
        this.direction = "right";
      }
    } else if (loopDiff <= -1) {
      this.direction = this.source.direction;
    } else if (loopDiff >= 1) {
      this.direction = this.oppositeDir(this.source.direction);
    } else {
      throw "bad loop diff";
    }

  }

  oppositeDir(dir) {
    if(dir === "left") {
      return "right";
    } else if(dir == "right") {
      return "left";
    } else {
      throw "bad direction";
    }
  }

  updateLocation(newX, newY) {
    // do nothing
  }

  wrap() {
    if(this.x > windowWidth + this.spacer) {
      this.x = 0 - this.spacer;
    } else if(this.x < 0 - this.spacer) {
      this.x = windowWidth + this.spacer;
    }
  }

  move() {
    if(this.complete) {
      this.x = this.target.x;
      this.y = this.target.y;
    } else {

      let v1 = createVector(this.x, this.y);
      let v2 = createVector(this.target.x, this.target.y);
      let d = dist(v1.x, v1.y, v2.x, v2.y);

      if(this.direction == "right") {
        if(this.x < this.target.x && d < this.easingThreshold) {
          /*
          let easeAmount = (this.easingThreshold - d)/this.easingThreshold;
          let lerp = p5.Vector.lerp(v1, v2, this.easing(easeAmount));
          this.x = lerp.x;
          */
          this.x = this.x + this.speed;
        } else {
          this.x = this.x + this.speed;
        }
      } else {
        if(this.x > this.target.x && d < this.easingThreshold) {
          /*
          let easeAmount = (this.easingThreshold - d)/this.easingThreshold;
          let lerp = p5.Vector.lerp(v1, v2, this.easing(easeAmount));
          this.x = lerp.x;
          */
          this.x = this.x - this.speed;
        } else {
          this.x = this.x - this.speed;
        }
      }

      if(d < this.threshold) {
        console.log("Complete");
        this.complete = true;
      } else {
        this.wrap();
      }
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
    push();
    stroke(255, 0, 0, 70);
    strokeWeight(Math.max(0, 3 - this.numDeadTicks / 30));
    ellipse(this.x, this.y, initialRadius + 5);
    pop();
  }
}
