class ExplodeParticle {
  constructor() {
    this.speed = 3;
    this.radius = random(0,1);
    this.directionX = random(-this.speed,this.speed);
    this.directionY = random(-this.speed,this.speed);
    this.hasPositionBeenUpdated = false;
  }

  initialPosition(x,y) {
    if(this.hasPositionBeenUpdated == false) {
      this.x = x;
      this.y = y;
      this.hasPositionBeenUpdated = true;
   }
  }

  update() {
    this.x = this.x + this.directionX;
    this.y = this.y + this.directionY;
  }

  show() {
    push();
    ellipse(this.x, this.y, this.radius);
    pop();

  }

}
