const httpStatus = require('http-status');
const { User, Conversation, Message } = require('../models');
const ApiError = require('../utils/ApiError');
const { faker } = require('@faker-js/faker');
const _ = require('lodash');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
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
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const usersAndConversations = async (email, options) => {
  //console.log('checking for matches in', email);
  const aggregate = User.aggregate([
    {
      $match: { email: { $ne: email } },
    },
    {
      $lookup: {
        from: 'conversations',
        let: { checkerEmail: '$email' },
        pipeline: [
          {
            $project: {
              firstUser: { $arrayElemAt: ['$participants', 0] },
              secondUser: { $arrayElemAt: ['$participants', 1] },
              lastMessage: '$lastMessage',
            },
          },
          {
            $match: {
              $expr: {
                $or: [
                  { $and: [{ $eq: ['$firstUser.email', email] }, { $eq: ['$secondUser.email', '$$checkerEmail'] }] },
                  { $and: [{ $eq: ['$firstUser.email', '$$checkerEmail'] }, { $eq: ['$secondUser.email', email] }] },
                ],
              },
            },
          },
        ],
        as: 'conversations',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        conversations: 1,
        conv_count: { $size: '$conversations' },
      },
    },
    {
      $sort: { conv_count: -1 },
    },
  ]);

  const results = await User.aggregatePaginate(aggregate, options);

  return results;
};

const createMockUsers = () => {
  for (let i = 0; i < 100; i++) {
    const _user = {
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      email: faker.internet.email(),
      password: 'ae234567890',
    };
    try {
      createUser(_user);
    } catch (e) {
      console.log(e);
    }
  }
};

const generalDataUsers = async (options) => {
  const aggregate = User.aggregate([
    {
      $match: {},
    },
    {
      $lookup: {
        from: 'conversations',
        let: { checkerEmail: '$email' },
        pipeline: [{ $match: { $expr: { $eq: ['$participants.email', '$$checkerEmail'] } } }],
        as: 'coversations',
      },
    },
    {
      $lookup: {
        from: 'messages',
        let: { checkerId: '$id' },
        pipeline: [{ $match: { $expr: { $eq: ['$sender', '$$checkerId'] } } }],
        as: 'messages',
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        conv_count: { $size: '$coversations' },
        msg_count: { $size: '$messages' },
      },
    },
  ]);

  const results = await User.aggregatePaginate(aggregate, options);

  return results;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  usersAndConversations,
  createMockUsers,
  generalDataUsers,
};
