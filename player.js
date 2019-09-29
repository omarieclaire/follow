class Player {
  //constructor is a method which is run only once to set up the object
  constructor(temp_name, temp_playerDir, temp_xspeed, temp_x, temp_y) {
    this.name = temp_name;
    this.direction = temp_playerDir;
    //sotre inittial diection for reset
    this.initialDirection = temp_playerDir;
    this.xspeed = temp_xspeed;
    this.initialxspeed = temp_xspeed;
    this.x = temp_x;
    this.initialX = temp_x;
    this.y = temp_y;
    this.initialY = temp_y
    this.r = 20;
    this.yspeed = 0;
    this.total = 5;
    this.isFollowing = false;
    this.isFollowed = false;

    this.playerRings = []; // store the rings within a local array
    for(var i = 0; i < this.total; i++) {
      this.playerRings.push({});
    }

  }

  resetPlayer(){
    this.xspeed = this.initialxspeed;
    this.x = this.initialX;
    this.y = this.initialY;
    this.r = 20;
    this.yspeed = 0;
    this.total = 5;
    this.isFollowing = false;
    this.isFollowed = false;
    this.direction = this.initialDirection;

    this.playerRings = []; // store the rings within a local array
    for(var i = 0; i < this.total; i++) {
      this.playerRings.push({});
    }
    // console.log("reset: " + this.direction + "and reset: " + this.total);
    console.log("player was reset " + this.name);
    console.log("is following is " + this.isFollowing);

  }

  eat(food) {
    var d = dist(this.x, this.y, food.x, food.y);
    if (d < scl) {
      this.total++;
      // pushing empty object into this.playerRings for now
      // when we have a Ring class we'll push that into this.playerRings
      // like: this.playerRings.push(new NewRingClass());
      this.playerRings.push({});
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

  incrementTotal(amount) {
    this.total = this.total + amount;
    // suppose total = 1.5
    // and amount is 1.2
    // new total: 2.7
    // TODO: FIX THIS.
    if(Number.isInteger(this.total)) {
      if(amount < 0) {
        this.playerRings.pop();
      } else {
        this.playerRings.push({});
      }
    }
  }

  updateTotal(otherPlayer) {
    if (this.isFollowing) {
      this.incrementTotal(-0.005);
      otherPlayer.incrementTotal(0.005);
    }
  }

  update(amount) {
    //directional speed of player
    if(typeof(amount) === 'undefined') {
      this.x = this.x + this.xspeed * scl;
      this.y = this.y + this.yspeed * scl;
    } else {
      this.x = this.x + this.xspeed * amount;
      this.y = this.y + this.yspeed * amount;
    }

    //loop player around screen
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


//FAIL
  show() {
    noStroke();
    //colored player circle
    ellipse(this.x, this.y, scl/4, scl/4);
    noFill();
    stroke(255, 200);
     //make array of player rings be empty
    //loop through the rings
    for (var i = 1; i < this.playerRings.length + 1; i++) {
      ellipse(this.x, this.y, scl/2 + i*scl/2);
    }


    // show() {
    //   noStroke();
    //   //colored player circle
    //   ellipse(this.x, this.y, scl/4, scl/4);
    //   //rings around players
    //   noFill();
    //   stroke(255, 200);
    //   for (var i = 1; i < this.total; i++) {
    //     ellipse(this.x, this.y, scl/2 + i * scl/2);
    //   }



//extra following rings
    // if (this.isFollowing == true && this.direction == "right") {
    //   ellipse(this.x - 10, this.y, scl/2 + 10 * scl/2)
    // } else if (this.isFollowing == true && this.direction == "left") {
    //   ellipse(this.x + 10, this.y, scl/2 + 10 * scl/2)
    // } else if (this.isFollowing == true && this.direction == "up") {
    //   ellipse(this.x, this.y + 10, scl/2 + 10 * scl/2)
    // } else if (this.isFollowing == true && this.direction == "down") {
    //   ellipse(this.x, this.y - 10, scl/2 + 10 * scl/2)
    // } else {
    //   // ellipse(this.x, this.y, scl/2 + i * scl/2)
    // }

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
