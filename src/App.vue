<script setup lang="ts">
// import Post from './components/Post.vue'
import Sidebar from './components/Sidebar.vue'
import Sidestrip from './components/Sidestrip.vue'
import MainPanel from './components/MainPanel.vue'
</script>

<template>
    <div id="MainWrapper">

        <div id="Sidestrip">
            <Sidestrip/>
        </div>

        <div id="Sidebar">
            <Sidebar/>
        </div>
        <div id="MainPanel">
            <MainPanel/>
        </div>

    </div>
</template>

<style>

* {
    box-sizing: border-box;
}
html, body {
    height: 100%;
    width: 100%;
}

body {
    background: #F2F2F6;
    font-family: Helvetica, "Helvetica Neue", Arial, Avenir, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;    
    font-size: 16px;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
}

a {
    color: rgba(0,0,0,.6);
    text-decoration: underline;
    font-weight: bold;
    transition: all 0.6s ease;
}

a:hover {
    text-decoration: underline;
    font-weight: bold;
    color: rgba(0,0,0,1);
    transition: all 0.15s ease;
}

h1, h2, h3, h4, h5, h6 {
    font-family: Nunito, Aria, "Helvetica Neue", Helvetica, sans-serif;
    font-weight: 400;
}

#app {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

#MainWrapper {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: horizonal;
    overflow: hidden;
}

#Sidestrip {
    background-color: black;
    flex: 0 0 50px;
    overflow: hidden;
}

#Sidebar {
    background-color: white;
    flex: 0 0 30%;
    overflow: hidden;
}

#MainPanel {
    flex: 0 0 70%;
    overflow: hidden;
}

</style>
