class Food {

  initializeFood() {
    this.color = this.foodColorPicker();
    this.numTicks = 0;
    // every this-many-ticks, increasing the speed.
    this.speedIncreaseCondition = 5000;
    this.speed = 2;
    this.total = 3;
  }
  constructor(temp_scl) {
    this.scl = temp_scl;
    this.x;
    this.y;
    this.initializeFood();
  }

  reset() {
    this.initializeFood();
  }

  foodColorPicker() {
    var arrayOfColors = [
      [184, 120, 245],
      [159, 7, 247],
      [152, 23, 191],
      [152, 25, 207],
      [132, 41, 196],
      [172, 46, 240],
      [184, 120, 245],
      [159, 7, 247],
      [152, 23, 191],
      [152, 25, 207],
      [132, 41, 196],
      [172, 46, 240]
    ];
    var randomNumber = floor(random(arrayOfColors.length));
    return arrayOfColors[randomNumber];
  }

  foodMove() {
    for (var i = 0; i <= 10; i++) {
      this.x = this.x + 1;
    }
  }

  //picking place for food
  makeRandomVector() {
    var cols = floor(windowWidth - this.scl);
    var vector = createVector(floor(random(cols)), 0);
    return vector;
  }
  //initialize food location with a random point
  location(player1, player2) {
    this.foodLocation = this.makeRandomVector();
    var player1Distance = dist(this.foodLocation.x, this.foodLocation.y, player1.x, player1.y);
    var player2Distance = dist(this.foodLocation.x, this.foodLocation.y, player2.x, player2.y);

    while(player1Distance < player1.currentDiameter()/2 || player2Distance < player2.currentDiameter()/2) {
      this.foodLocation = this.makeRandomVector();
      player1Distance = dist(this.foodLocation.x, this.foodLocation.y, player1.x, player1.y);
      player2Distance = dist(this.foodLocation.x, this.foodLocation.y, player2.x, player2.y);
    }

    this.x = this.foodLocation.x;
    this.y = this.foodLocation.y;
    this.color = this.foodColorPicker();
  }

  show() {
    this.numTicks++;
    if(this.numTicks % this.speedIncreaseCondition === 0) {
      this.speed++;
    }
    push();
    this.foodLocation.y = this.foodLocation.y + this.speed;
    if(this.foodLocation.y > windowHeight) {
      this.foodLocation.y = 0;
    }
    this.y = this.foodLocation.y;
    stroke(this.color);
    strokeWeight(1.5  );
    noFill();
    ellipse(this.foodLocation.x, this.foodLocation.y, this.scl*1.5, this.scl*1.5);
    for (var i = 0; i < this.total; i++) {
      // fill(random(220, 10), random(220, 10), 0);
//old food
      // ellipse(this.foodLocation.x, this.foodLocation.y, random(scl / 1.5, scl / 2), random(scl / 1.5, scl / 2));
      ellipse(this.foodLocation.x, this.foodLocation.y, random(scl / 1.2, scl / 7.5));
    }
    pop();
  }
}
