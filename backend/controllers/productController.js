const Product = require('../models/Product');

// @desc    Fetch all products with filtering, searching, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      discount,
      isFeatured,
      isFlashDeal,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (brand && brand !== 'All') {
      query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
    }

    if (minPrice || maxPrice) {
      query.finalPrice = {};
      if (minPrice) query.finalPrice.$gte = Number(minPrice);
      if (maxPrice) query.finalPrice.$lte = Number(maxPrice);
    }

    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    if (discount) {
      query.discount = { $gte: Number(discount) };
    }

    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    if (isFlashDeal === 'true') {
      query.isFlashDeal = true;
    }

    // Sorting logic
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { finalPrice: 1 };
    else if (sort === 'price_desc') sortOption = { finalPrice: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'popular') sortOption = { numReviews: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortOption).skip(skip).limit(limitNum);

    // Fetch distinct brands for filtering UI
    const distinctBrands = await Product.distinct('brand');

    res.json({
      products,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      totalProducts: total,
      brands: distinctBrands
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      price,
      discount,
      images,
      stock,
      sizes,
      colors,
      specifications,
      isFeatured,
      isFlashDeal,
      flashDealExpiry
    } = req.body;

    const product = new Product({
      name,
      description,
      category,
      brand,
      price,
      discount: discount || 0,
      finalPrice: discount ? Math.round(price * (1 - discount / 100)) : price,
      images: images && images.length ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800'],
      stock: stock || 10,
      sizes: sizes || [],
      colors: colors || [],
      specifications: specifications || [],
      isFeatured: isFeatured || false,
      isFlashDeal: isFlashDeal || false,
      flashDealExpiry: flashDealExpiry || null
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    Object.assign(product, req.body);
    if (req.body.price !== undefined || req.body.discount !== undefined) {
      const p = req.body.price !== undefined ? req.body.price : product.price;
      const d = req.body.discount !== undefined ? req.body.discount : product.discount;
      product.finalPrice = d ? Math.round(p * (1 - d / 100)) : p;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
