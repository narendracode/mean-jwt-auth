var express = require('express');
var router = express.Router();
var meetupController = require('../app/meetup/controllers/MeetupController');

router.post('/',meetupController.create);
router.get('/',meetupController.getAll);
router.get('/:id',meetupController.get);
router.put('/:id',meetupController.update);
router.delete('/:id',meetupController.delete);

module.exports = router;
