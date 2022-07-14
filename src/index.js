const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const http = require('http');
const serverInterface = http.createServer(app);
const { Server } = require("socket.io");
const R = require('ramda');

const separator = (fn, msg) => {
  if(!msg){
    return fn;
  }
  return msg + fn;
}

const composedLog = R.compose(console.log, separator);

const io = new Server(serverInterface,{
  cors: {
    origin: process.env.FRONTEND_URL,
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
  composedLog(R.prop('conversationId',socket.handshake.query), 'User connected ');

  socket.on("disconnect", (reason) => {
    composedLog(`User disconnected ${reason}`);
  });
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
