<template>
    <div>
        
     <b-navbar toggleable="lg" type="dark" variant="success" fixed="top">
         
            <b-navbar-brand href="#">Meme Generator</b-navbar-brand>
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-navbar-nav>
             <b-nav-item href="#" router to = "/overviewpage">Home</b-nav-item>
                <b-nav-item href="#" router to = "/">Create am Meme</b-nav-item>
                </b-navbar-nav>

            <!--<b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
                <b-nav-item href="#" router to = "/overviewpage">Home</b-nav-item>
                <b-nav-item href="#" router to = "/">Create am Meme</b-nav-item>
        
               
                <b-nav-item href="#" disabled>Disabled</b-nav-item
            </b-navbar-nav>-->
             <b-navbar-nav class="ml-auto" >
                <b-nav-item href="#" router to = "/login">Login</b-nav-item>
                 <b-nav-item href="#" router to = "/registration">Sign up</b-nav-item>
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

