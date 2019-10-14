// SceneSwitcher needs to: know the current scene, check if it's time to advance
class SceneManager {
  constructor(tmp_initialScene, tmp_allTheScenes, tmp_gameOverScene) {
    this.currSceneIndex = tmp_initialScene;
    this.initialSceneIndex = tmp_initialScene;
    this.allTheScenes = tmp_allTheScenes;
    this.gameOverScene = tmp_gameOverScene;
    this.gameOverMode = false;
  }

  resetSceneManager() {
    // reset all the scenes
    for (var i = 0; i < this.allTheScenes.length; i++) {
      this.allTheScenes[i].resetScene();
    }
    player1.resetPlayer();
    player2.resetPlayer();
    //reset the game over scene
    this.gameOverScene.resetScene();
    console.log(this.initialSceneIndex);
    this.gameOverMode = false;
    this.currSceneIndex = this.initialSceneIndex;
    console.log("scene was reset to " + this.currSceneIndex);
  }

  //checking if the game is over
  isGameOverManager(player1, player2) {
    //from the list of scenes, get me the current one.
    var theCurrentScene = this.allTheScenes[this.currSceneIndex];
    if (this.gameOverMode) {
      return true;
    } else {
      if (theCurrentScene.isGameOverCheck(player1, player2) == true) {
        this.gameOverMode = true;
      }
      return theCurrentScene.isGameOverCheck(player1, player2);
    }
  }

  //advance to the next scene when conditions are met
  switchScene(player1, player2) {
    if (this.gameOverMode) {
      if (this.gameOverScene.advanceToNextScene(player1, player2) == true) {
        this.resetSceneManager();
      }

    } else {
      var theCurrentScene = this.allTheScenes[this.currSceneIndex];
      if (theCurrentScene.advanceToNextScene(player1, player2) == true) {
        // console.log("advancing to the next scene");
        this.currSceneIndex++;
      }
    }
  }

  //drawing the scene
  drawScene(player1, player2, foods) {
    //at the beinning of every draw we call isgameovermanager
    this.isGameOverManager(player1, player2);

    if (this.gameOverMode == true) {
      this.gameOverScene.draw(player1, player2, foods);
    } else {
      //set theCurrentScene var = from the list of scenes, get me the current one.
      var theCurrentScene = this.allTheScenes[this.currSceneIndex];
      theCurrentScene.draw(player1, player2, foods);
    }
  }

  keyWasPressed(keyCode) {
    console.log("key was pressed" + keyCode);
    if (this.gameOverMode) {
      this.gameOverScene.keyWasPressed(keyCode);
    } else {
      var theCurrentScene = this.allTheScenes[this.currSceneIndex];
      theCurrentScene.keyWasPressedScene(keyCode);
    }
  }

}
