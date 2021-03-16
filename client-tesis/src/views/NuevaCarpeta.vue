<template>
  <div>
    <v-file-input
      v-model="im"
      show-size
      multiple
      small-chips
      accept="image/png, image/jpeg, image/bmp, video/mp4, video/mov"
      placeholder="Pick an avatar"
      prepend-icon="mdi-camera"
      label="Avatar"
    ></v-file-input>

    <p>{{ loadingProgress }}%</p>
    <v-progress-linear
      v-if="uploadingFile"
      v-model="loadingProgress"
      color="primary"
      rounded
    >
    </v-progress-linear>

    <v-btn @click="nuevaFoto()">Crear</v-btn>

    <form action="" class="formulario-nueva-carpeta">
      <h1>Nuevo Album</h1>
      <v-alert v-model="alert.state" dense :type="alert.type" dismissible>
        {{ alert.message }}
      </v-alert>
      <v-text-field
        ref="nombreCarpeta"
        prepend-icon="create_new_folder"
        label="Nombre de carpeta..."
        v-model="nuevaCarpeta.nombre"
        type="text"
      />

      <Search
        v-on:item-created="taggSelected"
        v-on:item-selected="taggSelected"
        url="/etiquetas"
        label="Buscar una etiqueta"
      />

      <v-chip-group column>
        <v-chip
          v-for="(tagg, i) in nuevaCarpeta.etiquetas"
          :key="i"
          close
          color="primary"
          @click:close="nuevaCarpeta.etiquetas.splice(i, 1)"
        >
          {{ tagg.nombre }}
        </v-chip>
      </v-chip-group>

      <h2>Agregue fotos a la carpeta</h2>
      <v-text-field
        prepend-icon="search"
        label="Filtrar fotos por..."
        v-model="nuevaCarpeta.nombre"
        type="text"
      />
    </form>
    <GrillaFotos
      v-on:selectedPhotos="getSelectedImages"
      :imagenes="imagenes"
      :selectable="true"
    ></GrillaFotos>

    <v-btn @click="createFolder()" fab color="primary" class="floating-btn">
      <v-icon>done</v-icon>
    </v-btn>
  </div>
</template>

<script>
import GrillaFotos from "@/components/GrillaFotos_justifiedLayout";
import Search from "../components/Search";

export default {
  name: "NuevaCarpeta",
  components: {
    GrillaFotos,
    Search,
  },
  data() {
    return {
      nuevaCarpeta: {
        nombre: "",
        etiquetas: [],
        fotos: [],
      },
      imagenes: undefined,
      im: [],
      alert: { state: false, message: "Ocurrio un error", type: "error" },
      uploadingFile: false,
      loadingProgress: 0,
    };
  },

  created() {
    this.$http
      .get("/fotos?_sort=created_at:DESC")
      .then((response) => {
        this.imagenes = response.data;
      })
      .catch((error) => {
        console.log("Error al cargar las imagenes", error);
      });
  },

  /*watch: {
    im: function () {
      this.im.forEach((item) => console.log("tipo de imagen", item.type));
      console.log(this.im.filter((item) => item.type === "image/NEF"));
    },
  },*/

  methods: {
    getSelectedImages(e) {
      this.nuevaCarpeta.fotos = e;
    },

    taggSelected(e) {
      this.nuevaCarpeta.etiquetas.push({ id: e.id, nombre: e.nombre });
    },

    createFolder() {
      if (this.nuevaCarpeta.nombre != "") {
        const data = new FormData();
        const info = {
          nombre: this.nuevaCarpeta.nombre,
          fotos: this.nuevaCarpeta.fotos,
          etiquetas: this.nuevaCarpeta.etiquetas.map((e) => e.id),
        };

        data.append("data", JSON.stringify(info));

        this.$http
          .post("/carpetas", data)
          .then((response) => {
            console.log("Folder created:", response);
            this.alert.state = true;
            this.alert.type = "success";
            this.alert.message =
              "Se creo la carpeta '" + this.nuevaCarpeta.nombre + "'";
          })
          .catch((error) => {
            console.log("Error ocurred when creating the folder:", error);
            this.nuevaCarpeta.nombre = "";
            this.alert.state = true;
            this.alert.type = "error";
            this.alert.message = "Ocurrio un error";
          });
      } else {
        this.nuevaCarpeta.nombre = "";
        this.alert.state = true;
        this.alert.type = "error";
        this.alert.message = "Agregar un nombre a la carpeta";
        this.$refs.nombreCarpeta.focus();
      }
    },

    async nuevaFoto() {
      const options = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          let percent = Math.floor((loaded * 100) / total);
          console.log(`${loaded}kb of ${total}kb | ${percent}%`);

          if (percent < 100) {
            this.loadingProgress = percent;
          }
        },
      };

      const data = new FormData();
      const info = {
        nombre: this.im[0] ? this.im[0].name : this.im[1].name,
        puntuacion: 0,
      };

      data.append(
        "files.img",
        this.im.filter(
          (item) =>
            item.type === "image/NEF" ||
            item.type === "video/mp4" ||
            item.type === "video/mov"
        )[0]
      );
      data.append(
        "files.thumbnail",
        this.im.filter(
          (item) =>
            item.type === "image/jpeg" ||
            item.type === "image/png" ||
            item.type === "image/jpg"
        )[0]
      );
      data.append("data", JSON.stringify(info));

      this.uploadingFile = true;

      console.log("Lo que va a mandar", data);

      this.$http
        .post("http://192.168.0.123:1337/fotos", data, options)
        .then((response) => {
          console.log(response);
          this.imagenes.push(response.data);
          this.uploadingFile = false;
        })
        .catch((error) => {
          console.log(error);
          this.uploadingFile = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.formulario-nueva-carpeta {
  width: 100%;
  padding: 0 3vw;
}
</style>
