const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  updateProfileValidation,
  changePasswordValidation,
} = require('../validators/userValidators');
const { updateProfile, changePassword } = require('../controllers/userController');

const router = express.Router();

router.use(authMiddleware);
router.put('/profile', updateProfileValidation, updateProfile);
router.put('/password', changePasswordValidation, changePassword);

module.exports = router;

