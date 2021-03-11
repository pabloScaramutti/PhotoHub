import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: "md"
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: "#00b7ff",
        secondary: "#ff8c00",
        accent: "#9c27b0",
        blanco: "#ADB8D6",
        negro: "#1D1F26"
      }
    }
  },
  options: {
    customProperties: true
  }
});
