<template>
  <b-container>
    <h1>Create a moving Meme!</h1>
    <b-row align-h="center" class="mb-3">
      <!-- <b-form-file
        v-model="meme"
        id="form-media"
        accept=".gif, .mp4"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        @input="uploadMedia"
      ></b-form-file> -->
      <b-form-input
        v-model="meme"
        placeholder="Enter a Video or GIF URL here..."
      />
    </b-row>
    <b-row v-for="caption in captions" :key="caption.label">
      <our-caption
        :label="caption.label"
        :text="caption.text"
        :deleteable="caption.deleteable"
        :offsetX="caption.offsetX"
        :offsetY="caption.offsetY"
        @changeText="(text) => onChangeText(caption, text)"
      />
      <label>Show in timeframe</label>
      <b-form-input
        placeholder="from frame"
        type="number"
        min="0"
        :max="videoLength - 1"
        :disabled="!caption.text"
        @change="addCaptionTime($event, 'from', caption)"
      ></b-form-input>
      <b-form-input
        placeholder="to frame"
        type="number"
        min="1"
        :max="videoLength"
        :disabled="!caption.text"
        @change="addCaptionTime($event, 'to', caption)"
      ></b-form-input>
    </b-row>
    <b-row align-h="center" align-content="center" v-show="meme">
      <!-- Time slider -->
      <b-col cols="6">
        <video
          id="video"
          ref="video"
          crossorigin="anonymous"
          :src="meme"
          controls
        ></video>
      </b-col>
      <b-col
        cols="6"
        :style="{ 'max-width': canvasWidth + 'px', 'padding-left': 0 }"
      >
        <canvas id="canvas" ref="canvas"></canvas>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Caption from "../CreateMeme/Caption";

export default {
  name: "CreateMovingMeme",
  components: {
    ourCaption: Caption,
  },
  data() {
    return {
      captions: [
        {
          label: "Caption",
          text: "A Caption",
          offsetX: 0,
          offsetY: -30,
          deleteable: false,
          fromBottom: true,
          fromTime: null,
          toTime: null,
        },
      ],
      meme: null,
      frames: [],
      manipulatedFrames: [],
      videoLength: 0,
      canvasWidth: 0,
      canvasHeight: 0,
    };
  },
  methods: {
    addCaptionTime(frame, position, caption) {
      if (position === "from") {
        caption.fromTime = frame;
      } else {
        caption.toTime = frame;
      }
    },
    timerCallback() {
      let video = this.$refs.video;
      if (video.paused || video.ended) {
        return;
      }
      this.computeFrame();
      let self = this;
      setTimeout(function () {
        self.timerCallback();
      }, 0);
    },
    computeFrame() {
      let video = this.$refs.video;
      let canvas = this.$refs.canvas;
      this.canvasWidth = video.videoWidth;
      this.canvasHeight = video.videoHeight;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      let ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

      this.videoLength = video.duration;

      ctx.putImageData(frame, 0, 0);
      this.captions.forEach((caption) => {
        if (
          caption.fromTime <= video.currentTime &&
          caption.toTime >= video.currentTime
        ) {
          this.setTextStyle();
          this.showText(caption, canvas);
        }
      });
      return;
    },
    showText(caption, canvas) {
      let topCanvasHorizontalMid = canvas.width / 2 + parseInt(caption.offsetX);

      let yCoordinate = caption.fromBottom
        ? canvas.height + caption.offsetY
        : caption.offsetY;

      this.drawTextOnCanvas(caption.text, topCanvasHorizontalMid, yCoordinate);
    },
    onChangeText(caption, text) {
      caption.text = text;
    },
    setTextStyle() {
      let canvas = this.$refs.canvas;
      let context = canvas.getContext("2d");
      context.font = "15px Impact";
      context.fillStyle = "white";
      context.strokeStyle = "black";
      context.textBaseline = "middle";
      context.textAlign = "center";
    },
    drawTextOnCanvas(text, x, y) {
      let canvas = this.$refs.canvas;
      let context = canvas.getContext("2d");
      context.fillText(text, x, y, canvas.width);
      context.strokeText(text, x, y, canvas.width);
    },
  },
  mounted() {
    let video = this.$refs.video;
    let self = this;
    video.addEventListener(
      "play",
      () => {
        // function step() {
        //   video.pause();
        //   ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        //   requestAnimationFrame(step);
        // }
        // requestAnimationFrame(step);

        self.timerCallback();
      },
      false
    );
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.overlay {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  /**col adds padding! */
  /* padding-right: 15px;
  padding-left: 15px; */
}
</style>





  

