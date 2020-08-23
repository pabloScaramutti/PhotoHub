import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";

import store from "./store/index.js";
import apiUrl from "./helpers/apiUrl.js";
import instanciaAxios from "./helpers/requests.js";

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
  render: h => h(App)
}).$mount("#app");
