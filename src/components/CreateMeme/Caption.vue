<template>
  <b-row align-h="center" class="mb-3">
    <b-col>
      <b-form-group label-cols-lg="4" content-cols-lg="7" :label="label">
        <b-form-input
          :value="text"
          @input="updateText"
          class="w-100"
          type="text"
          :placeholder="label"
        />
      </b-form-group>
    </b-col>
    <b-col md="2" v-if="showOffsetSettings">
      <b-form-group label-cols-lg="5" content-cols-lg="6" label="Offset X">
        <b-form-input
          :value="offsetX"
          @input="updateOffsetX"
          number
          style="min-width: 60px"
          class="w-50"
          type="number"
          placeholder="horizontal offset"
        />
      </b-form-group>
    </b-col>
    <b-col md="2" v-if="showOffsetSettings">
      <b-form-group label-cols-lg="5" content-cols-lg="6" label="Y">
        <b-form-input
          :value="offsetY"
          @input="updateOffsetY"
          number
          style="min-width: 60px"
          class="w-50"
          type="number"
          placeholder="vertical offset"
        />
      </b-form-group>
    </b-col>
    <b-button
      size="sm"
      class="my-2 my-sm-0 mr-2"
      @click="move('left')"
      v-if="showOffsetSettings"
      >🡄</b-button
    >
    <b-button
      size="sm"
      class="my-2 my-sm-0 mr-2"
      @click="move('right')"
      v-if="showOffsetSettings"
      >🡆</b-button
    >
    <b-button
      size="sm"
      class="my-2 my-sm-0 mr-2"
      @click="move('up')"
      v-if="showOffsetSettings"
      >🡅</b-button
    >
    <b-button
      size="sm"
      class="my-2 my-sm-0 mr-2"
      @click="move('down')"
      v-if="showOffsetSettings"
      >🡇</b-button
    >
    <b-button
      size="sm"
      class="my-2 my-sm-0 mr-2"
      variant="danger"
      :style="{ visibility: deleteable ? 'show' : 'hidden' }"
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
    showOffsetSettings: {
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