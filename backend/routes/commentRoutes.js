const express = require('express');
const router = express.Router();
const { addComment, updateComment, deleteComment, getRecipeComments } = require('../controllers/commentController');
const { protect } = require('../middleware/auth');

router.get('/:recipeId', getRecipeComments);
router.post('/:recipeId', protect, addComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;
