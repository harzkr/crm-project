const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { conversationService } = require('../services');

const createConversation = catchAsync(async (req, res) => {
  const conversation = await conversationService.createConversation(req.body);
  res.status(httpStatus.CREATED).send(conversation);
});

const getConversations = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await conversationService.queryConversations(filter, options);
  res.send(result);
});

const getConversation = catchAsync(async (req, res) => {
  const conversation = await conversationService.getConversation(req.params.conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  res.send(conversation);
});

const updateConversation = catchAsync(async (req, res) => {
  const conversation = await conversationService.updateConversation(req.params.conversationId, req.body);
  res.send(conversation);
});

const deleteConversation = catchAsync(async (req, res) => {
  await conversationService.deleteConversation(req.params.conversationId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createConversation,
  getConversations,
  getConversation,
  updateConversation,
  deleteConversation,
};
