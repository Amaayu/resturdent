import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  image: String,
  isAvailable: {
    type: Boolean,
    default: true
  },
  isVegetarian: Boolean,
  isVegan: Boolean,
  spiceLevel: {
    type: String,
    enum: ['mild', 'medium', 'hot', 'extra-hot']
  }
}, {
  timestamps: true
});

export default mongoose.model('MenuItem', menuItemSchema);
