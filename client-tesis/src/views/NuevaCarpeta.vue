<template>
  <div>
    <form action="" class="formulario-nueva-carpeta">
      <h1>Nuevo Album</h1>
      <v-text-field
        prepend-icon="create_new_folder"
        label="Nombre de carpeta..."
        v-model="nuevaCarpeta.nombre"
        type="text"
      />
      <v-text-field
        prepend-icon="local_offer"
        label="Agregar etiquetas"
        v-model="nuevaCarpeta.etiquetas"
        type="text"
      />
      <h2>Agregue fotos a la carpeta</h2>
      <v-text-field
        prepend-icon="search"
        label="Filtrar fotos por..."
        v-model="nuevaCarpeta.nombre"
        type="text"
      />
    </form>
    <GrillaFotos :imagenes="imagenes" :selectable="true"></GrillaFotos>
  </div>
</template>

<script>
import GrillaFotos from "@/components/GrillaFotos_masonry";

export default {
  name: "NuevaCarpeta",
  components: {
    GrillaFotos
  },
  data() {
    return {
      nuevaCarpeta: {
        nombre: "",
        fechaCreacion: undefined,
        etiquetas: [],
        fotos: []
      },
      imagenes: [
        require("@/assets/Media/DSC_0615.jpg"),
        require("@/assets/Media/DSC_0171.jpg"),
        require("@/assets/Media/DSC_0288.jpg"),
        require("@/assets/Media/DSC_0294.jpg"),
        require("@/assets/Media/DSC_0338.jpg"),
        require("@/assets/Media/DSC_0342.jpg"),
        require("@/assets/Media/DSC_0353.jpg"),
        require("@/assets/Media/DSC_0362.jpg"),
        require("@/assets/Media/DSC_0370.jpg"),
        require("@/assets/Media/DSC_0373.jpg"),
        require("@/assets/Media/DSC_0374.jpg"),
        require("@/assets/Media/DSC_0380.jpg"),
        require("@/assets/Media/DSC_0397.jpg"),
        require("@/assets/Media/DSC_0423.jpg"),
        require("@/assets/Media/DSC_0449.jpg")
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.formulario-nueva-carpeta {
  width: 100%;
  padding: 0 3vw;
}
</style>
