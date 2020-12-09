<template>
  <div class="nueva-automatizacion">
    <h3>Nueva Automatización</h3>
    <v-text-field prepend-icon="tune" label="Nombre del ajuste" type="text" />

    <v-menu
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      :return-value.sync="date"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="date"
          label="Picker in menu"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>
      <div class="background-solid">
        <v-checkbox label="Siempre" />
        <v-checkbox label="Rango" />
        <v-date-picker v-model="date" no-title scrollable>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(date)">
            OK
          </v-btn>
        </v-date-picker>
      </div>
    </v-menu>

    <v-autocomplete
      label="Etiquetas"
      prepend-icon="local_offer"
      :items="['Trevor Handsen', 'Alex Nelson']"
      full-width
      hide-details
      hide-no-data
      hide-selected
      multiple
      chips
      deletable-chips
    ></v-autocomplete>

    <v-autocomplete
      label="Carpeta"
      prepend-icon="folder"
      :items="['Trevor Handsen', 'Alex Nelson']"
      full-width
      hide-details
      hide-no-data
      hide-selected
      multiple
      chips
      deletable-chips
    ></v-autocomplete>

    <v-btn fab class="floating-btn" color="primary"
      ><v-icon>done</v-icon></v-btn
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: undefined,
      menu: false,
    };
  },
};
</script>

<style lang="scss" scoped>
.nueva-automatizacion {
  margin: 1.5rem 1rem;
}

.background-solid {
  background-color: #1e1e1e;
  padding: 5px;
}
</style>