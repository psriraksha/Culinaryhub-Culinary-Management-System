const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword, getBookmarks } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/bookmarks', protect, getBookmarks);

module.exports = router;
