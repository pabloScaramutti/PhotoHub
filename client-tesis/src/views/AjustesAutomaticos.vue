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
      :disabled="true"
      v-on:newSugestionList="showAutomatizations = $event"
    />

    <h3 id="automatizaciones-titulo">Automatizaciones</h3>

    <div class="automatizaciones" v-if="showAutomatizations.length">
      <div
        v-for="(automatization, i) in showAutomatizations"
        :key="i"
        class="auto-item"
      >
        <div class="flex-icons">
          <router-link
            class="link"
            :to="`/editar-automatizacion/${automatization.id}`"
          >
            <p>{{ automatization.nombre }}</p>
          </router-link>
          <div class="flex-icons">
            <v-icon
              large
              :color="automatization.activa ? 'primary' : 'grey darken-2'"
              @click="activate(automatization)"
            >
              {{ automatization.activa ? "toggle_on" : "toggle_off" }}
            </v-icon>
            <v-icon class="m-left-10 pointer">mdi-dots-vertical</v-icon>
          </div>
        </div>
        <p class="details">
          <span v-if="automatization.inicio && !automatization.fin"
            >Dia:
            {{ automatization.inicio && getDate(automatization.inicio) }}
          </span>
          <span v-if="automatization.inicio && automatization.fin"
            >Rango: Desde
            {{ automatization.inicio && getDate(automatization.inicio) }} -
            Hasta {{ automatization.fin && getDate(automatization.fin) }}</span
          >
          <span
            v-if="
              !automatization.inicio &&
              !automatization.fin &&
              automatization.multipleDate
            "
            >Multiple</span
          >
          <span
            v-if="
              !automatization.inicio &&
              !automatization.fin &&
              !automatization.multipleDate
            "
            >Siempre</span
          >
          {{ automatization.descripcion }}
        </p>
      </div>
    </div>
    <p v-else>No hay automatizaciones registradas</p>

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
      showAutomatizations: [],
    };
  },

  methods: {
    getDate(d) {
      return d.split("T")[0];
    },

    activate(e) {
      e.activa = !e.activa;

      this.$http
        .put(`/automatizacions/${e.id}`, { activa: e.activa })
        .then((r) => console.log("Se activo la automatizacion", r))
        .catch((e) => console.log("No se pudo activar la automatizacion", e));

      if (e.activa) {
        this.showAutomatizations.forEach((a) => {
          if (a == e || !a.activa) return;
          a.activa = false;
        });
      }
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
  .link {
    color: inherit;
    text-decoration: none;
  }
  .pointer {
    cursor: pointer;
  }
}
</style>