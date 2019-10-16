/////////////////////
//// Main Scene /////
/////////////////////
// scenes need to: draw themselves & know when to end (success and failure)
class Scene {
  constructor() {
    // this.leaderRing = new LeaderRing(scl);
    this.keyModes = ["standard", "mirror", "oppose"];
    this.keyModeIndex = 0;
  };
  resetScene() {}
  //first, a function to check if the game is over
  isGameOverCheck(player1, player2) {
    if (player1.total <= 0 || player2.total <= 0) {
      deathSound.play();
      return true;
    } else {
      return false;
    }
  }

  getCurrentKeyMode() {
    return this.keyModes[this.keyModeIndex];
  }

  keyWasPressed(keyCode, player1, player2) {}

  handleKeyPressMode(keyCode, player1, player2) {
    if(keyCode == 77) {
      // increment the keymode index
      if(this.keyModeIndex == this.keyModes.length - 1) {
        this.keyModeIndex = 0;
      } else {
        this.keyModeIndex++;
      }
    }
  }

  ///////////////////////////
  //// Basic Scene Draw /////
  ///////////////////////////
  basicSceneDraw(player1, player2, foods) {
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

    // this.leaderRing.drawLeaderRing(player1, player2);
  }

  draw(player1, player2, foods) {
    this.basicSceneDraw(player1, player2, foods);
  }
  // If food is eaten -> make more food
  foodEaten(player1, player2, foods) {
    for (let i = 0; i < foods.length; i++) {
      if (player1.eat(foods[i])) {
        foods[i].location(player1, player2);
        foodGenSound.play();
      }
      if (player2.eat(foods[i])) {
        foods[i].location(player1, player2);
        foodGenSound.play();
      }
    }
  }

  // If spike is hit -> player loses ring
  spikeHit(player1, player2, spikes) {
    for (let i = 0; i < spikes.length; i++) {
      player1.collideWithSpike(spikes[i], player2);
      player2.collideWithSpike(spikes[i], player1);
    }
  }

  standardKeyPressMode(keyCode, player1, player2) {
    if (keyCode === UP_ARROW) {
      player2.changeDirectionUp(player1);

    } else if (keyCode === DOWN_ARROW) {
      player2.changeDirectionDown(player1);

    } else if (keyCode === RIGHT_ARROW) {
      player2.changeDirectionRight(player1);

    } else if (keyCode === LEFT_ARROW) {
      player2.changeDirectionLeft(player1);

    } else if (keyCode === 87) {
      player1.changeDirectionUp(player2);

    } else if (keyCode === 83) {
      player1.changeDirectionDown(player2);

    } else if (keyCode === 68) {
      player1.changeDirectionRight(player2);

    } else if (keyCode === 65) {
      player1.changeDirectionLeft(player2);
    }
  }

  movePlayerOnKeyPress(keyCode, player1, player2) {
    var keyMode = this.getCurrentKeyMode();
    if(keyMode == "standard") {
      this.standardKeyPressMode(keyCode, player1, player2);
    } else if (keyMode == "mirror") {
    } else if (keyMode == "oppose") {
    }
  }
}

/////////////////////////////
//// Instruction Scene  ////
////////////////////////////
class InstructionScene extends Scene {
  constructor() {
    super();
    this.wasKeyPressed = false;
    introSound.loop();
    console.log("intro music playing");

  }

  draw(player1, player2, foods) {
    background(30);
    textSize(standardTextSize);
    textAlign(CENTER, TOP);
    fill(player1Color);
    text("player 1 use asdw keys to move", windowWidth / 2, windowHeight / 5);
    fill(player2Color);
    text("player 2 use arrow keys to move", windowWidth / 2, windowHeight / 3);
    fill(200);
    textSize(standardTextSize / 2);
    text("press spacebar to begin", windowWidth / 2, windowHeight / 1.5);
  }

  advanceToNextScene(player1, player2) {
    return this.wasKeyPressed == true;
  }

  keyWasPressed(keyCode, player1, player2) {
    introSound.stop();
    // ambientSound.loop();
    this.wasKeyPressed = true;
  }

  //advance to next scene bool needs to be reset when game restarts
  resetScene() {
    this.wasKeyPressed = false;
  }
}

//////////////////////////
////  welcome scene  ////
/////////////////////////

class WelcomeScene extends Scene {
  constructor() {
    // 'super' calls the 'constructor' of Scene (the class we inherit from)
    super();
    this.numTicks = 0;
  };
  //can create a draw inside any scene to customize it
  draw(player1, player2, foods) {
    this.numTicks++;
    // this.basicSceneDraw(player1, player2, foods);
    background(30);
    fill(10, 255, 50);
    textSize(standardTextSize);
    textAlign(CENTER, TOP);
    text("Welcome", windowWidth / 2, windowHeight / 2);
  }

  advanceToNextScene(player1, player2) {
    return this.numTicks >= 100;
  }

