const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { messageService } = require('../services');
const theServer = require('.././index.js');

const createMessage = catchAsync(async (req, res) => {
  const iovar = theServer.getIO();

  const message = await messageService.createMessage(req.body);
  
  iovar.emit(req.body.conversation, 'fetch');
  res.status(httpStatus.CREATED).send(message);
});

const getMessages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['conversation']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  options.sortBy = 'createdAt:desc';
  const result = await messageService.queryMessages(filter, options);
  res.send(result);
});

const getMessage = catchAsync(async (req, res) => {
  const message = await messageService.getMessage(req.params.messageId);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, 'message not found');
  }
  res.send(message);
});

const updateMessage = catchAsync(async (req, res) => {
  const message = await messageService.updateMessage(req.params.messageId, req.body);
  res.send(message);
});

const deleteMessage = catchAsync(async (req, res) => {
  await messageService.deleteMessage(req.params.messageId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
};
