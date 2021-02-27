<template>
  <b-container class="justify-content-md-center" fluid>
    <b-form @submit="register">
      <h3>Sign Up</h3>

      <b-row align-h="center" class="form-group">
        <b-col cols="2">
          <label>Username*:</label>
        </b-col>
        <b-col cols="auto">
          <b-form-input
            v-model="user.username"
            required
            class="form-control form-control-lg"
            type="text"
            v-on:input="checkUniqueness('username', $event)"
          />
        </b-col>
      </b-row>
      <b-row v-if="errors.username" align-h="center" class="mb-3">
        <span>{{ errors.username }}</span>
      </b-row>

      <b-row align-h="center" class="form-group">
        <b-col cols="2">
          <label>Email*:</label>
        </b-col>
        <b-col cols="auto">
          <b-form-input
            v-model="user.email"
            required
            class="form-control form-control-lg"
            type="email"
            v-on:input="checkUniqueness('email', $event)"
          />
        </b-col>
      </b-row>
      <b-row v-if="errors.email" align-h="center" class="mb-3">
        <span>{{ errors.email }}</span>
      </b-row>

      <b-row align-h="center" class="form-group">
        <b-col cols="2">
          <label>Password*:</label>
        </b-col>
        <b-col cols="auto">
          <b-form-input
            required
            v-model="user.password"
            class="form-control form-control-lg"
            type="password"
          />
        </b-col>
      </b-row>

      <b-row align-h="center">
        <b-button
          type="submit"
          variant="outline-primary"
          :disabled="Object.keys(this.errors).length > 0"
        >
          Register
        </b-button>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import { isUnique, registerUser } from "../../api";

export default {
  name: "Registration",
  data() {
    return {
      user: {
        email: "",
        username: "",
        password: "",
      },
      errors: {},
    };
  },
  methods: {
    async checkUniqueness(field, value) {
      let uniqueResult = await isUnique({ field, value });
      if (uniqueResult.status === 400 || uniqueResult.status === 500) {
        this.$set(this.errors, field, uniqueResult.error);
      } else {
        this.$delete(this.errors, field);
      }
    },
    async register(evt) {
      evt.preventDefault();
      let userResult = await registerUser(this.user);
      if (userResult.status !== 200) {
        this.$set(this.errors, "registration", userResult.body.error);
      } else {
        this.$delete(this.errors, "registration");
        this.$store.dispatch("tryLoadUser");
        this.$router.push("/");
      }
    },
  },
};
</script>

<style scoped>
</style>