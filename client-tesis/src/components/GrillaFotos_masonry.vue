<template>
  <v-container fluid class="grilla">
    <div class="grid">
      <div v-for="item in selected" :key="item.img" class="grid-item">
        <router-link
          :to="{ name: 'Foto', params: { img: item.img } }"
          tag="button"
          :disabled="selectable"
        >
          <v-icon v-if="selectable && !item.selector" class="checkbox"
            >check_box_outline_blank</v-icon
          >
          <v-icon v-else-if="selectable" class="selected-checkbox"
            >check</v-icon
          >
          <img
            :src="item.img"
            @click="item.selector = !item.selector"
            :class="[item.selector ? 'selected' : 'foto']"
            @load="onImageLoad()"
          />
          <!-- <template v-slot:placeholder>
              <v-row class="fill-height" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template> -->
        </router-link>
      </div>
    </div>
  </v-container>
</template>

<script>
import Masonry from "masonry-layout";

export default {
  name: "Grilla",
  data() {
    return {
      selected: this.agregarCheck(this.imagenes)
    };
  },
  props: {
    imagenes: {
      type: Array,
      required: true
    },
    selectable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleSelection(img) {
      var index = this.existe(this.selected, img);
      if (index != -1) {
        this.selected.splice(index, 1);
      } else {
        this.selected.push(img);
      }
      return this.selected;
    },

    agregarCheck: function(imagenes) {
      var aux = [];
      for (var i = 0; i < imagenes.length; i++) {
        var img = { img: imagenes[i], selector: false };
        aux.push(img);
      }
      return (this.imageSelector = aux);
    },

    existe(arreglo, img) {
      if (arreglo == null || arreglo.length < 1) {
        return -1;
      } else {
        for (var i = 0; i < arreglo.length; i++) {
          if (arreglo[i].localeCompare(img) == 0) {
            return i;
          }
        }
        return -1;
      }
    },
    onImageLoad() {
      this.loadMasonry();
    },
    loadMasonry() {
      var grid = document.querySelector(".grid");
      var msnry = new Masonry(grid, {
        // options...
        itemSelector: ".grid-item",
        gutter: 5
      });
      return msnry;
    }
  }
};
</script>

<style lang="scss" scope>
.grilla {
  .selected {
    border: 4px solid white;
  }

  .foto:hover {
    z-index: 1;
    transform: scale(1.01);
  }

  .checkbox {
    position: absolute;
    margin-top: 0;
    padding-top: 0;
    display: flex;
    justify-content: flex-end;
    z-index: 1;
  }

  .selected-checkbox {
    width: 100%;
    height: 100%;
    position: absolute;
    font-size: 3em;
    vertical-align: center;
    text-align: center;
    pointer-events: none;
  }

  .grid-item {
    width: 24.5%;

    img {
      width: 100%;
    }
  }

  @media (max-width: 740px) {
    .grid-item {
      width: 49%;

      img {
        width: 100%;
      }
    }
  }
}
</style>
