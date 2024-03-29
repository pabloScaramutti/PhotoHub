const { parseMultipartData, sanitizeEntity } = require('strapi-utils');
const axios = require('axios');

const url = require('url');

//Video thumbnail
const { promisify } = require('util');
const exec = promisify(require("child_process").exec);

//EXIF
const ExifTool = require('exiftool-kit/lib/exiftool-wrapper');
const automatizacion = require('../../automatizacion/controllers/automatizacion');

module.exports = {
  async create(ctx) {


    //EXIF
    const exiftool = new ExifTool()

    console.log("contexto:", ctx)

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      console.log("video:", files.img)
      //entity = await strapi.services.fotos.create(data, { files });

      //Reading EXIF data
      const exifPath = (files.img ? files.img.path : (files.thumbnail ? files.thumbnail.path : null));

      if (exifPath) {
        await exiftool.getTags({
          source: exifPath
        }).then(async (exif) => {
          data.exif = exif;
          if (data.exif.FileTypeExtension && data.exif.FileTypeExtension.toLowerCase() === 'nef' && data.exif.Orientation !== 'Horizontal (normal)') {
            let width = data.exif.ImageWidth;
            data.exif.ImageWidth = data.exif.ImageHeight;
            data.exif.ImageHeight = width;
          }
          if (files.img && exifPath === files.img.path)
            files.img.type = data.exif.MIMEType;
          if (files.thumbnail && exifPath === files.thumbnail.path)
            files.thumbnail.type = data.exif.MIMEType;
          else if (files.thumbnail) {
            await exiftool.getTags({
              source: files.thumbnail.path
            }).then(r => files.thumbnail.type = r.MIMEType).catch("No se pudo encontrar el MIMEType")
          }
        })
      }


      //console.log('data', data)
      //console.log('files', files)

      const automatizaciones = await strapi.services.automatizacion.find({ activa: true });
      console.log(automatizaciones);
      if (automatizaciones.length) {
        const unifyTaggList = [];
        automatizaciones.forEach(currentValue => unifyTaggList.push(...currentValue.etiquetas.map(e => e.id)));
        const removeDuplicates = [...new Set(unifyTaggList)];
        data.etiquetas = removeDuplicates;
        data.carpeta = automatizaciones[0].carpeta || undefined;
        if (automatizaciones[0].GPSPosition && !data.exif.GPSPosition) {
          console.log("Puse los datos de GPS de la automatizacion");
          data.exif.GPSPosition = automatizaciones[0].GPSPosition;
          data.exif.GPSLatitude = automatizaciones[0].GPSLatitude;
          data.exif.GPSLongitude = automatizaciones[0].GPSLongitude;
        }

        if (automatizaciones[0].color) {
          data.color = automatizaciones[0].color;
        }
      }

      //agregar etiquetas de color; carpetas; Decidir si hay varias automatizaciones activas que pasa


      entity = await strapi.services.fotos.create(data, { files });
      const notificacion = await strapi.services.notificaciones.create({ foto: entity.id });
      strapi.io.emit('nuevaFoto', entity);

      // Video thumbnail
      let videoThumbnail;
      let videoEntity;

      if (files.img && (files.img.type.localeCompare('video/mp4') == 0 || files.img.type.localeCompare('video/mov') == 0)) {
        console.log("Hay un video")
        thumbnailData = await this.extractScreenshot(files.img.path, files.img.name);
        videoThumbnail = await strapi.plugins.upload.services.upload.upload(
          {
            data: { fileInfo: {} }, files: {
              path: thumbnailData.URL,
              name: `${thumbnailData.name}.jpg`,
              type: 'image/jpg',
              size: 10000,
            }
          }
        )
        console.log("videoThumbnail", videoThumbnail);
        console.log("video thumbnail id", videoThumbnail[0].id);
        videoEntity = await strapi.services.fotos.update({ id: entity.id }, { thumbnail: videoThumbnail[0].id })
        console.log("VIDEO ENTITYYYYYYYYYYYYYYYYYYYYY", videoEntity);

      } else {


        let update = await this.createOrUpdateServiceItem("iso", entity, { valor: entity.exif.ISO.toString() }, { valor: entity.exif.ISO.toString(), fotos: [entity.id] });

        update = await this.createOrUpdateServiceItem("aperturas", entity, { valor: entity.exif.Aperture.toString() }, { valor: entity.exif.Aperture.toString(), fotos: [entity.id] });

        update = await this.createOrUpdateServiceItem("obturacion", entity, { valor: entity.exif.ShutterSpeed.toString() }, { valor: entity.exif.ShutterSpeed.toString(), fotos: [entity.id] });

        await this.getGeoposition(entity).then(r => console.log("Pude hacer la geoposition", r)).catch(e => console.log("no pude hacer la geoposition", e))

      }
    } else {
      entity = await strapi.services.fotos.create(ctx.request.body);
    }


    return sanitizeEntity(entity, { model: strapi.models.fotos });


  },

  async getGeoposition(imagen) {
    if (imagen.exif.GPSPosition) {
      await axios.get(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${this.getImgLat(imagen)}&longitude=${this.getImgLong(imagen)}&localityLanguage=es`
      )
        .then(async (r) => {
          let ubicacion = {
            localidad: r.data.locality,
            ciudad: r.data.city,
            provincia: r.data.principalSubdivision,
            pais: r.data.countryName,
          };

          console.log("ubicacion", ubicacion)

          let nombre = `${ubicacion.localidad}, ${ubicacion.ciudad}, ${ubicacion.provincia}, ${ubicacion.pais}`;

          await this.createOrUpdateServiceItem("ubicacion", imagen, { nombre: nombre }, { nombre: nombre, fotos: [imagen.id] }).then(r => console.log("Se creo o actualizo la ubicacion", r)).catch(e => console.log("aca se produjo un error", e));

        })
        .catch((e) => console.log(e));
    }
  },

  getImgLat(imagen) {
    if ("GPSLatitude" in imagen.exif) {
      let lat = imagen.exif.GPSLatitude.split(" ");
      lat[1] == "S" ? (lat[0] *= -1) : "";
      return lat[0];
    } else {
      return undefined;
    }
  },
  getImgLong(imagen) {
    if ("GPSLongitude" in imagen.exif) {
      let long = imagen.exif.GPSLongitude.split(" ");
      long[1] == "W" ? (long[0] *= -1) : "";
      return long[0];
    } else {
      return undefined;
    }
  },

  async createOrUpdateServiceItem(service, entity, compareValue, newObjectData) {
    //new object data es para crear un objeto para darle valor a cada propiedad; lo tuve que incluir cuando 
    //implemente la ubicacion que funciona distinto que el iso, la apertura, la obturacion
    let exist = await strapi.services[service].findOne(compareValue);
    if (exist) {
      exist.fotos.push(entity);
      return await strapi.services[service].update({ id: exist.id }, { fotos: exist.fotos.map(e => e.id) });
    } else {
      console.log("Valor nuevo", newObjectData);
      return await strapi.services[service].create(newObjectData);
    }
  },

  async extractScreenshot(inputURL, videoName) {

    let output = `/tmp/${videoName.split('.')[0]}_${inputURL.split('_')[1]}.jpg`;
    //let output = `/home/pi/Documents/Tesis/tesis/${videoName.split('.')[0]}_${inputURL.split('_')[1]}.jpg`;

    console.log(output, inputURL);

    const data = await exec(`ffmpeg -ss 0 -i ${inputURL} -vframes 1 ${output}`);
    console.log(data);
    return { URL: output, name: videoName.split('.')[0] };
  },

  //UPDATE---------------------------------------------------------
  async update(ctx) {
    console.log("EL METODO UPDATE CUSTOM", ctx.params)
    const { id } = ctx.params;

    let entity;
    if (ctx.is('multipart')) {
      console.log('es multipart')
      const { data, files } = parseMultipartData(ctx);

      if ('exif.GPSPosition' in data) {
        console.log('Existe')
        let img = await strapi.services.fotos.findOne({ id: id });
        this.getGeoposition(img)
      }

      entity = await strapi.services.fotos.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.fotos.update({ id }, ctx.request.body);

      if ('exif.GPSPosition' in ctx.request.body) {
        console.log('Existe')
        this.getGeoposition(entity)
      }
    }

    return sanitizeEntity(entity, { model: strapi.models.fotos });
  },

};
