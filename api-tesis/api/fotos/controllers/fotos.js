const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

const url = require('url');

//Video thumbnail
const { promisify } = require('util');
const exec = promisify(require("child_process").exec);

//EXIF
const ExifTool = require('exiftool-kit/lib/exiftool-wrapper')

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
          else {
            await exiftool.getTags({
              source: files.thumbnail.path
            }).then(r => files.thumbnail.type = r.MIMEType).catch("No se pudo encontrar el MIMEType")
          }
        })
      }


      console.log('data', data)
      console.log('files', files)


      entity = await strapi.services.fotos.create(data, { files });
      const notificacion = await strapi.services.notificaciones.create({ foto: entity.id });

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
        // If not video create search parameters
        let update = await this.createOrUpdateServiceItem("iso", entity, entity.exif.ISO.toString());
        console.log("ISO", update);

        update = await this.createOrUpdateServiceItem("aperturas", entity, entity.exif.Aperture.toString());
        console.log("Apertura", update);

        update = await this.createOrUpdateServiceItem("obturacion", entity, entity.exif.ShutterSpeed.toString());
        console.log("Obturador", update);

      }
      //console.log(notificacion);
    } else {
      //console.log('no es multipart')
      entity = await strapi.services.fotos.create(ctx.request.body);
    }

    strapi.io.emit('nuevaFoto', entity);
    return sanitizeEntity(entity, { model: strapi.models.fotos });
  },


  async createOrUpdateServiceItem(service, entity, compareValue) {
    let exist = await strapi.services[service].findOne({ valor: compareValue });
    if (exist) {
      exist.fotos.push(entity);
      return await strapi.services[service].update({ id: exist.id }, { fotos: exist.fotos.map(e => e.id) });
    } else {
      console.log("Valor nuevo");
      return await strapi.services[service].create({ valor: compareValue, fotos: entity.id });
    }
  },

  async extractScreenshot(inputURL, videoName) {

    let output = `/tmp/${videoName.split('.')[0]}_${inputURL.split('_')[1]}.jpg`;
    //let output = `/home/pi/Documents/Tesis/tesis/${videoName.split('.')[0]}_${inputURL.split('_')[1]}.jpg`;

    console.log(output, inputURL);

    const data = await exec(`ffmpeg -ss 0 -i ${inputURL} -vframes 1 ${output}`);
    console.log(data);
    return { URL: output, name: videoName.split('.')[0] };
  }
};
