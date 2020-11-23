const ip = require("ip");
const opn = require("opn");
const path = require("path");
const chalk = require("chalk");
const express = require("express");
const proxy = require("http-proxy-middleware");

const server = express();
const rootPath = path.resolve();

const uri = `http://${ip.address()}:5010`;
// server.use('/', express.static(path.join(rootPath, 'webapp')))
server.use(
  "/",
  express.static(path.join(rootPath, "webapp")),
  proxy({
    target: "http://xindaiguanjia-app-prod.itkyd.com",
    changeOrigin: true,
  })
  // proxy({
  //   target: "http://xindaiguanjia-app-dev.itkyd.com",
  //   changeOrigin: true,
  // })
  // proxy({ target: "http://192.168.2.112:8080", changeOrigin: true }) //亚轩
);

server.listen(5010, (error) => {
  if (error) {
    throw error;
  }
  console.log(chalk.green(`Server is running at ${uri}`));
  opn(uri);
});
