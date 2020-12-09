<template>
  <v-container fluid class="justified-layout">
    <template v-if="pros_img">
      <vue-justified-layout
        :items="pros_img"
        v-slot="{ item }"
        :options="{
          targetRowHeight: 200,
          boxSpacing: 5,
        }"
      >
        <router-link
          :to="`/fotos/${item.id}`"
          tag="button"
          :disabled="selectable"
          class="item-jl"
        >
          <img :src="item.url" />
        </router-link>
      </vue-justified-layout>
      <!-- <div>
      <router-link
        :to="{ name: 'Foto', params: { img: item.img } }"
        tag="button"
        :disabled="selectable"
      >
        <v-icon v-if="selectable && !item.selector" class="checkbox"
          >check_box_outline_blank</v-icon
        >
        <v-icon v-else-if="selectable" class="selected-check">check</v-icon>
        <img
          :src="item.img"
          @click="item.selector = !item.selector"
          :class="[item.selector ? 'selected' : 'foto']"
          @load="onImageLoad()"
        />
        
      </router-link>
    </div> -->
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
  },
};
</script>

<style lang="scss" scope>
.justified-layout {
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
    width: 90%;
    height: 90%;
    position: absolute;
    font-size: 3em;
    vertical-align: center;
    text-align: center;
    pointer-events: none;
  }
}
</style>
