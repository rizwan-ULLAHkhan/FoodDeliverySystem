const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Add a new order
router.post('/add', async (req, res) => {
    try {
        const { productId } = req.body;
        
        // Create a new order instance
        const order = new Order({
            productId
        });

        // Save the order to the database
        const newOrder = await order.save();
        
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error adding order:', error);
        res.status(500).json({ message: 'Error adding order', error: error.message });
    }
});

// Fetch all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
});

// Fetch order by ID
router.get('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        
        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
});

module.exports = router;
