<template>
  <div class="etiquetas-rapidas">
    <h3>Revisá tus etiquetas rápidas</h3>
    <p>
      Seleccioná las etiquetas que quieras tener a mano cuando recibas una foto.
      Estas son las etiquetas que mas uses o que creas que puedan servir para
      cierta ocación. <br /><br />Podés crear sets de etiquetas para usarlos
      cuando quieras.
    </p>

    <div v-for="(set, i) in setEtiquetas" :key="i" class="item-list">
      <div class="flex jc-space-between">
        <router-link :to="`/set-etiquetas/${set.id}`" class="link">
          <h3>{{ set.nombre }}</h3>
        </router-link>
        <v-icon class="m-left-10 set-options">mdi-dots-vertical</v-icon>
      </div>

      <hr />

      <v-chip-group column v-if="set.etiquetas.length > 0">
        <v-chip
          v-for="(etiqueta, i) in set.etiquetas"
          :key="i"
          class="ma-2"
          color="primary"
        >
          {{ etiqueta.nombre }}
        </v-chip>
      </v-chip-group>
      <p v-else class="emptySet">No hay etiquetas en este set</p>
    </div>

    <div class="spacer"></div>

    <v-btn to="/crear-set" fab color="primary" class="floating-btn"
      ><v-icon>add</v-icon></v-btn
    >
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      setEtiquetas: [
        {
          nombre: "",
          etiquetas: [],
        },
      ],
    };
  },

  created() {
    this.$http
      .get("/set-etiquetas?_sort=nombre:asc")
      .then((response) => (this.setEtiquetas = response.data))
      .catch((error) =>
        this.setAlert("Hubo un error cargando los sets de etiquetas", error)
      );
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.etiquetas-rapidas {
  margin: 1.5rem 1rem;

  .flex {
    display: flex;
    align-items: baseline;
  }

  .jc-space-between {
    justify-content: space-between;
  }

  .m-left-10 {
    margin-left: 10px;
  }

  .item-list {
    margin-bottom: 3vh;
  }

  hr {
    border-color: gray;
    border-width: 0.5px;
  }

  .emptySet {
    margin-top: 5px;
    color: lightgray;
  }

  .link {
    color: inherit;
    text-decoration: none;
  }

  .set-options:hover {
    border-radius: 50%;
    background: rgba(128, 128, 128, 0.479);
  }

  .set-options:active {
    border-radius: 50%;
    background: rgb(199, 199, 199);
  }

  .spacer {
    height: 30vh;
  }
}
</style>