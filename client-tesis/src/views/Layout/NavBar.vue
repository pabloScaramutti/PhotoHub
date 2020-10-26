<template>
  <div>
    <v-app-bar app color="negro" dark height="45rem">
      <div class="d-flex align-center">
        <!--router-link :to="{ name: 'Home' }">
          <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="@/assets/logo-tesis.png"
            transition="scale-transition"
            width="40"
          />
        </router-link-->
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      </div>

      <v-spacer></v-spacer>

      <router-link class="link" :to="{}">
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </router-link>
    </v-app-bar>

    <!------------------------------------------------------------------->

    <v-navigation-drawer v-model="drawer" app temporary color="negro">
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        style="margin: 10px"
      ></v-app-bar-nav-icon>
      <router-link :to="{ name: 'Home' }">
        <v-img src="@/assets/logo-tesis.png" class="logo"></v-img>
      </router-link>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      drawer: null,
      items: [
        { title: "Home", icon: "dashboard" },
        { title: "About", icon: "question_answer" }
      ]
    };
  }
};
</script>

<style scoped>
.link {
  text-decoration: none;
}

.logo {
  margin: 0rem auto 1rem;
  width: 50%;
}
</style>
