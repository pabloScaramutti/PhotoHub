<template>
  <div class="home">
    <router-link :to="{ name: 'Login' }">
      <v-btn block rounded color="primary"> Login </v-btn>
    </router-link>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: "Home",
  components: {}
};
</script>
