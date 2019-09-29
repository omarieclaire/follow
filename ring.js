class LeaderRing {
  constructor(scl) {
    this.scl = scl;
    // how much we move each time
    this.move = 0.05;
    this.x = windowWidth/2;
    this.y = windowHeight/2;
    this.lastPlayerLeading = undefined;
  }

  drawRingOnLeadingPlayer(thePlayer) {
    stroke(255,215,0, 200);
    if (thePlayer.direction == "right") {
      ellipse(this.x, this.y, this.scl / 2 + 5 * this.scl / 2)
    } else if (thePlayer.direction == "left") {
      ellipse(this.x, this.y, this.scl / 2 + 5 * this.scl / 2)
    } else if (thePlayer.direction == "up") {
      ellipse(this.x, this.y, this.scl / 2 + 5 * this.scl / 2)
    } else if (thePlayer.direction == "down") {
      ellipse(this.x, this.y, this.scl / 2 + 5 * this.scl / 2)
    } else {
    }
  }

  playerLocDiff(player) {
    let v1 = createVector(this.x, this.y);
    let v2 = createVector(player.x, player.y);
    let lerp = p5.Vector.lerp(v1, v2, this.move);
    this.x = lerp.x;
    this.y = lerp.y;
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
