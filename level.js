// levels need to: draw themselves & know when over (both success and failure)

class Level {
  constructor() {};
//is the game over?
  isGameOver(player1, player2) {
    if(player1.total <= 0 || player2.total <= 0) {
      return true;
    } else {
      return false;
    }
  }

  keyWasPressedLevel(keyCode) { }

  draw(player1, player2, foods) {
    background(30);
    noStroke();

    textSize(30);
    fill(255, 51, 153);
    // text(player1.total.toFixed(0), windowWidth / 2 + 200, windowHeight / 1.2);
    // fill(51, 153, 255);
    // text(player2.total.toFixed(0), windowWidth / 2 - 200, windowHeight / 1.2);

    //score text
    textSize(scl);
    textAlign(CENTER, TOP);

    if (player1.isFollowing) {
      fill(255, 51, 153);
      text("Pink is following", windowWidth / 2, windowHeight / 6);
    } else if (player2.isFollowing) {
      fill(51, 153, 255);
      text("Blue is Following", windowWidth / 2, windowHeight / 6);
    }

    fill(255, 51, 153);
    player1.show();
    fill(51, 153, 255);
    player2.show();

    for (let i = 0; i < foods.length; i++) {
      foods[i].show();
    }

  }
}
//this is a class that allows me to use a key to advance
class PressKeyToContinue extends Level {
  constructor() {
    super();
    this.keyWasPressed = false;
  }

  draw(player1, player2, foods) {
    // .. draw some stuff
  }

  advanceToNextLevel(player1, player2) {
    return this.keyWasPressed == true;
  }

  keyWasPressedLevel(keyCode) {
    this.keyWasPressed = true;
  }
}

class TemporaryLevel extends Level {
  constructor() {
    super();
    this.numTicks = 0;
  }

  draw(player1, player2, foods) {
    // .. draw stuff
    this.numTicks++;
  }

  advanceToNextLevel(player1, player2) {
    return this.numTicks >= 3000;
  }
}

class Level1 extends Level {
  constructor(){
    // 'super' calls the 'constructor' of Level (the class we inherit from)
    super();
  };

  advanceToNextLevel(player1, player2) {
    if(player1.total >= 8 || player2.total >= 8) {
      console.log("switching from level 1 to level 2");
      return true;
    } else {
      return false;
    }
  }

}

class Level2 extends Level {
  constructor(){
    super();
  };

  advanceToNextLevel(player1, player2) {
    if(player1.total > 10 || player2.total > 10) {
      console.log("switching from level 2 to level 3");
      return true;
    } else {
      return false;
    }
  }

  //can create a draw inside any level to customize it
  draw(player1, player2, foods) {
    background(255,0,0);

      fill(0, 5, 0);
      noStroke();
      text("GAME OVER!!!", windowWidth / 2, windowHeight / 6);
  }

}

class Level3 extends Level {
  constructor(){
    super();
  };

  advanceToNextLevel(player1, player2) {
    if(player1.total > 15 || player2.total > 15) {
      console.log("switching from level 3 to level 4");
      return true;
    } else {
      return false;
    }
  }
  draw(player1, player2, foods) {
    background(255,0,0);

      fill(0, 5, 0);
      noStroke();
      text("GAME OVER!!!", windowWidth / 2, windowHeight / 6);
  }

}

class FinalLevel extends Level {
  constructor() {
    super();
  }
  advanceToNextLevel(player1, player2) {
    console.log("final level");
    return false;
  }
}
