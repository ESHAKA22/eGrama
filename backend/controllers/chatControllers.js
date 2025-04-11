const asyncHandler = require('express-async-handler');
const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// Create or fetch a one-to-one chat
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log('UserId param not sent with request');
    return res.status(400).json({ message: 'UserId param not sent with request' });
  }

  // Validate that the userId exists
  const userExists = await User.findById(userId);
  if (!userExists) {
    return res.status(400).json({ message: 'Invalid userId' });
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate('users', '-password')
    .populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'username name pic email',
  });

  if (isChat.length > 0) {
    res.status(200).json(isChat[0]);
  } else {
    const chatData = {
      chatName: 'sender',
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    const createdChat = await Chat.create(chatData);
    const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      'users',
      '-password'
    );
    res.status(200).json(fullChat);
  }
});
// Fetch all chats for a user
const fetchChats = asyncHandler(async (req, res) => {
  const results = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });

  const populatedResults = await User.populate(results, {
    path: 'latestMessage.sender',
    select: 'username name pic email',
  });

  res.status(200).json(populatedResults);
});

// Create a new group chat
const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).json({ message: 'Please fill all the fields' });
  }

  let parsedUsers;
  try {
    parsedUsers = Array.isArray(users) ? users : JSON.parse(users);
  } catch (error) {
    return res.status(400).json({ message: 'Invalid users format' });
  }

  if (parsedUsers.length < 2) {
    return res
      .status(400)
      .json({ message: 'More than 2 users are required to form a group chat' });
  }
  const validUsers = await User.find({ _id: { $in: parsedUsers } });
  if (validUsers.length !== parsedUsers.length) {
    return res.status(400).json({ message: 'One or more user IDs are invalid' });
  }
  

  parsedUsers.push(req.user._id); // Use req.user._id

  const groupChat = await Chat.create({
    chatName: name,
    users: parsedUsers,
    isGroupChat: true,
    groupAdmin: req.user._id, // Use req.user._id
  });

  const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  res.status(200).json(fullGroupChat);
});

// Rename a group chat
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!updatedChat) {
    res.status(404).json({ message: 'Chat Not Found' });
  } else {
    res.json(updatedChat);
  }
});

// Remove a user from a group chat
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!removed) {
    res.status(404).json({ message: 'Chat Not Found' });
  } else {
    res.json(removed);
  }
});

// Add a user to a group chat
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate('users', '-password')
    .populate('groupAdmin', '-password');

  if (!added) {
    res.status(404).json({ message: 'Chat Not Found' });
  } else {
    res.json(added);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};