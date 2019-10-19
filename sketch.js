// WHY AM I HERE?
// We are locked in a dance with the other one
// Each compelled/controlled by aversion/anti-mirroring.
// What is following anyway?

// DESIGN HIGH LEVEL
// - what does player want to do?
// - what does player feel?
// - the DESIRE to do the opposite of the other player is not there yet
// - how do I *immediately* communicate follow status to both players?
// - should player *want* to be leading?
// - right now it is basically: don't go the direction someone else is going. is that what I want? should I try out "if they go up you go down - everything you do impacts the other"

// TODOS

// TODO Test visuals on actual projector

// TODO Sort out following logic in each mode
// TODO Set up unique instruction scenes for each keypress version

// TODO fix follow line wraps: wrappiong when it shouldn't be wrapping

// TODO integrate player waves colors and player waves frequencies
// TODO alternating death explosions (implosion, a fade-out over time, appear to collide and become one.
// TODO spikes and food fall from sky better
// TODO ease follow line wrapping (it's a bit jerky right at the "wrap" moment)
// TODO buy rope? boxes? Embed magnet in the rope, magnet sensor
// TODO improve ring loss animation
// TODO if I die, then you die too? how to draw?
// TODO make tail look better
// TODO move player collision to player class?
// TODO design sounds
// TODO choose text
// TODO make prettier
// TODO refactor everything :(
// TODO Fix trim screen to small rectangle bugs
// TODO: work on keypress ordering logic in serial


// DESIGN
// CONSIDER - should there be a game over? consider a timer
// CONSIDER - different end states with names
// CONSIDER - making food more "ring-like" (less translations)
// CONSIDER I make an even more basic level which is just turning, no moving?
// CONSIDER kinect as controller
// CONSIDER leaderboard
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

// Serialport library: https://github.com/p5-serial/p5.serialport
// 1) Open Arduino. Choose port in menu under tools>ports. Upload sketch. Open serial monitor. Check for values, then CLOSE.
// 2) Open p5 Serialcontrol app. Select port. Click 'open'. Check 'console enabled' and 'read in ASCII' Check for values. Uncheck both check-boxes.
// 3) Include library in this project folder. Include library path in index.html. Include unique serialport ID (e.g. "/dev/tty.usbmodem14201") in setup(),

// Thanks: Aaron, Arnab, Ida, Game Center, Mailis, Sukanya, Jessica, Eric, Danny, Coding Rainbow, Jackie, Brent, Peiling,


var player1;
var player2;
var foodColor = [255, 255, 1]; // white
var ringColor = [230, 230, 230];
var pointColor = [255, 215, 0, 250]; // gold
var player1Color = [255, 51, 153, 240]; // magenta
var player2Color = [51, 153, 255, 240]; //   blue
var player1FadeColor = [184, 125, 155, 200]; // faded pink
var player2FadeColor = [145, 200, 255, 200]; // faded blue
var scl = 30; // scale of almost everything in the game
var vol = 0; // music volume standard
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
var eatSound; //working
var hitSound; //working
var newSceneSound; //working
var followingSound; //working
var deathSound;
var ringMoveSound;
var ambientSound;

var serial;

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
  player1 = new Player("1", " ", -0, windowWidth / 4, scl, player1Color, player1FadeColor);
  player2 = new Player("2", " ", 0, windowWidth - windowWidth / 4, scl, player2Color, player2FadeColor);
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

  // Instantiate our SerialPort object
  serial = new p5.SerialPort();
  //copy this from serial control app
  serial.open("/dev/tty.usbmodem14201");
  // call my function gotData when you receive data on the serial port
  serial.on('data', gotData);
}

// Draw is where I call anything that needs to be constantly updated/needs to constantly change own state
function draw() {
  sceneManager.switchScene(player1, player2);

  // update location of player1 and player2
  player1.update(player2);
  player2.update(player1);

  player1.updateTargetForFollowingLine(player2);
  player2.updateTargetForFollowingLine(player1);

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
    player1.update(player2, 100);
    player2.update(player1, 100);
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
  if (keyCode === 73) { // i
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

// function to process incoming data from the arduino (serial)
// serial will call this each time data is available.
function gotData() {
  // get the button state.
  var currentString = serial.readLine();
  // read the incoming string
  //same as readStringUntil(‘\r\n’)
  trim(currentString);
  // remove any trailing whitespace
  if (!currentString) return;
  // if the string is empty, do no more
  // split: the string "1,0,1,1" -> ["1","0","1","1"]
  let buttonStates = split(currentString, ",");
  if (buttonStates.length > 1) {
    if (buttonStates.includes("0")) {
      console.log("serial: " + buttonStates);
    }

    var upButtonState = buttonStates[0];
    var rightButtonState = buttonStates[1];
    var downButtonState = buttonStates[2];
    var leftButtonState = buttonStates[3];

    // TODO: work on logic here right now, the last button in the list of
    // ifs will override any other button. so if you press left and then 'up'
    // the character will move left.
    if (upButtonState === "0") {
      sceneManager.keyWasPressed(UP_ARROW, player1, player2);
    }
    if (rightButtonState === "0") {
      sceneManager.keyWasPressed(RIGHT_ARROW, player1, player2);
    }
    if (downButtonState === "0") {
      sceneManager.keyWasPressed(DOWN_ARROW, player1, player2);
    }
    if (leftButtonState === "0") {
      sceneManager.keyWasPressed(LEFT_ARROW, player1, player2);
    }
  }
}
