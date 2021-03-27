<template>
  <div class="busqueda">
    <div class="configuracion-filtros">
      <Search
        label="Búsque fotos por palabras claves"
        prependIcon="search"
        :clearBeforeSelect="true"
        url="/etiquetas"
        v-on:item-selected="agregarTag($event)"
        v-on:item-created="agregarTag($event)"
      />

      <div class="flex align-baseline">
        <h3
          @click="changeModificadorPuntaje()"
          class="modificador-puntaje evitar-seleccion-txt"
        >
          {{ modificadorPuntaje }}
        </h3>
        <Puntaje v-on:nuevoPuntaje="nuevoFiltroPuntaje($event)" />
      </div>

      <div class="grid-container">
        <DialogSelectionList
          v-if="settingsFiltros.aperturas.length"
          icon="camera"
          title="Apertura"
          :lista="settingsFiltros.aperturas"
          :orderFunction="
            (a, b) => {
              return a.valor - b.valor;
            }
          "
          v-on:itemSelected="dialogSelectedItem($event)"
        />

        <DialogSelectionList
          v-if="settingsFiltros.obturacion.length"
          icon="shutter_speed"
          title="Obturacion"
          :lista="settingsFiltros.obturacion"
          :orderFunction="
            (a, b) => {
              return a.valor.split('/')[1] - b.valor.split('/')[1];
            }
          "
          v-on:itemSelected="dialogSelectedItem($event)"
        />

        <DialogSelectionList
          v-if="settingsFiltros.isos.length"
          icon="iso"
          title="ISO"
          :lista="settingsFiltros.isos"
          :orderFunction="
            (a, b) => {
              return a.valor - b.valor;
            }
          "
          v-on:itemSelected="dialogSelectedItem($event)"
        />

        <DialogSelectionList
          v-if="settingsFiltros.isos.length"
          icon="folder"
          title="Carpetas"
          :lista="settingsFiltros.isos"
          :orderFunction="
            (a, b) => {
              return a.valor - b.valor;
            }
          "
          v-on:itemSelected="dialogSelectedItem($event)"
        />

        <DialogSelectionList
          icon="palette"
          title="Color"
          :lista="colors"
          :listHtmlItem="
            (item) => {
              return (
                '<div class=flex style=align-items:center><div style=width:25px;height:25px;background-color:' +
                item.nombre +
                ';margin-right:25px;border-radius:50%></div><p style=margin:0>' +
                item.nombre +
                '</p></div>'
              );
            }
          "
          v-on:itemSelected="dialogSelectedItem($event)"
        />

        <Search
          label="Búsque fotos por ubicacion"
          prependIcon="location_on"
          :clearBeforeSelect="true"
          :textField="false"
          url="/ubicacions"
          v-on:item-selected="agregarTag($event)"
          v-on:item-created="agregarTag($event)"
          class="center-icon"
        />
      </div>

      <v-chip-group>
        <v-chip
          v-for="(tag, i) in tagsBusqueda"
          :key="i"
          close
          color="primary"
          @click:close="removeTag(i)"
        >
          {{ tag.nombre }}
        </v-chip>
      </v-chip-group>
    </div>

    <div v-if="fotos.length">
      <div class="left">
        <v-icon v-if="vista === 'grilla'" @click="vista = 'lista'" medium
          >view_list</v-icon
        >
        <v-icon v-else-if="vista === 'lista'" @click="vista = 'grilla'" medium
          >view_module</v-icon
        >
      </div>

      <hr />

      <GrillaFotos
        v-if="vista === 'grilla'"
        :imagenes="fotos"
        style="width: 100%"
      />
      <div v-else-if="vista === 'lista'">
        <div v-for="(foto, i) in fotos" :key="i">
          <FotoLista :image="foto"> </FotoLista>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Search from "@/components/Search";
import GrillaFotos from "@/components/GrillaFotos_justifiedLayout";
import FotoLista from "@/components/Foto_Lista";
import Puntaje from "@/components/Puntaje";
import DialogSelectionList from "@/components/DialogSelectionList.vue";

