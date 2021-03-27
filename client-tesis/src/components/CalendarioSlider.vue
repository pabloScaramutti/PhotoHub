<template>
  <v-slide-group class="calendario-slider">
    <v-slide-item v-for="i in 20" :key="i">
      <div class="date">
        <h1>12</h1>
        <h5>Marzo</h5>
      </div>
    </v-slide-item>
  </v-slide-group>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.calendario-slider {
  color: black;

  .date {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 60px;
    height: 90px;
    background-color: white;
    border-radius: 15px;
    margin-right: 32px;
  }
}
</style>