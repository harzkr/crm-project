const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const searchUsers = catchAsync(async (req, res) => {
  const result = await userService.searchUsers(req.body.searchTerm);
  res.send(result);
})

const getAllUsers = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.usersAndConversations(req.user.email, options);
  //console.log(result,'logging')
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const mockUsers = catchAsync(async (req, res) => {
  await userService.createMockUsers();
  res.status(httpStatus.NO_CONTENT).send();
})

const generalDataUsers = catchAsync(async (req, res) => {
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'name', 'email']);
  const result = await userService.generalDataUsers(options);
  res.send(result);
})

module.exports = {
  createUser,
  getUsers,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  mockUsers,
  generalDataUsers,
  searchUsers
};
