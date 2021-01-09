<template>
  <b-container class="justify-content-md-center" fluid>
    <b-row align-h="center">
      <b-col cols="2">
        <b-form-checkbox
          v-model="draw"
          name="draw"
          switch
          @change="notifyCanvas"
        >
          Draw Mode
        </b-form-checkbox>
      </b-col>
      <b-col :style="{ visibility: draw ? 'visible' : 'hidden' }" cols="1">
        <b-button
          class="mr-2"
          :variant="eraser ? 'danger' : 'outline-danger'"
          v-on:click="toggleEraser"
          >eraser</b-button
        >
      </b-col>
      <b-col :style="{ visibility: draw ? 'visible' : 'hidden' }" cols="5">
        <b-row>
          <b-input-group
            @change="notifyCanvas"
            class="w-50 mr-2"
            :append="brushSize"
          >
            <b-form-input
              v-model="brushSize"
              type="range"
              min="1"
              max="32"
            ></b-form-input>
          </b-input-group>
          <b-form-input
            v-model="color"
            @change="notifyCanvas"
            class="w-25"
            type="color"
          ></b-form-input>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "CreateMeme",
  data() {
    return {
      draw: false,
      eraser: false,
      brushSize: "1",
      color: "",
    };
  },
  methods: {
    toggleEraser() {
      this.eraser = !this.eraser;
      this.notifyCanvas();
    },
    notifyCanvas() {
      this.$emit(
        "toggleCanvasDrawingMode",
        this.draw,
        this.brushSize,
        this.color,
        this.eraser
      );
    },
  },
};
</script>