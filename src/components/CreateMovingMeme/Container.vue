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

    <b-row align-h="center" class="mb-3">
      <b-form-group
        label-cols="2"
        content-cols="10"
        label="Title"
        class="w-100"
      >
        <b-form-input v-model="title" placeholder="Enter a Title..." />
      </b-form-group>
    </b-row>

    <b-row v-for="caption in captions" :key="caption.label" v-show="meme">
      <b-col>
        <our-caption
          :label="caption.label"
          :text="caption.text"
          :deleteable="caption.deleteable"
          :offsetX="caption.offsetX"
          :offsetY="caption.offsetY"
          :showOffsetSettings="false"
          @changeText="(text) => onChangeText(caption, text)"
          @delete="() => deleteCaption(caption)"
        />
      </b-col>
      <b-col cols="4">
        <b-row>
          <b-col cols="6">
            <b-form-group class="w-100" label-for="input-horizontal"
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
          <b-col cols="6">
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

    <b-row align-h="center">
      <b-button variant="outline-primary" @click="addMoreCaptions"
        >Add more captions</b-button
      >
    </b-row>

    <b-row align-h="center">
      <span>
        Play the video on the left side to see your modifications on the right.
        Once finished click submit to upload your Moving Meme!
      </span>
    </b-row>

    <b-row align-h="center" align-content="center" v-show="meme">
      <video
        class="videoContainer m-2"
        id="video"
        ref="video"
        crossorigin="anonymous"
        :src="meme"
        controls
      ></video>
      <canvas class="m-2" id="canvas" ref="canvas"></canvas>
    </b-row>

    <b-row align-h="center" align-content="center" v-show="meme">
      <b-button
        variant="primary"
        v-on:click="startRecording"
        class="m-2"
        :disabled="isRecording"
      >
        Submit
      </b-button>
    </b-row>
  </b-container>
</template>

<script>
import Caption from "../CreateMeme/Caption";
import router from "../../router/index.js";

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
      meme:
        "https://upload.wikimedia.org/wikipedia/commons/7/79/Big_Buck_Bunny_small.ogv",
      title: "",
      videoLength: 0,
      isRecording: false,
    };
  },
  methods: {
    addMoreCaptions() {
      this.captions.push({
        label: `Caption ${this.captions.length}`,
        text: `Caption ${this.captions.length}`,
        offsetX: 0,
        offsetY: -30,
        deleteable: true,
        fromBottom: true,
        fromTime: null,
        toTime: null,
      });
    },
    addCaptionTime(frame, position, caption) {
      if (position === "from") {
        caption.fromTime = frame;
      } else {
        caption.toTime = frame;
      }
    },
    deleteCaption(caption) {
      this.captions.splice(this.captions.indexOf(caption), 1);
    },
    timerCallback() {
      let video = this.$refs.video;
      if (!video || video.paused || video.ended) {
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
      canvas.width = video.videoWidth; //clientWidth;
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
    startRecording() {
      let canvas = this.$refs.canvas;
      console.log("saving magic happens here!");
      var video = this.$refs.video;
      video.currentTime = 0;
      video.play();

      let videoOrAudioElement = this.$refs.video;
      // get the audio track:
      let audioContext = new AudioContext();
      let dest = audioContext.createMediaStreamDestination();
      let sourceNode = audioContext.createMediaElementSource(
        videoOrAudioElement
      );
      sourceNode.connect(dest);
      sourceNode.connect(audioContext.destination);
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
        console.log({ fullBlob });
        this.isRecording = false;
        this.upload(fullBlob);
      };
      this.isRecording = true;
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
    async upload(blob) {
      let data = new FormData();
      data.append("file", blob, "video.webm");
      data.append("title", this.title);
      let result = await fetch("http://localhost:3000/upload", {
        method: "POST",
        credentials: "include",
        body: data,
      });
      if (result.status === 200) {
        router.push({ name: "Home" }).catch((err) => {
          err;
        });
      }
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
.videoContainer {
  max-width: 500px;
}
</style>





  

