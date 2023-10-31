const {createProxyMiddleware} = require("http-proxy-middleware")

/**
 * This is use to proxy call to ogcapi server, the web server is coming from localhost:3000
 * hence if your browser request something not from localhost:3000 orgin check blocked the call.
 *
 * This proxy allow the call to tunnel to our real target.
 *
 * @param app
 */
module.exports = function(app) {
    app.use(
      createProxyMiddleware(
        '/collections',
        {
          target: 'http://ec2-3-24-110-244.ap-southeast-2.compute.amazonaws.com:8081',
          changeOrigin: true,
        })
    );
}
