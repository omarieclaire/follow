class LeaderRing {
  constructor(scl) {
    this.scl = scl;
    // how much we move each time
    this.move = 0.05;
    this.x = 10;
    this.y = 10;
    this.lastPlayerFollowed = undefined;
  }

  drawRingOnFollowingPlayer(thePlayer) {
    if (thePlayer.direction == "right") {
      ellipse(this.x, this.y, this.scl / 2 + 10 * this.scl / 2)
    } else if (thePlayer.direction == "left") {
      ellipse(this.x, this.y, this.scl / 2 + 10 * this.scl / 2)
    } else if (thePlayer.direction == "up") {
      ellipse(this.x, this.y, this.scl / 2 + 10 * this.scl / 2)
    } else if (thePlayer.direction == "down") {
      ellipse(this.x, this.y, this.scl / 2 + 10 * this.scl / 2)
    } else {
    }
  }

  playerLocDiff(player) {
    let v1 = createVector(this.x, this.y);
    let v2 = createVector(player.x, player.y);

    // LERP: Linear Interpolation between two vectors
    // basically: if you have two points (vectors) and drew a line between them,
    // lerp(v1, v2, this.move) will find the point/vector which is 'this.move'
    // amount along the line between v1 and v2.
    let lerp = p5.Vector.lerp(v1, v2, this.move);
    this.x = lerp.x;
    this.y = lerp.y;

  }

  drawLeaderRing(player1, player2) {
    if (player1.isFollowing) {
      this.playerLocDiff(player1);
      this.drawRingOnFollowingPlayer(player1);
      this.lastPlayerFollowed = player1;
    } else if (player2.isFollowing) {
      this.playerLocDiff(player2);
      this.drawRingOnFollowingPlayer(player2);
      this.lastPlayerFollowed = player2;
    } else {
      if (this.lastPlayerFollowed == undefined) {
        this.lastPlayerFollowed == undefined
      } else {
        this.x = this.lastPlayerFollowed.x;
        this.y = this.lastPlayerFollowed.y;
      }
    }
  }
}
