<template>
  <b-container class="justify-content-md-center" fluid>
    <h1>Create a Meme!</h1>
    <b-row align-h="center">
      <b-col cols="2">
        <label>Top Text:</label>
      </b-col>
      <b-col cols="4">
        <p>
          <b-form-input
            v-on:input="changeImageText"
            v-model="topText"
            class="w-100"
            type="text"
            placeholder="Top Text..."
          />
        </p>
      </b-col>
    </b-row>
    <b-row align-h="center">
      <b-col cols="2">
        <label>Bottom Text:</label>
      </b-col>
      <b-col cols="4">
        <b-form-input
          v-on:input="changeImageText"
          v-model="bottomText"
          class="w-100"
          type="text"
          placeholder="Bottom Text..."
        />
      </b-col>
    </b-row>

    <b-row class="mb-3" />

    <b-row>
      <b-col>
        <canvas style="width: 70%" ref="memeCanvas" />
      </b-col>
    </b-row>

    <b-row class="mb-3" align-h="center">
      <b-col cols="3" />
      <b-col>
        <b-button variant="outline-primary" v-on:click="upload">
          Upload
        </b-button>
      </b-col>
      <b-col>
        <b-button variant="outline-primary" v-on:click="download">
          Download
        </b-button>
      </b-col>
      <b-col cols="3" />
    </b-row>
  </b-container>
</template>

<script>
import cassiusMeme from "@/assets/meme.jpg";
import FormData from "form-data";
import { saveAs } from "file-saver";

export default {
  name: "CreateMeme",
  props: {
    msg: String,
  },
  data() {
    return {
      topText: "",
      bottomText: "",
      img: cassiusMeme,
    };
  },
  methods: {
    changeImageText() {
      var canvas = this.$refs.memeCanvas;
      var context = canvas.getContext("2d");

      this.drawCanvasImage(canvas, context).then(() => {
        this.setCanvasTextStyle(context);
        // wait until picture finished loading and add text afterwards!
        let canvasHorizontalMid = canvas.width / 2;
        let canvasBottom = canvas.height - 30;
        //show top text
        context.fillText(this.topText, canvasHorizontalMid, 30, canvas.width);
        context.strokeText(this.topText, canvasHorizontalMid, 30, canvas.width);
        //show bottom text
        context.fillText(
          this.bottomText,
          canvasHorizontalMid,
          canvasBottom,
          canvas.width
        );
        context.strokeText(
          this.bottomText,
          canvasHorizontalMid,
          canvasBottom,
          canvas.width
        );
      });
    },
    drawCanvasImage(canvas, context) {
      return new Promise((resolve) => {
        var img = new Image();
        img.src = cassiusMeme;
        img.onload = function () {
          var width = window.innerWidth;
          var height = window.innerHeight;
          // in order to show the picture in high resolution, set the canvas to the max height & width
          canvas.width = width;
          canvas.height = height;
          // calculate the scaled (down) image height & width to fit the canvas
          var imgWidth = img.width;
          var imgHeight = img.height;
          var scale = Math.min(
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
    setCanvasTextStyle(context) {
      context.font = "50px Impact";
      context.fillStyle = "white";
      context.strokeStyle = "black";
      context.textBaseline = "middle";
      context.textAlign = "center";
    },
    loadCanvas() {
      var canvas = this.$refs.memeCanvas;
      var context = canvas.getContext("2d");
      this.drawCanvasImage(canvas, context).then(() =>
        this.setCanvasTextStyle(context)
      );
    },
    download() {
      var canvas = this.$refs.memeCanvas;
      canvas.toBlob(function (blob) {
        saveAs(blob, "meme.png");
      });
    },
    async upload() {
      var canvas = this.$refs.memeCanvas;
      canvas.toBlob(async (blob) => {
        var data = new FormData();
        data.append("file", blob, "file.png");
        let result = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: data,
        });
        if (result.status === 200) {
          console.log("image uploaded successfully to server!");
        }
      });
    },
  },
  mounted() {
    this.loadCanvas();
  },
};
</script>



<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
button {
  margin: 25px 5px 20px 20px;
  color: #626c74;
}
</style>
