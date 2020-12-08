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
      <v-text-field
        prepend-icon="local_offer"
        label="Agregar etiquetas"
        v-model="nuevaCarpeta.etiquetas"
        type="text"
      />
      <h2>Agregue fotos a la carpeta</h2>
      <v-text-field
        prepend-icon="search"
        label="Filtrar fotos por..."
        v-model="nuevaCarpeta.nombre"
        type="text"
      />
    </form>
    <GrillaFotos :imagenes="imagenes" :selectable="true"></GrillaFotos>

    <v-btn @click="createFolder()" fab color="primary" class="floating-btn"
      ><v-icon>done</v-icon></v-btn
    >
  </div>
</template>

<script>
import GrillaFotos from "@/components/GrillaFotos_masonry";

import Axios from "axios";

export default {
  name: "NuevaCarpeta",
  components: {
    GrillaFotos,
  },
  data() {
    return {
      nuevaCarpeta: {
        nombre: "",
        etiquetas: [],
        fotos: [],
      },
      imagenes: [
        require("@/assets/Media/DSC_0615.jpg"),
        require("@/assets/Media/DSC_0171.jpg"),
        require("@/assets/Media/DSC_0288.jpg"),
        require("@/assets/Media/DSC_0294.jpg"),
        require("@/assets/Media/DSC_0338.jpg"),
        require("@/assets/Media/DSC_0342.jpg"),
        require("@/assets/Media/DSC_0353.jpg"),
        require("@/assets/Media/DSC_0362.jpg"),
        require("@/assets/Media/DSC_0370.jpg"),
        require("@/assets/Media/DSC_0373.jpg"),
        require("@/assets/Media/DSC_0374.jpg"),
        require("@/assets/Media/DSC_0380.jpg"),
        require("@/assets/Media/DSC_0397.jpg"),
        require("@/assets/Media/DSC_0423.jpg"),
        require("@/assets/Media/DSC_0449.jpg"),
      ],
      im: [],
      alert: { state: false, message: "Ocurrio un error", type: "error" },
    };
  },

  /*watch: {
    im: function () {
      this.im.forEach((item) => console.log("tipo de imagen", item.type));
      console.log(this.im.filter((item) => item.type === "image/NEF"));
    },
  },*/

  methods: {
    createFolder() {
      if (this.nuevaCarpeta.nombre != "") {
        const data = new FormData();
        const info = {
          nombre: this.nuevaCarpeta.nombre,
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
            this.alert.message = "Ocurrio un error";
          });
      } else {
        this.nuevaCarpeta.nombre = "";
        this.alert.state = true;
        this.alert.message = "Agregar un nombre a la carpeta";
        this.$refs.nombreCarpeta.focus();
      }
    },

    async nuevaFoto() {
      const data = new FormData();
      const info = {
        nombre: this.im[0].name,
        puntuacion: 0,
      };

      data.append(
        "files.img",
        this.im.filter((item) => item.type === "image/NEF")[0]
      );
      data.append(
        "files.thumbnail",
        this.im.filter((item) => item.type === "image/jpeg")[0]
      );
      data.append("data", JSON.stringify(info));

      await Axios({
        method: "POST",
        url: "http://192.168.0.123:1337/fotos",
        data,
      })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
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

.floating-btn {
  position: fixed;
  bottom: 80px;
  right: 5vw;
}
</style>
