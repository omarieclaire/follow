class LeaderRing {
  constructor(scl) {
    this.scl = scl;
    this.spacer = scl/2;
    // how much we move each time
    this.move = 1;
    this.x = windowWidth / 2;
    this.y = windowHeight / 2;
    this.lastPlayerLeading = undefined;
    this.show = false;
    this.numTicks = 0;
    this.animationLength = 100;
  }

  drawRingOnLeadingPlayer(thePlayer) {
    push();
    strokeWeight(200);
    var r = 10;
    // var r = thePlayer.playerRings[3[3]];
    stroke(255, 215, 0, 40);
    if (thePlayer.direction == "right") {
      ellipse(this.x, this.y, r, r);
    } else if (thePlayer.direction == "left") {
      ellipse(this.x, this.y, r, r);
    } else if (thePlayer.direction == "up") {
      ellipse(this.x, this.y, r, r);
    } else if (thePlayer.direction == "down") {
      ellipse(this.x, this.y, r, r);
    } else {}
    pop();
   }

  playerLocDiff(player) {
    let v1 = createVector(this.x, this.y);
    let v2 = createVector(player.x, player.y);
    let lerp = p5.Vector.lerp(v1, v2, this.move);
    this.x = lerp.x;
    this.y = lerp.y;

    if (this.x < 0 - this.spacer) {
      this.x = windowWidth - this.scl;
    } else if (this.x > windowWidth - this.scl + this.spacer) {
      this.x = 0 - this.spacer;
    } else if (this.y < 0 - this.spacer) {
      this.y = windowHeight - this.scl;
    } else if (this.y > windowHeight - this.scl + this.spacer) {
      this.y = 0 - this.spacer;

    }
  }


  drawLeaderRing(player1, player2) {
    if (player1.isFollowing) {
      this.playerLocDiff(player2);
      this.drawRingOnLeadingPlayer(player2);
      this.lastPlayerLeading = player2;
    } else if (player2.isFollowing) {
      this.playerLocDiff(player1);
      this.drawRingOnLeadingPlayer(player1);
      this.lastPlayerLeading = player1;
    } else {
      if (this.lastPlayerLeading == undefined) {
        this.lastPlayerLeading == undefined
      } else {
        this.x = this.lastPlayerLeading.x;
        this.y = this.lastPlayerLeading.y;
      }
    }
  }
}
