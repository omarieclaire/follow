// WHY AM I HERE?
// We are locked in a dance with the other. Each compelled/controlled by anti-mirroring.

// push the button and the ring shoots layout

// DESIGN HIGH LEVEL
// what does player want to do?
// what does player feel?
// what is this thing anyway? can I cut stuff for clarity?

// TODOS
// text not centered on fullscreen
// follow line should be drawn behind the player OR taper off OR
// rings should move around followline even when wrapping

// rug, table, lamp?
// is the venue wheelchair accessible?
// should I get prof feedback?

// make the follow line player 1, 2, and rings

// CODE TODOS
// rings should move around followline even when wrapping
// IF TIME (for proper debug) holding down movement key causes acceleration

// DESIGN TODOS
// GET LIGHTSS! Rugs? Table?
// TODO design sounds
// TODO design layout
// TODO choose colors
// TODO choose fonts
// CONSIDER - do more thinking on accessibility!! diff body movement, eyes, ears, neuro!
// CONSIDER - consider the timer
// CONSIDER - different end states with names
// CONSIDER - making food more "ring-like" (less translations)
// CONSIDER enter "player names" https://p5js.org/reference/#/p5/createInput and leaderboard
// CONSIDER should the one who is pressing the button should be "leading?" or is it even better to have the leader losing rings as a price
// CONSIDER shared score
// CONSIDER draw triangle on front of player????
// CONSIDER make health rings little circles that "follow" instead of wrap rings
// CONSIDER give flavour text boxes to coins CONSIDER i'm just looking for a leader? ("i'll do what ever you tell me to do"? or should I give flavour text to players?)
// CONSIDER punishment should be immediately obvious!
// CONSIDER Instructions? "if you follow you die" "if one of you dies, you die." ""
// CONSIDER you are both dead. playerX had more rings at time of death so congratulations.
// CONSIDER - major refactor to actually fix: unexpected "follow state" after player collision -> @player 176

// Serialport library: https://github.com/p5-serial/p5.serialport
// 1) Open Arduino. Choose port in menu under tools>ports. Upload sketch. Open serial monitor. Check for values, then CLOSE.
// 2) Open p5 Serialcontrol app. Select port. Click 'open'. Check 'console enabled' and 'read in ASCII' Check for values. Uncheck both check-boxes.
// 3) Include library in this project folder. Include library path in index.html. Include unique serialport ID (e.g. "/dev/tty.usbmodem14201") in setup(),

// Thanks: Aaron, Arnab, Ida, Game Center, Mailis, Sukanya, Jessica, Eric, Danny, Coding Rainbow, Jackie, Brent, Peiling, Nun, Atharva,

// p5.disableFriendlyErrors = true;


  // beginShape();
  // let spacing = map(mousex, 0, width, 5, 100);
  // for (let a = 0; a < 360; a += spacing) {
  //   let x = 100 * sin(a) + 200;
  //   let y = 100 * cos(a) + 200;
  //   vertex(x, y);
  // }
  // endShape();

var player1;
var player2;
var foodColor = [255, 255, 1]; // white
var ringColor = [153, 0, 204];
var pointColor = [255, 215, 0, 250]; // gold
var player1Color = [202, 44, 146, 240]; // magenta
var player2Color = [51, 153, 255, 240]; //   blue
var player1FadeColor = [202, 44, 146, 240]; // faded pink
var player2FadeColor = [51, 153, 255, 240]; // faded blue
var player1InitialRingColors = [
  [119, 37, 164],
  [167, 105, 201],
  [138, 66, 178],
  [96, 14, 142],
  [119, 37, 164],
  [167, 105, 201],
  [138, 66, 178],
  [96, 14, 142]
];
var player2InitialRingColors = [
  [119, 37, 164],
  [167, 105, 201],
  [138, 66, 178],
  [96, 14, 142],
  [119, 37, 164],
  [167, 105, 201],
  [138, 66, 178],
  [96, 14, 142]
];

var p1Ball, p2Ball;


var scl = 30; // scale of almost everything in the game
var vol = 0.1; // music volume standard
var foods = [];

var titleScene;
var welcomeScene;
var instructionScene;
var trainingScene;
var playScene;
var bonusScene;
var finalScene;
var sceneManager;

var standardTextSize = 40; // text size standard

let speed;

