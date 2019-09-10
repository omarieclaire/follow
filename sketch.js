var player1;
var player2;
var scl = 40;
var vol = 0.4;
var food;
var currLevel;

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
	// noStroke();
	//Special function to construct an object
	player1 = new Player("1", " ", 0, windowWidth/2 + 200, windowHeight/2);
	player2 = new Player("2", " ", -0, windowWidth/2 - 200, windowHeight/2);
	food = new Food(scl);


	currLevel = new Level(false, 0);
	food.location();

}

function draw() {
	background(30);
	noStroke();

	currLevel.advanceToNextLevel(player1, player2);

	//food
	// fill(0, 255, 0);

	//"is following text
	textSize(30);
	fill(255, 51, 153);
	text(player1.total.toFixed(0), windowWidth / 2 + 200, windowHeight / 1.2);
	fill(51, 153, 255);
	text(player2.total.toFixed(0), windowWidth / 2 - 200, windowHeight / 1.2);

	//score text
	textSize(20);
	textAlign(CENTER, TOP);

	//following punishment/rewards
	if (player1.isFollowing) {
		if (player1.isFollowing) {
			player1.total = player1.total - 0.001;
			}
		fill(255, 51, 153);
		text("Pink is following", windowWidth/2, windowHeight/6);
	} else if (player2.isFollowing) {
		if (player2.isFollowing) {
			player2.total = player2.total - 0.001;
			}
		fill(51, 153, 255);
		text("Blue is Following", windowWidth/2, windowHeight/6);
	}

	player1.update();
	player2.update();
	fill(255, 51, 153);
	player1.show();
	fill(51, 153, 255);
	player2.show();
	fill(255);
	food.show();

//food placement

	if (player1.eat(food)) {
		console.log("collide");
		food.location();
		food.placer();
	}

	if (player2.eat(food)) {
		console.log("collide");
		food.location();
		food.placer();
		}

}

//who is following who
function handlePlayerFollowing(playerX, playerY, futureDirectionOfX) {
	//this is happening right after playerX presses a directional key, BEFORE the direction of playerX changes
	if(playerX.direction == playerY.direction) { 	//only deal with cases where there is ALREADY a "follower"
		if(futureDirectionOfX != playerX.direction) { //is someone unfollowing someone?
			playerX.isFollowing = false; //then turn off all follows
			playerY.isFollowing = false;
		}
	} else { // if there is no current follower
		if(futureDirectionOfX == playerY.direction) {
			playerX.isFollowing = true;
		}
	}
}

function keyPressed() {
	if (keyCode === UP_ARROW) {
		handlePlayerFollowing(player1, player2, "up");
		player1.dir(0, -.1);
		player1.direction = "up";

	} else if (keyCode === DOWN_ARROW) {
		handlePlayerFollowing(player1, player2, "down");
		player1.dir(0, .1);
		player1.direction = "down";

	} else if (keyCode === RIGHT_ARROW) {
		handlePlayerFollowing(player1, player2, "right");
		player1.dir(.1, 0);
		player1.direction = "right";

	} else if (keyCode === LEFT_ARROW) {
		handlePlayerFollowing(player1, player2, "left");
		player1.dir(-.1, 0);
		player1.direction = "left";

	} else if (keyCode === 87) {
		handlePlayerFollowing(player2, player1, "up");
		player2.dir(0, -.1);
		player2.direction = "up";

	} else if (keyCode === 83) {
		handlePlayerFollowing(player2, player1, "down");
		player2.dir(0, .1);
		player2.direction = "down";

	} else if (keyCode === 68) {
		handlePlayerFollowing(player2, player1, "right");
		player2.dir(.1, 0);
		player2.direction = "right";

	} else if (keyCode === 65) {
		handlePlayerFollowing(player2, player1, "left");
		player2.dir(-.1, 0);
		player2.direction = "left";
	}
}

// function foodPlacer() {
// 	var cols = floor(width/scl);
// 	var rows = floor(height/scl);
// 	food = createVector(floor(random(cols)), floor(random(rows)));
// 	food.mult(scl);
// }
