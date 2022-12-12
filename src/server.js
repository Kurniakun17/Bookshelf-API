// eslint-disable-next-line import/no-unresolved
const Hapi = require('@hapi/hapi');
const routes = require('./routes');
/* eslint-disable no-console */

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route(routes);

  await server.start();

  console.log(`server berjalan pada ${server.info.uri}`);
};

init();
