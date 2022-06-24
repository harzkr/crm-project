const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const messageSchema = mongoose.Schema(
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
messageSchema.plugin(toJSON);
messageSchema.plugin(paginate);

/**
 * @typedef Token
 */
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;