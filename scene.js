/////////////////////
//// Main Scene /////
/////////////////////
// scenes need to: draw themselves & know when to end (success and failure)
class Scene {
  constructor() {
    this.leaderRing = new LeaderRing(scl);
    this.keyModes = ["simultaneous", "solo", "toggle", "split", "sharedhorizon"];
    this.keyModeIndex = 0;
    this.toggleFlag = true;
    this.player1LeftKeyDown = false;
    this.player2RightKeyDown = false;
    this.setInstructionText();
  };
  resetScene() {
    this.keyModeIndex = 0;
    this.player1LeftKeyDown = false;
    this.player2RightKeyDown = false;
    this.toggleFlag = true;
    this.setInstructionText();
  }
  setupFromPreviousScene(previousScene) {
    this.keyModeIndex = previousScene.keyModeIndex;
    this.player1LeftKeyDown = previousScene.player1LeftKeyDown;
    this.player2RightKeyDown = previousScene.player2RightKeyDown;
    this.toggleFlag = previousScene.toggleFlag;
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

  drawCountDown() {
    if (this.getCurrentKeyMode() === "simultaneous") {
      this.countDown--;
      push();
      textSize(standardTextSize);

      fill(138, 43, 226); //purple
      noStroke();
      textAlign(CENTER, TOP);
      var numberToPrint = floor(this.countDown / 100);

      text(numberToPrint, windowWidth / 5, height / 8, 3 / 5 * windowWidth, 3 / 5 * height);
      pop();
    }
  }
  ///////////////////////////
  //// Basic Scene Draw /////
  ///////////////////////////
  basicSceneDraw(player1, player2, foods) {
    push();
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

    player1.drawFollowLine(player2);
    player2.drawFollowLine(player1);

    player1.show();
    player2.show();

    if (keyIsDown(79)) {
      this.debugScreen();
    } else {}

    // this.leaderRing.drawLeaderRing(player1, player2);
    this.printDebugToScreen();
    pop();
  }

  wideSceneDraw() {
    if (this.getCurrentKeyMode() == "simultaneous") {
      push();
      fill(1);
      // rect(0, 0, windowWidth, windowHeight / 6);
      // rect(0, windowHeight - windowHeight / 6, windowWidth, windowHeight);
      pop();
    }
  }

  draw(player1, player2, foods) {
    this.basicSceneDraw(player1, player2, foods);
  }
  // If food is eaten -> make more food
  foodEaten(player1, player2, foods) {
    for (let i = 0; i < foods.length; i++) {
      if (player1.eat(foods[i], player2)) {
        foods[i].location(player1, player2);
        //foodGenSound.play();
      }
      if (player2.eat(foods[i], player1)) {
        foods[i].location(player1, player2);
        //foodGenSound.play();
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
    var rowHeight = scl / 2;
    background(0, 0, 20);
    textSize(standardTextSize / 2);
    fill(0, 255, 255);
    strokeWeight(1);
    var debugText =
      "o - Debug and Keys\n" +
      "m - KeyMode (different play)\n" +
      "i - Fullscreen\n" +
      "awsd - Player 1 possible controls\n" +
      "arrow keys - Player 2 possible controls";
    textLeading(20);
    textAlign(LEFT);
    text(debugText, windowWidth / 2, rowHeight, windowWidth, rowHeight * 10);
    pop();
  }

  printDebugToScreen() {
    if (keyIsDown(80)) {
      push();
      fill(200);
      // stroke(200);
      textSize(standardTextSize / 3);
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
        player2.changeDirectionLeft(player1);
        player1.changeDirectionLeft(player2);
      } else if (this.player2RightKeyDown) {
        player1.changeDirectionRight(player2);
        player2.changeDirectionRight(player1);
      }
    }
  }

  setInstructionText() {
    var keyMode = this.getCurrentKeyMode();
    if (keyMode == "solo") {
      this.instructionText = "Player 1 use wasd keys.\nPlayer 2 use arrow keys.\n\nGive your rings to the other player by going the same direction"
    } else if (keyMode == "toggle") {
      this.instructionText = "Only one player can move at a time.\n\n Hit spacebar to take control from the other player.";
    } else if (keyMode == "split") {
      this.instructionText = "Player 1 can move both players left & up using 'a' and 's'.\nPlayer 2 can move both players down & right using 'right arrow' and 'down arrow'.";
    } else if (keyMode == "sharedhorizon") {
      this.instructionText = "Player 1 steers both players left using the 'a' key.\nPlayer 2 steers both players right using the 'right arrow' key.\n Both players can move up and down independently";
    } else if (keyMode == "simultaneous") {
      this.instructionText = "Button 1 steers left. Button 2 steers right.\n\n When both buttons are down, both players stop";
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
      this.setInstructionText();
      console.log("Changing current mode to: " + this.getCurrentKeyMode());
    }
  }

  //Each Player has complete control of own direction at all times
  //It costs rings to follow (going in the same direction a player is already moving)
  soloKeyPressMode(keyCode, player1, player2) {
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
  //Only one player can use controls at a time (use n & b), but each Player has complete control of own direction
  //It costs rings to follow (going in the same direction a player is already moving)
  toggleKeyPressMode(keyCode, player1, player2) {
    if (keyCode == 32) {
      this.toggleFlag = !this.toggleFlag;
    } else {
      if (this.toggleFlag == true) {
        if (keyCode === UP_ARROW) {
          player2.changeDirectionUp(player1);
        } else if (keyCode === DOWN_ARROW) {
          player2.changeDirectionDown(player1);
        } else if (keyCode === RIGHT_ARROW) {
          player2.changeDirectionRight(player1);
        } else if (keyCode === LEFT_ARROW) {
          player2.changeDirectionLeft(player1);
        }
      } else if (this.toggleFlag == false) {
        if (keyCode === UP_ARROW) {
          player1.changeDirectionUp(player2);
        } else if (keyCode === DOWN_ARROW) {
          player1.changeDirectionDown(player2);
        } else if (keyCode === RIGHT_ARROW) {
          player1.changeDirectionRight(player2);
        } else if (keyCode === LEFT_ARROW) {
          player1.changeDirectionLeft(player2);
        }
      }
    }
  }

  //Player1 controls up and left, player2 controls right and down
  //It costs rings to lead
  splitKeyPressMode(keyCode, player1, player2) {
    // hacky split key mode - if keeping should deal with "following" better
    if (keyCode === UP_ARROW) {
      player2.changeDirectionUp(player1);
      player1.changeDirectionUp(player2);

    } else if (keyCode === RIGHT_ARROW) {
      player2.changeDirectionRight(player1);
      player1.changeDirectionRight(player2);

    } else if (keyCode === 65) {
      player1.changeDirectionLeft(player2);
      player2.changeDirectionLeft(player1);

    } else if (keyCode === 83) {
      player1.changeDirectionDown(player2);
      player2.changeDirectionDown(player1);
    }
  }
  //Player1 controls left, player2 controls right. Each player controlls own up and down
  //It costs rings to lead?
  sharedHorizonKeyPressMode(keyCode, player1, player2) {
    // hacky split key mode - if keeping should deal with "following" better
    if (keyCode === UP_ARROW) {
      player2.changeDirectionUp(player1);

    } else if (keyCode === DOWN_ARROW) {
      player2.changeDirectionDown(player1);

    } else if (keyCode === RIGHT_ARROW) {
      player2.changeDirectionRight(player1);
      player1.changeDirectionRight(player2);

    } else if (keyCode === 65) {
      player1.changeDirectionLeft(player2);
      player2.changeDirectionLeft(player1);

    } else if (keyCode === 87) {
      player1.changeDirectionUp(player2);

    } else if (keyCode === 83) {
      player1.changeDirectionDown(player2);
    }
  }
  //Player1 controls left, player2 controls right. Everything stops if both players hold their buttons together
  //It costs rings to lead?
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
        player2.isFollowed = true; //hacky temp sol
        player2.isFollowing = false;
        player1.isFollowing = true;
        player1.isFollowed = false;
        player1.numLoops = 0;
        player2.numLoops = 0;
      } else if (keyCode === RIGHT_ARROW) {
        player1.changeDirectionRight(player2);
        player2.changeDirectionRight(player1);
        player1.isFollowed = true;
        player1.isFollowing = false;
        player2.isFollowing = true;
        player2.isFollowed = false;
        player1.numLoops = 0;
        player2.numLoops = 0;
      }
    }
  }

