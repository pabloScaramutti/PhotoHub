<template>
  <v-container fluid class="justified-layout">
    <template v-if="pros_img">
      <v-btn text small @click="sizeUp()" :disabled="!(imgSize < 500)"
        ><v-icon>zoom_in</v-icon></v-btn
      >
      <v-btn text small @click="sizeDown()" :disabled="!(imgSize > 50)"
        ><v-icon>zoom_out</v-icon></v-btn
      >
      <v-btn v-if="selectable" fab small @click="selectAll()"
        ><v-icon>done</v-icon></v-btn
      >
      <v-btn v-if="selectable" fab small @click="deselectAll()"
        ><v-icon>check_box_outline_blank</v-icon></v-btn
      >
      <vue-justified-layout
        :items="pros_img"
        v-slot="{ item }"
        :options="{
          targetRowHeight: imgSize,
          boxSpacing: 5,
        }"
      >
        <router-link
          :to="`/fotos/${item.id}`"
          tag="button"
          :disabled="selectable"
          class="item-jl"
        >
          <v-icon v-if="selectable && !item.selected" class="checkbox"
            >check_box_outline_blank</v-icon
          >
          <v-icon v-else-if="selectable" class="selected-check">check</v-icon>
          <img
            :src="item.url"
            @click="item.selected = !item.selected"
            :class="[item.selected ? 'foto selected' : 'foto']"
          />
        </router-link>
      </vue-justified-layout>
    </template>
    <v-progress-circular
      v-else
      indeterminate
      size="50"
      color="primary"
      class="loading"
    ></v-progress-circular>
  </v-container>
</template>

<script>
import { VueJustifiedLayout } from "vue-justified-layout";

export default {
  name: "Grilla",
  data() {
    return {
      selected: undefined,
      pros_img: undefined,
      imgSize: 200,
    };
  },
  components: {
    VueJustifiedLayout,
  },
  props: {
    imagenes: {
      type: undefined,
      required: true,
    },
    selectable: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    imagenes: function () {
      if (this.imagenes) {
        this.selected = this.agregarCheck(this.imagenes);
        this.pros_img = this.imagenes.map((img) => {
          let nImg = {
            width: img.exif.ImageWidth,
            height: img.exif.ImageHeight,
            url: this.$apiUrl(img.thumbnail.url),
            id: img.id,
            selected: false,
          };
          return nImg;
        });
      }
    },
  },
  methods: {
    agregarCheck: function (imagenes) {
      var aux = [];
      for (var i = 0; i < imagenes.length; i++) {
        var img = { img: imagenes[i], selector: false };
        aux.push(img);
      }
      return (this.imageSelector = aux);
    },
    sizeUp() {
      this.imgSize < 500 ? (this.imgSize += 50) : undefined;
    },
    sizeDown() {
      this.imgSize > 50 ? (this.imgSize -= 50) : undefined;
    },
    selectAll() {
      this.pros_img.forEach((element) => {
        element.selected = true;
      });
    },
    deselectAll() {
      this.pros_img.forEach((element) => {
        element.selected = false;
      });
    },
  },
};
</script>

<style lang="scss" scope>
.justified-layout {
  padding: 0 !important;

  .selected {
    border: 4px solid white;
    opacity: 0.4;
  }

  .item-jl {
    height: 100%;
  }

  img:hover {
    z-index: 1;
    transform: scale(1.01);
  }

  img {
    cursor: pointer;
    border-radius: 3px;
    height: 100%;
    max-width: 100%;
  }

  .checkbox {
    position: absolute;
    margin-top: 0;
    padding-top: 0;
    display: flex;
    justify-content: flex-end;
    z-index: 1;
    pointer-events: none;
  }

  .selected-check {
    width: 100%;
    transform: translateX(-50%);
    height: 100%;
    position: absolute;
    font-size: 3.5em;
    vertical-align: center;
    text-align: center;
    pointer-events: none;
    z-index: 2;
  }
}
</style>
