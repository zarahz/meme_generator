<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="success">
            <b-navbar-brand to="/home">Home</b-navbar-brand>
            <b-navbar-brand href="#">Create meme</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <!--<b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item href="#">Link</b-nav-item>
                <b-nav-item href="#" disabled>Disabled</b-nav-item>
            </b-navbar-nav>
            -->

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">
                <b-button size="sm" class="glyphicon glyphicon-lock" to="/login" variant="success">Login</b-button>
                <b-button size="sm" class="my-2 my-sm-0" to="/signup" variant="success" >Sign up</b-button>
            </b-navbar-nav>
            <!--</b-collapse> -->
        </b-navbar>
         <div class="App">
            <div class="vertical-center">
                <div class="inner-block">
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>
