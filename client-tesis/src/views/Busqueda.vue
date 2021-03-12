<template>
  <div class="busqueda">
    <div class="configuracion-filtros">
      <Search
        label="Búsque fotos por palabras claves"
        preppendIcon="search"
        :clearBeforeSelect="true"
        url="/etiquetas"
        v-on:item-selected="agregarTag($event)"
      />

      <div class="flex align-baseline">
        <h3
          @click="changeModificadorPuntaje()"
          class="modificador-puntaje"
          style="user-select: none"
        >
          {{ modificadorPuntaje }}
        </h3>
        <Puntaje />
      </div>

      <div class="flex">
        <div
          @click="selectedFilters.color = undefined"
          class="color-tag"
          :style="`background: gray;
                  background: linear-gradient(135deg, rgba(255,255,255,1) 40%, rgba(255,0,0,1) 40%, rgba(255,0,0,1) 55%, rgba(255,255,255,1) 55%); 
                  border: ${
                    selectedFilters.color === undefined
                      ? '4px solid gray'
                      : 'none'
                  };`"
        ></div>
        <div
          v-for="(color, i) in colors"
          @click="selectedFilters.color = color.nombre"
          :key="i"
          :style="`background-color: ${color.nombre}; border: ${
            color.nombre === selectedFilters.color ? '4px solid white' : 'none'
          }`"
          class="color-tag"
        ></div>
      </div>

      <div class="grid-container">
        <div class="filtros-camera-settings">
          <h5>Aperturas</h5>
          <ul v-if="settingsFiltros.aperturas.length > 0">
            <li
              v-for="(apertura, i) in settingsFiltros.aperturas"
              :key="i"
              @click="selectedFilters.apertura = apertura"
            >
              <p>
                {{ apertura.valor }}
              </p>
            </li>
          </ul>
          <p v-else>No se registraron aperturas</p>
        </div>
        <div class="filtros-camera-settings">
          <h5>Velocidad Obturacion</h5>
          <ul v-if="settingsFiltros.obturacion.length > 0">
            <li
              v-for="(obturacion, i) in settingsFiltros.obturacion"
              :key="i"
              @click="selectedFilters.obturacion = obturacion"
            >
              <p>
                {{ obturacion.valor }}
              </p>
            </li>
          </ul>
          <p v-else>No se registraron velocidades de obturacion</p>
        </div>
        <div class="filtros-camera-settings">
          <h5>ISO</h5>
          <ul v-if="settingsFiltros.isos.length > 0">
            <li
              v-for="(iso, i) in settingsFiltros.isos"
              :key="i"
              @click="selectedFilters.iso = iso"
            >
              <p>{{ iso.valor }}</p>
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
        <li>nombre de imagen</li>
        <li>carpeta</li>
        <li>etiqueta</li>
        <li>rating</li>
        <li>etiqueta color</li>
        <li>Video / Imagen</li>
      </ul>

      <v-chip-group>
        <v-chip v-for="(tag, i) in tagsBusqueda" :key="i" close color="primary">
          {{ tag.nombre }}
        </v-chip>
      </v-chip-group>
    </div>

    <div v-if="fotos.length > 0">
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
      this.tagsBusqueda.push(t);
      t.fotos.forEach((foto) => {
        this.existInArrayById(this.fotos, foto) < 0 && this.fotos.push(foto);
      });
    },

    existInArrayById(array, foto) {
      let exist = -1;

      if (array.length > 0) {
        array.forEach((elem, i) => {
          if (elem.id == foto.id) exist = i;
        });
      }

      return exist;
    },

    changeModificadorPuntaje() {
      if (this.modificadorPuntaje === "=") {
        this.modificadorPuntaje = ">=";
      } else if (this.modificadorPuntaje === ">=") {
        this.modificadorPuntaje = "<=";
      } else if (this.modificadorPuntaje === "<=") {
        this.modificadorPuntaje = "=";
      }
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

      p {
        margin: 0;
      }
    }

    li:hover {
      background-color: gray;
    }
  }
}
</style>