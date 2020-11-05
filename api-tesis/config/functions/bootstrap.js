'use strict';

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

module.exports = () => {
  var http = require('http').createServer(strapi.server);
  // import socket io
  var io = require('socket.io')(http);

  // listen for user connection
  io.on('connection', function (socket) {
    // send message on user connection
    socket.emit('bienvenida', JSON.stringify({ message: 'Hello food lover' }));
    socket.on('test', data => {
      console.log(data);
      socket.emit('recibido', 1);
    })
    console.log('usser connected');
    // listen for user diconnect
    socket.on('disconnect', () => console.log('a user disconnected'));
  });

  http.listen(3000, () => {
    console.log('listening on *:3000');
  });

  strapi.io = io; // register socket io inside strapi main object to use it globally anywhere
  //cb();*/
};
