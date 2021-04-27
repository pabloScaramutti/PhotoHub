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
import Busqueda from "../views/Busqueda.vue";
import Carpeta from "../views/Carpeta.vue";



Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: "Home" }
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true
    }
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
    component: Login,
    meta: {
      hideForAuth: true
    }
  },
  {
    path: "/registro",
    name: "Registro",
    component: Registro,
    meta: {
      hideForAuth: true
    }
  },
  {
    path: "/notas",
    name: "Notas",
    component: Notas,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/fotos/:img",
    name: "Foto",
    component: Foto,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/calendario",
    name: "Calendario",
    component: Calendario,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/nueva-carpeta",
    name: "NuevaCarpeta",
    component: NuevaCarpeta,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/notificaciones",
    name: "Notificaciones",
    component: Notificaciones,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/conexion",
    name: "Conexion",
    component: Conexion,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/etiquetas-rapidas",
    name: "EtiquetasRapidas",
    component: EtiquetasRapidas,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/ajustes-automaticos",
    name: "AjustesAutomaticos",
    component: AjustesAutomaticos,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/crear-automatizacion",
    name: "NuevaAutomatizacion",
    component: NuevaAutomatizacion,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/editar-automatizacion/:automatizacion",
    name: "ModificarAutomatizacion",
    component: NuevaAutomatizacion,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/crear-set",
    name: "CrearSet",
    component: SetEtiqueta,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/set-etiquetas/:set",
    name: "SetEtiqueta",
    component: SetEtiqueta,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/busqueda",
    name: "Busqueda",
    component: Busqueda,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/carpetas/:id",
    name: "Carpeta",
    component: Carpeta,
    meta: {
      requiresAuth: true
    }
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.getItem('authtoken')) {
      console.log("entre aca");
      next({
        name: "Login"
      });
      console.log("ejecute el next de login");
      return;
    } else {
      next();
      return;
    }
  } else if (to.matched.some(record => record.meta.hideForAuth)) {
    console.log("Estoy entrando aca tambien");
    if (localStorage.getItem('authtoken')) {
      next({
        name: "Home"
      });
      console.log("estoy ejecutando el next de home")
      return;
    } else {
      next();
    }
  } else {
    next();
    return;
  }
});

export default router;
