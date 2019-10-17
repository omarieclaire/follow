class Food {
  constructor(temp_scl) {
    this.scl = temp_scl;
    this.total = 3;
    this.x;
    this.y;
    this.color = this.foodColorPicker();
  }

  foodColorPicker() {
    var arrayOfColors = [
      [119, 37, 164],
      [167, 105, 201],
      [138, 66, 178],
      [96, 14, 142],
      [74, 6, 111],
      [214, 39, 104],
      [234, 116, 160],
      [225, 75, 130],
      [185, 9, 74],
      [145, 0, 54],
      [135, 222, 41],
      [182, 240, 119],
      [158, 233, 78],
      [104, 192, 9],
      [79, 151, 0],
      [246, 246, 45],
      [255, 255, 126],
      [255, 255, 85],
      [212, 212, 10],
      [167, 167, 0],
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
    var rows = floor(windowHeight - this.scl);
    var vector = createVector(floor(random(cols)), floor(random(rows)));
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
    stroke(this.color);
    strokeWeight(.75);
    noFill();
    ellipse(this.foodLocation.x, this.foodLocation.y, this.scl, this.scl);
    for (var i = 0; i < this.total; i++) {
      // fill(random(220, 10), random(220, 10), 0);
//old food
      // ellipse(this.foodLocation.x, this.foodLocation.y, random(scl / 2, scl / 8), random(scl / 2, scl / 8));
      ellipse(this.foodLocation.x, this.foodLocation.y, random(scl / 2, scl / 8));
    }
  }
}
