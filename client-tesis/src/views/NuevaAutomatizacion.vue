<template>
  <div class="nueva-automatizacion">
    <h3>Nueva Automatización</h3>
    <v-text-field
      v-model="automatizacion.nombre"
      prepend-icon="tune"
      label="Nombre del ajuste"
      type="text"
      autocomplete="off"
    />

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
        <v-radio-group v-model="datePickerType">
          <v-radio label="Siempre" value="siempre" />
          <v-radio label="Unico" value="unico" />
          <v-radio label="Rango" value="rango" />
          <v-radio label="Multiple" value="multiple" />
        </v-radio-group>
        <v-date-picker
          v-if="datePickerType !== 'siempre'"
          v-model="date"
          no-title
          scrollable
          :range="datePickerType === 'rango'"
          :multiple="datePickerType === 'multiple'"
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
          <v-btn text color="primary" @click="$refs.menu.save(date)">
            OK
          </v-btn>
        </v-date-picker>
      </div>
    </v-menu>

    <Search
      v-on:item-created="addTag($event)"
      v-on:item-selected="addSearchTag($event)"
      url="/etiquetas"
      label="Búsqueda de etiquetas"
      prependIcon="local_offer"
      :clearBeforeSelect="true"
    />

    <v-chip
      v-for="(tag, index) in automatizacion.etiquetas"
      :key="index"
      close
      @click:close="removeTag(index)"
      class="m-top-10px m-right-10px"
      color="primary"
    >
      {{ tag.nombre }}
    </v-chip>

    <color-tag-picker
      class="color-picker"
      :initialValue="automatizacion.color"
      v-on:colorSelected="handlerColorSelected($event)"
    />

    <v-autocomplete
      v-model="automatizacion.carpeta"
      label="Carpeta"
      :items="carpetas"
      item-text="nombre"
      hide-selected
      chips
      prepend-icon="folder"
      url="/carpetas"
      return-object
    />

    <div class="floating-btn done-confirm-btn-container">
      <v-btn
        :to="{ name: 'AjustesAutomaticos' }"
        class="m-bottom-10"
        fab
        small
        color="red"
        ><v-icon>clear</v-icon></v-btn
      >
      <v-btn
        fab
        color="primary"
        @click="createOrUpdate()"
        :loading="loadingDoneBtn"
        ><v-icon>done</v-icon></v-btn
      >
    </div>

    <div class="mapa">
      <Mapa
        :lat="automatizacion.GPSLatitude"
        :long="automatizacion.GPSLongitude"
        v-on:changeLocation="handlerChangeLocation($event)"
      ></Mapa>
    </div>

    <div class="height-surpase"></div>
  </div>
</template>

<script>
import Search from "@/components/Search";
import Mapa from "@/components/Mapa";
import ColorTagPicker from "@/components/ColorTagPicker";
import formatGPS from "@/helpers/formatGPS.js";

