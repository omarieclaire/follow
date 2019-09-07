function Food(scl) {
  this.isfollowing = false;
  this.scl = scl;
  this.total = 3;

  //picking place for food
  this.makeRandomVector = function() {
    var cols = floor(windowWidth / this.scl);
    var rows = floor(windowHeight / this.scl);
    var vector = createVector(floor(random(cols)), floor(random(rows)));
    vector.mult(this.scl);
    return vector;
  }
  //initialize food location with a random point
  this.foodLocation = this.makeRandomVector();
  this.x = this.foodLocation.x;
  this.y = this.foodLocation.y;
  //new location
  this.placer = function() {
    this.foodLocation = this.makeRandomVector();
    this.x = this.foodLocation.x;
    this.y = this.foodLocation.y;
  }


  this.show = function() {
    ellipse(this.foodLocation.x, this.foodLocation.y, this.scl, this.scl);
    for (var i = 0; i < this.total; i++) {
      noStroke();
      fill(random(220, 270), random(220, 270), 0);
      ellipse(this.foodLocation.x, this.foodLocation.y, random(scl / 2, scl / 8), random(scl / 2, scl / 8));
    }
  }
}
