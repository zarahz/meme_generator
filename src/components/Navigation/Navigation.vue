<template>
    <div>
        <b-navbar toggleable="lg" type="dark" variant="success" fixed="top">
            <b-navbar-brand href="#">Meme Generator</b-navbar-brand>
           
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <!--<b-collapse id="nav-collapse" is-nav>-->
            <b-navbar-nav>
                <b-nav-item href="#" router to = "/overviewpage">Home</b-nav-item>
                <b-nav-item href="#" router to = "/">Create am Meme</b-nav-item>
        
               
                <!--b-nav-item href="#" disabled>Disabled</b-nav-item-->
            </b-navbar-nav>

            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto">

                <b-nav-item-dropdown text="Language" right>
                <b-dropdown-item href="#">EN</b-dropdown-item>
                <b-dropdown-item href="#">ES</b-dropdown-item>
                <b-dropdown-item href="#">RU</b-dropdown-item>
                <b-dropdown-item href="#">FR</b-dropdown-item>
                </b-nav-item-dropdown>

                <b-nav-item-dropdown right>
                <!-- Using 'button-content' slot -->
                <template #button-content>
                    <em>Login</em>
                </template>
                <b-dropdown-item href="#">Google</b-dropdown-item>
                <b-dropdown-item href="#">LinkedIn</b-dropdown-item>
                <b-dropdown-item href="#">Yahoo</b-dropdown-item>
                <b-dropdown-item href="#">Sign Out</b-dropdown-item>
                 
                </b-nav-item-dropdown>
                <b-navbar-nav right>
                <b-nav-item href="#" router to = "/login">Login</b-nav-item>
                 <b-nav-item href="#" router to = "/registration">Sign up</b-nav-item>
                </b-navbar-nav>

                <b-nav-form>
                    <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                    <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                </b-nav-form>
            </b-navbar-nav>
            <!--</b-collapse> -->
        </b-navbar>
    </div>
</template>

