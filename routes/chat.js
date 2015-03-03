var express = require('express');
var router = express.Router();
var chatController = require('../app/chat/controllers/ChatController');

router.post('/',chatController.send);
/*
router.get('/',chatController.getAll);
router.get('/:id',chatController.get);
router.put('/:id',chatController.update);
router.delete('/:id',chatController.delete); */

module.exports = router;
