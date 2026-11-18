const express = require('express');
const router = express.Router();
const {
  getDashboardStats, getAllUsers, updateUserStatus, deleteUser,
  getAllRecipes, updateRecipeStatus, getAllComments, deleteComment
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/recipes', getAllRecipes);
router.put('/recipes/:id/status', updateRecipeStatus);
router.get('/comments', getAllComments);
router.delete('/comments/:id', deleteComment);

module.exports = router;
