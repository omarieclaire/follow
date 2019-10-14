class FollowSound {
  constructor() {
    this.numTicks = 0;
  }

  playFollowSound(isFollowing, isFollowed) {
    if (isFollowing == true) {
      this.numTicks = this.numTicks + 1;
      if (this.numTicks >= 2) {
        if (!ambientSound.isPlaying()) {
          ambientSound.play();
        }
      }
    } else if (isFollowed != true) {
      ambientSound.stop();
      this.numTicks = 0;
    }
  }
}
