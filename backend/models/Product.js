const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    brand: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 }, // percentage discount e.g. 15 for 15%
    finalPrice: { type: Number, required: true },
    images: [{ type: String, required: true }],
    stock: { type: Number, required: true, default: 10 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    specifications: [{ key: String, value: String }],
    rating: { type: Number, default: 4.5 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isFlashDeal: { type: Boolean, default: false },
    flashDealExpiry: { type: Date }
  },
  { timestamps: true }
);

productSchema.pre('save', function (next) {
  if (this.discount && this.discount > 0) {
    this.finalPrice = Math.round(this.price * (1 - this.discount / 100));
  } else {
    this.finalPrice = this.price;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
