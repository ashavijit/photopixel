const express = require('express');
const UserControllers = require('../controllers/userControllers');
const router = express.Router();

router.get('/', UserControllers.GetALLUsers);
router.get('/:id', UserControllers.GetOneUser);

module.exports = router;