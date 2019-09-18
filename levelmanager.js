// LevelSwitcher needs to: know the current level, check if it's time to advance
class LevelManager {
  constructor(tmp_initialLevel, tmp_allTheLevels){
    this.currLevelIndex = tmp_initialLevel;
    this.allTheLevels = tmp_allTheLevels;
  }

  isGameOverManager(player1, player2) {
    //from the list of levels, get me the current one.
    var theCurrentLevel = this.allTheLevels[this.currLevelIndex];
    return theCurrentLevel.isGameOver(player1, player2);
  }

  switchLevel(player1, player2) {
    //from the list of levels, get me the current one.
    var theCurrentLevel = this.allTheLevels[this.currLevelIndex];

    if(theCurrentLevel.advanceToNextLevel(player1, player2) == true) {
      console.log("advancing to the next level");
      this.currLevelIndex++;
    }
  }

  drawLevel(player1, player2, foods) {
    //from the list of levels, get me the current one.
    var theCurrentLevel = this.allTheLevels[this.currLevelIndex];

    theCurrentLevel.draw(player1, player2, foods);
  }

  keyWasPressed(keyCode) {
    var theCurrentLevel = this.allTheLevels[this.currLevelIndex];

    theCurrentLevel.keyWasPressedLevel(keyCode);
  }
}
