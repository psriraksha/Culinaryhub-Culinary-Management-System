const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');

// @desc    Add comment to recipe
// @route   POST /api/comments/:recipeId
exports.addComment = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const recipe = await Recipe.findById(req.params.recipeId);

    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });
    if (recipe.approvalStatus !== 'Approved') {
      return res.status(400).json({ success: false, message: 'Cannot comment on non-approved recipes' });
    }

    const newComment = await Comment.create({
      user: req.user._id,
      recipe: recipe._id,
      comment,
      rating: rating || null
    });

    // Update recipe rating if provided
    if (rating) {
      const existingRating = recipe.ratings.find(r => r.user.toString() === req.user._id.toString());
      if (existingRating) {
        existingRating.rating = rating;
      } else {
        recipe.ratings.push({ user: req.user._id, rating });
      }
      recipe.calculateAverageRating();
      await recipe.save();
    }

    const populated = await Comment.findById(newComment._id).populate('user', 'name profileImage');
    res.status(201).json({ success: true, message: 'Comment added', comment: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
exports.updateComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const existingComment = await Comment.findById(req.params.id);

    if (!existingComment) return res.status(404).json({ success: false, message: 'Comment not found' });

    if (existingComment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    existingComment.comment = comment;
    existingComment.isEdited = true;
    await existingComment.save();

    res.json({ success: true, message: 'Comment updated', comment: existingComment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    const isOwner = comment.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await comment.deleteOne();
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get comments for recipe
// @route   GET /api/comments/:recipeId
exports.getRecipeComments = async (req, res) => {
  try {
    const comments = await Comment.find({ recipe: req.params.recipeId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
