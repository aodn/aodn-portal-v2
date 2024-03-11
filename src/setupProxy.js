import * as proxy from "http-proxy-middleware";

/**
 * This is use to proxy call to ogcapi server, the web server is coming from localhost:3000
 * hence if your browser request something not from localhost:3000 orgin check blocked the call.
 *
 * This proxy allow the call to tunnel to our real target but works in dev only, in npm run build,
 * this get disabled. Hence, we have installed ngnix in the docker image to serve the routing
 *
 * @param app
 */
module.exports = function (app) {
  app.use(
    proxy(["/api/v1/ogc/collections", "/api/v1/ogc/tiles"], {
      target: import.meta.env.VITE_API_HOST,
      changeOrigin: true,
    })
  );
};
