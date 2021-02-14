<template>
  <div class="search">
    <v-text-field
      @focus="inputFocus"
      @blur="inputBlur"
      :prepend-icon="prependIcon"
      :append-icon="appendIcon"
      :label="label"
      v-model="input.nombre"
      autocomplete="off"
    ></v-text-field>
    <div
      v-if="
        (suggestion.length > 0 || loading == true || input.nombre != '') &&
        showSuggestions
      "
      class="suggestions"
    >
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
      <v-btn @click="createItem()" fab small color="primary" id="create-btn">
        <v-icon>add</v-icon>
      </v-btn>
    </div>
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
  },

  data() {
    return {
      input: { nombre: "" },
      suggestion: [],
      loading: false,
      awaitingSearch: false,
      showSuggestions: false,
      appendIcon: "arrow_drop_down",
    };
  },

  watch: {
    "input.nombre": function () {
      if (this.input.nombre != "") {
        this.sendEvent("text-changed", this.input.nombre);
        if (this.url) {
          if (!this.awaitingSearch) {
            this.loading = true;
            setTimeout(() => {
              this.$http
                .get(
                  `${this.url}?nombre_contains=${this.input.nombre}&&_sort=nombre:asc`
                )
                .then((response) => {
                  this.loading = false;
                  this.suggestion = response.data;
                })
                .catch((error) => console.log(error));
              this.awaitingSearch = false;
            }, 1000);
          }
        }
        this.awaitingSearch = true;
      } else {
        this.suggestion = [];
      }
    },
  },

  methods: {
    inputFocus() {
      this.showSuggestions = true;
      this.appendIcon = "arrow_drop_up";
    },
    inputBlur() {
      setTimeout(() => {
        this.showSuggestions = false;
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
          this.input = result.data;
          this.sendEvent("item-created", result.data);
          console.log("se creo ", result);
        })
        .catch((error) => console.log("Error al crear", error));
    },
    setItem(item) {
      this.input = item;
      this.sendEvent("item-selected", item);
    },
    sendEvent(name, element) {
      this.$emit(name, element);
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  width: 100%;

  .suggestions {
    position: absolute;
    z-index: 2;
    width: 80%;
    padding: 15px;
    background: #1d1f26;
    transform: translateY(-20px);
    margin-left: 35px;
  }

  #create-btn {
    display: flex;
    margin: 15px auto;
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
}
</style>