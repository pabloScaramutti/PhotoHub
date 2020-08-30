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
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </router-link>
    <router-link class="link" :to="{}">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </router-link>
  </v-app-bar>
</template>

<style scoped>
.link {
  text-decoration: none;
}
</style>
