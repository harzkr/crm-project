const express = require('express');
const router = express.Router();

const messageController = require('../../controllers/message.controller');

router.post('/create', messageController.createMessage);
router.get('/get', messageController.getMessages);
router.get('/get/:messageId', messageController.getMessage);
router.put('/update/:messageId', messageController.updateMessage);
router.delete('/delete/:messageId', messageController.deleteMessage);

module.exports = router;