const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  async create(ctx) {

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.fotos.create(data, { files });
    } else {
      //console.log('no es multipart')
      entity = await strapi.services.fotos.create(ctx.request.body);
    }
    strapi.io.emit('nuevaFoto', entity);
    return sanitizeEntity(entity, { model: strapi.models.fotos });
  },
};
