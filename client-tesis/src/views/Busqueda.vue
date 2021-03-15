<template>
  <div class="busqueda">
    <div class="configuracion-filtros">
      <Search
        label="Búsque fotos por palabras claves"
        preppendIcon="search"
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
        <Puntaje />
      </div>

      <div class="flex">
        <div
          @click="selectFilter('color', selectedFilters.color)"
          class="color-tag color-tag-none"
          :style="`border: ${
            !selectedFilters.color ? '4px solid gray' : 'none'
          };`"
        ></div>
        <div
          v-for="(color, i) in colors"
          @click="selectFilter('color', color)"
          :key="i"
          :style="`background-color: ${color.nombre}; border: ${
            selectedFilters.color &&
            color.nombre === selectedFilters.color.nombre
              ? '4px solid white'
              : 'none'
          }`"
          class="color-tag"
        ></div>
      </div>

      <div class="grid-container">
        <div class="filtros-camera-settings">
          <h5>Aperturas</h5>
          <ul v-if="settingsFiltros.aperturas.length">
            <li
              v-for="(apertura, i) in settingsFiltros.aperturas"
              :key="i"
              @click="selectFilter('apertura', apertura)"
              :class="selectedFilters.apertura == apertura && 'selected-item'"
            >
              <p class="evitar-seleccion-txt">
                {{ apertura.valor }}
              </p>
            </li>
          </ul>
          <p v-else>No se registraron aperturas</p>
        </div>
        <div class="filtros-camera-settings">
          <h5>Velocidad Obturacion</h5>
          <ul v-if="settingsFiltros.obturacion.length">
            <li
              v-for="(obturacion, i) in settingsFiltros.obturacion"
              :key="i"
              @click="selectFilter('obturacion', obturacion)"
              :class="
                selectedFilters.obturacion == obturacion && 'selected-item'
              "
            >
              <p class="evitar-seleccion-txt">
                {{ obturacion.valor }}
              </p>
            </li>
          </ul>
          <p v-else>No se registraron velocidades de obturacion</p>
        </div>
        <div class="filtros-camera-settings">
          <h5>ISO</h5>
          <ul v-if="settingsFiltros.isos.length">
            <li
              v-for="(iso, i) in settingsFiltros.isos"
              :key="i"
              @click="selectFilter('iso', iso)"
              :class="selectedFilters.iso == iso && 'selected-item'"
            >
              <p class="evitar-seleccion-txt">{{ iso.valor }}</p>
            </li>
          </ul>
          <p v-else>No se registraron niveles de ISO</p>
        </div>
      </div>

      <ul>
        <li>Por fecha</li>
        <li>Por settings</li>
        <ul>
          <li>apertura</li>
          <li>velocidad de obturacion</li>
          <li>iso</li>
          <li>tamaño</li>
          <li>flash</li>
        </ul>
        <li>geograficamente</li>
        <li>nombre de imagen</li>
        <li>carpeta</li>
        <li>etiqueta</li>
        <li>rating</li>
        <li>etiqueta color</li>
        <li>Video / Imagen</li>
      </ul>

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
          <FotoLista :img="foto"> </FotoLista>
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

export default {
  name: "Busqueda",

  components: {
    Search,
    GrillaFotos,
    FotoLista,
    Puntaje,
  },

  data() {
    return {
      fotos: [],
      tagsBusqueda: [],
      rangeRating: {
        inicio: 0,
        fin: 0,
      },
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
    },

    addPhotoFilter(selectedFilter, photos) {
      console.log("ADDING________________________________");
      console.log(
        "Fotos filtradas:",
        this.fotos.map((e) => e.id)
      );

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
        console.log("RESULT_ADDING________________________________");
        console.log(
          "Fotos filtradas:",
          this.fotos.map((e) => e.id)
        );
      }
    },

    removePhotoFilter() {
      console.log("REMOVING-----------------------------");
      console.log(
        "Fotos filtradas:",
        this.fotos.map((e) => e.id)
      );
      let filters = this.getFiltersInUse();
      if (filters.length == 0) {
        this.fotos = [];
      } else {
        console.log("filtros activos", filters, filters[0]);
        let intersectedPhotos = [];
        let firstFilterPhotos = this.selectedFilters[filters[0]].fotos;
        console.log("intersectedPhotos", intersectedPhotos);

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

        console.log("RESULT_ADDING________________________________");
        console.log(
          "Fotos filtradas:",
          this.fotos.map((e) => e.id)
        );
        //this.fotos = intersectedPhotos;
      }
    },

    selectFilter(filter, value) {
      if (
        this.selectedFilters[filter] &&
        this.selectedFilters[filter] == value
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

  .color-tag-none {
    background: gray;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 1) 40%,
      rgba(255, 0, 0, 1) 40%,
      rgba(255, 0, 0, 1) 55%,
      rgba(255, 255, 255, 1) 55%
    );
  }

  .align-baseline {
    align-items: baseline;
  }

  .modificador-puntaje {
    cursor: pointer;
  }

  .grid-container {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }

  .filtros-camera-settings {
    width: 32%;
    min-width: 200px;
    margin-right: 1%;

    ul {
      padding: 0;
    }

    li {
      list-style-type: none;
      cursor: pointer;
      padding: 2px;

      p {
        margin: 0;
      }
    }

    li:hover {
      background-color: rgb(150, 150, 150);
    }

    .selected-item {
      background-color: rgb(42, 170, 255);
    }
  }
}
</style>