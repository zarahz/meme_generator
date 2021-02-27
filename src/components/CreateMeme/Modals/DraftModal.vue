<template>
  <b-modal
    size="xl"
    ref="draftModal"
    id="draftModal"
    scrollable
    title="Pick a Draft"
    @ok="selected"
  >
    <b-spinner label="Spinning" v-if="loading"></b-spinner>
    <b-row v-if="allDrafts.length === 0" class="ml-2"
      >No drafts are available.</b-row
    >
    <b-form-group>
      <div v-for="(draft, index) in allDrafts" v-bind:key="draft._id">
        <b-form-radio v-model="selectedDraft" :value="draft" class="w-100">
          <b-row>
            <b-col>
              <b-row>
                <b-col> Title: </b-col>
                <b-col>
                  {{ draft.title }}
                </b-col>
              </b-row>
              <b-row v-for="caption in draft.captions" :key="caption._id">
                <b-col> {{ caption.label }}: </b-col>
                <b-col> {{ caption.text }} </b-col>
              </b-row>
              <b-row>
                <b-col> Creation Date: </b-col>
                <b-col>
                  {{ new Date(draft.creationDate).toDateString() }}
                </b-col>
              </b-row>
            </b-col>
            <b-col cols="4">
              <img class="w-50" :src="draft.memeSource" />
            </b-col>
          </b-row>
        </b-form-radio>
        <hr v-if="index !== allDrafts.length - 1" />
      </div>
    </b-form-group>
  </b-modal>
</template>

<script>
import { loadDraft } from "../../../api";
export default {
  name: "DraftModal",
  data() {
    return {
      allDrafts: [],
      selectedDraft: {},
      loading: true,
      showDraftModal: false,
    };
  },
  methods: {
    async getAllDrafts() {
      this.loading = true;
      let result = await loadDraft();
      this.allDrafts = result.body;
      this.loading = false;
      this.$refs["draftModal"].show();
    },
    async selected() {
      if (!this.selectedDraft) return;
      this.$emit("selected", this.selectedDraft);
    },
    openModal() {
      this.getAllDrafts();
      this.showDraftModal = true;
    },
  },
};
</script>

<style scoped>
.custom-radio >>> .custom-control-label {
  width: 100%;
}
</style>