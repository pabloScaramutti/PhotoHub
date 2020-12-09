<template>
  <div class="etiquetas-rapidas">
    <h3>Revisá tus etiquetas rápidas</h3>
    <p>
      Seleccioná las etiquetas que quieras tener a mano cuando recibas una foto.
      Estas son las etiquetas que mas uses o que creas que puedan servir para
      cierta ocación. <br /><br />Podés crear sets de etiquetas para usarlos
      cuando quieras.
    </p>

    <div class="flex">
      <v-autocomplete
        label="Nombre del set"
        prepend-icon="local_offer"
        ref="Nombre del set"
        :items="['Trevor Handsen', 'Alex Nelson']"
        full-width
        hide-details
        hide-no-data
        hide-selected
        single-line
      >
        <template v-slot:append-item>
          <v-btn fab small color="primary" id="add-set"
            ><v-icon>add</v-icon></v-btn
          >
        </template>
      </v-autocomplete>
      <v-icon class="m-left-10">mdi-dots-vertical</v-icon>
    </div>

    <v-chip-group column>
      <v-chip
        v-for="i in 5"
        :key="i"
        class="ma-2"
        close
        color="primary"
        @click:close="chip1 = false"
      >
        Etiqueta {{ i }}
      </v-chip>
    </v-chip-group>

    <v-autocomplete
      label="Buscar etiqueta"
      prepend-icon="search"
      ref="Nombre de la etiqueta"
      :items="['Trevor Handsen', 'Alex Nelson']"
      full-width
      hide-details
      hide-no-data
      hide-selected
      single-line
      clearable
    ></v-autocomplete>

    <div class="grid">
      <v-checkbox
        v-for="i in 37"
        :key="i"
        :label="`Etiqueta ${i}`"
      ></v-checkbox>
    </div>

    <v-btn fab color="primary" class="floating-btn"
      ><v-icon>done</v-icon></v-btn
    >
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.etiquetas-rapidas {
  margin: 1.5rem 1rem;

  .grid {
    margin: 1.5rem 1.5rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, 120px);
    grid-gap: 0px;
    justify-content: space-between;
  }

  .flex {
    display: flex;
    align-items: baseline;
  }

  .m-left-10 {
    margin-left: 10px;
  }
}

#add-set {
  display: flex;
  margin: auto;
}
</style>