<template>
  <div class="notificaciones">
    <div class="settings-buttons">
      <router-link class="router-link" :to="{ name: 'Conexion' }">
        <v-btn fab color="primary">
          <v-icon>camera_alt</v-icon>
        </v-btn>
        <p>Conectarse</p>
      </router-link>
      <router-link class="router-link" :to="{ name: 'EtiquetasRapidas' }">
        <v-btn fab color="primary">
          <v-icon>local_offer</v-icon>
        </v-btn>
        <p>Etiquetas rápidas</p>
      </router-link>
      <router-link class="router-link" :to="{ name: 'AjustesAutomaticos' }">
        <v-btn fab color="primary">
          <v-icon>settings</v-icon>
        </v-btn>
        <p>Ajustes automáticos</p>
      </router-link>
    </div>
    <h2>Notificaciones</h2>
    <FotoLista
      v-for="(item, index) in notificaciones"
      :key="index"
      :image="item.foto"
    />
  </div>
</template>

<script>
import FotoLista from "@/components/Foto_Lista";

export default {
  name: "Notificaciones",
  components: {
    FotoLista,
  },
  data() {
    return {
      notificaciones: undefined,
    };
  },
  created() {
    this.$http
      .get("/notificaciones?_sort=id:DESC&_limit=15")
      .then((response) => {
        //console.log(response);
        this.notificaciones = response.data;
      })
      .catch((error) => {
        console.log("Se produjo un error", error);
      });
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.notificaciones {
  padding: 1vw;

  h2 {
    margin-left: 20px;
  }

  .settings-buttons {
    display: flex;
    justify-content: space-evenly;

    .router-link {
      width: 56px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin: 20px;
      text-decoration: none;
      color: inherit;

      p {
        margin-top: 5px;
        font-size: 15px;
        line-height: 1.2;
      }
    }
  }
}
</style>
