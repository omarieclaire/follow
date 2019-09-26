// levels need to: draw themselves & know when over (both success and failure)
class Level {
  constructor() {
    this.leaderRing = new LeaderRing(scl);
  };
  //first, a function to check if the game is over
  isGameOver(player1, player2) {
    if (player1.total <= 0 || player2.total <= 0) {
      console.log("Game is over");
      return true;
    } else {
      return false;
    }
  }
  keyWasPressedLevel(keyCode) {}
  basicLevelDraw(player1, player2, foods) { //basic level draw
    background(30);
    noStroke();
    textSize(30);
    fill(255);
    // text(player1.total.toFixed(0), windowWidth / 2 + 200, windowHeight / 1.2);
    // fill(51, 153, 255);
    // text(player2.total.toFixed(0), windowWidth / 2 - 200, windowHeight / 1.2);

    //score text
    textSize(scl);
    textAlign(CENTER, TOP);
    if (player1.isFollowing) {
      fill(255);
      text("Pink is following Blue", windowWidth / 2, windowHeight / 6);
      fill(255, 51, 153, 50);
      player1.show();
      fill(player2Color);
      player2.show();
    } else if (player2.isFollowing) {
      text("Blue is Following Pink", windowWidth / 2, windowHeight / 6);
      fill(player1Color);
      player1.show();
      fill(51, 153, 255, 50);
      player2.show();
    } else {
      fill(player1Color);
      player1.show();
      fill(player2Color);
      player2.show();
    }

    this.leaderRing.drawLeaderRing(player1, player2);

  }
  draw(player1, player2, foods) {
    this.basicLevelDraw();
  }
}
//////////keypress to skip level?
// class PressKeyToContinue extends Level {
//   constructor() {
//     super();
//     this.keyWasPressed = false;
//   }
//   draw(player1, player2, foods) {
//     fill(20, 10, 100);
//     rect(20, 30, 30);
//   }
//
//   advanceToNextLevel(player1, player2) {
//     return this.keyWasPressed == true;
//   }
//
//   keyWasPressedLevel(keyCode) {
//     this.keyWasPressed = true;
//   }
// }

//////////welcome level
class Level0 extends Level {
  constructor() {
    // 'super' calls the 'constructor' of Level (the class we inherit from)
    super();
    this.numTicks = 0;
  };
  //can create a draw inside any level to customize it
  draw(player1, player2, foods) {
    this.numTicks++;
    this.basicLevelDraw(player1, player2, foods);
    background(0, 10, 0);
    fill(255);
    noStroke();
    text("Welcome", windowWidth / 2, windowHeight / 6);
  }

  advanceToNextLevel(player1, player2) {
    return this.numTicks >= 50;
  }
}

//////////training level - no food
class Level1 extends Level {
  constructor() {
    super();
  };
  draw(player1, player2, foods) {
    this.basicLevelDraw(player1, player2, foods);
  }

  advanceToNextLevel(player1, player2) {
    if (player1.total >= 5 || player2.total >= 5) {
      console.log("switching from level 1 to level 2");
      return true;
    } else {
      return false;
    }
  }

}
//////////food level
class Level2 extends Level {
  constructor() {
    super();
  };


  draw(player1, player2, foods) {
    this.basicLevelDraw(player1, player2, foods);
    for (let i = 0; i < foods.length; i++) {
      foods[i].show();
    }
  }

  advanceToNextLevel(player1, player2) {
    if (player1.total > 20 || player2.total > 20) {
      console.log("switching from level 2 to level 3");
      return true;
    } else {
      return false;
    }
  }

}
//////////death level
class Level3 extends Level {
  constructor() {
    super();
  };

  advanceToNextLevel(player1, player2) {
    if (player1.total > 15 || player2.total > 15) {
      console.log("switching from level 3 to level 4");
      return true;
    } else {
      return false;
    }
  }
  draw(player1, player2, foods) {
    background(255, 0, 0);

    fill(0, 5, 0);
    noStroke();
    text("GAME OVER!!!", windowWidth / 2, windowHeight / 6);
  }
}

//////////post-death level
class FinalLevel extends Level {
  constructor() {
    super();
  }
  advanceToNextLevel(player1, player2) {
    console.log("final level");
    return false;
  }
}
