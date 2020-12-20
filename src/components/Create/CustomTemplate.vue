<template>
  <b-container class="justify-content-md-center" fluid>
    <h3>Upload from url</h3>
    <b-row align-h="center">
      <b-col cols="2">
        <b-row align-h="center">
          <b-nav-form>
            <b-form-input
              v-on:enter="useCustomTemplate"
              v-model="customUrl"
              size="sm"
              class="mr-sm-2"
              placeholder="url"
            ></b-form-input>
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              v-on:click="useCustomTemplate"
              >✔</b-button
            >
          </b-nav-form>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Templates",
  props: {
    searchString: String,
  },
  components: {},
  data() {
    return {
      customUrl: "",
    };
  },
  methods: {
    useCustomTemplate() {
      this.$emit("newTemplateSelected", this.customUrl);
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>