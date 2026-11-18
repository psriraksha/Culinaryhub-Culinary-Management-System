const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: String, required: true },
  unit: { type: String, default: '' }
});

const stepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  instruction: { type: String, required: true },
  image: { type: String, default: null }
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  ingredients: {
    type: [ingredientSchema],
    required: [true, 'Ingredients are required'],
    validate: {
      validator: function(v) { return v.length > 0; },
      message: 'At least one ingredient is required'
    }
  },
  steps: {
    type: [stepSchema],
    required: [true, 'Cooking steps are required'],
    validate: {
      validator: function(v) { return v.length > 0; },
      message: 'At least one step is required'
    }
  },
  cookingTime: {
    prep: { type: Number, default: 0 },
    cook: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  servings: { type: Number, default: 4 },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Appetizer', 'Soup', 'Salad', 'Bread', 'Other']
  },
  cuisine: {
    type: String,
    default: 'International'
  },
  image: {
    type: String,
    default: null
  },
  approvalStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 }
  }],
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  tags: [{ type: String }]
}, { timestamps: true });

// Calculate average rating before save
recipeSchema.methods.calculateAverageRating = function() {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
    this.totalRatings = 0;
  } else {
    const sum = this.ratings.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
    this.totalRatings = this.ratings.length;
  }
};

// Text index for search
recipeSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
