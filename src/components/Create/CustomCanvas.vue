<template>
  <b-container fluid>
    <!-- class="justify-content-md-center"-->
    <b-row align-h="center" :style="{ position: 'relative' }">
      <canvas ref="memeCanvas" id="memeCanvas" />
      <canvas class="overlay" ref="drawCanvas" id="drawCanvas" />
      <canvas ref="resultCanvas" id="resultCanvas" class="hidden" />
    </b-row>
  </b-container>
</template>

<script>
import { saveAs } from "file-saver";
import FormData from "form-data";

import router from "../../router/index.js";

export default {
  name: "CustomCanvas",
  props: {
    topText: Object,
    bottomText: Object,
    img: String,
    drawingSettings: Object,
  },
  components: {},
  data() {
    return {
      pos: { x: 0, y: 0 },
    };
  },
  methods: {
    changeImageText() {
      let canvas = this.$refs.memeCanvas;
      let context = canvas.getContext("2d");

      this.drawCanvasImage(canvas, context).then(() => {
        this.setCanvasTextStyle(context);
        // wait until picture finished loading and add text afterwards!
        let topCanvasHorizontalMid =
          canvas.width / 2 + parseInt(this.topText.offsetX);
        let bottomCanvasHorizontalMid =
          canvas.width / 2 + parseInt(this.bottomText.offsetX);
        console.log(
          topCanvasHorizontalMid + " and " + bottomCanvasHorizontalMid
        );
        let canvasBottom = canvas.height - Math.abs(this.bottomText.offsetY);
        //show top text

        context.fillText(
          this.topText.text,
          topCanvasHorizontalMid,
          this.topText.offsetY,
          canvas.width
        );
        context.strokeText(
          this.topText.text,
          topCanvasHorizontalMid,
          this.topText.offsetY,
          canvas.width
        );
        //show bottom text
        context.fillText(
          this.bottomText.text,
          bottomCanvasHorizontalMid,
          canvasBottom,
          canvas.width
        );
        context.strokeText(
          this.bottomText.text,
          bottomCanvasHorizontalMid,
          canvasBottom,
          canvas.width
        );
      });
    },
    drawCanvasImage(canvas, context) {
      console.log("drawCanvasImage");
      return new Promise((resolve) => {
        let img = new Image();
        img.src = this.img;
        img.crossOrigin = "anonymous";
        img.src = this.img;
        img.onload = function () {
          let width = window.innerWidth;
          let height = window.innerHeight;
          // in order to show the picture in high resolution, set the canvas to the max height & width
          canvas.width = width;
          canvas.height = height;
          // calculate the scaled (down) image height & width to fit the canvas
          let imgWidth = img.width;
          let imgHeight = img.height;
          let scale = Math.min(
            canvas.width / imgWidth,
            canvas.height / imgHeight
          );
          // set the canvas back to the scaled values to maintain ratio and hight pic resolution
          let newImageWidth = imgWidth * scale;
          let newImageHeight = imgHeight * scale;
          canvas.width = newImageWidth;
          canvas.height = newImageHeight;

          context.mozImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;
          context.webkitImageSmoothingEnabled = false;

          context.drawImage(
            img,
            0,
            0,
            imgWidth,
            imgHeight,
            0,
            0,
            newImageWidth,
            newImageHeight
          );

          // register that image loading is complete
          return resolve();
        };
      });
    },
    loadCanvas() {
      let canvas = this.$refs.memeCanvas;
      let context = canvas.getContext("2d");
      this.drawCanvasImage(canvas, context).then(() => {
        this.setCanvasTextStyle(context);
        // layer the drawing canvas above
        let drawingCanvas = this.$refs.drawCanvas;
        drawingCanvas.height = canvas.height;
        drawingCanvas.width = canvas.width;

        let resultCanvas = this.$refs.resultCanvas;
        resultCanvas.height = canvas.height;
        resultCanvas.width = canvas.width;
      });
    },
    setCanvasTextStyle(context) {
      context.font = "50px Impact";
      context.fillStyle = "white";
      context.strokeStyle = "black";
      context.textBaseline = "middle";
      context.textAlign = "center";
    },
    createResultingCanvas() {
      let canvas = this.$refs.resultCanvas;
      let context = canvas.getContext("2d");
      //combine the meme and drawing into a result canvas to download
      context.drawImage(this.$refs.memeCanvas, 0, 0);
      context.drawImage(this.$refs.drawCanvas, 0, 0);
      return canvas;
    },
    download() {
      let canvas = this.createResultingCanvas();
      canvas.toBlob(function (blob) {
        saveAs(blob, "meme.png");
      });
    },
    async saveOnServer() {
      let canvas = this.createResultingCanvas();
      canvas.toBlob(async (blob) => {
        let data = new FormData();
        data.append("file", blob, "file.png");
        let result = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: data,
        });
        if (result.status === 200) {
          console.log("image uploaded successfully to server!");
          router.push({ name: "Home" }).catch((err) => {
            err;
          });
        }
      });
    },
    activateDrawingMode() {
      const canvas = this.$refs.drawCanvas;
      canvas.addEventListener("mousemove", this.drawOnCanvas, false);
      canvas.addEventListener("mousedown", this.setPosition, false);
    },
    setPosition(e) {
      this.pos.x = e.offsetX;
      this.pos.y = e.offsetY;
    },
    drawOnCanvas(e) {
      if (!this.drawingSettings) return;
      let { brushSize, color, isErasing } = this.drawingSettings;
      let canvas = this.$refs.drawCanvas;
      let ctx = canvas.getContext("2d");
      // mouse left button must be pressed
      if (e.buttons !== 1) return;

      ctx.beginPath(); // begin

      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";

      if (!isErasing) {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = color;

        ctx.moveTo(this.pos.x, this.pos.y); // from
        this.setPosition(e);
        ctx.lineTo(this.pos.x, this.pos.y); // to

        ctx.stroke(); // draw it!
      } else {
        //TODO eraser!
        // ctx.globalCompositeOperation = "destination-out";
        // ctx.arc(this.pos.x, this.pos.y, brushSize, 0, Math.PI * 2, false);
        // ctx.fill();
        ctx.globalCompositeOperation = "destination-out";

        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, brushSize, 0, 2 * Math.PI, false);
        ctx.fill();

        ctx.lineWidth = brushSize;
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        this.setPosition(e);
        ctx.lineTo(this.pos.x, this.pos.y);
        ctx.stroke();
      }
    },
  },
  mounted() {
    this.loadCanvas();
  },
  watch: {
    topText: {
      handler() {
        this.changeImageText();
      },
      deep: true,
    },
    bottomText: {
      handler() {
        this.changeImageText();
      },
      deep: true,
    },
    img() {
      this.changeImageText();
    },
  },
};
</script>

<style scoped>
.hidden {
  display: none;
}
.overlay {
  position: absolute;
  z-index: 1;
}
</style>