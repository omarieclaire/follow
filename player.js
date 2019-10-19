class Player {
  //constructor is a method which is run only once to set up the object
  constructor(temp_name, temp_playerDir, temp_xspeed, xOffSet, scl, tmp_playerColor, tmp_playerFadedColor, num) {
    this.scl = scl; //note: I don't reset this in the reset, maybe I should
    this.name = temp_name;
    this.direction = temp_playerDir;
    this.initialDirection = temp_playerDir; //store initial diection for reset
    this.xspeed = temp_xspeed;
    this.initialxspeed = temp_xspeed;
    this.lastXSpeed = this.xspeed;
    this.x = xOffSet;
    this.initialXOffset = xOffSet;
    this.y = windowHeight / 2;
    this.r = scl;
    this.yspeed = 0;
    this.lastYSpeed = this.yspeed;
    this.total = 8;
    this.isFollowing = false;
    this.isFollowed = false;
    this.playerColor = tmp_playerColor;
    this.playerFadedColor = tmp_playerFadedColor;
    this.poppedRings = [];
    this.numTicksPoppedRing = 0;
    this.ringSpacer = this.scl / 4;
    this.explodeParticles = [];
    this.followSoundClass = new FollowSound();

    this.numTicks = 0;
    // this.newColor = [0, 255, 255];
    this.windowLoopSpacer = this.scl / 2;

    // the number of times i've loope while in following state
    this.numLoops = 0;

    this.playerRings = []; // store the rings within a local array
    let randomColors = [
      [119, 37, 164],
      [167, 105, 201],
      [138, 66, 178],
      [96, 14, 142],

    ];
    for (var i = 0; i < this.total; i++) { //for each point in score
      this.playerRings.push(new Rings(this, this.scl, random(randomColors))); //push a new ring to array
    }

    this.explodeParticles = [];
    for (var i = 0; i < 500; i++) {
      this.explodeParticles.push(new ExplodeParticle());
    }
  }

  resetPlayer() {
    this.xspeed = this.initialxspeed;
    this.lastXSpeed = this.xspeed;
    this.x = this.initialXOffset;
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

    this.numTicks = 0;
    // this.newColor = [0, 255, 255];
    this.windowLoopSpacer = this.scl / 2;
    this.hasLooped = false;
    this.loopDirection;


    this.playerRings = []; // store the rings within a local array
    let randomColors = [
      [119, 37, 164],
      [167, 105, 201],
      [138, 66, 178],
      [96, 14, 142],

    ];
    for (var i = 0; i < this.total; i++) { //for each point in score
      this.playerRings.push(new Rings(this, this.scl, random(randomColors))); //push a new ring to array
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

  pointsForWaveyLine(x1, y1, x2, y2, numSamples, phase, amplitude, frequency) {
    var xStart = x1;
    var yStart = y1;
    var xEnd = x2;
    var yEnd = y2;
    var data = [];
    var xDelta = xEnd - xStart;
    var yDelta = yStart - yEnd;
    var vecLength = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
    // Avoid divide by zero
    vecLength = Math.max(vecLength, 0.0001);

    // normalize it
    xDelta = xDelta / vecLength;
    yDelta = yDelta / vecLength;

    var angle = Math.atan2(yDelta, xDelta);
    var currentTime = Date.now();

    for (var i = 0; i < numSamples; i++) {
      var progress = (i.toFixed(10) / numSamples);
      var xpos = lerp(xStart, xEnd, progress);
      var ypos = lerp(yStart, yEnd, progress);
      var amp = amplitude * (Math.cos(progress * Math.PI * 2. + 3.14) * 0.5 + 0.5);
      var wave = Math.sin(phase + currentTime * 0.01 + progress * Math.PI * 2.0 * frequency) * amp;

      xpos += Math.sin(angle) * wave * 0.5;
      ypos += Math.cos(angle) * wave * 0.5;

      var entry = {
        x: xpos,
        y: ypos
      };
      data.push(entry);
    }
    return data;
  }

  drawFollowLine(otherPlayer) {
    if (this.isFollowing || this.isFollowed) {
      push();
      strokeWeight(5);
      var playerWavesColours = [[255, 51, 153, 50], [51, 153, 255, 50]];
      // var playerWavesColours = [[255, 51, 153, 50], [51, 153, 255, 50], [0, 255, 255, 50]];
      // var playerWavesFrequencies = [0, 0.5*Math.PI, Math.PI];
      var playerWavesFrequencies = [0.5*Math.PI, Math.PI];
      for(var i = 0; i < playerWavesColours.length; i++) {
        var waveColour = playerWavesColours[i];
        var waveFrequency = playerWavesFrequencies[i];
        var waveyLinePoints = this.pointsForWaveyLine(this.x, this.y, this.targetX, this.targetY, 30, waveFrequency, 20, 25);
fill(waveColour);
stroke(waveColour);
strokeWeight(1);
        beginShape();
        for (var i = 0; i < waveyLinePoints.length; i++) {
          vertex(waveyLinePoints[i].x, waveyLinePoints[i].y);
        }
        endShape();
      }
      pop();
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
      spike.location(this, otherPlayer);
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

  //not being used - kinda broken
  resumeMovement() {
    // this.xspeed = 0.01;
    // this.xspeed = 0.01;
    // console.log("resuming " + this.lastXSpeed);
    // this.xspeed = this.lastXSpeed;
    // this.yspeed = this.lastYSpeed;
  }

  changeRingTotal(amount, x, y, newRingColor) {
    var oldTotal = this.total;
    this.total = this.total + amount;
    //floor of old total minus floor of new total, then the absolute value of that (if pos we leave it, if neg we make it pos)
    var diff = Math.abs(Math.floor(this.total) - Math.floor(oldTotal));
    if (diff >= 1) {
      if (amount < 0) {
        if (amount === -1) {
          this.poppedRings.push(this.playerRings.pop());
        } else {
          this.playerRings.pop();
        }
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

  updateTargetForFollowingLine(otherPlayer) {
    // if I HAVE looped and the other player has NOT looped
    if (this.numLoops - otherPlayer.numLoops == 1) {
      if (this.direction == 'left') {
        this.targetX = otherPlayer.x + width + this.windowLoopSpacer;
        this.targetY = otherPlayer.y
      } else if (this.direction == 'right') {
        this.targetX = otherPlayer.x - width - this.windowLoopSpacer;
        this.targetY = otherPlayer.y
      } else if (this.direction == 'up') {
        this.targetX = otherPlayer.x;
        this.targetY = otherPlayer.y + width + this.windowLoopSpacer;
      } else if (this.direction == 'down') {
        this.targetX = otherPlayer.x;
        this.targetY = otherPlayer.y - width - this.windowLoopSpacer;
      }
     // if I have NOT looped and the other player HAS looped
   } else if (otherPlayer.numLoops - this.numLoops == 1) {
      if (this.direction == 'left') {
        this.targetX = otherPlayer.x - width - this.windowLoopSpacer;
        this.targetY = otherPlayer.y
      } else if (this.direction == 'right') {
        this.targetX = otherPlayer.x + width + this.windowLoopSpacer;
        this.targetY = otherPlayer.y
      } else if (this.direction == 'up') {
        this.targetX = otherPlayer.x;
        this.targetY = otherPlayer.y - width - this.windowLoopSpacer;
      } else if (this.direction == 'down') {
        this.targetX = otherPlayer.x;
        this.targetY = otherPlayer.y + width + this.windowLoopSpacer;
      }
    } else {
      this.targetX = otherPlayer.x;
      this.targetY = otherPlayer.y;
    }
  }

  //directional speed of player
  update(otherPlayer, amount) {
    //for most circumstances we don't pass a value
    if (typeof(amount) === 'undefined') {
      this.x = this.x + this.xspeed * this.scl;
      this.y = this.y + this.yspeed * this.scl;
      //for the collision bug we need to pass a value
    } else {
      this.x = this.x + this.xspeed * amount;
      this.y = this.y + this.yspeed * amount;
    }


    // set up a var for tracking loopstate
    var iHaveLooped = false;
    //loop player around screen
    if (this.x <= 0 - this.windowLoopSpacer) {
      this.x = windowWidth + this.windowLoopSpacer;
      for (var i = 0; i < this.playerRings.length; i++) {
        var theRing = this.playerRings[i];
        theRing.updateLocation(windowWidth - this.windowLoopSpacer, theRing.y);
      }
      iHaveLooped = true;
      //don't change this one to "">="" or the bug comes back!
    } else if (this.x > windowWidth + this.windowLoopSpacer) {
      this.x = 0 - this.windowLoopSpacer;
      for (var i = 0; i < this.playerRings.length; i++) {
        var theRing = this.playerRings[i];
        theRing.updateLocation(0 - this.windowLoopSpacer, theRing.y);
      }
      iHaveLooped = true;
    } else if (this.y <= 0 - this.windowLoopSpacer) {
      this.y = windowHeight + this.windowLoopSpacer;
      for (var i = 0; i < this.playerRings.length; i++) {
        var theRing = this.playerRings[i];
        theRing.updateLocation(theRing.x, windowHeight - this.windowLoopSpacer);
      }
      iHaveLooped = true;
    } else if (this.y > windowHeight + this.windowLoopSpacer) {
      this.y = 0 - this.windowLoopSpacer;
      for (var i = 0; i < this.playerRings.length; i++) {
        var theRing = this.playerRings[i];
        theRing.updateLocation(theRing.x, 0 - this.windowLoopSpacer);
      }
      iHaveLooped = true;
    }

    if(iHaveLooped && (this.isFollowing || this.isFollowed)) {
      this.numLoops++;
    } else if (!this.isFollowing && !this.isFollowed){
      this.numLoops = 0;
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

  ringBreathe() {
    var breatheRate;

    if (this.xspeed == 0 && this.yspeed == 0) {
      breatheRate = 0.05;
    } else {
      breatheRate = 0.02;
    }
    //Change spacing of ring according to time
    //.6 is the limit of how large it can be
    //.025 slows it keyPressDown
    this.ringSpacer = (this.scl / 3.5) + (.6 * Math.sin(this.numTicks * breatheRate));
  }
  //findme
  drawDirectionalArcs(playerDirection) {
    push();
    strokeWeight(2);
    stroke(255, 255, 0);
    noFill();
    if (this.direction == "up") {
      arc(this.x, this.y, this.scl, this.scl, 180, 0);
    } else if (this.direction == "left") {
      arc(this.x, this.y, this.scl, this.scl, 90, 270);
    } else if (this.direction == "down") {
      arc(this.x, this.y, this.scl, this.scl, 0, 180);
    } else if (this.direction == "right") {
      arc(this.x, this.y, this.scl, this.scl, 270, 90);
    } else {}
    pop();
  }

  //FOLLOW ME

  show() {
    this.numTicks++;
    this.ringBreathe();

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
    this.drawDirectionalArcs(this.direction);

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
          thePoppedRing.drawDeadRing((this.scl * 2) + (this.playerRings.length + 1) * this.ringSpacer);
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
      var length = this.currentDiameter()/2;
      push();
      stroke(100);
      strokeWeight(2);
      if (this.direction == "up") {
        let newYCoordinate = this.y + (i * spaceBetweenCircles) + length;
        ellipse(this.x, newYCoordinate, newRadius);
      } else if (this.direction == "down") {
        let newYCoordinate = this.y - (i * spaceBetweenCircles) - length;
        ellipse(this.x, newYCoordinate, newRadius);
      } else if (this.direction == "left") {
        let newXCoordinate = this.x + (i * spaceBetweenCircles) + length;
        ellipse(newXCoordinate, this.y, newRadius);
      } else if (this.direction == "right") {
        let newXCoordinate = this.x - (i * spaceBetweenCircles) - length;
        ellipse(newXCoordinate, this.y, newRadius);
      }
      pop();
    }
  }
}
