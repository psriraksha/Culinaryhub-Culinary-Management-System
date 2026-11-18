const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');

// @desc    Admin dashboard stats
// @route   GET /api/admin/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers, activeUsers, suspendedUsers,
      totalRecipes, pendingRecipes, approvedRecipes, rejectedRecipes,
      totalComments
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', status: 'active' }),
      User.countDocuments({ role: 'user', status: 'suspended' }),
      Recipe.countDocuments(),
      Recipe.countDocuments({ approvalStatus: 'Pending' }),
      Recipe.countDocuments({ approvalStatus: 'Approved' }),
      Recipe.countDocuments({ approvalStatus: 'Rejected' }),
      Comment.countDocuments()
    ]);

    const recentRecipes = await Recipe.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find({ role: 'user' })
      .sort({ createdAt: -1 })
      .limit(5);

    const categoryStats = await Recipe.aggregate([
      { $match: { approvalStatus: 'Approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      stats: {
        users: { total: totalUsers, active: activeUsers, suspended: suspendedUsers },
        recipes: { total: totalRecipes, pending: pendingRecipes, approved: approvedRecipes, rejected: rejectedRecipes },
        comments: { total: totalComments }
      },
      recentRecipes,
      recentUsers,
      categoryStats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const query = { role: 'user' };

    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

    res.json({
      success: true, users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: `User ${status === 'active' ? 'activated' : 'suspended'}`, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    await Recipe.deleteMany({ author: user._id });
    await Comment.deleteMany({ user: user._id });
    await user.deleteOne();

    res.json({ success: true, message: 'User and all associated data deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all recipes (admin)
// @route   GET /api/admin/recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (status) query.approvalStatus = status;
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Recipe.countDocuments(query);
    const recipes = await Recipe.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true, recipes,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or Reject recipe
// @route   PUT /api/admin/recipes/:id/status
exports.updateRecipeStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Use Approved or Rejected.' });
    }

    const update = { approvalStatus: status };
    if (status === 'Rejected' && rejectionReason) {
      update.rejectionReason = rejectionReason;
    } else {
      update.rejectionReason = '';
    }

    const recipe = await Recipe.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('author', 'name email');

    if (!recipe) return res.status(404).json({ success: false, message: 'Recipe not found' });

    res.json({
      success: true,
      message: `Recipe ${status.toLowerCase()} successfully`,
      recipe
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all comments
// @route   GET /api/admin/comments
exports.getAllComments = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Comment.countDocuments();

    const comments = await Comment.find()
      .populate('user', 'name email')
      .populate('recipe', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true, comments,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete comment (admin)
// @route   DELETE /api/admin/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });
    res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
