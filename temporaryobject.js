class TemporaryRing {

  constructor(player, animationLength) {
    this.player = player;
    this.x = player.x;
    this.y = player.y;
    this.length = animationLength;
    this.numTicks = 0;
    this.maxOpacity = 150;
  }

  isDone() {
    return this.numTicks >= this.length;
  }

  draw(radius) {
    console.log("drawing temp ring");
    this.x = this.player.x;
    this.y = this.player.y
    push();
    strokeWeight(10);
    noFill();
    var r = radius + 5;
    if(this.numTicks < this.length/2) {
      // fade in
      stroke(255, 215, 0, this.numTicks/(this.length/2) * this.maxOpacity);
    } else {
      // fade out
      stroke(255, 215, 0, (2 - this.numTicks/(this.length/2)) * this.maxOpacity);
    }
    ellipse(this.x, this.y, r, r);
    pop();
    this.numTicks++;
  }
}

