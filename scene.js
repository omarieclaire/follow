/////////////////////
//// Main Scene /////
/////////////////////
// scenes need to: draw themselves & know when to end (success and failure)
class Scene {
  constructor() {
    // this.leaderRing = new LeaderRing(scl);
    this.keyModes = ["standard", "split", "sharedhorizon", "simultaneous"];
    this.keyModeIndex = 0;
    this.player1LeftKeyDown = false;
    this.player2RightKeyDown = false;
  };
  resetScene() {
    this.keyModeIndex = 0;
    this.player1LeftKeyDown = false;
    this.player2RightKeyDown = false;
  }

  setupFromPreviousScene(previousScene) {
    this.keyModeIndex = previousScene.keyModeIndex;
    this.player1LeftKeyDown = previousScene.player1LeftKeyDown;
    this.player2RightKeyDown = previousScene.player2RightKeyDown;
  }

  // function to
  playStartSound() {}

  //first, a function to check if the game is over
  isGameOverCheck(player1, player2) {
    if (player1.total <= 0 || player2.total <= 0) {
      deathSound.play();
      return true;
    } else {
      return false;
    }
  }

  ///////////////////////////
  //// Basic Scene Draw /////
  ///////////////////////////
  basicSceneDraw(player1, player2, foods) {
    background(0, 0, 20);
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

    if (keyIsDown(79)) {
      this.debugScreen();
    } else {}

    // this.leaderRing.drawLeaderRing(player1, player2);
    this.printDebugToScreen();
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
  //~~~~~~~~~~~~~~~~~~~~~~//
  //~~~ debug STUFF ~~~//
  //~~~~~~~~~~~~~~~~~~~~~//

  debugScreen() {
    push();
    var rowHeight = scl / 2 ;
    background(0, 0, 20);
    textSize(standardTextSize/2);
    fill(0, 255, 255);
    strokeWeight(1);
    text("o - Debug and Keys", windowWidth / 2, rowHeight);
    text("m - KeyMode (different play)", windowWidth / 2, rowHeight * 4);
    text("n - Fullscreen", windowWidth / 2, rowHeight * 6);
    text("awsd - Player 1 possible controls", windowWidth / 2, rowHeight * 8);
    text("arrow keys - Player 2 possible controls", windowWidth / 2, rowHeight * 10);
    pop();
  }

  printDebugToScreen(){
    if (keyIsDown(80)) {
      push();
      fill(200);
      // stroke(200);
      textSize(standardTextSize/3);
      textAlign(LEFT, TOP);
      text(this.getCurrentKeyMode(), 30, 30, 100, 100);
      pop();
    } else {}
  }

  //~~~~~~~~~~~~~~~~~~~~~~//
  //~~~ KEYMODE STUFF ~~~//
  //~~~~~~~~~~~~~~~~~~~~~//
  getCurrentKeyMode() {
    return this.keyModes[this.keyModeIndex];
  }

  areWeInAHaltState() {
    //(this.player1LeftDown && this.player2RightKeyDown) || (this.player1UpDown && this.player12RIghtUpDown)
    return this.player1LeftKeyDown && this.player2RightKeyDown;
  }

  keyWasPressed(keyCode, player1, player2) {}
  keyWasReleased(keyCode, player1, player2) {
    // were we previously in a halt state?
    var previouslyHalted = this.areWeInAHaltState();

    if (keyCode == 65) {
      this.player1LeftKeyDown = false;
    } else if (keyCode == RIGHT_ARROW) {
      this.player2RightKeyDown = false;
    }

    // are we currently in a halt state?
    var currentlyHalted = this.areWeInAHaltState();

    // if in a previous halt state and now NOT in a halt state, then resume.
    if (previouslyHalted && !currentlyHalted) {
      if (this.player1LeftKeyDown) {
        player1.changeDirectionLeft(player2);
        player2.changeDirectionLeft(player1);
      } else if (this.player2RightKeyDown) {
        player1.changeDirectionRight(player2);
        player2.changeDirectionRight(player1);
      }
    }
  }

  handleKeyPressMode(keyCode, player1, player2) {
    if (keyCode == 77) {
      // increment the keymode index
      if (this.keyModeIndex == this.keyModes.length - 1) {
        this.keyModeIndex = 0;
      } else {
        this.keyModeIndex++;
      }
      console.log("Changing current mode to: " + this.getCurrentKeyMode());
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

  splitKeyPressMode(keyCode, player1, player2) {
    // hacky split key mode - if keeping should deal with "following" better
    if (keyCode === UP_ARROW) {
      player2.changeDirectionUp(player1);
      player1.changeDirectionUp(player2);

    } else if (keyCode === RIGHT_ARROW) {
      player1.changeDirectionRight(player2);
      player2.changeDirectionRight(player1);

    } else if (keyCode === 65) {
      player2.changeDirectionLeft(player1);
      player1.changeDirectionLeft(player2);

    } else if (keyCode === 83) {
      player1.changeDirectionDown(player2);
      player2.changeDirectionDown(player1);
    }
  }

  sharedHorizonKeyPressMode(keyCode, player1, player2) {
    // hacky split key mode - if keeping should deal with "following" better
    if (keyCode === UP_ARROW) {
      player2.changeDirectionUp(player1);

    } else if (keyCode === DOWN_ARROW) {
      player2.changeDirectionDown(player1);

    } else if (keyCode === RIGHT_ARROW) {
      player1.changeDirectionRight(player2);
      player2.changeDirectionRight(player1);

    } else if (keyCode === 65) {
      player2.changeDirectionLeft(player1);
      player1.changeDirectionLeft(player2);

    } else if (keyCode === 87) {
      player1.changeDirectionUp(player2);

    } else if (keyCode === 83) {
      player1.changeDirectionDown(player2);
    }
  }

  simultaneousKeyPressMode(keyCode, player1, player2) {
    if (keyCode == 65) {
      this.player1LeftKeyDown = true;
    } else if (keyCode == RIGHT_ARROW) {
      this.player2RightKeyDown = true;
    }

    if (this.areWeInAHaltState()) {
      player1.halt();
      player2.halt();
    } else {
      if (keyCode === 65) {
        player2.changeDirectionLeft(player1);
        player1.changeDirectionLeft(player2);
      } else if (keyCode === RIGHT_ARROW) {
        player1.changeDirectionRight(player2);
        player2.changeDirectionRight(player1);
      }
    }
  }


  movePlayerOnKeyPress(keyCode, player1, player2) {
    var keyMode = this.getCurrentKeyMode();
    if (keyMode == "standard") {
      this.standardKeyPressMode(keyCode, player1, player2);
    } else if (keyMode == "split") {
      this.splitKeyPressMode(keyCode, player1, player2);
    } else if (keyMode == "sharedhorizon") {
      this.sharedHorizonKeyPressMode(keyCode, player1, player2);
    } else if (keyMode == "simultaneous") {
      this.simultaneousKeyPressMode(keyCode, player1, player2);
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
  }

  draw(player1, player2, foods) {
    background(0, 0, 20);
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
    // introSound.stop();
    // ambientSound.loop();
    this.wasKeyPressed = true;
  }

  //advance to next scene bool needs to be reset when game restarts
  resetScene() {
    super.resetScene();
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
    background(0, 0, 20);
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
    super.resetScene();
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

  playStartSound() {
    newSceneSound.play();
  }
  draw(player1, player2, foods) {
    if (player1.xspeed != 0 || player2.xspeed != 0 || player1.yspeed != 0 || player2.yspeed != 0) {
      this.numTicks++;
    } else {}

   this.basicSceneDraw(player1, player2, foods);
   player1.drawFollowLine(player2);
   player2.drawFollowLine(player1);


    //only print directional cues if player is still living TEXTDISPLAYBUG
    if (this.numTicks <= 1000) {
      //directional text
      push();
      stroke(255);
      strokeWeight(1);
      stroke(player1Color);
      if (player1.isFollowing) {
        // ringMoveSound.loop();
        stroke(player1Color);
        text(player1.direction + " (following)", windowWidth / 4, windowHeight / 1.43);
        // text("Follower", windowWidth / 4, windowHeight / 1.23);
        // stroke(player2Color);
        // text("Leader", windowWidth - windowWidth / 4, windowHeight / 1.23);
      } else if (player2.isFollowing) {
        // ringMoveSound.loop();
        // stroke(player1Color);
        // text("Leader", windowWidth / 4, windowHeight / 1.23);
        stroke(player2Color);
        text(player2.direction + " (following)", windowWidth - windowWidth / 4, windowHeight / 1.43);
        // text("Follower", windowWidth - windowWidth / 4, windowHeight / 1.23);
      } else {
        stroke(player1Color);
        text(player1.direction, windowWidth / 4, windowHeight / 1.43);
        stroke(player2Color);
        text(player2.direction, windowWidth - windowWidth / 4, windowHeight / 1.43);
        // ringMoveSound.stop();
      }
      pop();
    } else {}
  }

  advanceToNextScene(player1, player2) {
    return this.numTicks >= 700; // training scene length
  }
  //ticks need to be reset when game restarts
  resetScene() {
    super.resetScene();
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
      this.spikes[i].location(player1, player2);
    }
  };


   playStartSound() {
     newSceneSound.play();
  }
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
    if (this.numTicks % 5000 == 0) {
      this.spikes.push(new Spike(scl));
    }

    for (let i = 0; i < this.spikes.length; i++) {
      this.spikes[i].show();
    }

    player1.drawFollowLine(player2);
    player2.drawFollowLine(player1);

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
    super.resetScene();
    this.numTicks = 0;
  }
}
/////////////////////////
//// bonus scene ////
/////////////////////////
class BonusScene extends Scene {
  constructor() {
    super();
  };

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
    text("begin again?", windowWidth / 2, windowHeight / 2);
    // text("One of you may have more rings but you are both dead", windowWidth / 2, windowWidth - windowHeight / 4);
    this.numTicks++;
  }
  advanceToNextScene(player1, player2) {
    return this.numTicks >= 300;
  }
  resetScene() {
    super.resetScene();
    this.numTicks = 0;
    noStroke();
  }
}
