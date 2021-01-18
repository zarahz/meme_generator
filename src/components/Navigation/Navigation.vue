<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark" fixed="top">
      <b-navbar-brand router to="/" href="#">Meme Generator</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-navbar-nav>
        <b-nav-item
          href="#"
          router
          to="/create-meme"
          :active="$route.name == 'CreateMeme'"
          >Create a Meme</b-nav-item
        >
      </b-navbar-nav>

      <!--<b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item href="#" router to = "/overviewpage">Home</b-nav-item>
                <b-nav-item href="#" router to = "/">Create am Meme</b-nav-item>
        
               
                <b-nav-item href="#" disabled>Disabled</b-nav-item
            </b-navbar-nav>-->

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

      <!-- Right aligned nav items -->
      <!--b-navbar-nav class="ml-auto">
                <b-button size="sm" class="glyphicon glyphicon-lock" to="/login" variant="success">Login</b-button>
                <b-button size="sm" class="glyphicon glyphicon-lock" to="/registration" variant="success">Sign in</b-button>
            </b-navbar-nav-->
      <!--</b-collapse> -->
    </b-navbar>
  </div>
</template>

