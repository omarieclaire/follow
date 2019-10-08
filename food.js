class Food {
  constructor(temp_scl) {
    this.scl = temp_scl;
    this.total = 3;
    this.x;
    this.y;
  }

  foodMove() {
    for (var i = 0; i <= 10; i++) {
      this.x = this.x + 1;
    }
  }

  //picking place for food
  makeRandomVector() {
    var cols = floor(windowWidth / this.scl);
    var rows = floor(windowHeight / this.scl);
    var vector = createVector(floor(random(cols)), floor(random(rows)));
    vector.mult(this.scl);
    return vector;
  }
  //initialize food location with a random point
  location() {
    this.foodLocation = this.makeRandomVector();
    this.x = this.foodLocation.x;
    this.y = this.foodLocation.y;
  }

  show() {
    stroke(foodColor);
    strokeWeight(.5);
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
