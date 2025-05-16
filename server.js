const app = require("./app");

const http = require("http");
const config = require("./config/config");


const httpServer = http.createServer(app);

const server = httpServer.listen(config.env.port, () => {
  console.log(`Server is running on port ${config.env.port}`);
});