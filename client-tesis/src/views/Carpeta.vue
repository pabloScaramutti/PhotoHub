<template>
  <div>
    <div v-if="carpeta">
      <div class="carpeta-info">
        <h1>{{ carpeta.nombre }}</h1>
        <p>{{ carpeta.descripcion }}</p>
        <div class="carpeta-etiquetas">
          <v-chip
            v-for="(tag, i) in carpeta.etiquetas"
            :key="i"
            color="primary"
          >
            {{ tag.nombre }}
          </v-chip>
        </div>
      </div>

      <div v-if="carpeta.fotos.length > 0">
        <div class="left">
          <v-icon v-if="vista === 'grilla'" @click="vista = 'lista'" medium
            >view_list</v-icon
          >
          <v-icon v-else-if="vista === 'lista'" @click="vista = 'grilla'" medium
            >view_module</v-icon
          >
        </div>

        <hr />

        <div class="mt-5">
          <Grilla v-if="vista === 'grilla'" :imagenes="carpeta.fotos" />
          <div v-else-if="vista === 'lista'">
            <div v-for="(foto, i) in carpeta.fotos" :key="i">
              <FotoLista :img="foto"> </FotoLista>
            </div>
          </div>
        </div>
      </div>
    </div>
    <v-progress-circular
      v-else
      indeterminate
      color="primary"
    ></v-progress-circular>
  </div>
</template>

<script>
import Grilla from "@/components/GrillaFotos_justifiedLayout.vue";
import FotoLista from "@/components/Foto_Lista.vue";

export default {
  name: "Carpeta",
  components: {
    Grilla,
    FotoLista,
  },

  data() {
    return {
      carpeta: undefined,
      vista: "grilla",
    };
  },

  created() {
    this.$http
      .get(this.$route.path)
      .then((r) => (this.carpeta = r.data))
      .catch((e) => console.log("No se pudo cargar la carpeta", e));
  },
};
</script>

<style lang="scss" scoped>
.carpeta-info {
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .carpeta-etiquetas {
    flex-direction: row;
  }
}

.left {
  display: flex;
  justify-content: flex-end;
}

.mt-5 {
  margin-top: 5px;
}
</style>