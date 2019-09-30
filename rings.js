

class Rings {
  constructor(player) {
    this.x = player.x;
    this.y = player.y;
    this.player = player;
  }

  move() {
      let v1 = createVector(this.x, this.y);
      let v2 = createVector(this.player.x, this.player.y);
      let lerp = p5.Vector.lerp(v1, v2, .98);
      this.x = lerp.x;
      this.y = lerp.y;

      if (this.x < 0 - 20) {
        this.x = windowWidth - scl;
      } else if (this.x > windowWidth - scl + 20) {
        this.x = 0 - 20;
      } else if (this.y < 0 - 20) {
        this.y = windowHeight - scl;
      } else if (this.y > windowHeight - scl + 20) {
        this.y = 0 - 20;
      }
  }

  draw(radius) {
    strokeWeight(.5);
    ellipse(this.x, this.y, radius);
  }
}
