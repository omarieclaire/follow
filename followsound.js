class FollowSound {
  constructor() {
    this.numTicks = 0;
  }

  playFollowSound(isFollowing, isFollowed) {
    if (isFollowing == true) {
      this.numTicks = this.numTicks + 1;
      if (this.numTicks >= 2) {
        ambientSound.stop();
        if (!followingSound.isPlaying()) {
          //followingSound.play();
        }
      }
    } else if (isFollowed != true) {
      followingSound.stop();
      if (!ambientSound.isPlaying()) {
        //ambientSound.play();
      }
      this.numTicks = 0;
    }
  }
}
