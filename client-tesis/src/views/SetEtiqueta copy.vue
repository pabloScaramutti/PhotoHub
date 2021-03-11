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
        v-on:item-selected="seleccionDeEvento_Handler($event)"
        v-on:item-created="setEtiquetas = $event"
        v-on:text-changed="setEtiquetas.nombre = $event"
        :disabled="disableSearch"
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
        :close="setEdited"
        color="primary"
        @click:close="setEdited && removeTag(i)"
      >
        {{ item.nombre }}
      </v-chip>
    </v-chip-group>

    <div v-if="setEdited">
      <Search
        v-on:item-created="addTag($event)"
        v-on:item-selected="addSearchTag($event)"
        url="/etiquetas"
        label="Buscar una etiqueta"
      />

      <div class="grid">
        <v-checkbox
          v-for="(etiqueta, i) in todasLasEtiquetas"
          :key="i"
          :label="`${etiqueta.nombre}`"
          :value="etiqueta"
          v-model="etiquetasSeleccionadas"
          @click="addTag(etiqueta)"
        ></v-checkbox>
      </div>
    </div>

    <v-btn
      fab
      color="primary"
      class="floating-btn"
      @click="!setEdited ? startEditing() : updateSet()"
      :loading="loadingDoneBtn"
      ><v-icon>{{ !setEdited ? "edit" : "done" }}</v-icon></v-btn
    >
    <v-btn
      v-if="setEdited"
      @click="cancelEditing()"
      fab
      small
      color="red"
      class="floating-btn-secondary"
      ><v-icon>clear</v-icon></v-btn
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
  name: "SetEtiqueta",
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
      etiquetasSeleccionadas: [],
      setEdited: false,
      disableSearch: false,
      loadingDoneBtn: false,
      setEtiqueta_previousState: undefined,
      alert: {
        text: "",
        type: "success",
        show: false,
      },
    };
  },

  created() {
    this.$http
      .get("/etiquetas?_sort=nombre:ASC")
      .then((response) => (this.todasLasEtiquetas = response.data))
      .catch((error) =>
        this.setAlert("Hubo un error cargando las etiquetas", error)
      );
  },

  watch: {
    "setEtiquetas.etiquetas": function () {
      this.setEdited = true;
    },

    "alert.show": function (v) {
      if (v) {
        setTimeout(() => {
          this.alert.show = false;
        }, 5000);
      }
    },
  },

  methods: {
    createSet() {
      if (this.setEtiquetas.nombre) {
        this.loadingDoneBtn = true;
        const data = new FormData();
        const info = {
          nombre: this.setEtiquetas.nombre,
          etiquetas: this.setEtiquetas.etiquetas,
        };

        data.append("data", JSON.stringify(info));

        this.$http
          .post("/set-etiquetas", data)
          .then((r) => {
            this.setAlert(`Se creo el Set: "${r.data.nombre}"`, "success");
            this.loadingDoneBtn = false;
          })
          .catch((e) => {
            this.setAlert(`Se produjo un error: ${e}`, "error");
            this.loadingDoneBtn = false;
          });
      } else {
        this.setAlert("Ingrese un nombre para el set", "error");
      }
    },

    updateSet() {
      this.loadingDoneBtn = true;
      this.$http
        .put(`/set-etiquetas/${this.setEtiquetas.id}`, {
          etiquetas: this.setEtiquetas.etiquetas,
          nombre: this.setEtiquetas.nombre,
        })
        .then(() => {
          this.setAlert(
            `Se actualizó el set ${this.setEtiquetas.nombre}`,
            "success"
          );
          this.setEdited = false;
          this.loadingDoneBtn = false;
        })
        .catch((e) => {
          this.setAlert(
            `Se produjo un error al actualizar la etiqueta: ${e}`,
            "error"
          );
          this.loadingDoneBtn = false;
        });
    },

    setAlert(text, type) {
      this.alert.text = text;
      this.alert.type = type;
      this.alert.show = true;
    },

    removeTag(index) {
      let element = this.setEtiquetas.etiquetas.splice(index, 1);

      let exist = this.existInArrayById(
        this.etiquetasSeleccionadas,
        element[0]
      );

      if (exist !== -1) this.etiquetasSeleccionadas.splice(exist, 1);
    },

    addTag(e) {
      let exist = this.existInArrayById(this.setEtiquetas.etiquetas, e);

      if (exist !== -1) {
        this.removeTag(exist);
      } else {
        this.setEtiquetas.etiquetas.push(e);
      }
    },

    addSearchTag(e) {
      if (this.existInArrayById(this.etiquetasSeleccionadas, e) == -1)
        this.etiquetasSeleccionadas.push(e);
      if (this.existInArrayById(this.setEtiquetas.etiquetas, e) == -1)
        this.setEtiquetas.etiquetas.push(e);
    },

    existInArrayById(array, tag) {
      let exist = -1;

      array.forEach((elem, i) => {
        if (elem.id == tag.id) exist = i;
      });

      return exist;
    },

    seleccionDeEvento_Handler(setSeleccionado) {
      this.setEtiquetas = setSeleccionado;
      this.etiquetasSeleccionadas = [];
      if (this.todasLasEtiquetas.length > 0) {
        this.setEtiquetas.etiquetas.forEach((e) => {
          let exist = this.existInArrayById(this.todasLasEtiquetas, e);
          if (exist !== -1)
            this.etiquetasSeleccionadas.push(this.todasLasEtiquetas[exist]);
        });
      }

      this.$nextTick(() => {
        this.setEdited = false;
      });
    },

    startEditing() {
      this.setEdited = true;
      this.disableSearch = true;
      this.setEtiqueta_previousState = JSON.parse(
        JSON.stringify(this.setEtiquetas)
      );
    },

    cancelEditing() {
      this.disableSearch = false;
      this.setEtiquetas = JSON.parse(
        JSON.stringify(this.setEtiqueta_previousState)
      );

      this.$nextTick(() => {
        this.setEdited = false;
      });
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