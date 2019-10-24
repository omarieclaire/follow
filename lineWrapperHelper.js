class LineWrapperHelper {

  /*

  +---------------------------------------------+-------------------+
  |                                             |                   |
  |                                             |                   |
  |                                             |                   |
  |                                             |                   |
  |     +-+                                     |     +-+           |
  |     |L|                                     |     |L|           |
  |     +-+                                     |    *+++           |
  |                                             |   *  |            |
  |                                             |  *   |            |
  |                                             | *    |            |
  |                                             |*     |            |
  X                                             X      |            |
  |                ty   dy                     *|      |            |
  |                -- = --                    * |      |            |
  |                tx   dx                   *  |      |            |
  |                                         *   |      | ty         |
  |                                        *    |      |            |
  |                                       *     |dy    |            |
  |                                      *      |      |            |
  |                                     *       |      |            |
  |                                    *        |      |            |
  |                                   *         |      |            |
  |                                  *          |      |            |
  |                                 *           |      |            |
  |                            +-+ *            |      |            |
  |                            |T|*     dx      |      |            |
  |                            +-----------------------+            |
  |                                             |                   |
  |                                           tx|                   |
  |                                             |                   |
  |                                             |                   |
  +---------------------------------------------+-------------------+

  */

  constructor(player, spacer) {
    this.player = player;
    this.spacer = spacer;
  }
//
  getTargetCoordinatesForRight(trailingPlayer, leadingPlayer) {

    // total x distance between us
    var totalXDistance = (windowWidth + this.spacer) - trailingPlayer.x + leadingPlayer.x;
    // total y distance between us
    var totalYDistance = leadingPlayer.y - trailingPlayer.y;
    // distance of us from edge
    var distanceFromEdge = windowWidth + this.spacer - trailingPlayer.x;

    // this is the target Y value.
    var targetY = trailingPlayer.y + (totalYDistance / totalXDistance) * distanceFromEdge;
    var targetX = windowWidth + this.spacer;

    return {
      x: targetX,
      y: targetY
    };
  }

  getTargetCoordinatesForLeft(trailingPlayer, leadingPlayer) {
    var totalXDistance = (windowWidth + this.spacer) + trailingPlayer.x - leadingPlayer.x;
    var totalYDistance = leadingPlayer.y - trailingPlayer.y;
    var distanceFromEdge = 0 + trailingPlayer.x;

    var targetY = trailingPlayer.y + (totalYDistance / totalXDistance) * distanceFromEdge;
    var targetX = 0 - this.spacer;

    return {
      x: targetX,
      y: targetY
    };
  }

  getTargetCoordinatesForUp(trailingPlayer, leadingPlayer) {
    var totalXDistance = trailingPlayer.x - leadingPlayer.x;
    var totalYDistance = trailingPlayer.y + (windowHeight + this.spacer) - leadingPlayer.y;
    var distanceFromEdge = trailingPlayer.y;

    var targetY = 0 - this.spacer;
    var targetX = trailingPlayer.x - (totalXDistance / totalYDistance) * distanceFromEdge;

    return {
      x: targetX,
      y: targetY
    };
  }

  getTargetCoordinatesForDown(trailingPlayer, leadingPlayer) {
    var totalXDistance = trailingPlayer.x - leadingPlayer.x;
    var totalYDistance = (windowHeight + this.spacer) - trailingPlayer.y + leadingPlayer.y;
    var distanceFromEdge = (windowHeight + this.spacer) - trailingPlayer.y;

    var targetY = windowHeight + this.spacer;
    var targetX = trailingPlayer.x - (totalXDistance / totalYDistance) * distanceFromEdge;

    return {
      x: targetX,
      y: targetY
    };
  }

  getTrailingAndLeadingPlayer(otherPlayer) {

    var trailingPlayer;
    var leadingPlayer;
    if (this.player.numLoops - otherPlayer.numLoops === 1) {
      // I'm the leading
      trailingPlayer = otherPlayer;
      leadingPlayer = this.player;

    } else if (this.player.numLoops - otherPlayer.numLoops === -1) {
      // I'm trailing (I have less counts)
      trailingPlayer = this.player;
      leadingPlayer = otherPlayer;
    } else {
      console.log("THIS IS BAD");
      trailingPlayer = this.player;
      leadingPlayer = otherPlayer;
    }

    return {
      trailing: trailingPlayer,
      leading: leadingPlayer
    };
  }

  handleDirRight(otherPlayer) {
    var leadingOrTrailing = this.getTrailingAndLeadingPlayer(otherPlayer);
    var leadingPlayer = leadingOrTrailing.leading;
    var trailingPlayer = leadingOrTrailing.trailing;

    return this.getTargetCoordinatesForRight(trailingPlayer, leadingPlayer);
  }

  handleDirLeft(otherPlayer) {
    var leadingOrTrailing = this.getTrailingAndLeadingPlayer(otherPlayer);
    var leadingPlayer = leadingOrTrailing.leading;
    var trailingPlayer = leadingOrTrailing.trailing;

    return this.getTargetCoordinatesForLeft(trailingPlayer, leadingPlayer);
  }

  handleDirUp(otherPlayer) {
    var leadingOrTrailing = this.getTrailingAndLeadingPlayer(otherPlayer);
    var leadingPlayer = leadingOrTrailing.leading;
    var trailingPlayer = leadingOrTrailing.trailing;

    return this.getTargetCoordinatesForUp(trailingPlayer, leadingPlayer);
  }

  handleDirDown(otherPlayer) {
    var leadingOrTrailing = this.getTrailingAndLeadingPlayer(otherPlayer);
    var leadingPlayer = leadingOrTrailing.leading;
    var trailingPlayer = leadingOrTrailing.trailing;

    return this.getTargetCoordinatesForDown(trailingPlayer, leadingPlayer);
  }

  pointsForWaveyLine(x1, y1, x2, y2, numSamples, phase, amplitude, frequency) {
    var xStart = x1;
    var yStart = y1;
    var xEnd = x2;
    var yEnd = y2;
    var data = [];
    var xDelta = xEnd - xStart;
    var yDelta = yStart - yEnd;
    var vecLength = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
    // Avoid divide by zero
    vecLength = Math.max(vecLength, 0.0001);

    // normalize it
    xDelta = xDelta / vecLength;
    yDelta = yDelta / vecLength;

    var angle = Math.atan2(yDelta, xDelta);
    var currentTime = Date.now();

    for (var i = 0; i < numSamples; i++) {
      var progress = (i.toFixed(10) / numSamples);
      var xpos = lerp(xStart, xEnd, progress);
      var ypos = lerp(yStart, yEnd, progress);
      // this amplitude determines the broad envelope of the wave.
      // if amplitude is 1 for all the samples, then the wave will be a Regular
      // sine wave.
      var amp = (amplitude / (numSamples - i))  * (Math.cos(progress * Math.PI * 2. + 3.14) * 0.5 + 0.5);
      var wave = Math.sin(phase + currentTime * 0.01 + progress * Math.PI * 2.0 * frequency) * amp;

      xpos += Math.sin(angle) * wave * 0.5;
      ypos += Math.cos(angle) * wave * 0.5;

      var entry = {
        x: xpos,
        y: ypos
      };
      data.push(entry);
    }
    return data;
  }

  drawFollowLine(targetX, targetY) {
    if (this.player.isFollowing || this.player.isFollowed) {
      push();
      var playerWavesColours = [
        [0,0,200,85],

        [255, 51, 153, 85],
        [51, 153, 255, 85],
      ];
      var playerWavesPhases = [
        0.5 * Math.PI,
        0,
        Math.PI
      ];
      // more samples is better fidelity
      var waveyLineNumSamples = 30;
      // maximum amplitude of the wave. (crescendo)
      var waveyLineAmplitude = 200;
      // distance between wave crests. Higher means shorter distance, "more humps"
      var waveyLineFrequency = 25;

      for (var j = 0; j < playerWavesColours.length; j++) {
        var waveColour = playerWavesColours[j];
        // start point of the wave (different start points mean the waves overlap)
        var wavePhase = playerWavesPhases[j];
        var waveyLinePoints = this.pointsForWaveyLine(this.player.x, this.player.y, targetX, targetY, waveyLineNumSamples, wavePhase, waveyLineAmplitude, waveyLineFrequency);
        //fill(waveColour);
        noFill();
        stroke(waveColour);
        strokeWeight(3);
        beginShape();
        for (var k = 0; k < waveyLinePoints.length; k++) {
          vertex(waveyLinePoints[k].x, waveyLinePoints[k].y);
        }
        endShape();
      }
      pop();
    }
  }

  drawWrappedFollowLine(otherPlayer) {
    if (this.player.numLoops === otherPlayer.numLoops || Math.abs(this.player.numLoops - otherPlayer.numLoops) > 1) {
      // only draw line from player if following.
      if(this.player.isFollowing) {
        this.drawFollowLine(otherPlayer.x, otherPlayer.y);
      }
    } else {
      var targetCoordinates;
      if (this.player.direction === "right") {
        targetCoordinates = this.handleDirRight(otherPlayer);
      } else if (this.player.direction === "up") {
        targetCoordinates = this.handleDirUp(otherPlayer);
      } else if (this.player.direction === "left") {
        targetCoordinates = this.handleDirLeft(otherPlayer);
      } else if (this.player.direction === "down") {
        targetCoordinates = this.handleDirDown(otherPlayer);
      }

      if (this.player.numLoops - otherPlayer.numLoops == -1) {
        // me (this.player) is trailing
        this.drawFollowLine(targetCoordinates.x, targetCoordinates.y);
      } else if (this.player.numLoops - otherPlayer.numLoops == 1) {
        // me (this.player) is leading
        if (this.player.direction === "right") {
          this.drawFollowLine(0, targetCoordinates.y);
        } else if (this.player.direction === "up") {
          this.drawFollowLine(targetCoordinates.x, windowHeight - this.spacer);
        } else if (this.player.direction === "left") {
          this.drawFollowLine(windowWidth - this.spacer, targetCoordinates.y);
        } else if (this.player.direction === "down") {
          this.drawFollowLine(targetCoordinates.x, 0);
        }
      }
    }
  }
}
