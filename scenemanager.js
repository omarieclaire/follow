// SceneSwitcher needs to: know the current scene, check if it's time to advance
class SceneManager {
  constructor(tmp_initialScene, tmp_allTheScenes, tmp_finalScene) {
    this.currSceneIndex = tmp_initialScene;
    this.initialSceneIndex = tmp_initialScene;
    this.allTheScenes = tmp_allTheScenes;
    this.finalScene = tmp_finalScene;
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
    this.finalScene.resetScene();
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
      if (this.finalScene.advanceToNextScene(player1, player2) == true) {
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
      this.finalScene.draw(player1, player2, foods);
    } else {
      //set theCurrentScene var = from the list of scenes, get me the current one.
      var theCurrentScene = this.allTheScenes[this.currSceneIndex];
      theCurrentScene.draw(player1, player2, foods);
    }
  }

  keyWasPressed(keyCode, player1, player2) {
    if (this.gameOverMode) {
      this.finalScene.keyWasPressed(keyCode, player1, player2);
    } else {
      var theCurrentScene = this.allTheScenes[this.currSceneIndex];
      theCurrentScene.keyWasPressed(keyCode, player1, player2);
    }
  }

}
