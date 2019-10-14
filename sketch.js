// HIGH LEVEL
// - right now it is basically: don't go the direction someone else is going. is that what I want? should I try out "if they go up you go down - everything you do impacts the other"
// - how do I *immediately* communicate follow status to both players?
// - Communicate direction more
// - Player should *want* to be leading?
// - work on alt controller - buy makey makey, wireless arduino, led strips, spinning chair

// TODO
// - BUG - other (non dead) player gets an unexpected deathdraw a few seconds after dead player dies (player movement looks like it is stopping but actually it isn't)
// - BUG - player collisions sometiems don't work if they are offscreen (sound doesn't play & rings aren't lost) -> reproduce by pressing "a" and ""->"" simultaneously at beginning of game
// - BUG - unexpected "follow state" after player collision -> noticed at @player 176
// - BUG - spikes and foods sometimes generate underneath players (or on top of eachother).
// - BUG - players start moving before game (arrow keys shouldn't work until after welcome level)
// - TODO players should have to move to trigger new level (not just numticks)

// - TODO have a tick for the level, and once the tick reaches a certain level, add a spike to the array
// - TODO ring easing for better feel (@ring 23) https://p5js.jp/examples/input-easing.html AND https://easings.net/en#easeInCirc
// - TODO set up sounds
// - improve ring loss animation
// - make tail come off last ring / make tail look better
// - food is coloured, and you get a ring of that colour?
// - smiley face when leading, frowny face when following, neutral face when neutral
// - move player collision to player class?
// - improve sound files (audacity)

// MAYBE???
// - draw triangle on front of player????
// - turtles
// - make health rings little circles that "follow" instead of wrap rings
// - give flavour text boxes to coins - i'm just looking for a leader? ("i'll do what ever you tell me to do"? or should I give flavour text to players?)
// - should foods move around a bit?
// - integrate rippling ring from common
// - punishment should be immediately obvious!
// - Instructions? "if you follow you die" "if one of you dies, you die." ""
// - draw line between players?
// - playerX wins? (you are both dead so...)
// you are both dead. playerX had more rings at time of death so congratulations.
// - alt controller and wireless keyboard both work

// IDEA
// We are locked in a dance with the other, a dance we can step out of at any time.
// Each being controlled by the things you hate.
// Like "mirroring" we mimick the people we dislike
// There are many kinds of following.

// CONTROLLER
// Want visually interesting draw people in, durable, accessible, visible (kinesthetically feel the other player)
// Floor pads?
// Two facing monitors and controled with head (window)?

// WHY
// - why does this have a var and the others don't?   var allTheLevels = [pressKeyToContinue, level0, level1, level2, level3];
// - why do some things require "setup" and others don't? For example, "Rings" aren't set up
// - why do I have collision bugs?
// - I should walk through the "move" of the rings
// - Why is noCursor not working?
// - what is currentDiameter @player 103 doign?

// Thanks: Aaron, Ida, Game Center, Mailis, Sukanya, Jessica, Eric, Danny Hawk,


var player1;
var player2;
var foodColor = [255]; // white
var pointColor = [255, 215, 0, 250]; // gold
var player1Color = [255, 51, 153, 240]; // magenta
var player2Color = [51, 153, 255, 240]; // blue
var player1FadeColor = [184, 125, 155, 200]; // faded pink
var player2FadeColor = [145, 200, 255, 200]; // faded blue
var scl = 40; // scale of almost everything in the game
var vol = 0.2; // music volume standard
var foods = [];
var level0;
var level1;
var level2;
var level3;
var finallevel;
var levelManager;
var pressKeyToContinue;
var standardTextSize = 40; // text size standard
let speed;

var introSound;
var foodGenSound;
var eatSound;
var hitSound;
var newLevelSound;
var followingSound;
var deathSound;
var ringMoveSound;
var ambientSound;

// foodgen_sound, newlevel (currently dupe sound), start game sound

function preload() {
  p1_img = loadImage('img/p1.png');
  introSound = loadSound('sounds/intro.mp3');
  introSound.setVolume(vol);
  foodGenSound = loadSound('sounds/eat.mp3');
  foodGenSound.setVolume(vol);
  eatSound = loadSound('sounds/eat.mp3');
  eatSound.setVolume(vol);
  hitSound = loadSound('sounds/hit.mp3');
  hitSound.setVolume(vol);
  newLevelSound = loadSound('sounds/newlevel.mp3');
  newLevelSound.setVolume(vol);
  followingSound = loadSound('sounds/following.mp3');
  followingSound.setVolume(vol);
  deathSound = loadSound('sounds/losing.mp3');
  deathSound.setVolume(vol);
  ringMoveSound = loadSound('sounds/ringmove.mp3');
  ringMoveSound.setVolume(vol);
  ambientSound = loadSound('sounds/ambience.mp3');
  ambientSound.setVolume(vol);
}

// Setup is where I set up a bunch of important objects
function setup() {
  noCursor();
  createCanvas(windowWidth, windowHeight);
  // p5 specific function for working with degrees
  angleMode(DEGREES);
  //special functions to construct an object from a class
  player1 = new Player("1", " ",-0, -200, scl, player1Color, player1FadeColor);
  player2 = new Player("2", " ", 0, 200, scl, player2Color, player2FadeColor);
  level0 = new Level0();
  level1 = new Level1();
  level2 = new Level2();
  level3 = new Level3();
  finalLevel = new FinalLevel();
  pressKeyToContinue = new PressKeyToContinue();
  var allTheLevels = [pressKeyToContinue, level0, level1, level2, level3];
  levelManager = new LevelManager(0, allTheLevels, finalLevel);
  // set up an array of food objects and an array of spike objects
  for (var i = 0; i < 1; i++) {
    foods[i] = new Food(scl);
    foods[i].location();
  }
}

// Draw is where I call anything that needs to be constantly updated/needs to constantly change own state
function draw() {
  levelManager.switchLevel(player1, player2);
  //implememt punishment/rewards for following/leading
  player1.updateTotal(player2);
  player2.updateTotal(player1);

  // update location of player1 and player2
  player1.update();
  player2.update();

  playerCollision();

  // Finally actually drawing!
  levelManager.drawLevel(player1, player2, foods);
}

function playerCollision() {
  let d = dist(player1.x, player1.y, player2.x, player2.y);

  if (d <= player1.currentDiameter() / 2 + player2.currentDiameter() / 2) {
    console.log("collide!");
    hitSound.play();

    player1.changeRingTotal(-1, player1.x, player1.y);
    player2.changeRingTotal(-1, player2.x, player2.y);

    // console.log("popping rings");
    player1.flipDirection(player2);
    player2.flipDirection(player1);
    //add xspeed or yspeed after collision to fix collision bug
    player1.update(100);
    player2.update(100);
    // players never follow each other after coliding
    player1.isFollowing = false;
    player2.isFollowing = false;
    player1.isFollowed = false;
    player2.isFollowed = false;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  levelManager.resetLevelManager();
}

function keyPressed() {
  if (keyCode === 70) {
    let fs = fullscreen();
    fullscreen(!fs);
    levelManager.resetLevelManager();
  }

  if (keyCode === 32) {
    levelManager.keyWasPressed(keyCode);
  }

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
