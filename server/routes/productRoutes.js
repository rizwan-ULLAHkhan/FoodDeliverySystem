const express = require('express');
const router = express.Router();
const multer = require('multer'); // Import multer middleware
const Product = require('../models/product');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Destination folder where uploaded files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // Generate a unique filename for the uploaded file
  }
})

// Initialize multer instance with the storage configuration
const upload = multer({ storage: storage })

// Upload a new product with image
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const { name, price, description, category } = req.body;
        
        // Check if a file was uploaded
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const { filename } = req.file; // Get the filename of the uploaded image
        
        const product = new Product({
            name,
            price,
            description,
            category,
            image: filename // Save the filename of the uploaded image to the database
        });

        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error uploading product:', error);
        res.status(500).json({ message: 'Error uploading product', error: error.message });
    }
});

// Fetch all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
});


// Fetch product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
});


module.exports = router;
