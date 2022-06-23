const express = require('express');
const conversationController = require('../../controllers/conversation.controller');

const router = express.Router();

router.post('/create', conversationController.createConversation);
router.get('/get', conversationController.getConversations);
router.get('/get/:conversationId', conversationController.getConversation);
router.put('/update/:conversationId', conversationController.updateConversation);
router.delete('/delete/:conversationId', conversationController.deleteConversation);

module.exports = router;