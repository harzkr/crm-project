const httpStatus = require('http-status');
const { getConversation, updateConversation } = require('../controllers/conversation.controller');
const { Message } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a message
 * @param {Object} messageBody
 * @returns {Promise<Message>}
 */
const createMessage = async (messageBody) => {
  const conversation = await getConversation(messageBody.conversation)
  if (!conversation) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Conversation not found');
  }

  await updateConversation(conversation._id, { lastMessage: messageBody });
  
  return Message.create(messageBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMessages = async (filter, options) => {
  const messages = await Message.paginate(filter, options);
  return messages;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Message>}
 */
const getMessage = async (id) => {
  return Message.findById(id);
};

module.exports = {
  createMessage,
  queryMessages,
  getMessage,
};