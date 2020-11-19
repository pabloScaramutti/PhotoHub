const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

//EXIF
const fs = require('fs')
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
      //let img = `public/${entity.img.url}`;

      await getImageWithBuffer(files.img.path)
        .then(buf => {
          return exiftool.getTags({
            source: buf
          })
        })
        .then((exif) => {
          console.log('a ver si esto es lo que me devuelve', exif);
          data.exif = exif;

        })

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


function getImageWithBuffer(img) {
  return new Promise((resolve, reject) => {
    return fs.readFile(img, (err, data) => {
      if (err != null) {
        return reject(new Error(err))
      }

      return resolve(data)
    })
  })
}