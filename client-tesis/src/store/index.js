import Vue from "vue";
import Vuex from "vuex";
//import Axios from "axios";
import InstanciaAxios from "@/helpers/requests.js";
//import apiUrl from "@/helpers/apiUrl.js";

import { MutacionesFunciones } from "./mutations/mutaciones";
import { AccionesFunciones } from "./actions/acciones";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    usuario: undefined,
    request: InstanciaAxios
  },
  actions: AccionesFunciones,
  mutations: MutacionesFunciones
});
