class Level {
  constructor(isDead, currLevel){
    this.isDead;
    this.currLevel = 0;
}

  advanceToNextLevel(player1, player2) {
    if(this.currLevel == 0) {
      if(player1.total >= 6 || player2.total >= 6) {
        this.currLevel = this.currLevel + 1;
        console.log(this.currLevel);
      }
    } else if (this.currLevel == 1) {
      if(player1.total > 7 || player2.total > 7) {
        this.currLevel = this.currLevel + 1;
        console.log(this.currLevel);

      }
    } else if (this.currLevel == 2) {

    } else {
      console.log("ran out of levels");
    }

  }
}
