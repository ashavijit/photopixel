const express = require('express');
const router = express.Router();
const { getAllImages } = require('../controllers/gdrive');

router.get('/', getAllImages);

module.exports = router;