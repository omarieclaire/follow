// WHY AM I HERE?
// We are locked in a dance with the other. What is this dance?
// Each compelled/controlled by the things we don't want to be/do.
// Like "mirroring" we mimick the other, especially the unloved other
// What is following anyway?

// should there be a game over? consider a timer
// strip of projector
// different end states - name them equal
// ida applebroog // brancussi , things facing, overlapping circles and spheres
// make poassible ring a ring (less translations)

// DESIGN HIGH LEVEL
// - what does player want to do?
// - what does player feel?
// - the DESIRE to do the opposite of the other player is not there yet
// - how do I *immediately* communicate follow status to both players?
// - should player *want* to be leading?
// - right now it is basically: don't go the direction someone else is going. is that what I want? should I try out "if they go up you go down - everything you do impacts the other"

// TODOS
// TODO spikes and food fall from sky?
// TODO fix follow line wrapping
// TODO foods slowly appear
// TODO line between following player and followed
// TODO improve ring loss animation
// TODO if I die, then you die too? how to draw?
// TODO Sort out following logic in each mode
// TODO make tail come off last ring / make tail look better
// TODO move player collision to player class?
// TODO set up sounds
// TODO choose text
// TODO make prettier
// TODO refactor everything :(

// DESIGN
// CONSIDER I make an even more basic level which is just turning, no moving?
// CONSIDER smiley face when leading, frowny face when following, neutral face when neutral
// CONSIDER should the one who is pressing the button should be "leading?" or is it even better to have the leader losing rings as a price
// CONSIDER shared score
// CONSIDER draw triangle on front of player????
// CONSIDER turtles
// CONSIDER make health rings little circles that "follow" instead of wrap rings
// CONSIDER give flavour text boxes to coins CONSIDER i'm just looking for a leader? ("i'll do what ever you tell me to do"? or should I give flavour text to players?)
// CONSIDER should foods move around a bit?
// CONSIDER integrate rippling ring from common
// CONSIDER punishment should be immediately obvious!
// CONSIDER Instructions? "if you follow you die" "if one of you dies, you die." ""
// CONSIDER draw line between players?
// CONSIDER playerX wins? (you are both dead so...)
// CONSIDER you are both dead. playerX had more rings at time of death so congratulations.
// CONSIDER - major refactor to actually fix: unexpected "follow state" after player collision -> @player 176

// CONTROLLER
// strip of projected play
// two controller boxes connected by a rope
// Want visually interesting draw people in, durable, accessible, visible (kinesthetically feel the other player)
// Floor pads?
// Two facing monitors and controled with head (window)?

// QUESTIONS

// Thanks: Aaron, Arnab, Ida, Game Center, Mailis, Sukanya, Jessica, Eric, Danny, Coding Rainbow, Jackie, Brent,


var player1;
var player2;
var foodColor = [255, 255, 1]; // white
var ringColor = [230, 230, 230];
var pointColor = [255, 215, 0, 250]; // gold
var player1Color = [255, 51, 153, 240]; // magenta
var player2Color = [51, 153, 255, 240]; //   blue
var player1FadeColor = [184, 125, 155, 200]; // faded pink
var player2FadeColor = [145, 200, 255, 200]; // faded blue
var scl = 30 ; // scale of almost everything in the game
var vol = 0.1; // music volume standard
var foods = [];

var welcomeScene;
var trainingScene;
var playScene;
var bonusScene;
var finalScene;
var sceneManager;
var instructionScene;

var standardTextSize = 40; // text size standard
let speed;
var introSound;
var foodGenSound;
var eatSound;
var hitSound;
var newSceneSound;
var followingSound;
var deathSound;
var ringMoveSound;
var ambientSound;

// foodgen_sound, newScene (currently dupe sound), start game sound

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
  newSceneSound = loadSound('sounds/newscene.mp3');
  newSceneSound.setVolume(vol);
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
  player1 = new Player("1", " ", -0, windowWidth/4, scl, player1Color, player1FadeColor);
  player2 = new Player("2", " ", 0, windowWidth - windowWidth/4, scl, player2Color, player2FadeColor);
  welcomeScene = new WelcomeScene();
  trainingScene = new TrainingScene();
  playScene = new PlayScene();
  bonusScene = new BonusScene();
  finalScene = new FinalScene();
  instructionScene = new InstructionScene();
  var allTheScenes = [instructionScene, welcomeScene, trainingScene, playScene, bonusScene];
  sceneManager = new SceneManager(0, allTheScenes, finalScene);
  // set up an array of food objects and an array of spike objects
  for (var i = 0; i < 1; i++) {
    foods[i] = new Food(scl, foodColor);
    foods[i].location(player1, player2);
  }
}

// Draw is where I call anything that needs to be constantly updated/needs to constantly change own state
function draw() {
  sceneManager.switchScene(player1, player2);

  // update location of player1 and player2
  player1.update();
  player2.update();

  //implememt punishment/rewards for following/leading
  player1.updateTotal(player2);
  player2.updateTotal(player1);

  playerCollision();

  // Finally actually drawing!
  sceneManager.drawScene(player1, player2, foods);
}

function playerCollision() {
  let d = dist(player1.x, player1.y, player2.x, player2.y);

  if (d <= player1.currentDiameter() / 2 + player2.currentDiameter() / 2) {
    hitSound.play();

    player1.changeRingTotal(-1, player1.x, player1.y);
    player2.changeRingTotal(-1, player2.x, player2.y);

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
  sceneManager.resetSceneManager();
}

function keyPressed() {
  if (keyCode === 78) {
    let fs = fullscreen();
    fullscreen(!fs);
    sceneManager.resetSceneManager();
  }

  sceneManager.keyWasPressed(keyCode, player1, player2);
}

function keyReleased() {
  sceneManager.keyWasReleased(keyCode, player1, player2);
  return false;
}
