const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const tokenSchema = mongoose.Schema(
  {
    sender:{
        type: String,
        ref: 'User',
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    conversation:{
        type: String,
        ref: 'Conversation',
        required: true,
    },
    read:{
        type: Boolean,
        default: false,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON);

/**
 * @typedef Token
 */
const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;