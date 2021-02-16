<template>
  <b-container fluid>
    <!-- class="justify-content-md-center"-->
    <b-row align-h="center" class="m-2">
      <b-button
        type="button"
        size="sm"
        variant="outline-primary"
        @click="openTemplatesModal('top')"
      >
        <b-icon icon="plus" font-scale="2"></b-icon>
      </b-button>
    </b-row>
    <b-row align-h="center" class="canvas-row mr-1">
      <b-col align-self="center" class="plus-button-left">
        <b-button
          type="button"
          size="sm"
          variant="outline-primary"
          @click="openTemplatesModal('left')"
        >
          <b-icon icon="plus" font-scale="2"></b-icon>
        </b-button>
      </b-col>
      <b-col :style="{ 'max-width': canvasWidth + 'px', 'padding-left': 0 }">
        <canvas ref="memeCanvas" id="memeCanvas" />
        <canvas class="overlay" ref="textCanvas" id="textCanvas" />
        <canvas class="overlay" ref="drawCanvas" id="drawCanvas" />
        <canvas ref="resultCanvas" id="resultCanvas" class="hidden" />
      </b-col>
      <b-col align-self="center" class="plus-button-right">
        <b-button
          type="button"
          size="sm"
          variant="outline-primary"
          @click="openTemplatesModal('right')"
        >
          <b-icon icon="plus" font-scale="2"></b-icon>
        </b-button>
      </b-col>
    </b-row>
    <b-row align-h="center" class="m-2">
      <b-button
        type="button"
        size="sm"
        variant="outline-primary"
        @click="openTemplatesModal('bottom')"
      >
        <b-icon icon="plus" font-scale="2"></b-icon>
      </b-button>
    </b-row>

    <b-row align-h="center" class="mt-3">
      <label class="mr-4">Canvas Size</label>
      <label class="mr-1">Width:</label>
      <b-form-input
        v-model="canvasWidth"
        @change="changeCanvasSize(true)"
        class="mr-3 size-input"
        type="text"
        placeholder="horizontal offset"
      />
      <label class="mr-1">Height:</label>
      <b-form-input
        v-model="canvasHeight"
        @change="changeCanvasSize(false)"
        class="size-input"
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
    captions: {
      type: Array,
      default: () => [],
    },
    img: String,
    drawingSettings: Object,
    fontSize: Number,
    fontLocal: String,
    isItalic: String,
    isBold: String,
    font: String,
    fontColor: String,
  },
  components: {},
  data() {
    return {
      pos: { x: 0, y: 0 },
      canvasWidth: 0,
      canvasHeight: 0,
      appendOnPosition: "left",
    };
  },
  methods: {
    showTexts() {
      let canvas = this.$refs.textCanvas;
      let context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.setTextStyle();

      this.captions.forEach((caption) => {
        let topCanvasHorizontalMid =
          canvas.width / 2 + parseInt(caption.offsetX);

        let yCoordinate = caption.fromBottom
          ? canvas.height + caption.offsetY
          : caption.offsetY;

        this.drawTextOnCanvas(
          caption.text,
          topCanvasHorizontalMid,
          yCoordinate
        );
      });
    },
    drawTextOnCanvas(text, x, y) {
      let canvas = this.$refs.textCanvas;
      let context = canvas.getContext("2d");
      context.fillText(text, x, y, canvas.width);
      context.strokeText(text, x, y, canvas.width);
    },
    changeCanvasSize(basedOnWidth) {
      let canvas = this.$refs.memeCanvas;
      let context = canvas.getContext("2d");
      let self = this;
      new Promise((resolve) => {
        //image must be rerendered on canvas size change!
        var content = new Image();
        content.src = canvas.toDataURL();
        content.onload = function () {
          let OGSize = { width: canvas.width, height: canvas.height };

          let windowWidth = window.innerWidth;
          let windowHeight = window.innerHeight;
          let scale = 1;
          // in order to show the picture in high resolution, set the canvas to the max height & width
          canvas.width = windowWidth;
          canvas.height = windowHeight;
          scale = self.calculateImageScale(OGSize, basedOnWidth);

          //calculate new image size by scaling up/down
          let imageSize = self.calculateImageSize(OGSize, scale);

          // set canvas size based on (scaled) image size
          canvas.width = imageSize.width;
          canvas.height = imageSize.height;

          //save canvas width & height values
          self.adaptAllCanvasSizes();

          context.drawImage(
            content,
            0,
            0,
            content.width,
            content.height,
            0,
            0,
            self.canvasWidth,
            self.canvasHeight
          );
          // register that image loading is complete
          return resolve();
        };
      }).then(() => {
        this.showTexts();
      });
    },
    prepareImage(url) {
      let img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      img.src = url;
      return img;
    },
    openTemplatesModal(position) {
      this.appendOnPosition = position;
      this.$emit("openTemplatesModal");
    },
    apppendTemplate(memeUrl) {
      let canvas = this.$refs.memeCanvas;
      let context = canvas.getContext("2d");
      let self = this;
      return new Promise((resolve) => {
        let img = this.prepareImage(memeUrl);
        img.onload = function () {
          let OGCanvasContent = context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          let OGCanvasSize = { width: canvas.width, height: canvas.height };

          let widthRatio = canvas.width / img.width;
          let heigthRatio = canvas.height / img.height;

          let scale = Math.min(widthRatio, heigthRatio);
          //calculate new image size by scaling up/down
          let imageSize = self.calculateImageSize(img, scale);

          // set canvas size based on (scaled) image size
          if (
            self.appendOnPosition === "top" ||
            self.appendOnPosition === "bottom"
          ) {
            canvas.height += imageSize.height;
          } else {
            canvas.width += imageSize.width;
          }
          self.adaptAllCanvasSizes();

          //calculate position where new image will be appended
          //and redraw the previous content accordingly
          let appendingCoordinates = { x: 0, y: 0 };
          switch (self.appendOnPosition) {
            case "top":
              //move previous content down
              context.putImageData(OGCanvasContent, 0, imageSize.height);
              break;
            case "bottom":
              //no need to move previous canvas content
              context.putImageData(OGCanvasContent, 0, 0);
              appendingCoordinates = { x: 0, y: OGCanvasSize.height };
              break;
            case "left":
              //move previous content right
              context.putImageData(OGCanvasContent, imageSize.width, 0);
              break;
            default:
              //no need to move previous canvas content
              context.putImageData(OGCanvasContent, 0, 0);
              appendingCoordinates = { x: OGCanvasSize.width, y: 0 };
          }
          //draw new meme into canvas
          context.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            appendingCoordinates.x,
            appendingCoordinates.y,
            imageSize.width,
            imageSize.height
          );
          return resolve();
        };
      }).then(() => {
        this.showTexts();
      });
    },
    drawCanvasImage(canvas, context) {
      let self = this;
      return new Promise((resolve) => {
        let img = this.prepareImage(this.img);
        img.onload = function () {
          let windowWidth = window.innerWidth;
          let windowHeight = window.innerHeight;
          // in order to show the picture in high resolution, set the canvas to the max height & width
          canvas.width = windowWidth;
          canvas.height = windowHeight;
          let widthRatio = windowWidth / img.width;
          let heigthRatio = windowHeight / img.height;

          let scale = Math.min(widthRatio, heigthRatio);
          let imageSize = { width: img.width, height: img.height };
          //don't scale up!
          if (scale < 1) {
            //calculate new image size by scaling up/down
            imageSize = self.calculateImageSize(img, scale);
          }

          // set canvas size based on (scaled) image size
          canvas.width = imageSize.width;
          canvas.height = imageSize.height;

          self.adaptAllCanvasSizes();

          context.drawImage(
            img,
            0,
            0,
            img.width,
            img.height,
            0,
            0,
            imageSize.width,
            imageSize.height
          );
          return resolve();
        };
      });
    },
    calculateImageScale(img, ratioBasedOnWidth) {
      let scale = 1;
      if (ratioBasedOnWidth) {
        // ratio is based on User set canvas size instead of window size!
        scale = this.canvasWidth / img.width;
      } else {
        scale = this.canvasHeight / img.height;
      }
      return scale;
    },
    calculateImageSize(img, scale) {
      // maintain ratio and hight resolution
      let imageSize = { width: img.width * scale, height: img.height * scale };
      return imageSize;
    },
    adaptAllCanvasSizes() {
      let memeCanvas = this.$refs.memeCanvas;
      this.canvasWidth = memeCanvas.width;
      this.canvasHeight = memeCanvas.height;

      // layer the drawing canvas above
      let drawingCanvas = this.$refs.drawCanvas;
      drawingCanvas.height = this.canvasHeight;
      drawingCanvas.width = this.canvasWidth;

      // layer the text canvas above
      let textCanvas = this.$refs.textCanvas;
      textCanvas.height = this.canvasHeight;
      textCanvas.width = this.canvasWidth;

      let resultCanvas = this.$refs.resultCanvas;
      resultCanvas.height = this.canvasHeight;
      resultCanvas.width = this.canvasWidth;
    },
    loadCanvas() {
      let canvas = this.$refs.memeCanvas;
      let context = canvas.getContext("2d");
      this.drawCanvasImage(canvas, context).then(() => {
        // this.adaptAllCanvasSizes();
        this.setTextStyle();
        this.showTexts();
      });
    },
    clearDrawingCanvas() {
      const drawingCanvas = this.$refs.drawCanvas;
      const context = drawingCanvas.getContext("2d");

      context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    },
    setTextStyle() {
      let canvas = this.$refs.textCanvas;
      let context = canvas.getContext("2d");
      context.font =
        this.isItalic + " " + this.isBold + " " + this.fontSize + "px Impact"; //Arial
      context.fontSize = this.fontSize;
      context.fillStyle = this.fontColor;
      context.strokeStyle = "black"; //this.fontColor;
      context.textBaseline = "middle";
      context.textAlign = "center";
    },
    createResultingCanvas() {
      let canvas = this.$refs.resultCanvas;
      let context = canvas.getContext("2d");
      //combine the meme and drawing into a result canvas to download
      context.drawImage(this.$refs.memeCanvas, 0, 0);
      context.drawImage(this.$refs.textCanvas, 0, 0);
      context.drawImage(this.$refs.drawCanvas, 0, 0);
      return canvas;
    },
    getMemeCanvasURI() {
      return this.$refs.memeCanvas.toDataURL();
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
    img() {
      this.loadCanvas();
    },
    fontSize: {
      handler() {
        //this.showTexts();
        this.showTexts();
      },
    },
    fontColor: {
      handler() {
        this.showTexts();
      },
    },
    font: {
      handler() {
        this.showTexts();
      },
    },
    isBold: {
      handler() {
        this.showTexts();
      },
    },
    isItalic: {
      handler() {
        this.showTexts();
      },
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
  /**col adds padding! */
  /* padding-right: 15px;
  padding-left: 15px; */
  box-shadow: 0px 0px 32px 2px grey;
}

.size-input {
  width: 60px;
}
.plus-button-left {
  text-align: right;
}
.plus-button-right {
  text-align: left;
}
</style>