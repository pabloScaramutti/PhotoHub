<template>
  <div @click="checkearCero">
    <v-rating
      v-model="rating"
      color="primary"
      background-color="grey darken-1"
      :hover="!tactil"
      :size="size"
    ></v-rating>
  </div>
</template>

<script>
export default {
  name: "Puntaje",
  props: {
    size: {
      type: String,
      default: "3vh",
    },
    puntajeInicial: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      rating: 0,
      ratingAnterior: 0,
      tactil:
        this.$vuetify.breakpoint.name == "xs" ||
        this.$vuetify.breakpoint.name == "sm"
          ? true
          : false,
    };
  },
  mounted() {
    this.rating = this.puntajeInicial;
  },
  watch: {
    rating: function (newRating) {
      this.$emit("nuevoPuntaje", newRating);
    },
  },
  methods: {
    checkearCero() {
      if (this.rating == this.ratingAnterior && this.ratingAnterior == 1) {
        this.rating = this.ratingAnterior = 0.0;
      } else {
        this.ratingAnterior = this.rating;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.v-rating .v-icon {
  padding: 0.3rem !important;
}
</style>
