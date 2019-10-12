// HIGH LEVEL
// how do I *immediately communicate follow status* to both players? player isn't looking at other player
// Communicate direction more (maybe display direction on screen somehow?)
// Player should *want* to be leading
// - more weight to decision - consciousness. could be alt control or some kind of timer where you are strateg.

// TODO
// - ring faster in the beginning when transfering to the other player - consider loosening an "almost lost" ring
// - alt controller - get a makey makey? get wireless arduino working again?
// - set up sounds
// - improve ring loss animation
// - better feel to ring loss
// - more spikes
// - moving spikes
// - it's unfair to be killed by a spike when it generates underneath you ()
// - make tail come off last ring
// - make tail look better
// - food is coloured, and you get a ring of that colour?
// - smiley face when leading, frowny face when following, neutral face when neutral
// - make death more compelling
// - move player collision to player class?
// - arrow keys shouldn't work until after welcome level
// - improve sound files (audacity)
// - have a tick for the level, and once the tick reaches a certain level, add a spike to the array

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

// Thanks: Ida, Aaron, Game Center, Mailis, Jessica, Eric, Danny Hawk,


var player1;
var player2;
var foodColor = [255]; // white
var pointColor = [255, 215, 0, 250]; // gold
var player1Color = [255, 51, 153, 250]; // magenta
var player2Color = [51, 153, 255, 250]; // blue
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

function preload() {
  p1_img = loadImage('images/p1.png');
  intro_music = loadSound('sounds/intro.mp3');
  intro_music.setVolume(0.02);
  eat_sound = loadSound('sounds/eat.mp3');
  eat_sound.setVolume(vol);
  hit_sound = loadSound('sounds/hit.mp3');
  hit_sound.setVolume(2);
  newlevel_music = loadSound('sounds/newlevel.mp3');
  newlevel_music.setVolume(vol);
  following_music = loadSound('sounds/following.mp3');
  following_music.setVolume(vol);
  losing_music = loadSound('sounds/losing.mp3');
  intro_music.setVolume(vol);
  ringMove_music = loadSound('sounds/ringmove.mp3');
  ringMove_music.setVolume(vol);
  ambience_music = loadSound('sounds/ambience.mp3');
  ambience_music.setVolume(vol);
}

// Setup is where I set up a bunch of important objects
function setup() {
  // ambience_music.play();
  noCursor();
  createCanvas(windowWidth, windowHeight);
  // p5 specific function for working with degrees
  angleMode(DEGREES);
  //special functions to construct an object from a class
  player1 = new Player("1", " ", 0, 200, scl, player1Color, player1FadeColor);
  player2 = new Player("2", " ", -0, -200, scl, player2Color, player2FadeColor);
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
  playSound();

}

function playSound (){
  if (ambience_music.isPlaying()) {
    // ambience_music.stop();
    // console.log("music stopping!")

  } else {
    // ambience_music.play();
    // console.log("music playing!")
  }
}

function playerCollision() {
  let d = dist(player1.x, player1.y, player2.x, player2.y);

  if (d <= player1.currentRadius()/2 + player2.currentRadius()/2) {
    // console.log("player 1: (" + player1.x + "," + player1.y + ")");
      // console.log("player 2: (" + player2.x + "," + player2.y + ")");
      // console.log("log: " + d + " < " + player1.currentRadius() + " + " + player2.currentRadius());
    // console.log("COLLISSION");
    player1.total = player1.total - 1;
    player2.total = player2.total - 1;
    player1.poppedRings.push(player1.playerRings.pop());
    player2.poppedRings.push(player2.playerRings.pop());
    // console.log("popping rings");
    player1.flipDirection(player2);
    player2.flipDirection(player1);
    //add xspeed or yspeed after collision to fix collision bug
    player1.update(100);
    player2.update(100);
    // players never follow each other after a collission
    player1.isFollowing = false;
    player2.isFollowing = false;
    player1.isFollowed = false;
    player2.isFollowed = false;
    hit_sound.play();
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
    player1.changeDirectionUp(player2);

  } else if (keyCode === DOWN_ARROW) {
    player1.changeDirectionDown(player2);

  } else if (keyCode === RIGHT_ARROW) {
    player1.changeDirectionRight(player2);

  } else if (keyCode === LEFT_ARROW) {
    player1.changeDirectionLeft(player2);

  } else if (keyCode === 87) {
    player2.changeDirectionUp(player1);

  } else if (keyCode === 83) {
    player2.changeDirectionDown(player1);

  } else if (keyCode === 68) {
    player2.changeDirectionRight(player1);

  } else if (keyCode === 65) {
    player2.changeDirectionLeft(player1);
  }
}
