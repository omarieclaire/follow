class Player {
  //constructor is a method which is run only once to set up the object
  constructor(temp_name, temp_playerDir, temp_xspeed, temp_x, temp_y) {
    this.name = temp_name;
    this.direction = temp_playerDir;
    this.xspeed = temp_xspeed;
    this.x = temp_x;
    this.y = temp_y;

    this.r = 20;
    this.yspeed = 0;
    this.total = 5;
    this.isfollowing = false;
    this.isfollowed = false;

  }

  eat(food) {
    var d = dist(this.x, this.y, food.x, food.y);
    if (d < scl) {
      this.total++;
      eat_sound.play();
      return true;
    } else {
      return false;
    }
  }

  dir(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  flipDirection() {
    if(this.direction == "up") {
      this.changeDirectionDown();
    } else if (this.direction == "down") {
      this.changeDirectionUp();
    } else if (this.direction == "left") {
      this.changeDirectionRight();
    } else if (this.direction == "right") {
      this.changeDirectionLeft();
    }
  }

  changeDirectionDown() {
    this.dir(0, 0.1);
    this.direction = "down";
  }
  changeDirectionUp() {
    this.dir(0, -0.1);
    this.direction = "up";
  }
  changeDirectionLeft() {
    this.dir(-0.1, 0);
    this.direction = "left";
  }
  changeDirectionRight() {
    this.dir(0.1, 0);
    this.direction = "right";
  }

  updateTotal(player1, player2) {
    if (this.isFollowing) {
      player1.total = player1.total - 0.005;
			player2.total = player2.total + 0.005;
      console.log(player1.total, player2.total);

    }
  }



  update() {

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

  show() {
    ellipse(this.x, this.y, scl, scl);
    for (var i = 1; i < this.total; i++) {
      noFill();
      stroke(255, 200);
      ellipse(this.x, this.y, 10 + i * 20, 10 + i * 20);
      // scl + i * scl / 2 + 20, scl + i * scl / 2 + 20
    }
    //player trail
    let numberOfTrails = 10;
    let spaceBetweenCircles = 15;
    let radiusShrinkFactor = 0.5;

    for (var i = 1; i < numberOfTrails; i++) {
      //having 1 + ensures that the divisor is always above 1 so the trail will never be bigger than the player
      let newRadius = (scl/4) / (1 + i * radiusShrinkFactor);
      if (this.direction == "up") {
        let newYCoordinate = this.y + (i * spaceBetweenCircles);
        ellipse(this.x, newYCoordinate, newRadius);
      } else if (this.direction == "down") {
        let newYCoordinate = this.y - (i * spaceBetweenCircles);
        ellipse(this.x, newYCoordinate, newRadius);
      } else if (this.direction == "left") {
        let newXCoordinate = this.x + (i * spaceBetweenCircles);
        ellipse(newXCoordinate, this.y, newRadius);
      } else if (this.direction == "right") {
        let newXCoordinate = this.x - (i * spaceBetweenCircles);
        ellipse(newXCoordinate, this.y, newRadius);
      }
    }
  }

}