export default {
  name: "Busqueda",

  components: {
    Search,
    GrillaFotos,
    FotoLista,
    Puntaje,
    DialogSelectionList,
  },

  data() {
    return {
      fotos: [],
      tagsBusqueda: [],
      rating: 0,
      colors: [],
      folders: [],
      vista: "grilla",
      modificadorPuntaje: "=",
      settingsFiltros: {
        aperturas: [],
        isos: [],
        obturacion: [],
      },
      selectedFilters: {
        apertura: undefined,
        iso: undefined,
        obturacion: undefined,
        color: undefined,
        puntaje: undefined,
      },
    };
  },

  created() {
    this.$http
      .get("/colores")
      .then((result) => (this.colors = result.data))
      .catch((error) => {
        console.log("No se pudieron cargar los colores", error);
      });

    this.$http
      .get("/aperturas")
      .then((r) => (this.settingsFiltros.aperturas = r.data))
      .catch((e) => console.log("No se pudieron cargar las aperturas", e));
    this.$http
      .get("/obturacions")
      .then((r) => (this.settingsFiltros.obturacion = r.data))
      .catch((e) => console.log("No se pudieron cargar las obturaciones", e));
    this.$http
      .get("/isos")
      .then((r) => (this.settingsFiltros.isos = r.data))
      .catch((e) => console.log("No se pudieron cargar los valores iso", e));
  },

  methods: {
    agregarTag(t) {
      let exist = this.existInArrayById(this.tagsBusqueda, t);
      if (exist == -1) {
        this.tagsBusqueda.push(t);
        this.selectedFilters[t.nombre] = { fotos: t.fotos };
        this.selectFilter(t.nombre, t);
      }
    },

    removeTag(index) {
      this.selectedFilters[this.tagsBusqueda[index].nombre] = undefined;
      this.tagsBusqueda.splice(index, 1);
      this.removePhotoFilter();
    },

    existInArrayById(array, foto) {
      let exist = -1;

      if (array.length) {
        array.forEach((elem, i) => {
          if (elem.id == foto.id) exist = i;
        });
      }

      return exist;
    },

    changeModificadorPuntaje() {
      const modificadores = {
        "=": ">=",
        ">=": "<=",
        "<=": "=",
      };
      this.modificadorPuntaje = modificadores[this.modificadorPuntaje];
      this.nuevoFiltroPuntaje(this.rating);
    },

    addPhotoFilter(selectedFilter, photos) {
      let filters = this.getFiltersInUse();
      if (filters.length == 0) {
        this.fotos.push(...photos);
      } else {
        let existInEvery;
        let intersectedPhotos = [];
        for (let photo of photos) {
          for (let filter of filters) {
            if (selectedFilter == filter) {
              continue;
            }
            existInEvery = this.existInArrayById(
              this.selectedFilters[filter].fotos,
              photo
            );
            if (existInEvery == -1) {
              break;
            }
          }
          if (existInEvery != -1) {
            intersectedPhotos.push(photo);
          }
        }

        this.fotos = intersectedPhotos;
        // console.log("RESULT_ADDING________________________________");
        // console.log(
        //   "Fotos filtradas:",
        //   this.fotos.map((e) => e.id)
        // );
      }
    },

    removePhotoFilter() {
      let filters = this.getFiltersInUse();
      if (filters.length == 0) {
        this.fotos = [];
      } else {
        let intersectedPhotos = [];
        let firstFilterPhotos = this.selectedFilters[filters[0]].fotos;

        for (let photo of firstFilterPhotos) {
          let exist;
          for (
            let filterIndex = 1;
            filterIndex < filters.length;
            filterIndex++
          ) {
            exist = this.existInArrayById(
              this.selectedFilters[filters[filterIndex]].fotos,
              photo
            );

            if (exist == -1) {
              break;
            }
          }
          if (exist != -1) {
            intersectedPhotos.push(photo);
          }
        }

        this.fotos = intersectedPhotos;

        //console.log("RESULT_ADDING________________________________");
        // console.log(
        //   "Fotos filtradas:",
        //   this.fotos.map((e) => e.id)
        // );
        //this.fotos = intersectedPhotos;
      }
    },

    selectFilter(filter, value) {
      if (
        (this.selectedFilters[filter] &&
          this.selectedFilters[filter] == value) ||
        (this.selectedFilters[filter] && !value)
      ) {
        this.selectedFilters[filter] = undefined;
        this.removePhotoFilter();
      } else {
        this.selectedFilters[filter] = value;
        this.addPhotoFilter(filter, value.fotos);
      }
    },

    getFiltersInUse() {
      let filters = [];
      for (let filter in this.selectedFilters) {
        let item = this.selectedFilters[filter];
        if (item) {
          filters.push(filter.toString());
        }
      }
      return filters;
    },

    nuevoFiltroPuntaje(event) {
      this.rating = event != 0 ? event : undefined;
      if (this.rating) {
        const filter = {
          "=": "eq",
          ">=": "gte",
          "<=": "lte",
        };

        this.$http
          .get(
            `/fotos?puntuacion_${filter[this.modificadorPuntaje]}=${
              this.rating
            }`
          )
          .then((r) => {
            this.selectedFilters.puntaje = { fotos: r.data };
            this.addPhotoFilter("puntaje", r.data);
          });
      } else {
        this.selectedFilters.puntaje = undefined;
        this.removePhotoFilter();
      }
    },

    dialogSelectedItem(event) {
      // console.log(event);
      this.selectFilter(event.title.toLowerCase(), event.itemSelected);
      // @click="selectFilter('iso', iso)"
    },
  },
};
</script>

<style lang="scss" scoped>
.busqueda {
  .configuracion-filtros {
    width: 80%;
    margin: auto;
  }

  .evitar-seleccion-txt {
    user-select: none;
  }

  .left {
    display: flex;
    justify-content: flex-end;
  }

  .color-tag {
    cursor: pointer;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 20px;
  }

  .align-baseline {
    align-items: baseline;
  }

  .modificador-puntaje {
    cursor: pointer;
  }

  .grid-container {
    width: 100%;
    // display: flex;
    // justify-content: space-around;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    justify-content: center;
    align-items: flex-start;

    .center-icon {
      display: flex;
      justify-content: center;
    }
  }
}
</style>