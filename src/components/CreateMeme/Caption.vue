<template>
  <b-row align-h="center" class="mb-3">
    <b-col cols="2">
      <label>{{ label }}:</label>
    </b-col>
    <b-col cols="auto">
      <b-form-input
        :value="text"
        @input="updateText"
        class="w-100"
        type="text"
        :placeholder="label"
      />
    </b-col>
    <b-col cols="1">
      <label>Offset X:</label>
    </b-col>
    <b-col cols="1">
      <b-form-input
        :value="offsetX"
        @input="updateOffsetX"
        number
        style="min-width: 60px"
        class="w-50"
        type="number"
        placeholder="horizontal offset"
      />
    </b-col>
    <b-col cols="1">
      <label>Y:</label>
    </b-col>
    <b-col cols="1">
      <b-form-input
        :value="offsetY"
        @input="updateOffsetY"
        number
        style="min-width: 60px"
        class="w-50"
        type="number"
        placeholder="vertical offset"
      />
    </b-col>
    <b-button size="sm" class="my-2 my-sm-0 mr-2" @click="move('left')"
      >🡄</b-button
    >
    <b-button size="sm" class="my-2 my-sm-0 mr-2" @click="move('right')"
      >🡆</b-button
    >
    <b-button size="sm" class="my-2 my-sm-0 mr-2" @click="move('up')"
      >🡅</b-button
    >
    <b-button size="sm" class="my-2 my-sm-0 mr-2" @click="move('down')"
      >🡇</b-button
    >
    <b-button
      size="sm"
      class="my-2 my-sm-0 mr-2"
      variant="danger"
      v-if="deleteable"
      @click="deleteThis"
    >
      <b-icon icon="trash" />
    </b-button>
  </b-row>
</template>

<script>
export default {
  name: "Caption",
  props: {
    label: String,
    text: String,
    offsetX: Number,
    offsetY: Number,
    deleteable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    deleteThis() {
      this.$emit("delete");
    },
    move(direction) {
      switch (direction) {
        case "up":
          return this.$emit("changeOffset", {
            offsetX: this.offsetX,
            offsetY: this.offsetY - 5,
          });
        case "down":
          return this.$emit("changeOffset", {
            offsetX: this.offsetX,
            offsetY: this.offsetY + 5,
          });

        case "right":
          return this.$emit("changeOffset", {
            offsetX: this.offsetX + 5,
            offsetY: this.offsetY,
          });
        case "left":
          return this.$emit("changeOffset", {
            offsetX: this.offsetX - 5,
            offsetY: this.offsetY,
          });
      }
    },
    updateText(text) {
      this.$emit("changeText", text);
    },
    updateOffsetX(value) {
      this.$emit("changeOffset", {
        offsetX: Number(value),
        offsetY: this.offsetY,
      });
    },
    updateOffsetY(value) {
      this.$emit("changeOffset", {
        offsetX: this.offsetX,
        offsetY: Number(value),
      });
    },
  },
};
</script>

<style scoped>
</style>