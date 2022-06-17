const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const conversationSchema = mongoose.Schema(
  {
    participants: [
      {
        email: String,
        name: String,
        userId: {
            type: String,
            ref: 'User',
            required: true,
        },
      },
    ],
    lastMessage: {
        content: String,
        date: Date,
        sender: String
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
conversationSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;
