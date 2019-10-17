class Player {
  //constructor is a method which is run only once to set up the object
  constructor(temp_name, temp_playerDir, temp_xspeed, xOffSet, scl, tmp_playerColor, tmp_playerFadedColor) {
    this.scl = scl; //note: I don't reset this in the reset, maybe I should
    this.name = temp_name;
    this.direction = temp_playerDir;
    this.initialDirection = temp_playerDir; //store inittial diection for reset
    this.xspeed = temp_xspeed;
    this.initialxspeed = temp_xspeed;
    this.lastXSpeed = this.xspeed;
    this.x = windowWidth / 2 + xOffSet;
    this.initialXOffset = xOffSet;
    this.y = windowHeight / 2;
    this.r = scl;
    this.yspeed = 0;
    this.lastYSpeed = this.yspeed;
    this.total = 5;
    this.isFollowing = false;
    this.isFollowed = false;
    this.playerColor = tmp_playerColor;
    this.playerFadedColor = tmp_playerFadedColor;
    this.poppedRings = [];
    this.numTicksPoppedRing = 0;
    this.ringSpacer = this.scl / 4;
    this.explodeParticles = [];
    this.followSoundClass = new FollowSound();
    // this.newColor = [0, 255, 255];


    this.playerRings = []; // store the rings within a local array
    for (var i = 0; i < this.total; i++) { //for each point in score
      this.playerRings.push(new Rings(this, this.scl, ringColor)); //push a new ring to array
    }

    this.explodeParticles = [];
    for (var i = 0; i < 500; i++) {
      this.explodeParticles.push(new ExplodeParticle());
    }
  }

  resetPlayer() {
    this.xspeed = this.initialxspeed;
    this.lastXSpeed = this.xspeed;
    this.x = windowWidth / 2 + this.initialXOffset;
    this.y = windowHeight / 2;
    this.r = scl;
    this.yspeed = 0;
    this.lastYSpeed = this.yspeed;
    this.total = 5;
    this.isFollowing = false;
    this.isFollowed = false;
    this.direction = this.initialDirection;
    this.poppedRings = [];
    this.numTicksPoppedRing = 0;
    this.followSound = new FollowSound();


    this.playerRings = []; // store the rings within a local array
    for (var i = 0; i < this.total; i++) {
      this.playerRings.push(new Rings(this, this.scl, ringColor));
    }
    this.explodeParticles = [];
    for (var i = 0; i < 500; i++) {
      this.explodeParticles.push(new ExplodeParticle());
    }
  }

  handlePlayerFollowing(otherPlayer, ourFutureDirection) {
    //this is happening right after playerX presses a directional key, BEFORE the direction of playerX changes
    if (this.direction == otherPlayer.direction) { //only deal with cases where there is ALREADY a "follower"
      if (ourFutureDirection != this.direction) { //is someone unfollowing someone?
        this.isFollowing = false; //then turn off all follows
        otherPlayer.isFollowing = false;
        this.isFollowed = false;
        otherPlayer.isFollowed = false;
      }
    } else { // if there is no current follower
      if (ourFutureDirection == otherPlayer.direction) {
        this.isFollowing = true;
        otherPlayer.isFollowed = true;
        // console.log("when called by player collision this is a bug. no one is following anyone");
      }
    }
  }

  eat(food) {
    var d = dist(this.x, this.y, food.x, food.y);
    if (d < this.currentDiameter() / 2 + this.scl / 2) {
      eatSound.play();
      this.changeRingTotal(1, this.x, this.y, food.color);
      return true;
    } else {
      return false;
    }
  }

  deathDraw() {
    fill(this.playerColor);
    noStroke();

    // speed = 10;
    for (let i = 0; i < this.explodeParticles.length; i++) {
      this.explodeParticles[i].initialPosition(this.x, this.y);
      this.explodeParticles[i].update();
      this.explodeParticles[i].show();
    }
  }

  currentDiameter() {
    return this.scl + 2 * this.playerRings.length * this.ringSpacer;
  }

  collideWithSpike(spike, otherPlayer) {
    var d = dist(this.x, this.y, spike.x, spike.y);
    if (d < (this.currentDiameter() / 2) + (this.scl / 2)) {
      if (!hitSound.isPlaying()) {
        hitSound.play();
      }
      this.changeRingTotal(-1, this.x, this.y);
      // otherPlayer handles flip direction because we need to
      // update isFollowed and isFollowing whenever a player's direction
      // is changed.
      console.log("collide then flip");
      this.flipDirection(otherPlayer);
      return true;
    } else {
      return false;
    }
  }

  dir(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  flipDirection(otherPlayer) {
    if (this.direction == "up") {
      this.changeDirectionDown(otherPlayer);
    } else if (this.direction == "down") {
      this.changeDirectionUp(otherPlayer);
    } else if (this.direction == "left") {
      this.changeDirectionRight(otherPlayer);
    } else if (this.direction == "right") {
      this.changeDirectionLeft(otherPlayer);
    }
  }

  changeDirectionDown(otherPlayer) {
    this.dir(0, 0.1);
    this.handlePlayerFollowing(otherPlayer, "down");
    this.direction = "down";
  }
  changeDirectionUp(otherPlayer) {
    this.dir(0, -0.1);
    this.handlePlayerFollowing(otherPlayer, "up");
    this.direction = "up";
  }
  changeDirectionLeft(otherPlayer) {
    this.dir(-0.1, 0);
    this.handlePlayerFollowing(otherPlayer, "left");
    this.direction = "left";
  }
  changeDirectionRight(otherPlayer) {
    this.dir(0.1, 0);
    this.handlePlayerFollowing(otherPlayer, "right");
    this.direction = "right";
  }

  halt() {
    this.lastXSpeed = this.xspeed;
    this.lastYSpeed = this.yspeed;
    this.xspeed = 0;
    this.yspeed = 0;
  }

  resumeMovement() {
    // this.xspeed = 0.01;
    // this.xspeed = 0.01;

    console.log("resuming " + this.lastXSpeed);

    this.xspeed = this.lastXSpeed;
    this.yspeed = this.lastYSpeed;
  }

  changeRingTotal(amount, x, y, newRingColor) {
    var oldTotal = this.total;
    this.total = this.total + amount;
    //floor of old total minus floor of new total, then the absolute value of that (if pos we leave it, if neg we make it pos)
    var diff = Math.abs(Math.floor(this.total) - Math.floor(oldTotal));
    if (diff >= 1) {
      if (amount < 0) {
        this.playerRings.pop();
      } else {
        // create a ring that follows 'this' and has the start x and y coordinates passed to changeRingTotal
        // if we pass a new ringcolor use it, otherwise use the default
        if (typeof(newRingColor) === "undefined") {
          this.playerRings.push(new Rings(this, this.scl, ringColor, x, y)); //add a ring
        } else {
          this.playerRings.push(new Rings(this, this.scl, newRingColor, x, y)); //add a ring
        }
      }
    }
  }

  colorOfOuterMostRing() {
    // look at the last element of the array and ask what colour it is.
    // return undefined if the array is empty
     if (this.playerRings.length == 0) {
      return undefined;
    } else {
      return this.playerRings[this.playerRings.length - 1].ringColor;
    }
  }

  //update the score on players - also changes rings
  updateTotal(otherPlayer) {
    //ring movement from one player to another
    var ringTransferSpd = 0.01;
    if (this.isFollowing) {
      //increment!
      //other player is an object. we pass the values below into changeringtotal.
      //create a ring that follows other player
      otherPlayer.changeRingTotal(ringTransferSpd, this.x, this.y, this.colorOfOuterMostRing());
      //decrement! (note: we never use this.x and this.y here bc of the above logic (amount < 0))
      this.changeRingTotal(-ringTransferSpd, this.x, this.y);
    }
  }
  //directional speed of player
  update(amount) {
    //for most circumstances we don't pass a value
    if (typeof(amount) === 'undefined') {
      this.x = this.x + this.xspeed * this.scl;
      this.y = this.y + this.yspeed * this.scl;
      //for the collision bug we need to pass a value
    } else {
      this.x = this.x + this.xspeed * amount;
      this.y = this.y + this.yspeed * amount;
    }

    //loop player around screen
    var windowLoopSpacer = this.scl / 2;
    if (this.x <= 0 - windowLoopSpacer) {
      this.x = windowWidth + windowLoopSpacer;
      for (var i = 0; i < this.playerRings.length; i++) {
        var theRing = this.playerRings[i];
        theRing.updateLocation(windowWidth - windowLoopSpacer, theRing.y);
      }
      // Rings.x = windowWidth - this.scl;
      // leaderRing.x = windowWidth - this.scl;

      //don't change this one to "">="" or the bug comes back!
    } else if (this.x > windowWidth + windowLoopSpacer) {
      this.x = 0 - windowLoopSpacer;
      for (var i = 0; i < this.playerRings.length; i++) {
        var theRing = this.playerRings[i];
        theRing.updateLocation(0 - windowLoopSpacer, theRing.y);
      }
    } else if (this.y <= 0 - windowLoopSpacer) {
      this.y = windowHeight + windowLoopSpacer;
      for (var i = 0; i < this.playerRings.length; i++) {
        var theRing = this.playerRings[i];
        theRing.updateLocation(theRing.x, windowHeight - windowLoopSpacer);
      }
    } else if (this.y > windowHeight + windowLoopSpacer) {
      this.y = 0 - windowLoopSpacer;
      for (var i = 0; i < this.playerRings.length; i++) {
        var theRing = this.playerRings[i];
        theRing.updateLocation(theRing.x, 0 - windowLoopSpacer);
      }

    }
    // following player jitter (x speed is for the death case)
    if (this.isFollowing && this.xspeed != 0) {
      this.x = this.x + random(-2, 2);
      this.y = this.y + random(-2, 2);
    }
    for (var i = 0; i < this.playerRings.length; i++) {
      this.playerRings[i].move();
    }
  }

  //FOLLOW ME

  show() {
    noStroke();
    //colored player circle
    if (this.isFollowing) {
      fill(this.playerFadedColor);
    } else {
      fill(this.playerColor);
    }
    //follow sound
    this.followSoundClass.playFollowSound(this.isFollowing, this.isFollowed);

    // player circle / face
    ellipse(this.x, this.y, this.scl, this.scl);
    
    noFill();
    // stroke(255, 200);
    push(); //set original drawstate
    for (var i = 0; i < this.playerRings.length; i++) {
      if (this.isFollowed && i == this.playerRings.length - 1) {
        // strokeWeight(5);
        // stroke(pointColor);
        // stroke(this.playerColor);


      } else {
        // strokeWeight(.25);
        // stroke(this.playerColor);
      }
      this.playerRings[i].draw(this.scl + 2 * (i + 1) * this.ringSpacer);
    }

    // draw dead ring
    if (this.poppedRings.length > 0 && this.numTicksPoppedRing < 50) {
      for (var i = 0; i < this.poppedRings.length; i++) {
        var thePoppedRing = this.poppedRings[i];
        if (typeof(thePoppedRing) !== 'undefined') {
          thePoppedRing.drawDeadRing(this.scl + this.playerRings.length * this.ringSpacer);
        } else {
          // the popped ring should never be undefined. but somehow it is occasionally.
          // if a ring was undefined then we would not have been able to draw it.
          // not sure how a ring gets popped and then becomes undefined.
          // we should try to get the chrome debugger to work here and
          // investigate.
          //debug();
        }
      }
      this.numTicksPoppedRing++;
    } else {
      this.numTicksPoppedRing = 0;
      this.poppedRings.pop();
    }
    pop(); //pop back to original drawstate

    //player trail
    let numberOfTrails = 5;
    let spaceBetweenCircles = 15;
    let radiusShrinkFactor = 0.5;

    for (var i = 1; i < numberOfTrails; i++) {
      //having 1 + ensures that the divisor is always above 1 so the trail will never be bigger than the player
      let newRadius = (this.scl / 4) / (1 + i * radiusShrinkFactor);
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
