<template>
  <v-container fluid class="justified-layout">
    <template v-if="pros_img && pros_img.length > 0">
      <div class="sticky">
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
      </div>
      <vue-justified-layout
        :items="pros_img"
        v-slot="{ item }"
        :options="{
          targetRowHeight: imgSize,
          boxSpacing: 5,
        }"
      >
        <div
          @click="!selectable && goToPhotos(item)"
          tag="button"
          class="item-jl"
        >
          <!-- :to="`/fotos/${item.id}`" :disabled="selectable"-->
          <v-icon v-if="selectable && !item.selected" class="checkbox"
            >check_box_outline_blank</v-icon
          >
          <v-icon v-else-if="selectable" class="selected-check">check</v-icon>
          <img
            v-if="item.hasThumbnail"
            :src="item.url"
            @click="changeStatusSelected(item)"
            :class="[item.selected ? 'foto selected' : 'foto']"
          />

          <video
            v-else-if="item.isVideo"
            :class="[item.selected && 'foto selected']"
            @click="changeStatusSelected(item)"
            @load="videoLoaded(item)"
          >
            <source :src="item.url" type="video/mp4" />
          </video>
          <v-icon
            v-if="item.isVideo"
            :size="`${playButtonSize}px`"
            :class="[
              item.selected ? 'play-arrow-top-left' : 'play-arrow-center',
              'loading-video',
            ]"
            >play_circle_outline</v-icon
          >
        </div>
      </vue-justified-layout>
    </template>
    <v-progress-circular
      v-else-if="!pros_img"
      indeterminate
      size="50"
      color="primary"
      class="loading"
    ></v-progress-circular>
    <h4 v-else-if="pros_img.length < 1">No hay nada que mostrar</h4>
  </v-container>
</template>

<script>
import { VueJustifiedLayout } from "vue-justified-layout";

export default {
  name: "Grilla",
  data() {
    return {
      // selected: undefined,
      pros_img: undefined,
      imgSize: 200,
      playButtonSize: 60,
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

  created() {
    this.procesarImagenes();
  },

  watch: {
    imagenes: {
      deep: true,
      handler() {
        this.procesarImagenes();
      },
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
      this.playButtonSize += 15;
    },
    sizeDown() {
      this.imgSize > 50 ? (this.imgSize -= 50) : undefined;
      this.playButtonSize -= 15;
    },
    selectAll() {
      this.pros_img.forEach((element) => {
        element.selected = true;
      });
      this.$emit("selectedPhotos", this.pros_img);
    },
    deselectAll() {
      this.pros_img.forEach((element) => {
        element.selected = false;
      });
      this.$emit("selectedPhotos", []);
    },
    changeStatusSelected(item) {
      item.selected = !item.selected;
      let sendData = this.pros_img
        .filter((e) => e.selected)
        .map((obj) => obj.id);
      this.$emit("selectedPhotos", sendData);
    },
    videoLoaded(v) {
      v.loaded = true;
    },

    procesarImagenes() {
      if (this.imagenes) {
        // this.agregarCheck(this.imagenes);
        this.pros_img = this.imagenes.map((img) => {
          let nImg;

          nImg = {
            width: img.exif.ImageWidth,
            height: img.exif.ImageHeight,
            url: img.thumbnail
              ? this.$apiUrl(
                  img.thumbnail.formats
                    ? img.thumbnail.formats.medium.url
                    : img.thumbnail.url
                )
              : this.$apiUrl(img.img.url),
            id: img.id,
            selected: false,
            isVideo: this.isVideo(img),
            hasThumbnail: img.thumbnail ? true : false,
          };

          return nImg;
        });
      }
    },

    isVideo(img) {
      if (img.img) {
        let imgExt = img.img.ext.toLowerCase();
        if (
          imgExt.localeCompare(".mp4") === 0 ||
          imgExt.localeCompare(".mov") === 0
        ) {
          return true;
        }
      }
      return false;
    },

    goToPhotos(item) {
      localStorage.setItem(
        "listaDeFotos",
        JSON.stringify(this.imagenes.map((e) => e.id))
      );
      // console.log(JSON.stringify(this.imagenes.map((e) => e.id)));
      // console.log(this.imagenes.map((e) => e.id));
      this.$router.push({ name: "Foto", params: { img: item.id } });
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

  video {
    cursor: pointer;
    border-radius: 3px;
    width: 100%;
    height: 100%;
  }

  video:hover {
    z-index: 1;
    transform: scale(1.01);
  }

  .loading-video {
    color: black;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    // // filter: drop-shadow(0px 3px 2px rgba(0, 0, 0, 0.1));

    background-image: linear-gradient(270deg, #00b7ff, #c8e2ff);
    background-size: 400% 400%;

    animation: change-color 1s ease infinite;
  }

  @keyframes change-color {
    0% {
      background-position: 78% 0%;
    }
    50% {
      background-position: 23% 100%;
    }
    100% {
      background-position: 78% 0%;
    }
  }

  .play-arrow-center {
    position: absolute;
    top: 40%;
    left: 40%;
    z-index: 2;
  }

  .play-arrow-top-left {
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 2;
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
    //transform: translateX(-50%);
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
