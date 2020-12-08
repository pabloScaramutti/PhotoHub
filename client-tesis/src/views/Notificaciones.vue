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
      <div>
        <v-btn fab color="primary">
          <v-icon>settings</v-icon>
        </v-btn>
        <p>Ajustes automáticos</p>
      </div>
    </div>
    <h2>Notificaciones</h2>
    <FotoLista
      v-for="(item, index) in notificaciones"
      :key="index"
      :img="item.foto"
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
      imagenes: undefined,
    };
  },
  mounted() {
    this.$http
      .get("/notificaciones?_sort=created_at:DESC&_limit=15")
      .then((response) => {
        //console.log(response);
        this.notificaciones = response.data;
        if (this.notificaciones) {
          //console.log(this.notificaciones);
          this.imagenes = this.notificaciones.map((item) =>
            this.$apiUrl(item.foto.thumbnail.url)
          );
          //console.log(this.imagenes);
        }
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

  p {
    font-weight: 100;
  }

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

    div {
      width: 56px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin: 20px;

      p {
        margin-top: 5px;
        font-size: 15px;
        line-height: 1.2;
      }
    }
  }
}
</style>
