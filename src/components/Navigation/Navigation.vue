<template>
  <div>
    <b-navbar
      class="fixed-top"
      toggleable="lg"
      type="dark"
      variant="primary"
      fixed="top"
    >
      <b-navbar-brand router to="/" href="#"
        ><img src="../../assets/logo.png"
      /></b-navbar-brand>
      <b-navbar-toggle target="nav-collapse">
        <template #default="{ expanded }">
          <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
          <b-icon v-else icon="chevron-bar-down"></b-icon>
        </template>
      </b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item
            href="#"
            router
            to="/create-meme"
            :active="$route.name == 'CreateMeme'"
            >Create Meme</b-nav-item
          >
          <b-nav-item
            href="#"
            router
            to="/create-moving-meme"
            :active="$route.name == 'CreateMovingMeme'"
            >Create Video Meme</b-nav-item
          >
          <b-nav-item
            href="#"
            router
            to="/fabric-meme"
            :active="$route.name == 'FabricMeme'"
            >WYSIWYG Editor</b-nav-item
          >
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown
            v-if="$store.getters.isLoggedIn"
            :text="$store.getters.user.username"
            right
          >
            <b-dropdown-item href="#" router to="/my-page"
              >My Page</b-dropdown-item
            >
            <b-dropdown-item href="#" v-on:click="$store.dispatch('logout')"
              >Logout</b-dropdown-item
            >
          </b-nav-item-dropdown>

          <b-nav-item
            v-show="!$store.getters.isLoggedIn"
            href="#"
            router
            to="/login"
            :active="$route.name == 'Login'"
            >Login</b-nav-item
          >
          <b-nav-item
            v-show="!$store.getters.isLoggedIn"
            href="#"
            router
            to="/registration"
            :active="$route.name == 'Registration'"
            >Sign up</b-nav-item
          >
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      expanded: false,
    };
  },
};
</script>
