'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {

  async update(ctx) {
    const { id } = ctx.params;
    let entity;

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);

      entity = await strapi.services.automatizacion.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.automatizacion.update({ id }, ctx.request.body);
      let allAutomatizations = await strapi.services.automatizacion.find();

      allAutomatizations.forEach(e => {
        if (e.id == entity.id) return;
        strapi.services.automatizacion.update({ id: e.id }, { activa: false })
      });
    }

    return sanitizeEntity(entity, { model: strapi.models.fotos });
  },


};
