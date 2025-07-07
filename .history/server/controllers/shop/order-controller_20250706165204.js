const mongoose = require('mongoose');
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.startTransaction();
    const { body } = req;

    console.log('Incoming order data:', {
      userId: body.userId,
      cartId: body.cartId,
      itemsCount: body.cartItems?.length,
      paymentMethod: body.paymentMethod
    });

    // Validate required fields
    const requiredFields = ['userId', 'cartId', 'cartItems', 'addressInfo', 'paymentMethod', 'totalAmount'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate cart items
    if (!Array.isArray(body.cartItems) {
      return res.status(400).json({
        success: false,
        message: "Cart items must be an array"
      });
    }

    // Check product stock
    for (const item of body.cartItems) {
      const product = await Product.findById(item.productId).session(session);
      if (!product) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: `Product ${item.productId} not found`
        });
      }
      if (product.totalStock < item.quantity) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.title}`
        });
      }
    }

    // Create order document
    const orderData = {
      userId: body.userId,
      cartId: body.cartId,
      cartItems: body.cartItems.map(item => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity
      })),
      addressInfo: body.addressInfo,
      orderStatus: 'pending',
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentMethod === 'cod' ? 'pending' : 'unpaid',
      subtotal: body.subtotal || body.totalAmount,
      shippingFee: body.shippingFee || 0,
      totalAmount: body.totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date()
    };

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save({ session });

    // Update product stock
    for (const item of body.cartItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { totalStock: -item.quantity } },
        { session }
      );
    }

    // Clear cart
    await Cart.findByIdAndDelete(body.cartId, { session });

    await session.commitTransaction();
    
    console.log('Order created successfully:', savedOrder._id);
    return res.status(201).json({
      success: true,
      data: savedOrder,
      message: "Order created successfully"
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Order creation failed:', error);
    
    // Specific error for duplicate key
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Order already exists"
      });
    }
    
    // General error response
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    session.endSession();
  }
};

module.exports = { createOrder };