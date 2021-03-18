<template>
  <div class="search">
    <v-text-field
      @focus="inputFocus"
      @click.stop="!disabled && openDialog()"
      :prepend-icon="prependIcon"
      :append-icon="appendIcon"
      :label="label"
      v-model="input.nombre"
      autocomplete="off"
    ></v-text-field>

    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ label }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="dialog = false"> Save </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <div class="card-content">
          <v-text-field
            @focus="inputFocus"
            @blur="inputBlur"
            :prepend-icon="prependIcon"
            :append-icon="appendIcon"
            :label="label"
            v-model="input.nombre"
            autocomplete="off"
            ref="inputName"
          ></v-text-field>
          <!-- <div v-if="suggestion.length > 0 || loading == true "> -->
          <ul v-if="loading != true">
            <li
              v-for="(item, index) in suggestion"
              :key="index"
              @click="setItem(item)"
            >
              {{ item.nombre }}
            </li>
          </ul>
          <v-progress-circular
            v-else
            indeterminate
            color="primary"
            class="loading"
          ></v-progress-circular>
          <p v-if="suggestion.length == 0 && !loading">
            No se encontraron resultados
          </p>
          <v-btn
            @click="createItem()"
            fab
            small
            color="primary"
            id="create-btn"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <!-- </div> -->
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    prependIcon: {
      type: String,
      default: "search",
    },
    label: {
      type: String,
      default: "Búsqueda...",
    },
    url: {
      type: String,
      required: true,
    },
    clearBeforeSelect: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      input: { nombre: "" },
      suggestion: [],
      loading: false,
      awaitingSearch: false,
      appendIcon: "arrow_drop_down",
      dialog: false,
    };
  },

  watch: {
    "input.nombre": function () {
      // if (this.input.nombre != "") {
      this.sendEvent("text-changed", this.input.nombre);
      if (this.url) {
        if (!this.awaitingSearch) {
          this.loading = true;
          this.serverRequest();
        }
      }
      this.awaitingSearch = true;
      // } else {
      //   this.suggestion = [];
      // }
    },
  },

  mounted() {
    this.serverRequest();
  },

  methods: {
    inputFocus() {
      this.appendIcon = "arrow_drop_up";
    },
    inputBlur() {
      setTimeout(() => {
        this.appendIcon = "arrow_drop_down";
      }, 100);
    },
    createItem() {
      console.log("Se esta creando");
      this.$http
        .post(this.url, {
          nombre: this.input.nombre,
        })
        .then((result) => {
          //this.input = result.data;
          this.sendEvent("item-created", result.data);
          console.log("se creo la etiqueta:", result);
          //this.clearText(result.data);
          this.input.nombre = "";
          this.dialog = false;
        })
        .catch((error) => console.log("Error al crear la etiqueta", error));
    },

    setItem(item) {
      //this.input = item;
      this.sendEvent("item-selected", item);
      this.dialog = false;
      this.input.nombre = "";
    },

    sendEvent(name, element) {
      let sendingElement = JSON.parse(JSON.stringify(element));
      this.$emit(name, sendingElement);
    },

    clearText(data) {
      // console.log(this.clearBeforeSelect);
      if (this.clearBeforeSelect) {
        setTimeout(() => {
          this.input.nombre = "";
          console.log(this.clearBeforeSelect);
        }, 1000);
      } else {
        this.input = data;
      }
    },

    openDialog() {
      this.dialog = true;
      setTimeout(() => {
        this.$refs.inputName.focus();
      }, 500);
    },

    serverRequest() {
      setTimeout(() => {
        this.$http
          .get(
            `${this.url}?nombre_contains=${this.input.nombre}&&_sort=nombre:asc`
          )
          .then((response) => {
            this.loading = false;
            this.suggestion = response.data;
            this.sendEvent("newSugestionList", this.suggestion);
          })
          .catch((error) => console.log(error));
        this.awaitingSearch = false;
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  width: 100%;
}

#create-btn {
  display: flex;
  margin: 15px auto;
}

.card-content {
  width: 80vw;
  margin: auto;
}

ul {
  list-style: none;
  padding: 0;

  li {
    cursor: pointer;
    padding: 15px;
  }

  li:hover {
    background: #28cbff;
  }
}
</style>