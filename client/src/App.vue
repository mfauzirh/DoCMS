<template>
  <div id="app">
    <v-app>
      <SnackBar ref="SnackBar" />
      <router-view/>
    </v-app>
  </div>
</template>

<script>
import SnackBar from './components/SnackBar.vue';

export default {

  name: 'App',
  components: {
    SnackBar
  },
  mounted() {
    // Register SnackBar to root so that it can use anywhere in child components
    this.$root.SnackBar = this.$refs.SnackBar;
  }

}
</script>


<style lang="scss">

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: var(--primary-dark);
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
