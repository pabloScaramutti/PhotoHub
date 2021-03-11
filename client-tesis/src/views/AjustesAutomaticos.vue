<template>
  <div class="ajustes-automaticos">
    <h3>Ajustes Automáticos</h3>
    <p>
      Podés programar ajustes automáticos que se aplicarán a las fotos nuevas.
    </p>

    <Search
      label="Nombre de la automatización"
      prependIcon="tune"
      url="/automatizacions"
    />

    <h3 id="automatizaciones-titulo">Automatizaciones</h3>

    <div class="automatizaciones">
      <div
        v-for="(automatization, i) in automatizations"
        :key="i"
        class="auto-item"
      >
        <div class="flex-icons">
          <p>{{ automatization.nombre }}</p>
          <div class="flex-icons">
            <v-icon
              large
              :color="automatization.activa ? 'primary' : 'grey darken-2'"
              @click="automatization.activa = !automatization.activa"
              >{{ automatization.activa ? "toggle_on" : "toggle_off" }}</v-icon
            >
            <v-icon class="m-left-10">mdi-dots-vertical</v-icon>
          </div>
        </div>
        <p class="details">
          <!-- {{ getDate(automatization.inicio) }} -
            {{ getDate(automatization.fin) }} -->
          {{ automatization.descripcion }}
        </p>
      </div>
    </div>

    <v-btn
      :to="{ name: 'NuevaAutomatizacion' }"
      fab
      color="primary"
      class="floating-btn"
    >
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script>
import Search from "@/components/Search";

export default {
  components: {
    Search,
  },

  data() {
    return {
      automatizations: undefined,
    };
  },

  created() {
    this.$http
      .get("/automatizacions")
      .then((r) => (this.automatizations = r.data))
      .catch((e) => console.log(e));
  },

  methods: {
    getDate(d) {
      return d.split("T")[0];
    },
  },
};
</script>

<style lang="scss" scoped>
.ajustes-automaticos {
  margin: 1.5rem 1rem;

  #automatizaciones-titulo {
    margin: 2rem 0 1rem 0;
  }

  .pointer {
    cursor: pointer;
  }

  .automatizaciones {
    .auto-item {
      border-bottom: 1px solid gray;
      padding: 0.5em;
      // display: flex;
      // justify-content: space-between;
      // align-items: center;

      .flex-icons {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .m-left-10 {
        margin-left: 10px;
      }
      p {
        margin: 0;
        font-weight: 400;
      }
      .details {
        font-weight: 100;
        font-size: 0.9em;
      }
    }
  }
  .router-link {
    text-decoration: none;
  }
}
</style>