class Player {
  constructor(temp_name, temp_playerDir, temp_xspeed, temp_x, temp_y){
  this.name = temp_name;
  this.x = temp_x;
  this.y = temp_y;
  this.xspeed = temp_xspeed;
  this.yspeed = 0;
  this.total = 5;
  this.direction = temp_playerDir;
  this.isfollowing = false;
}


  eat(pos) {
    var d = dist(this.x, this.y, pos.x, pos.y);
    if (d < scl) {
      this.total++;
      eat_sound.play();
      return true;
    } else {
      return false;
    }
  }

  dir (x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  update () {

    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;

    if (this.x < -20) {
      this.x = width - scl;
    } else if (this.x > width - scl + 20) {
      this.x = -20;
    } else if (this.y < -20) {
      this.y = height - scl;
    } else if (this.y > height - scl + 20) {
      this.y = -20;
    }
  }

  show () {
    ellipse(this.x, this.y, scl, scl);
    for (var i = 1; i < this.total; i++) {
      noFill();
      stroke(255, 200);
      ellipse(this.x, this.y, 10 + i*20, 10 + i*20);
      // scl + i * scl / 2 + 20, scl + i * scl / 2 + 20
    }
  }

}
