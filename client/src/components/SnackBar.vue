<template>
  <v-snackbar
    v-model="showSnackbar"
    :timeout="timer"
    :color="color"
    elevation="8"
    left
    bottom
  >
    <v-icon>{{ icon }}</v-icon>
    {{ message }}
    {{ color }}
  </v-snackbar>
</template>

<script>
export default {
  name: 'SnackBar',
  data() {
    return {
      showSnackbar: false,
      message: '',
      color: 'success',
      icon: 'mdi-check-circle',
      timer: 2000
    }
  },
  methods: {
    show(data) {
      if(!data) { return; }

      this.message = data.message || 'no message passed'
      this.color = data.color || 'success'
      this.icon = data.icon || 'mdi-check-circle'
      this.timer = data.timer || 2000
      this.showSnackbar = true
    },
    hide() {
      this.message = 'no message passsed'
      this.color = 'success'
      this.icon = 'mdi-check-circle'
      this.timer = 2000
      this.showSnackbar = false
    }
  }
};
</script>

<style>
</style>