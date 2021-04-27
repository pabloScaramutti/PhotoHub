<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <div class="selection-icon">
        <v-icon
          :size="iconSize"
          dark
          v-bind="attrs"
          v-on="on"
          class="activator"
        >
          {{ icon }}
        </v-icon>
        <p>{{ selectedItem ? selectedItem.valor : "-" }}</p>
      </div>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
      </v-toolbar>

      <ul v-if="lista.length">
        <li @click="returnSelectedItem(undefined)">-</li>
        <li
          v-for="(item, i) in lista"
          :key="i"
          @click="returnSelectedItem(item)"
          :class="selectedItem == item && 'selected-item'"
        >
          <div v-html="listHtmlItem(item)"></div>
        </li>
      </ul>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      selectedItem: undefined,
    };
  },

  props: {
    icon: String,
    iconSize: {
      type: String,
      default: "32px",
    },
    title: String,
    lista: Array,
    orderFunction: {
      default: undefined,
      type: Function,
      required: false,
    },

    listHtmlItem: {
      default: (item) => `<p>${item.valor} (${item.fotos.length})</p>`,
      type: Function,
      required: false,
    },
  },

  created() {
    if (this.lista && this.orderFunction) {
      this.lista = this.lista.sort(this.orderFunction);
    }
  },

  methods: {
    returnSelectedItem(item) {
      this.$emit("itemSelected", { title: this.title, itemSelected: item });
      this.selectedItem = item == this.selectedItem ? undefined : item;
      this.dialog = false;
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  padding: 0;
}

li {
  list-style-type: none;
  cursor: pointer;
  padding: 10px;
  padding-left: 80px;
  border-bottom: solid 1px rgba(128, 128, 128, 0.171);
}

li:hover {
  background-color: rgb(150, 150, 150);
}

.selected-item {
  background-color: rgb(42, 170, 255);
}

.selection-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  //width: fit-content;
}

p {
  margin: 0;
}

.activator:hover {
  color: rgb(30, 164, 229);
}
</style>