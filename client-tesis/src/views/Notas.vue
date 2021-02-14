<template>
  <div>
    <Nota
      v-for="(nota, i) in notas"
      :key="i"
      :text="nota.contenido"
      :title="nota.titulo"
    />
  </div>
</template>

<script>
import Nota from "@/components/Nota";

export default {
  name: "Notas",
  components: {
    Nota,
  },
  data() {
    return {
      notas: undefined,
    };
  },
  created() {
    this.$http
      .get("/notas")
      .then((r) => (this.notas = r.data))
      .catch((e) => console.log("Ocurrió un error cargando las notas", e));
  },
};
</script>

<style>
</style>