  movePlayerOnKeyPress(keyCode, player1, player2) {
    var keyMode = this.getCurrentKeyMode();
    console.log(keyMode);
    if (keyMode == "solo") {
      this.soloKeyPressMode(keyCode, player1, player2);
    } else if (keyMode == "toggle") {
      this.toggleKeyPressMode(keyCode, player1, player2);
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
//////// Title Scene  ///////
////////////////////////////
class TitleScene extends Scene {
  constructor() {
    super();
    this.wasKeyPressed = false;
    // introSound.loop();
  }


  draw(player1, player2, foods) {
    push();
    background(0, 0, 20);
    textSize(standardTextSize * 3);
    textFont(spectral);
    fill(player1Color);
    textAlign(CENTER, CENTER);
    text("F", windowWidth / 8, height / 2.2);
    // text("o", windowWidth / 5, height / 2.2);
    text("L", windowWidth / 2.6, height / 2.2);
    text("L", windowWidth - windowWidth/ 2.6, height / 2.2);
    // text("o", windowWidth / 5, height / 2.2);
    text("W", windowWidth - windowWidth/8, height / 2.2);
    player1.show();
    player2.show();
    fill(200);
    textFont(openSansFont);
    textSize(standardTextSize / 2);
    text("press spacebar to begin", windowWidth / 5, 4 / 5 * height, 3 / 5 * windowWidth, height);
    pop();

    push();
    for (var i = -10; i < 500; i++) {
      noFill();
      strokeWeight(.25);
      stroke('purple');
      // ellipse(windowWidth/2, [i] * 8, 100, 100)
    }
    pop();


    // let xAdd = 400;
    // let yAdd = 180;
    //
    //
    // beginShape();
    // vertex(64 + xAdd, 6.69 + yAdd);
    // vertex(0 + xAdd, 6.69 + yAdd);
    // vertex(0 + xAdd, 120.37 + yAdd);
    // vertex(12.82 + xAdd, 120.37 + yAdd);
    // vertex(12.82 + xAdd, 53.5 + yAdd);
    // vertex(35.67 + xAdd, 53.5 + yAdd);
    // vertex(35.67 + xAdd, 45.55 + yAdd);
    // vertex(12.26 + xAdd, 45.55 + yAdd);
    // vertex(12.26 + xAdd, 17.28 + yAdd);
    // vertex(55.17 + xAdd, 17.28 + yAdd);
    // vertex(64.92 + xAdd, 6.69 + yAdd);
    // endShape();
    //
    //
    // beginShape();
    // vertex(196.72 + xAdd, 6.69 + yAdd);
    // vertex(196.72 + xAdd, 94.74 + yAdd);
    // vertex(255.79 + xAdd, 94.74 + yAdd);
    // vertex(255.79 + xAdd, 81.36 + yAdd);
    // vertex(208.98 + xAdd, 81.36 + yAdd);
    // vertex(208.98 + xAdd, 6.69 + yAdd);
    // vertex(196.72 + xAdd, 6.69 + yAdd);
    // endShape();
    //
    //
    // beginShape();
    // vertex(286.33 + xAdd, 6.69 + yAdd);
    // vertex(286.33 + xAdd, 94.74 + yAdd);
    // vertex(345.4 + xAdd, 94.74 + yAdd);
    // vertex(345.4 + xAdd, 81.36 + yAdd);
    // vertex(298.59 + xAdd, 81.36 + yAdd);
    // vertex(298.59 + xAdd, 6.69 + yAdd);
    // vertex(286.33 + xAdd, 6.69 + yAdd);
    // endShape();
    //
    //
    // beginShape();
    // vertex(475.92 + xAdd, 6.69 + yAdd);
    // vertex(506.01 + xAdd, 94.74 + yAdd);
    // vertex(536.67 + xAdd, 26.19 + yAdd);
    // vertex(563.41 + xAdd, 94.74 + yAdd);
    // vertex(595.18 + xAdd, 6.69 + yAdd);
    // vertex(584.03 + xAdd, 6.69 + yAdd);
    // vertex(563.97 + xAdd, 67.43 + yAdd);
    // vertex(535.55 + xAdd, 0 + yAdd);
    // vertex(508.24 + xAdd, 64.09 + yAdd);
    // vertex(489.3 + xAdd, 6.69 + yAdd);
    // vertex(475.92 + xAdd, 6.69 + yAdd);
    // endShape();
    // textFont(openSansFont);


  }

  advanceToNextScene(player1, player2) {
    return this.wasKeyPressed == true;
  }

  keyWasPressed(keyCode, player1, player2) {
    if(keyCode == 77) {
      this.handleKeyPressMode(keyCode, player1, player2);
    } else if(keyCode == 68) {
      // do nothing: d button broken
    } else {
      this.wasKeyPressed = true;
    }
  }

  //advance to next scene bool needs to be reset when game restarts
  resetScene() {
    super.resetScene();
    this.wasKeyPressed = false;
  }
}

/////////////////////////////
//// Instruction Scene  ////
////////////////////////////
class InstructionScene extends Scene {
  constructor() {
    super();
    this.wasKeyPressed = false;
    this.length = 400;
    this.numTicks = 0;
    //introSound.loop();
  }

  draw(player1, player2, foods) {
    push();
    background(0, 0, 20);
    textSize(standardTextSize);
    textAlign(CENTER, TOP);
    textFont(openSansFont);
    fill(player1Color);
    text(this.instructionText, windowWidth / 5, height / 5, 3 / 5 * windowWidth, 3 / 5 * height);
    /*
    fill(player1Color);
    text("player 1 use asdw keys to move", windowWidth / 2, windowHeight / 5);
    fill(player2Color);
    text("player 2 use arrow keys to move", windowWidth / 2, windowHeight / 3);
    */
    fill(200);
    textSize(standardTextSize / 2);
    textAlign(CENTER, TOP);
    text("press a button to begin", windowWidth / 5, 4 / 5 * height, 3 / 5 * windowWidth, height);
    pop();
    this.numTicks++;
  }

  advanceToNextScene(player1, player2) {
    return this.wasKeyPressed == true || this.numTicks > this.length;
  }

  keyWasPressed(keyCode, player1, player2) {
    if(keyCode == 77) {
      this.handleKeyPressMode(keyCode, player1, player2);
    } else if(keyCode == 68) {
      // do nothing: d button broken
    } else {
      this.wasKeyPressed = true;
    }
  }

  //advance to next scene bool needs to be reset when game restarts
  resetScene() {
    super.resetScene();
    this.wasKeyPressed = false;
    this.numTicks = 0;
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
    textAlign(CENTER, CENTER);
    textLeading(scl * 2);
    text("Welcome", windowWidth / 5, height / 5, 3 / 5 * windowWidth, 3 / 5 * height);
    this.wideSceneDraw();
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
    this.countDown = 90000;
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



    //only print directional cues if player is still living TEXTDISPLAYBUG
    if (this.numTicks <= 1000) {
      //directional text
      push();
      stroke(255);
      strokeWeight(1);
      stroke(player1Color);
      if (player1.isFollowing) {
        // ringMoveSound.loop();
        // stroke(player1Color);
        // text(player1.direction + " (following)", windowWidth / 4, windowHeight / 1.43);
        // text("Follower", windowWidth / 4, windowHeight / 1.23);
        // stroke(player2Color);
        // text("Leader", windowWidth - windowWidth / 4, windowHeight / 1.23);
      } else if (player2.isFollowing) {
        // ringMoveSound.loop();
        // stroke(player1Color);
        // text("Leader", windowWidth / 4, windowHeight / 1.23);
        // stroke(player2Color);
        // text(player2.direction + " (following)", windowWidth - windowWidth / 4, windowHeight / 1.43);
        // text("Follower", windowWidth - windowWidth / 4, windowHeight / 1.23);
      } else {
        stroke(player1Color);
        // text(player1.direction, windowWidth / 4, windowHeight / 1.43);
        stroke(player2Color);
        // text(player2.direction, windowWidth - windowWidth / 4, windowHeight / 1.43);
        // ringMoveSound.stop();
      }
      pop();
      //this.drawCountDown();
    } else {}
    this.wideSceneDraw();
  }

  isGameOverCheck(player1, player2) {
    //return super.isGameOverCheck(player1, player2) || this.countDown <= 0;
    return super.isGameOverCheck(player1, player2);
  }

  advanceToNextScene(player1, player2) {
    return this.numTicks >= 1000; // training scene length
  }
  //ticks need to be reset when game restarts
  resetScene() {
    super.resetScene();
    this.numTicks = 0;
    this.countDown = 9000;
  }

}
///////////////////////
////  play scene  ////
//////////////////////
class PlayScene extends Scene {
  constructor() {
    super();
    this.initializeSpikes();
    this.numTicks = 0;

  };

  initializeSpikes() {
    //create spikes
    this.spikes = [];
    for (var i = 0; i < 2; i++) {
      this.spikes[i] = new Spike(scl, player1, player2);
      this.spikes[i].location(player1, player2);
    }
  }

  setupFromPreviousScene(previousScene) {
    super.setupFromPreviousScene(previousScene);
    this.countDown = previousScene.countDown;
  }

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
      this.spikes.push(new Spike(scl, player1, player2));
    }

    for (let i = 0; i < this.spikes.length; i++) {
      this.spikes[i].show();
    }

    this.wideSceneDraw();
    //this.drawCountDown();
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
    this.initializeSpikes();
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
    this.totalTicks = 300;
  }
  draw(player1, player2, foods) {
    push();
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

      fill(foodColor);
      noStroke();
      textSize(standardTextSize);
      textAlign(CENTER, BOTTOM);
      if (this.getCurrentKeyMode() === "simultaneous") {
        text("mutal end", windowWidth / 5, height / 5, 3 / 5 * windowWidth, 3 / 10 * height);
        console.log("mutual end");
      }
    } else if (player2.total <= 0 && player1.total > 0) {
      fill(1);
      stroke(1);
      ellipse(player2.x, player2.y, player1.r);
      player2.deathDraw();

      fill(foodColor);
      noStroke();
      textSize(standardTextSize);
      textAlign(CENTER, BOTTOM);
      if (this.getCurrentKeyMode() === "simultaneous") {
        text("1 gives & 1 takes", windowWidth / 5, height / 5, 3 / 5 * windowWidth, 3 / 10 * height);
        console.log("one gives one takes");

      }
    } else if (player1.total <= 0 && player2.total > 0) {
      fill(1);
      stroke(1);
      ellipse(player1.x, player1.y, player1.r);
      player1.deathDraw();

      fill(foodColor);
      noStroke();
      textSize(standardTextSize);
      textAlign(CENTER, BOTTOM);
      if (this.getCurrentKeyMode() === "simultaneous") {
        text("1 gives & 1 takes", windowWidth / 5, height / 5, 3 / 5 * windowWidth, 3 / 10 * height);
        console.log("one gives one takes");

      }
    } else {
      // should only get here in simultaneous mode
      player1.twoBecomeOne(player2, this.numTicks / this.totalTicks);
      fill(foodColor);
      noStroke();
      textSize(standardTextSize);
      textAlign(CENTER, BOTTOM);
      text("together", windowWidth / 5, height / 5, 3 / 5 * windowWidth, 3 / 10 * height);
      console.log("together");
    }
    // text("One of you may have more rings but you are both dead", windowWidth / 2, windowWidth - windowHeight / 4);
    this.numTicks++;
    this.wideSceneDraw();
    textAlign(CENTER, BOTTOM);
    text("begin again?", windowWidth / 5, height / 5, 3 / 5 * windowWidth, 3 / 5 * height);
    pop();
  }
  advanceToNextScene(player1, player2) {
    return this.numTicks >= this.totalTicks;
  }
  resetScene() {
    super.resetScene();
    this.numTicks = 0;
    noStroke();
  }
}
