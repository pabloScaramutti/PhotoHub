import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Registro from "../views/Registro.vue";
import Notas from "../views/Notas.vue";
import Foto from "../views/Foto.vue";
import Calendario from "../views/Calendario.vue";
import NuevaCarpeta from "../views/NuevaCarpeta.vue";
import Notificaciones from "../views/Notificaciones.vue";
import Conexion from "../views/Conexion.vue";
import EtiquetasRapidas from "../views/EtiquetasRapidas.vue";
import AjustesAutomaticos from "../views/AjustesAutomaticos.vue";
import NuevaAutomatizacion from "../views/NuevaAutomatizacion.vue";
import SetEtiqueta from "../views/SetEtiqueta.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: "Home" }
  },
  {
    path: "/home",
    name: "Home",
    component: Home
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/registro",
    name: "Registro",
    component: Registro
  },
  {
    path: "/notas",
    name: "Notas",
    component: Notas
  },
  {
    path: "/fotos/:img",
    name: "Foto",
    component: Foto
  },
  {
    path: "/calendario",
    name: "Calendario",
    component: Calendario
  },
  {
    path: "/nueva-carpeta",
    name: "NuevaCarpeta",
    component: NuevaCarpeta
  },
  {
    path: "/notificaciones",
    name: "Notificaciones",
    component: Notificaciones
  },
  {
    path: "/conexion",
    name: "Conexion",
    component: Conexion
  },
  {
    path: "/etiquetas-rapidas",
    name: "EtiquetasRapidas",
    component: EtiquetasRapidas
  },
  {
    path: "/ajustes-automaticos",
    name: "AjustesAutomaticos",
    component: AjustesAutomaticos
  },
  {
    path: "/nueva-automatizacion",
    name: "NuevaAutomatizacion",
    component: NuevaAutomatizacion
  },
  {
    path: "/set-etiquetas/:set",
    name: "SetEtiqueta",
    component: SetEtiqueta
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