  //ticks need to be reset when game restarts
  resetScene() {
    this.numTicks = 0;
  }
}
////////////////////////
//// training scene ////
////////////////////////
class TrainingScene extends Scene {
  constructor() {
    super();
    this.numTicks = 0;

  };

  keyWasPressed(keyCode, player1, player2) {
    this.handleKeyPressMode(keyCode, player1, player2);
    this.movePlayerOnKeyPress(keyCode, player1, player2);
  }
  draw(player1, player2, foods) {
    this.numTicks++;
    this.basicSceneDraw(player1, player2, foods);


    //only print directional cues if player is still living TEXTDISPLAYBUG
    if (player1.total > 0 && player2.total > 0) {
      //directional text

      push();
      stroke(255);
      strokeWeight(1);

      stroke(player1Color);
      text(player1.direction, windowWidth / 4, windowHeight / 1.43);
      stroke(player2Color);
      text(player2.direction, windowWidth - windowWidth / 4, windowHeight / 1.43);
      if (player1.isFollowing) {
        // ringMoveSound.loop();
        stroke(player1Color);
        text("Follower", windowWidth / 4, windowHeight / 1.23);
        stroke(player2Color);
        text("Leader", windowWidth - windowWidth / 4, windowHeight / 1.23);

      } else if (player2.isFollowing) {
        // ringMoveSound.loop();
        stroke(player1Color);
        text("Leader", windowWidth / 4, windowHeight / 1.23);
        stroke(player2Color);
        text("Follower", windowWidth - windowWidth / 4, windowHeight / 1.23);

      } else {
        // ringMoveSound.stop();

      }
      pop();
    }
    else {
    }
  }

  advanceToNextScene(player1, player2) {
    return this.numTicks >= 1000; // training scene length
  }
  //ticks need to be reset when game restarts
  resetScene() {
    this.numTicks = 0;
  }

}
///////////////////////
////  play scene  ////
//////////////////////
class PlayScene extends Scene {
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
    for (let i = 0; i < spikes.length; i++) {
      player1.collideWithSpike(spikes[i], player2);
      player2.collideWithSpike(spikes[i], player1);
    }
  }

  keyWasPressed(keyCode, player1, player2) {
    this.handleKeyPressMode(keyCode, player1, player2);
    this.movePlayerOnKeyPress(keyCode, player1, player2);
  }

  draw(player1, player2, foods) {
    this.numTicks++;
    this.foodEaten(player1, player2, foods);
    this.spikeHit(player1, player2, this.spikes);

    this.basicSceneDraw(player1, player2, foods);
    for (let i = 0; i < foods.length; i++) {
      foods[i].show();
    }

    // every 1000 ticks, add a spike.
    if(this.numTicks % 5000 == 0) {
      this.spikes.push(new Spike(scl));
    }

    for (let i = 0; i < this.spikes.length; i++) {
      this.spikes[i].show();
    }

  }
  advanceToNextScene(player1, player2) {
    if (player1.total > 7000000 || player2.total > 700000) {
      return true;
    } else {
      return false;
    }
  }
  //advance to next scene bool needs to be reset when game restarts
  resetScene() {
    this.numTicks = 0;
  }
}
/////////////////////////
//// whatever scene ////
/////////////////////////
class WhateverScene extends Scene {
  constructor() {
    super();
  };
  draw(player1, player2, foods) {
    this.foodEaten(player1, player2, foods);

    this.basicSceneDraw(player1, player2, foods);
    for (let i = 0; i < foods.length; i++) {
      foods[i].show();
    }
  }
  advanceToNextScene(player1, player2) {
    if (player1.total > 1000 || player2.total > 1000) {
      console.log("you win");
      // return true;
    } else {
      return false;
    }
  }
  resetScene() {
  }
}
/////////////////////
//// final scene ////
/////////////////////
class FinalScene extends Scene {
  constructor() {
    super();
    this.numTicks = 0;
  }
  draw(player1, player2, foods) {
    stroke(255);
    player1.halt();
    player2.halt();
    if (player2.total <= 0 && player1.total <= 0) {
      fill(1);
      stroke(1);
      ellipse(player1.x, player1.y, player1.r);
      ellipse(player2.x, player2.y, player1.r);
      player1.deathDraw();
      player2.deathDraw();
    } else if (player2.total <= 0 && player1.total > 0) {
      fill(1);
      stroke(1);
      ellipse(player2.x, player2.y, player1.r);
      player2.deathDraw();

    } else if (player1.total <= 0 && player2.total > 0) {
      fill(1);
      stroke(1);
      ellipse(player1.x, player1.y, player1.r);
      player1.deathDraw();

    } else {}
    // GAME OVER TEXT
    noStroke();
    text("GAME OVER!!!", windowWidth / 2, windowHeight / 2);
    // text("One of you may have more rings but you are both dead", windowWidth / 2, windowWidth - windowHeight / 4);

    this.numTicks++;
  }
  advanceToNextScene(player1, player2) {
    return this.numTicks >= 300;
  }
  resetScene() {
    this.numTicks = 0;
    noStroke();
  }
}