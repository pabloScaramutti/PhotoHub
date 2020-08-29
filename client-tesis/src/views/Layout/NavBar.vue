<template>
  <v-app-bar app color="negro" dark>
    <div class="d-flex align-center">
      <router-link :to="{ name: 'Home' }">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo-tesis.png"
          transition="scale-transition"
          width="40"
        />
      </router-link>
    </div>

    <v-spacer></v-spacer>

    <router-link class="link" :to="{}">
      <v-icon>mdi-magnify</v-icon>
    </router-link>
    <router-link class="link" :to="{}">
      <v-icon>mdi-menu</v-icon>
    </router-link>
  </v-app-bar>
</template>

<style scoped>
.link {
  text-decoration: none;
  margin: 0.5rem;
  border-radius: 45%;
  padding: 0.5rem;
}

.link:active {
  background: rgba(126, 255, 126, 0.1);
}
</style>
