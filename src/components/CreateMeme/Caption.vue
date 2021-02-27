<template>
  <b-row align-h="center" class="mb-3" fluid>
    <b-col>
      <!-- sm="12" lg="4" md="6" -->
      <!-- <b-form-group label-cols-lg="4" content-cols-lg="7" :label="label"> -->
      <b-input-group>
        <b-form-input
          :value="text"
          @input="updateText"
          class="w-75"
          type="text"
          :placeholder="label"
        />
        <b-input-group-append>
          <b-button
            :variant="this.recognition ? 'danger' : 'outline-secondary'"
            @click="toggleRecognition"
            ><b-icon icon="mic-fill" />
          </b-button>
        </b-input-group-append>
      </b-input-group>
    </b-col>
    <b-col sm="12" lg="4" md="6" v-if="showOffsetSettings">
      <b-row>
        <b-form-group
          label-cols="5"
          content-cols="4"
          label="Offset X"
          class="w-50"
        >
          <b-form-input
            :value="offsetX"
            @input="updateOffsetX"
            number
            class="input"
            type="number"
            placeholder="horizontal offset"
          />
        </b-form-group>
        <b-form-group label-cols="2" content-cols="4" label="Y" class="w-50">
          <b-form-input
            :value="offsetY"
            @input="updateOffsetY"
            number
            class="input"
            type="number"
            placeholder="vertical offset"
          />
        </b-form-group>
      </b-row>
    </b-col>
    <b-col sm="6" lg="3" md="6" v-if="showOffsetSettings">
      <b-button size="sm" class="icon mr-1" @click="move('left')"> 🡄 </b-button>
      <b-button size="sm" class="icon mr-1" @click="move('right')">
        🡆
      </b-button>
      <b-button size="sm" class="icon mr-1" @click="move('up')"> 🡅 </b-button>
      <b-button size="sm" class="icon" @click="move('down')"> 🡇 </b-button>
    </b-col>
    <b-col sm="6" lg="1" md="6">
      <b-button
        size="sm"
        class="icon my-2 my-sm-0 mr-2"
        variant="danger"
        :style="{ visibility: deleteable ? 'show' : 'hidden' }"
        @click="deleteThis"
      >
        <b-icon icon="trash" />
      </b-button>
    </b-col>
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
    return {
      recognition: null,
    };
  },
  methods: {
    toggleRecognition() {
      if (!this.recognition) {
        this.recognition = new window.webkitSpeechRecognition();
        this.recognition.lang = "en-US";
        this.recognition.continuous = false;
        this.recognition.interimResults = true;

        this.recognition.start();
        let that = this;
        this.recognition.onresult = function (event) {
          let result = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            result += event.results[i][0].transcript;
          }
          console.log(event.results);
          that.updateText(result);
        };
        this.recognition.onaudioend = function () {
          that.recognition = null;
        };
      } else {
        this.recognition.stop();
        this.recognition = null;
      }
    },
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
.icon {
  height: 40px;
}

.input {
  min-width: 60px;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>