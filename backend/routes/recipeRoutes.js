const express = require('express');
const router = express.Router();
const {
  getRecipes, getRecipe, createRecipe, updateRecipe,
  deleteRecipe, getMyRecipes, rateRecipe, toggleBookmark
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getRecipes);
router.get('/my-recipes', protect, getMyRecipes);
router.get('/:id', (req, res, next) => {
  // Optional auth for recipe detail
  const auth = require('../middleware/auth');
  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      User.findById(decoded.id).select('-password').then(user => {
        req.user = user;
        next();
      }).catch(() => next());
    } catch {
      next();
    }
  } else {
    next();
  }
}, getRecipe);
router.post('/', protect, upload.single('recipeImage'), createRecipe);
router.put('/:id', protect, upload.single('recipeImage'), updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.post('/:id/rate', protect, rateRecipe);
router.post('/:id/bookmark', protect, toggleBookmark);

module.exports = router;
