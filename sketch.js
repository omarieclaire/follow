// HIGH LEVEL
// immediately communicate follow status to both players
// Communicate direction more (maybe display direction on screen somehow?)
// Player should *want* to be leading

// TODO
// - sort out sound playing
// - improve ring loss animation
// - more spikes, moving spikes
// - standardize ring offset
// - make tail come off last ring
// - food is coloured, and you get a ring of that colour?
// - smiley face when leading, frowny face when following, neutral face when neutral
// - make death more compelling
// - make player trail look better
// - integrate music
// - move player collision to player class?
// - arrow keys shouldn't work until after welcome level
// - improve sound files (audacity)

// MAYBE???
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

// Thanks: Ida, Aaron, Game Center, Mailis,


var player1;
var player2;
var foodColor = [255]; // white
var pointColor = [255, 215, 0, 250]; // gold
var player1Color = [255, 51, 153, 250]; // magenta
var player2Color = [51, 153, 255, 250]; // blue
var player1FadeColor = [184, 125, 155, 200]; // faded pink
var player2FadeColor = [145, 200, 255, 200]; // faded blue
var scl = 40; // scale of almost everything in the game
var vol = 0.4; // music volume standard
var foods = [];
var spikes = [];
var level0;
var level1;
var level2;
var level3;
var finallevel;
var levelManager;
var pressKeyToContinue;
var standardTextSize = 40; // text size standard
let explodeParticles = [];
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
  for (var i = 0; i < 1; i++) {
    spikes[i] = new Spike(scl);
    spikes[i].location();
  }
  for(let i = 0; i < 50; i++){
      explodeParticles.push(new ExplodeParticle);
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
  levelManager.drawLevel(player1, player2, foods, spikes);

  // speed = map(mouseX, 0, width, 0, 50);
  // translate(width/2, height/2);
  //
  // for(let i = 0; i < explodeParticles.length; i++){
  //     explodeParticles[i].update();
  //     explodeParticles[i].show();
  // }
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
  if (d < player1.r + player2.r) {
    player1.total = player1.total - 1;
    player2.total = player2.total - 1;
    player1.poppedRings.push(player1.playerRings.pop());
    player2.poppedRings.push(player2.playerRings.pop());
    console.log("popping rings");
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