var spectral;
var openSansFont;

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

var upButtonIsDown = false;
var rightButtonIsDown = false;
var downButtonIsDown = false;
var leftButtonIsDown = false;
var dButtonIsDown = false;
var aButtonIsDown = false;
var wButtonIsDown = false;
var sButtonIsDown = false;
var spaceButtonIsDown = false;

// foodgen_sound, newScene (currently dupe sound), start game sound

function preload() {
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

  p1Ball = loadAnimation('img/p11.png', 'img/p12.png', 'img/p13.png', 'img/p14.png', 'img/p15.png', 'img/p16.png');
  p2Ball = loadAnimation('img/p21.png', 'img/p22.png', 'img/p23.png', 'img/p24.png', 'img/p25.png', 'img/p26.png');

  spectral = loadFont('fonts/spectral.ttf');
  openSansFont = loadFont('fonts/OpenSans-Regular.ttf');

}

// Setup is where I set up a bunch of important objects
function setup() {
  noCursor();
  createCanvas(windowWidth, windowHeight);
  // p5 specific function for working with degrees
  angleMode(DEGREES);
  //special functions to construct an object from a class
  player1 = new Player("1", " ", -0, windowWidth / 4, scl, player1Color, player1FadeColor, player1InitialRingColors, player2Color);
  player2 = new Player("2", " ", 0, windowWidth - windowWidth / 4, scl, player2Color, player2FadeColor, player2InitialRingColors, player1Color);
  titleScene = new TitleScene();
  instructionScene = new InstructionScene();
  welcomeScene = new WelcomeScene();
  trainingScene = new TrainingScene();
  playScene = new PlayScene();
  bonusScene = new BonusScene();
  finalScene = new FinalScene();
  var allTheScenes = [titleScene, instructionScene, welcomeScene, trainingScene, playScene, bonusScene];
  sceneManager = new SceneManager(0, allTheScenes, finalScene);
  // set up an array of food objects and an array of spike objects
  for (var i = 0; i < 1; i++) {
    foods[i] = new Food(scl, foodColor);
    foods[i].location(player1, player2);
  }

  textFont('spectral');


  // Instantiate our SerialPort object
  serial = new p5.SerialPort();
  //copy this from serial control app
  serial.open("/dev/tty.usbmodem14111");
  // call my function gotData when you receive data on the serial port
  serial.on('data', gotData);
}

// Draw is where I call anything that needs to be constantly updated/needs to constantly change own state
function draw() {
  sceneManager.switchScene(player1, player2);

  // update location of player1 and player2
  player1.update(player2);
  player2.update(player1);

  // player1.updateTargetForFollowingLine(player2);
  // player2.updateTargetForFollowingLine(player1);

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

function handleButtonPress(buttonState, downFlag, keyCode) {
  if (buttonState === "0") {
    if (this[downFlag] === false) {
      // this is the first time we're seeing the button down.
      this[downFlag] = true;
      sceneManager.keyWasPressed(keyCode, player1, player2);
    }
  } else {
    if (this[downFlag] == true) {
      this[downFlag] = false;
      sceneManager.keyWasReleased(keyCode, player1, player2);
    }
  }
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
    var dButtonState = buttonStates[4];
    var aButtonState = buttonStates[5];
    var wButtonState = buttonStates[6];
    var sButtonState = buttonStates[7];
    var spaceButtonState = buttonStates[8];

    // TODO: work on logic here right now, the last button in the list of
    // ifs will override any other button. so if you press left and then 'up'
    // the character will move left.
    handleButtonPress(upButtonState, 'upButtonIsDown', UP_ARROW);
    handleButtonPress(rightButtonState, 'rightButtonIsDown', RIGHT_ARROW);
    handleButtonPress(downButtonState, 'downButtonIsDown', DOWN_ARROW);
    handleButtonPress(leftButtonState, 'leftButtonIsDown', LEFT_ARROW);
    handleButtonPress(aButtonState, 'aButtonIsDown', 65);
    handleButtonPress(wButtonState, 'wButtonIsDown', 87);
    handleButtonPress(sButtonState, 'sButtonIsDown', 83);
    handleButtonPress(dButtonState, 'dButtonIsDown', 68);
    handleButtonPress(spaceButtonState, 'spaceButtonIsDown', 32);
  }
}
