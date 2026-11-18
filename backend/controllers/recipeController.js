const Recipe = require('../models/Recipe');
const Comment = require('../models/Comment');

// @desc    Get all approved recipes (public)
// @route   GET /api/recipes
exports.getRecipes = async (req, res) => {
  try {
    const { search, category, difficulty, cuisine, sort, page = 1, limit = 12 } = req.query;

    const query = { approvalStatus: 'Approved' };

    if (search) {
      query.$text = { $search: search };
    }
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (cuisine) query.cuisine = cuisine;

    let sortObj = { createdAt: -1 };
    if (sort === 'rating') sortObj = { averageRating: -1 };
    else if (sort === 'popular') sortObj = { views: -1 };
    else if (sort === 'oldest') sortObj = { createdAt: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Recipe.countDocuments(query);

    const recipes = await Recipe.find(query)
      .populate('author', 'name profileImage')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      success: true,
      recipes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name profileImage bio');

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    if (recipe.approvalStatus !== 'Approved') {
      const isOwner = req.user && recipe.author._id.toString() === req.user._id.toString();
      const isAdmin = req.user && req.user.role === 'admin';
      if (!isOwner && !isAdmin) {
        return res.status(403).json({ success: false, message: 'This recipe is not publicly available' });
      }
    }

    // Increment views
    recipe.views += 1;
    await recipe.save();

    const comments = await Comment.find({ recipe: recipe._id })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.json({ success: true, recipe, comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create recipe
// @route   POST /api/recipes
exports.createRecipe = async (req, res) => {
  try {
    const {
      title, description, ingredients, steps,
      cookingTime, servings, difficulty, category, cuisine, tags
    } = req.body;

    const recipeData = {
      title,
      description,
      ingredients: typeof ingredients === 'string' ? JSON.parse(ingredients) : ingredients,
      steps: typeof steps === 'string' ? JSON.parse(steps) : steps,
      cookingTime: typeof cookingTime === 'string' ? JSON.parse(cookingTime) : cookingTime,
      servings,
      difficulty,
      category,
      cuisine,
      tags: typeof tags === 'string' ? JSON.parse(tags) : (tags || []),
      author: req.user._id,
      approvalStatus: 'Pending'
    };

    if (req.file) {
      recipeData.image = `/uploads/recipes/${req.file.filename}`;
    }

    const recipe = await Recipe.create(recipeData);

    res.status(201).json({
      success: true,
      message: 'Recipe submitted successfully! It will be reviewed by our admin.',
      recipe
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
exports.updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const isOwner = recipe.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this recipe' });
    }

    const updateData = { ...req.body };
    if (req.body.ingredients && typeof req.body.ingredients === 'string') {
      updateData.ingredients = JSON.parse(req.body.ingredients);
    }
    if (req.body.steps && typeof req.body.steps === 'string') {
      updateData.steps = JSON.parse(req.body.steps);
    }
    if (req.body.cookingTime && typeof req.body.cookingTime === 'string') {
      updateData.cookingTime = JSON.parse(req.body.cookingTime);
    }

    // Reset to pending if user (not admin) updates
    if (isOwner && !isAdmin) {
      updateData.approvalStatus = 'Pending';
    }

    if (req.file) {
      updateData.image = `/uploads/recipes/${req.file.filename}`;
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });

    res.json({ success: true, message: 'Recipe updated successfully', recipe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const isOwner = recipe.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this recipe' });
    }

    await Comment.deleteMany({ recipe: recipe._id });
    await recipe.deleteOne();

    res.json({ success: true, message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user's own recipes
// @route   GET /api/recipes/my-recipes
exports.getMyRecipes = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { author: req.user._id };
    if (status) query.approvalStatus = status;

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });
    res.json({ success: true, recipes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Rate a recipe
// @route   POST /api/recipes/:id/rate
exports.rateRecipe = async (req, res) => {
  try {
    const { rating } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }

    const existingRating = recipe.ratings.find(r => r.user.toString() === req.user._id.toString());

    if (existingRating) {
      existingRating.rating = rating;
    } else {
      recipe.ratings.push({ user: req.user._id, rating });
    }

    recipe.calculateAverageRating();
    await recipe.save();

    res.json({ success: true, message: 'Rating saved', averageRating: recipe.averageRating, totalRatings: recipe.totalRatings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle bookmark
// @route   POST /api/recipes/:id/bookmark
exports.toggleBookmark = async (req, res) => {
  try {
    const user = req.user;
    const recipeId = req.params.id;

    const bookmarkIndex = user.bookmarks.indexOf(recipeId);
    if (bookmarkIndex > -1) {
      user.bookmarks.splice(bookmarkIndex, 1);
      await user.save();
      res.json({ success: true, bookmarked: false, message: 'Bookmark removed' });
    } else {
      user.bookmarks.push(recipeId);
      await user.save();
      res.json({ success: true, bookmarked: true, message: 'Recipe bookmarked' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
