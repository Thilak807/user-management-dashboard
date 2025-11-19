const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { registerValidation, loginValidation } = require('../validators/authValidators');
const { register, login, currentUser, logout } = require('../controllers/authController');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authMiddleware, currentUser);
router.post('/logout', authMiddleware, logout);

module.exports = router;

