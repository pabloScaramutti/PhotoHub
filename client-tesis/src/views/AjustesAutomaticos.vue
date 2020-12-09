<template>
  <div class="ajustes-automaticos">
    <h3>Ajustes Automáticos</h3>
    <p>
      Podés programar ajustes automáticos que se aplicarán a las fotos nuevas.
    </p>

    <v-autocomplete
      label="Nombre de la automatización"
      prepend-icon="tune"
      ref="Nombre de la automatización"
      :items="['Trevor Handsen', 'Alex Nelson']"
      full-width
      hide-details
      hide-no-data
      hide-selected
      single-line
    ></v-autocomplete>

    <div id="automatizaciones-titulo">
      <h3>Automatizaciones</h3>
      <router-link class="router-link" :to="{ name: 'NuevaAutomatizacion' }">
        <h3 class="pointer">+</h3>
      </router-link>
    </div>
    <div class="automatizaciones">
      <div v-for="i in 5" :key="i" class="auto-item">
        <div>
          <p>Automatización {{ i }}</p>
          <p class="details">29/10/20 - Siempre</p>
        </div>
        <div class="flex-icons">
          <v-icon large>toggle_on</v-icon>
          <v-icon class="m-left-10">mdi-dots-vertical</v-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.ajustes-automaticos {
  margin: 1.5rem 1rem;

  #automatizaciones-titulo {
    margin: 2rem 0 1rem 0;
    display: flex;
    justify-content: space-between;
  }

  .pointer {
    cursor: pointer;
  }

  .automatizaciones {
    .auto-item {
      border-bottom: 1px solid gray;
      padding: 0.5em;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .flex-icons {
        display: flex;
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