const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

//EXIF
const ExifTool = require('exiftool-kit/lib/exiftool-wrapper')

module.exports = {
  async create(ctx) {

    //EXIF
    const exiftool = new ExifTool()

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
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
      //console.log(notificacion);
    } else {
      //console.log('no es multipart')
      entity = await strapi.services.fotos.create(ctx.request.body);
    }
    strapi.io.emit('nuevaFoto', entity);
    return sanitizeEntity(entity, { model: strapi.models.fotos });
  },
};
