<template>
  <b-container class="justify-content-md-center mt-3" fluid>
    <b-form @submit="register">
      <b-row align-h="center" class="mb-3">
        <b-col cols="2">
          <label>Username*:</label>
        </b-col>
        <b-col cols="auto">
          <b-form-input
            v-model="user.username"
            required
            class="w-100"
            type="text"
            v-on:input="checkUniqueness('username', $event)"
          />
        </b-col>
      </b-row>
      <b-row v-if="errors.username" align-h="center" class="mb-3">
        <span>{{ errors.username }}</span>
      </b-row>

      <b-row align-h="center" class="mb-3">
        <b-col cols="2">
          <label>Email*:</label>
        </b-col>
        <b-col cols="auto">
          <b-form-input
            v-model="user.email"
            required
            class="w-100"
            type="email"
            v-on:input="checkUniqueness('email', $event)"
          />
        </b-col>
      </b-row>
      <b-row v-if="errors.email" align-h="center" class="mb-3">
        <span>{{ errors.email }}</span>
      </b-row>

      <b-row align-h="center" class="mb-3">
        <b-col cols="2">
          <label>Password*:</label>
        </b-col>
        <b-col cols="auto">
          <b-form-input
            required
            v-model="user.password"
            class="w-100"
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
    async checkUniqueness(fieldname, event) {
      let result = await fetch("http://localhost:3000/is-unique", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field: fieldname, value: event }),
      });
      if (result.status !== 200) {
        const { error } = await result.json();
        this.$set(this.errors, fieldname, error);
      } else {
        this.$delete(this.errors, fieldname);
      }
    },
    async register(evt) {
      evt.preventDefault();
      if (Object.keys(this.errors).length === 0) {
        //No problems, create new user!
        console.log(this.user);
        let result = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this.user),
        });
        if (result.status !== 200) {
          const { error } = await result.json();
          this.$set(this.errors, "registration", error);
        } else {
          const { token } = await result.json();
          console.log(token);
          //TODO save token in local storage and get user by that!
          this.$delete(this.errors, "registration");
        }
      }
    },
  },
};
</script>

<style scoped>
</style>