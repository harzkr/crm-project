const httpStatus = require('http-status');
const { Conversation } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a conversation
 * @param {Object} conversationBody
 * @returns {Promise<Conversation>}
 */
const createConversation = async (conversationBody) => {
  return Conversation.create(conversationBody);
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
const queryConversations = async (filter, options) => {
  const conversations = await Conversations.paginate(filter, options);
  return conversations;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getConversation = async (id) => {
  return Conversation.findById(id);
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateConversation = async (conversationId, updateBody) => {
  const conversation = await getConversation(conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  if (!updateBody.lastMessage) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No last message update sent');
  }
  conversation.lastMessage = updateBody.lastMessage;
  await conversation.save();
  return conversation;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteConversation = async (conversationId) => {
  const conversation = await getConversation(conversationId);
  if (!conversation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Conversation not found');
  }
  await conversation.remove();
  return conversation;
};

module.exports = {
  createConversation,
  queryConversations,
  getConversation,
  updateConversation,
  deleteConversation,
};