import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

import store from "./store/index.js";
import apiUrl from "./helpers/apiUrl.js";
import instanciaAxios from "./helpers/requests.js";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.use({
  install(Vue) {
    Vue.prototype.$urlApi = apiUrl;
    Vue.prototype.$http = instanciaAxios;
  }
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
