const express = require('express');
const get = require('../controllers/s3controller');
const getAllImages = require('../controllers/s3controller');
const router = express.Router();

router.get('/', get);
router.get('/all', getAllImages);

module.exports = router;