import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import axios from "axios";
import '@/style/style.scss'
import Toasted from 'vue-toasted'
import { getCookie } from "./plugins/cookie";

Vue.use(Toasted)

Vue.config.productionTip = false;

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.common['Authorization'] = `Bearer ${getCookie('token')}`;

Vue.prototype.$http = axios;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
