<template>
  <b-container fluid>
    <!-- class="justify-content-md-center"-->
    <b-row align-h="center">
      <b-button type="button" size="sm" variant="outline-primary">
        <b-icon icon="plus" font-scale="2"></b-icon>
      </b-button>
    </b-row>
    <b-row align-h="center" class="canvas-row mt-1">
      <b-col align-self="center" class="plus-button-left">
        <b-button type="button" size="sm" variant="outline-primary">
          <b-icon icon="plus" font-scale="2"></b-icon>
        </b-button>
      </b-col>
      <b-col>
        <canvas ref="memeCanvas" id="memeCanvas" />
        <canvas class="overlay" ref="drawCanvas" id="drawCanvas" />
        <canvas ref="resultCanvas" id="resultCanvas" class="hidden" />
      </b-col>
      <b-col align-self="center" class="plus-button-right">
        <b-button type="button" size="sm" variant="outline-primary">
          <b-icon icon="plus" font-scale="2"></b-icon> </b-button
      ></b-col>
    </b-row>
    <b-row align-h="center">
      <b-button type="button" size="sm" variant="outline-primary">
        <b-icon icon="plus" font-scale="2"></b-icon>
      </b-button>
    </b-row>

    <b-row align-h="center" class="mt-3">
      <label class="mr-5">Set Canvas Size</label>
      <label class="mr-1">Width:</label>
      <!--v-on:input="changeImageText"-->
      <b-form-input
        v-model="canvasWidth"
        @change="changeCanvasSize(true)"
        style="width: 60px"
        class="mr-3"
        type="text"
        placeholder="horizontal offset"
      />
      <label class="mr-1">Height:</label>
      <!--v-on:input="changeImageText"-->
      <b-form-input
        v-model="canvasHeight"
        @change="changeCanvasSize(false)"
        style="width: 60px"
        type="text"
        placeholder="horizontal offset"
      />
    </b-row>
  </b-container>
</template>

<script>
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
      canvasWidth: 0,
      canvasHeight: 0,
    };
  },
  methods: {
    changeImageText() {
      let canvas = this.$refs.memeCanvas;
      let context = canvas.getContext("2d");

      this.drawCanvasImage(canvas, context).then(() => {
        this.showTexts(canvas, context);
      });
    },
    showTexts(canvas, context) {
      this.setCanvasTextStyle(context);
      // wait until picture finished loading and add text afterwards!
      let topCanvasHorizontalMid =
        canvas.width / 2 + parseInt(this.topText.offsetX);
      let bottomCanvasHorizontalMid =
        canvas.width / 2 + parseInt(this.bottomText.offsetX);
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
    },
    changeCanvasSize(basedOnWidth) {
      let canvas = this.$refs.memeCanvas;
      let context = canvas.getContext("2d");
      this.drawCanvasImage(canvas, context, true, basedOnWidth).then(() => {
        this.showTexts(canvas, context);
      });
    },
    appendImage(position) {
      console.log(position);
    },
    drawCanvasImage(
      canvas,
      context,
      modifiedCanvasSize = false,
      ratioBasedOnWidth
    ) {
      let self = this;
      return new Promise((resolve) => {
        let img = new Image();
        img.src = this.img;
        img.crossOrigin = "anonymous";
        img.src = this.img;
        img.onload = function () {
          let windowWidth = window.innerWidth;
          let windowHeight = window.innerHeight;
          // in order to show the picture in high resolution, set the canvas to the max height & width
          canvas.width = windowWidth;
          canvas.height = windowHeight;

          let scale = self.calculateImageScale(
            img,
            windowWidth,
            windowHeight,
            modifiedCanvasSize,
            ratioBasedOnWidth
          );

          //calculate new image size by scaling up/down
          let imageSize = self.calculateImageSize(
            img,
            scale,
            modifiedCanvasSize
          );

          // set canvas size based on (scaled) image size
          canvas.width = imageSize.width;
          canvas.height = imageSize.height;

          //save canvas width & height values
          self.canvasWidth = canvas.width;
          self.canvasHeight = canvas.height;

          self.adaptAllCanvasSizes();

          context.mozImageSmoothingEnabled = false;
          context.imageSmoothingEnabled = false;
          context.webkitImageSmoothingEnabled = false;

          context.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            0,
            0,
            modifiedCanvasSize ? self.canvasWidth : imageSize.width,
            modifiedCanvasSize ? self.canvasHeight : imageSize.height
          );
          // register that image loading is complete
          return resolve();
        };
      });
    },
    calculateImageScale(
      img,
      windowWidth,
      windowHeight,
      modifiedCanvasSize,
      ratioBasedOnWidth
    ) {
      // calculate the scaled (down) image height & width to fit the canvas
      let widthRatio = windowWidth / img.width;
      let heigthRatio = windowHeight / img.height;

      let scale = Math.min(widthRatio, heigthRatio);

      //if user has set a size for the canvas, calculate ratios based on that
      if (modifiedCanvasSize) {
        if (ratioBasedOnWidth) {
          // ratio is based on User set canvas size instead of window size!
          scale = this.canvasWidth / img.width;
        } else {
          scale = this.canvasHeight / img.height;
        }
      }
      return scale;
    },
    calculateImageSize(img, scale, modifiedCanvasSize) {
      let imageSize = {};
      imageSize.width = img.width;
      imageSize.height = img.height;
      //always scale down, scale up only if user manually increased the size
      if (modifiedCanvasSize || scale < 1) {
        // maintain ratio and hight resolution
        imageSize.width = img.width * scale;
        imageSize.height = img.height * scale;
      }
      return imageSize;
    },
    adaptAllCanvasSizes() {
      // layer the drawing canvas above
      let drawingCanvas = this.$refs.drawCanvas;
      drawingCanvas.height = this.canvasHeight;
      drawingCanvas.width = this.canvasWidth;

      let resultCanvas = this.$refs.resultCanvas;
      resultCanvas.height = this.canvasHeight;
      resultCanvas.width = this.canvasWidth;
    },
    loadCanvas() {
      let canvas = this.$refs.memeCanvas;
      let context = canvas.getContext("2d");
      this.drawCanvasImage(canvas, context).then(() => {
        this.setCanvasTextStyle(context);
        this.adaptAllCanvasSizes();
      });
    },
    clearDrawingCanvas() {
      console.log("deleting");
      const drawingCanvas = this.$refs.drawCanvas;
      const context = drawingCanvas.getContext("2d");

      context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
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
.canvas-row {
  position: relative;
}
.overlay {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
}

.plus-button-left {
  text-align: right;
}
.plus-button-right {
  text-align: left;
}
</style>