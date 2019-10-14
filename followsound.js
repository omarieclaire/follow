class FollowSound {
  constructor() {
    this.numTicks = 0;
  }

  playFollowSound(isFollowing, isFollowed) {
    if (isFollowing == true) {
      this.numTicks = this.numTicks + 1;
      console.log(this.numTicks)
      if (this.numTicks >= 2) {
        if (!ambientSound.isPlaying()) {
          ambientSound.play();
          console.log("follow sound playing");
        }
      }
    } else if (isFollowed != true) {
      ambientSound.stop();
      console.log("follow sound stopping");
      this.numTicks = 0;
    }
  }
}
