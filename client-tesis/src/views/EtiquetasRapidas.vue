<template>
  <div class="etiquetas-rapidas">
    <h3>Revisá tus etiquetas rápidas</h3>
    <p>
      Seleccioná las etiquetas que quieras tener a mano cuando recibas una foto.
      Estas son las etiquetas que mas uses o que creas que puedan servir para
      cierta ocación. <br /><br />Podés crear sets de etiquetas para usarlos
      cuando quieras.
    </p>

    <div class="flex">
      <Search
        v-on:item-selected="setEtiquetas = $event"
        v-on:item-created="setEtiquetas = $event"
        v-on:text-changed="setEtiquetas.nombre = $event"
        url="/set-etiquetas"
        label="Nombre del set"
        prependIcon="local_offer"
      />
      <v-icon class="m-left-10">mdi-dots-vertical</v-icon>
    </div>

    <v-chip-group column class="chip-group">
      <v-chip
        v-for="(item, i) in setEtiquetas.etiquetas"
        :key="i"
        class="ma-2"
        close
        color="primary"
        @click:close="setEtiquetas.etiquetas.splice(i, 1)"
      >
        {{ item.nombre }}
      </v-chip>
    </v-chip-group>

    <Search
      v-on:item-created="todasLasEtiquetas.push($event)"
      url="/etiquetas"
      label="Buscar una etiqueta"
    />

    <div class="grid">
      <v-checkbox
        v-for="(etiqueta, i) in todasLasEtiquetas"
        :key="i"
        :label="`${etiqueta.nombre}`"
        :value="etiqueta"
        v-model="setEtiquetas.etiquetas"
      ></v-checkbox>
    </div>

    <v-btn fab color="primary" class="floating-btn" @click="createSet()"
      ><v-icon>done</v-icon></v-btn
    >

    <div class="pop-up-alert">
      <v-alert dense v-model="alert.show" :type="alert.type" dismissable>
        {{ alert.text }}
      </v-alert>
    </div>
  </div>
</template>

<script>
import Search from "../components/Search";

export default {
  components: {
    Search,
  },
  data() {
    return {
      setEtiquetas: {
        nombre: "",
        etiquetas: [],
      },
      todasLasEtiquetas: [],
      alert: {
        text: "",
        type: "success",
        show: false,
      },
    };
  },

  created() {
    this.$http
      .get("/etiquetas")
      .then((response) => (this.todasLasEtiquetas = response.data))
      .catch((error) =>
        this.setAlert("Hubo un error cargando las etiquetas", error)
      );
  },

  methods: {
    createSet() {
      if (this.setEtiquetas.nombre) {
        const data = new FormData();
        const info = {
          nombre: this.setEtiquetas.nombre,
          etiquetas: this.setEtiquetas.etiquetas,
        };

        data.append("data", JSON.stringify(info));

        this.$http
          .post("/set-etiquetas", data)
          .then((r) =>
            this.setAlert(`Se creo el Set: "${r.data.nombre}"`, "success")
          )
          .catch((e) => this.setAlert(`Se produjo un error: ${e}`, "error"));
      } else {
        this.setAlert("Ingrese un nombre para el set", "error");
      }
    },
    setAlert(text, type) {
      this.alert.text = text;
      this.alert.type = type;
      this.alert.show = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.etiquetas-rapidas {
  margin: 1.5rem 1rem;

  .grid {
    margin: 5px 5px;
    display: grid;
    grid-template-columns: repeat(auto-fill, 150px);
    grid-gap: 0px;
    justify-content: space-between;
    align-items: center;
  }

  .flex {
    display: flex;
    align-items: baseline;
  }

  .m-left-10 {
    margin-left: 10px;
  }

  .chip-group {
    min-height: 120px;
  }
}

#add-set {
  display: flex;
  margin: auto;
}
</style>