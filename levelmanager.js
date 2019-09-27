// LevelSwitcher needs to: know the current level, check if it's time to advance
class LevelManager {
  constructor(tmp_initialLevel, tmp_allTheLevels, tmp_gameOverLevel){
    this.currLevelIndex = tmp_initialLevel;
    this.initialLevelIndex = tmp_initialLevel;
    this.allTheLevels = tmp_allTheLevels;
    this.gameOverLevel = tmp_gameOverLevel;

    this.gameOverMode = false;
  }

  resetLevels(){
    console.log(this.initialLevelIndex);
    this.gameOverMode = false;
    this.currLevelIndex = this.initialLevelIndex;
    console.log("level was reset to " + this.currLevelIndex);
  }

//checking if the game is over
  isGameOverManager(player1, player2) {
    //from the list of levels, get me the current one.
    var theCurrentLevel = this.allTheLevels[this.currLevelIndex];
    if (theCurrentLevel.isGameOverCheck(player1, player2) == true) {
      this.gameOverMode = true;
    }
    return theCurrentLevel.isGameOverCheck(player1, player2);
  }

//advance to the next level when conditions are met
  switchLevel(player1, player2) {
    //from the list of levels, get me the current one.
    var theCurrentLevel = this.allTheLevels[this.currLevelIndex];
    if(theCurrentLevel.advanceToNextLevel(player1, player2) == true) {
      // console.log("advancing to the next level");
      this.currLevelIndex++;
    }
  }

//drawing the level
  drawLevel(player1, player2, foods) {
    if(this.gameOverMode == true)  {
      // draw the game over level
      console.log("final level!")
      this.gameOverLevel.draw(player1, player2, foods);
    } else {
      //from the list of levels, get me the current one.
      var theCurrentLevel = this.allTheLevels[this.currLevelIndex];
      theCurrentLevel.draw(player1, player2, foods);
    }


  }

  keyWasPressed(keyCode) {
    console.log("key was pressed" + keyCode);
     var theCurrentLevel = this.allTheLevels[this.currLevelIndex];
     theCurrentLevel.keyWasPressedLevel(keyCode);

   }




}
