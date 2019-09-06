function Player(name, playerDir, xspeed, x, y) {
  this.name = name;
	this.x = x;
	this.y = y;
	this.xspeed = xspeed;
	this.yspeed = 0;
	this.total = 5;
	this.direction = playerDir;
	this.isfollowing = false;


	this.eat = function(pos) {
		var d = dist(this.x, this.y, pos.x, pos.y);
		if (d < scl) {
			this.total++;
			eat_sound.play();
			return true;
		} else {
			return false;
		}
	}

	this.dir = function(x, y) {
		this.xspeed = x;
		this.yspeed = y;
	}

	this.update = function() {

		this.x = this.x + this.xspeed*scl;
		this.y = this.y + this.yspeed*scl;

		if (this.x < -20) {
			this.x = width-scl;
		} else if (this.x > width-scl + 20) {
			this.x = -20;
		} else if (this.y < -20) {
			this.y = height-scl;
		} else if (this.y > height-scl + 20) {
			this.y = -20;
		}





		// this.x = constrain(this.x, 0, width-scl);
		// this.y = constrain(this.y, 0, height-scl);
	}

this.show = function() {
	ellipse(this.x, this.y, scl, scl);
	for (var i = 0; i < this.total; i++) {
		noFill();
		stroke(255, 200);
		ellipse(this.x, this.y, scl+i*scl/2+20, scl+i*scl/2+20);
	}
}

}
