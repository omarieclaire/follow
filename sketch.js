
//slowly move rings from one player to another
//add sound
//figure out keyPress
//communicate death with animation
//reset everything (especially player score and lvl)  at end of GAME


var player1;
var player2;
var player1Color = [255, 51, 153, 255];
var player2Color = [51, 153, 255, 255];
var scl = 40;
var vol = 0.4;
var foods = [];
var level0;
var level1;
var level2;
var level3;
var finallevel;
var levelManager;
var pressKeyToContinue;

function preload() {
  p1_img = loadImage('images/p1.png');
  p2_img = loadImage('images/p2.png');
  food_img = loadImage('images/food.png');
  brick_img = loadImage('images/brick.png');
  intro_music = loadSound('sounds/intro.mp3');
  intro_music.setVolume(vol);
  eat_sound = loadSound('sounds/eat.mp3');
  eat_sound.setVolume(vol);
  hit_sound = loadSound('sounds/hit.mp3');
  hit_sound.setVolume(vol);
  newlevel_music = loadSound('sounds/newlevel.mp3');
  newlevel_music.setVolume(vol);
  winning_music = loadSound('sounds/winning.mp3');
  winning_music.setVolume(vol);
  losing_music = loadSound('sounds/losing.mp3');
  intro_music.setVolume(vol);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //Special function to construct an object
  player1 = new Player("1", " ", 0, windowWidth / 2 + 200, windowHeight / 2);
  player2 = new Player("2", " ", -0, windowWidth / 2 - 200, windowHeight / 2);
	level0 = new Level0();
	level1 = new Level1();
  level2 = new Level2();
  level3 = new Level3();
  finalLevel = new FinalLevel();
  pressKeyToContinue = new PressKeyToContinue();
//array variable containing all the levels
  var allTheLevels = [pressKeyToContinue, level0, level1, level2, level3];
  levelManager = new LevelManager(0, allTheLevels, finalLevel);

  for (var i = 0; i < 1; i++) {
    foods[i] = new Food(scl);
    foods[i].location();
  }
}

function draw() {
  //////////////////////////////// UPDATE
  if (levelManager.isGameOverManager(player1, player2) == true) {
    // return;
    resetEverything(player1, player2, levelManager);
  }

  levelManager.switchLevel(player1, player2);
	//following punishment/rewards
  player1.updateTotal(player2);
  player2.updateTotal(player1);

  // update location of player1 and player2
  player1.update();
  player2.update();

	// player1.ringLocation();
	// player2.ringLocation();

  foodEaten();
  playerCollision();

  ////////////////////////// DRAW
  levelManager.drawLevel(player1, player2, foods);
}

function foodEaten() {
  for (let i = 0; i < foods.length; i++) {
    if (player1.eat(foods[i])) {
      foods[i].location();
    }

    if (player2.eat(foods[i])) {
      foods[i].location();
    }
  }
}

//who is following who
function handlePlayerFollowing(playerX, playerY, futureDirectionOfX) {
  //this is happening right after playerX presses a directional key, BEFORE the direction of playerX changes
  if (playerX.direction == playerY.direction) { //only deal with cases where there is ALREADY a "follower"
    if (futureDirectionOfX != playerX.direction) { //is someone unfollowing someone?
      playerX.isFollowing = false; //then turn off all follows
      playerY.isFollowing = false;
    }
  } else { // if there is no current follower
    if (futureDirectionOfX == playerY.direction) {
      console.log("noooo a bug");

      playerX.isFollowing = true;
			playerY.isFollowed = true;
    }
  }
}

function playerCollision() {
  let d = dist(player1.x, player1.y, player2.x, player2.y);
  if (d < player1.r + player2.r) {
		player1.flipDirection();
		player2.flipDirection();
		// players never follow each other after a collission
		player1.isFollowing = false;
		player2.isFollowing = false;
  }
}

function keyPressed() {
	//32
  levelManager.keyWasPressed(keyCode);
  if (keyCode === UP_ARROW) {
    handlePlayerFollowing(player1, player2, "up");
		player1.changeDirectionUp();

  } else if (keyCode === DOWN_ARROW) {
    handlePlayerFollowing(player1, player2, "down");
		player1.changeDirectionDown();

  } else if (keyCode === RIGHT_ARROW) {
		handlePlayerFollowing(player1, player2, "right");
		player1.changeDirectionRight();

  } else if (keyCode === LEFT_ARROW) {
    handlePlayerFollowing(player1, player2, "left");
		player1.changeDirectionLeft();

  } else if (keyCode === 87) {
    handlePlayerFollowing(player2, player1, "up");
		player2.changeDirectionUp();

  } else if (keyCode === 83) {
    handlePlayerFollowing(player2, player1, "down");
		player2.changeDirectionDown();

  } else if (keyCode === 68) {
    handlePlayerFollowing(player2, player1, "right");
		player2.changeDirectionRight();

  } else if (keyCode === 65) {
    handlePlayerFollowing(player2, player1, "left");
		player2.changeDirectionLeft();
  }
}

function resetEverything(player1, player2, levelManager){
  console.log("game was reset")
  levelManager.resetLevels();
  player1.resetPlayer();
  player2.resetPlayer();
}
