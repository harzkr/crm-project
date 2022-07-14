const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const http = require('http');
const serverInterface = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(serverInterface,{
  cors: {
    origin: "http://localhost:3000",
  }
});

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = serverInterface.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

io.on('connection', (socket) => {
  console.log('a user connected',socket.handshake.query);
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});

module.exports.getIO = function(){
  return io;
}
