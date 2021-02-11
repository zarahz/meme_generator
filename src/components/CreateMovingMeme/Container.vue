<template>
  <b-container>
    <h1 class="p-3">Create a moving Meme!</h1>
    <b-row align-h="center" class="mb-3">
      <b-form-group label-cols="2" content-cols="10" label="URL" class="w-100">
        <b-form-input
          v-model="meme"
          placeholder="Enter a Video or GIF URL here..."
        />
      </b-form-group>
    </b-row>

    <b-row v-for="caption in captions" :key="caption.label">
      <b-col cols="5">
        <our-caption
          :label="caption.label"
          :text="caption.text"
          :deleteable="caption.deleteable"
          :offsetX="caption.offsetX"
          :offsetY="caption.offsetY"
          :showOffsetSettings="false"
          @changeText="(text) => onChangeText(caption, text)"
        />
      </b-col>
      <b-col>
        <b-row>
          <b-col>
            <b-form-group
              class="w-100"
              label-cols="8"
              content-cols="4"
              label="Show in timeframe"
              label-for="input-horizontal"
              ><b-form-input
                id="input-horizontal"
                type="number"
                min="0"
                placeholder="from second ..."
                :max="videoLength - 1"
                :disabled="!meme || !caption.text"
                @change="addCaptionTime($event, 'from', caption)"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col cols="3">
            <b-form-input
              placeholder="to second ..."
              type="number"
              min="1"
              :max="videoLength"
              :disabled="!meme || !caption.text"
              @change="addCaptionTime($event, 'to', caption)"
            ></b-form-input>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row align-h="center" align-content="center" v-show="meme">
      <!-- Time slider -->
      <video
        width="500px"
        id="video"
        ref="video"
        crossorigin="anonymous"
        :src="meme"
        controls
        class="m-2"
      ></video>
      <canvas class="m-2" id="canvas" ref="canvas"></canvas>
    </b-row>
    <b-row align-h="center" align-content="center" v-show="meme">
      <b-button variant="primary" v-on:click="startRecording" class="m-2">
        Record Meme
      </b-button>
      <b-button
        v-on:click="cancelRecording"
        variant="primary"
        :style="{ visibility: isRecording ? 'show' : 'hidden' }"
        class="m-2"
      >
        Cancel
      </b-button>
    </b-row>
    <b-row>
      Moving meme:
      <video
        width="500px"
        id="resultingVideo"
        ref="resultingVideo"
        controls
        crossorigin="anonymous"
        class="m-2"
      ></video>
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
      isRecording: false,
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
      canvas.width = video.clientWidth;
      canvas.height = video.clientHeight;
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
    startRecording() {
      let canvas = this.$refs.canvas;
      console.log("saving magic happens here!");
      var video = this.$refs.video;
      video.currentTime = 0;
      video.play();

      let videoOrAudioElement = this.$refs.video;
      // get the audio track:
      let ctx = new AudioContext();
      let dest = ctx.createMediaStreamDestination();
      let sourceNode = ctx.createMediaElementSource(videoOrAudioElement);
      sourceNode.connect(dest);
      sourceNode.connect(ctx.destination);
      let audioTrack = dest.stream.getAudioTracks()[0];
      // add it to your canvas stream:

      const stream = canvas.captureStream();
      stream.addTrack(audioTrack);

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });

      // Get the blob data when is available
      let allChunks = [];
      recorder.ondataavailable = function (e) {
        allChunks.push(e.data);
      };

      recorder.onstop = () => {
        const fullBlob = new Blob(allChunks, { type: "video/webm" });
        this.$refs.resultingVideo.src = window.URL.createObjectURL(fullBlob);
        console.log({ fullBlob });

        //download
        // var url = URL.createObjectURL(fullBlob);
        // var a = document.createElement("a");
        // document.body.appendChild(a);
        // a.style = "display: none";
        // a.href = url;
        // a.download = "test.webm";
        // a.click();
        // window.URL.revokeObjectURL(url);
      };

      // Start to record
      recorder.start(100);

      // Stop the recorder after 5s and check the result
      setTimeout(() => {
        recorder.stop();
      }, 15000);
    },
    cancelRecording() {
      console.log("cancel recording!");
    },
  },
  mounted() {
    let video = this.$refs.video;
    let self = this;
    video.addEventListener(
      "play",
      () => {
        self.timerCallback();
      },
      false
    );
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>





  

