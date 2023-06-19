import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import Scrollspy from 'vue2-scrollspy';
import VueTour from 'vue-tour';
import { createPinia, PiniaVuePlugin } from 'pinia';
import './config/axiosInterceptor';

import './assets/css/style.css';
require('vue-tour/dist/vue-tour.css');

Vue.use(PiniaVuePlugin);
Vue.use(Scrollspy);
Vue.use(require('vue-moment'));
Vue.use(VueTour);

const pinia = createPinia();

// Turn off productionTip Warning
Vue.config.productionTip = false;

new Vue({
  vuetify,
  pinia,
  router,
  render: h => h(App)
}).$mount('#app');

