<template>
  <div class="busqueda">
    <Search
      label="Búsque fotos por palabras claves"
      preppendIcon="search"
      :clearBeforeSelect="true"
      url="/etiquetas"
      v-on:item-selected="agregarTag($event)"
    />
    <v-chip-group>
      <v-chip v-for="(tag, i) in tagsBusqueda" :key="i" close color="primary">
        {{ tag.nombre }}
      </v-chip>
    </v-chip-group>

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

export default {
  name: "Busqueda",

  components: {
    Search,
    GrillaFotos,
    FotoLista,
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
    };
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
  },
};
</script>

<style lang="scss" scoped>
.busqueda {
  width: 80%;
  margin: auto;

  .left {
    display: flex;
    justify-content: flex-end;
  }
}
</style>