export default {
  name: "NuevaAutomatizacion",
  components: {
    Search,
    Mapa,
    ColorTagPicker,
  },

  data() {
    return {
      automatizacion: {
        nombre: "",
        etiquetas: [],
        carpeta: undefined,
        GPSPosition: undefined,
        GPSLatitude: undefined,
        GPSLongitude: undefined,
        color: undefined,
      },

      date: undefined,
      menu: false,
      datePickerType: "siempre",
      loadingDoneBtn: false,
      carpetas: undefined,
    };
  },

  created() {
    if (this.$route.path.includes("editar-automatizacion")) {
      this.$http
        .get(`/automatizacions/${this.$route.path.split("/")[2]}`)
        .then((r) => {
          this.automatizacion = r.data;
          if (this.automatizacion.dateType === "unico") {
            this.datePickerType = "unico";
            this.date = this.automatizacion.inicio.split("T")[0];
          } else if (this.automatizacion.dateType === "rango") {
            this.datePickerType = "rango";
            this.date = [
              this.automatizacion.inicio.split("T")[0],
              this.automatizacion.fin.split("T")[0],
            ];
          } else if (this.automatizacion.dateType === "multiple") {
            this.datePickerType = "multiple";
            this.date = JSON.parse(this.automatizacion.multipleDate);
          } else {
            this.datePickerType = "siempre";
          }
        })
        .catch((e) => console.log("No se pudo cargar la automatizacion", e));
    }

    this.loadFolders();
  },

  methods: {
    loadFolders() {
      this.$http
        .get("carpetas")
        .then((r) => (this.carpetas = r.data))
        .catch((e) => console.log("Fallo la carga de las carpetas", e));
    },

    removeTag(index) {
      this.automatizacion.etiquetas.splice(index, 1);
    },

    addTag(e) {
      let exist = this.existInArrayById(this.automatizacion.etiquetas, e);

      if (exist !== -1) {
        this.removeTag(exist);
      } else {
        this.automatizacion.etiquetas.push(e);
      }
    },

    addSearchTag(e) {
      if (this.existInArrayById(this.automatizacion.etiquetas, e) == -1)
        this.automatizacion.etiquetas.push(e);
    },

    existInArrayById(array, tag) {
      let exist = -1;

      array.forEach((elem, i) => {
        if (elem.id == tag.id) exist = i;
      });

      return exist;
    },

    createOrUpdate() {
      if (this.$route.path.includes("crear-automatizacion")) {
        this.createAutomatization();
      } else {
        this.updateAutomatizacion();
      }
    },

    dateForSend_Inicio() {
      return this.datePickerType === "unico" || this.datePickerType === "rango"
        ? Array.isArray(this.date)
          ? this.date[0]
          : this.date
        : undefined;
    },

    dateForSend_Fin() {
      return this.datePickerType === "rango" && Array.isArray(this.date)
        ? this.date[1]
        : undefined;
    },

    dateForSend_Multiple() {
      return this.datePickerType === "multiple"
        ? JSON.stringify(this.date)
        : undefined;
    },

    sendingObject() {
      return {
        id: this.automatizacion.id,
        nombre: this.automatizacion.nombre,
        inicio: this.dateForSend_Inicio(),
        fin: this.dateForSend_Fin(),
        multipleDate: this.dateForSend_Multiple(),
        etiquetas: this.automatizacion.etiquetas.map((e) => e.id),
        dateType: this.datePickerType,
        carpeta: this.automatizacion.carpeta.id,
        GPSLatitude: this.automatizacion.GPSLatitude,
        GPSLongitude: this.automatizacion.GPSLongitude,
        GPSPosition: this.automatizacion.GPSPosition,
        color: this.automatizacion.color.id,
        activa: true,
      };
    },

    createAutomatization() {
      this.loadingDoneBtn = true;

      this.$http
        .post("/automatizacions", this.sendingObject())
        .then((r) => {
          console.log("Se creó la automatización", r);
          this.loadingDoneBtn = false;
          this.$router.push({ name: "AjustesAutomaticos" });
        })
        .catch((e) => {
          console.log("Hubo un error creando la automatización", e);
          this.loadingDoneBtn = false;
        });
    },

    updateAutomatizacion() {
      this.loadingDoneBtn = true;

      this.$http
        .put(`/automatizacions/${this.automatizacion.id}`, this.sendingObject())
        .then((r) => {
          console.log("Se actualizo la automatizacion", r);
          this.loadingDoneBtn = false;
          this.$router.push({ name: "AjustesAutomaticos" });
        })
        .catch((e) =>
          console.log("Ocurrio un error actualizando la automatizacion", e)
        );
    },

    handlerChangeLocation(evento) {
      console.log(evento, evento.lat, evento.lng);
      this.automatizacion.GPSLatitude = formatGPS.formatLat(evento.lat);
      this.automatizacion.GPSLongitude = formatGPS.formatLng(evento.lng);
      this.automatizacion.GPSPosition = formatGPS.formatGPSPosition(
        evento.lat,
        evento.lng
      );
    },

    handlerColorSelected(evento) {
      this.automatizacion.color = evento;
    },
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

.mapa {
  width: 100%;
  height: 500px;
}

.color-picker {
  margin: 40px 0;
}

.height-surpase {
  height: 25vh;
}
</style>