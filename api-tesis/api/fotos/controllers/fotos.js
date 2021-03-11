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
        }).then((exif) => {
          data.exif = exif;
        })
      }


      console.log('data', data)
      console.log('files', files)


      entity = await strapi.services.fotos.create(data, { files });
      const notificacion = await strapi.services.notificaciones.create({ foto: entity.id });

      // Video thumbnail
      let videoThumbnail;
      let videoEntity;

      if (files.img && (files.img.type.localeCompare('video/mp4') || files.img.type.localeCompare('video/mov'))) {
        console.log("Hay un video")
        thumbnailData = await this.extractScreenshot(files.img.path, files.img.name)
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

      }
      //console.log(notificacion);
    } else {
      //console.log('no es multipart')
      entity = await strapi.services.fotos.create(ctx.request.body);
    }

    strapi.io.emit('nuevaFoto', entity);
    return sanitizeEntity(entity, { model: strapi.models.fotos });
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
