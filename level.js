// levels need to: draw themselves & know when over (both success and failure)
class Level {
  constructor() {
    this.leaderRing = new LeaderRing(scl);

  };
  resetLevel() {}
  //first, a function to check if the game is over
  isGameOverCheck(player1, player2) {
    if (player1.total <= 0 || player2.total <= 0) {
      return true;
    } else {
      return false;
    }
  }
  keyWasPressedLevel(keyCode) {}
  basicLevelDraw(player1, player2, foods) { //basic level draw
    background(30);
    noStroke();
    textSize(standardTextSize);
    // fill(player1Color);
    // text(player1.total.toFixed(2), windowWidth / 2 + 200, windowHeight / 1.2);
    // fill(player2Color);
    // text(player2.total.toFixed(2), windowWidth / 2 - 200, windowHeight / 1.2);
    fill(255);
    //player colour
    textSize(standardTextSize);
    textAlign(CENTER, TOP);
    player1.show();
    player2.show();

    this.leaderRing.drawLeaderRing(player1, player2);
  }
  draw(player1, player2, foods) {
    this.basicLevelDraw(player1, player2, foods);
  }

  foodEaten(player1, player2, foods) {
    for (let i = 0; i < foods.length; i++) {
      if (player1.eat(foods[i])) {
        foods[i].location();
      }

      if (player2.eat(foods[i])) {
        foods[i].location();
      }
    }
  }

  spikeHit(player1, player2, spikes) {
    for(let i = 0; i < spikes.length; i++) {
      player1.collideWithSpike(spikes[i], player2);
      player2.collideWithSpike(spikes[i], player1);
    }
  }
}

class PressKeyToContinue extends Level {
  constructor() {
    super();
    this.keyWasPressed = false;
  }

  //bool needs to be reset when game restarts
  resetLevel() {
    this.keyWasPressed = false;
  }
  draw(player1, player2, foods) {
    // draw our title screen.
    background(30);
    textSize(standardTextSize);
    textAlign(CENTER, TOP);

    fill(player1Color);
    text("player 1 use arrow keys to move", windowWidth / 2, windowHeight / 5);
    fill(player2Color);
    text("player 2 use asdw keys to move", windowWidth / 2, windowHeight / 3);
    fill(200);
    textSize(standardTextSize / 2);

    text("press spacebar to begin", windowWidth / 2, windowHeight / 1.5);
  }
  advanceToNextLevel(player1, player2) {
    return this.keyWasPressed == true;
  }
  keyWasPressedLevel(keyCode) {
    this.keyWasPressed = true;
  }
}
//////////////////////////////////////
//////////welcome level///////////////
class Level0 extends Level {
  constructor() {
    // 'super' calls the 'constructor' of Level (the class we inherit from)
    super();
    this.numTicks = 0;
  };
  //can create a draw inside any level to customize it
  draw(player1, player2, foods) {
    this.numTicks++;
    // this.basicLevelDraw(player1, player2, foods);
    background(30);
    fill(10, 255, 50);
    textSize(standardTextSize);
    textAlign(CENTER, TOP);
    text("Welcome", windowWidth / 2, windowHeight / 2);


  }

  advanceToNextLevel(player1, player2) {
    return this.numTicks >= 200;
  }

  //ticks need to be reset when game restarts
  resetLevel() {
    this.numTicks = 0;
  }
}
////////////////////////////////////////
////// training level - no food ////////
class Level1 extends Level {
  constructor() {
    super();
    this.numTicks = 0;

  };
  draw(player1, player2, foods) {
    this.numTicks++;
    this.basicLevelDraw(player1, player2, foods);

    if (player1.isFollowing) {
      fill(player2Color);
      noStroke();
      text("Blue is Leading", windowWidth / 2, windowHeight / 1.2);
    } else if (player2.isFollowing) {
      fill(player1Color);
      noStroke();
      text("Pink is Leading", windowWidth / 2, windowHeight / 1.2);
    } else {}

    if (intro_music.isPlaying()) {
      intro_music.stop();
    } else {
      // intro_music.play();
    }

  }

  advanceToNextLevel(player1, player2) {
    return this.numTicks >= 3000;
  }
  //ticks need to be reset when game restarts
  resetLevel() {
    this.numTicks = 0;
  }

}
//////////////////////////////////////
//////////food level//////////////////
class Level2 extends Level {
  constructor() {
    super();
    this.spikes = [];
    this.numTicks = 0;
    //create spikes
    for (var i = 0; i < 2; i++) {
      this.spikes[i] = new Spike(scl);
      this.spikes[i].location();
    }
  };
  spikeHit(player1, player2, spikes) {
    for(let i = 0; i < spikes.length; i++) {
      player1.collideWithSpike(spikes[i], player2);
      player2.collideWithSpike(spikes[i], player1);
    }
  }

  draw(player1, player2, foods) {
    this.numTicks++;


    this.foodEaten(player1, player2, foods);
    this.spikeHit(player1, player2, this.spikes);

    this.basicLevelDraw(player1, player2, foods);
    for (let i = 0; i < foods.length; i++) {
      foods[i].show();
    }
    for (let i = 0; i < this.spikes.length; i++) {
      this.spikes[i].show();
    }
  }
  advanceToNextLevel(player1, player2) {
    if (player1.total > 7000 || player2.total > 7000) {
      console.log("switching from level 2 to level 3");
      return true;
    } else {
      return false;
    }
  }
}
////////////////////////////////////
///////// whatever level ///////////
class Level3 extends Level {
  constructor() {
    super();
  };
  draw(player1, player2, foods) {
    this.foodEaten(player1, player2, foods);

    this.basicLevelDraw(player1, player2, foods);
    for (let i = 0; i < foods.length; i++) {
      foods[i].show();
    }
  }
  advanceToNextLevel(player1, player2) {
    if (player1.total > 1000 || player2.total > 1000) {
      console.log("you win");
      // return true;
    } else {
      return false;
    }
  }
}
///////////////////////////////////////
//////// post-death level ////////////
class FinalLevel extends Level {
  constructor() {
    super();
    this.numTicks = 0;
  }
  draw(player1, player2, foods) {
    // this.dissolvePlayer(player1, player2);
    // console.log("you are dead");
    // background(255, 0, 0);
    noStroke();
    text("GAME OVER!!!", windowWidth / 2, windowHeight / 2);

    stroke(255);
    if (player2.total <= 0 && player1.total <= 0) {
      noFill();
      // ellipse(player1.x, player1.y, player1.r);
      // ellipse(player2.x, player2.y, player1.r);
      player1.deathDraw();
      player2.deathDraw();

    } else if (player2.total <= 0 && player1.total > 0) {
      noFill();
      // ellipse(player2.x, player2.y, player1.r);
      // translate(player2.x, player2.y);
      player2.deathDraw();

    } else if (player1.total <= 0 && player2.total > 0){
      noFill();
      // ellipse(player1.x, player1.y, player1.r);

      // translate(player1.x, player1.y);

      player1.deathDraw();

    } else {}
    this.numTicks++;
  }
  advanceToNextLevel(player1, player2) {
    return this.numTicks >= 100;
  }
  resetLevel() {
    this.numTicks = 0;
    noStroke();
  }
}
