const mongoose = require('mongoose');
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { body } = req;
    console.log('Order creation request:', body);

    // Validate required fields
    const requiredFields = {
      userId: 'User ID is required',
      cartId: 'Cart ID is required',
      cartItems: 'Cart items are required',
      addressInfo: 'Address information is required',
      paymentMethod: 'Payment method is required',
      totalAmount: 'Total amount is required'
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!body[field]) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message
        });
      }
    }

    // Validate cart items
    if (!Array.isArray(body.cartItems) || body.cartItems.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Cart items must be a non-empty array'
      });
    }

    // Validate payment method
    const validPaymentMethods = ['cod', 'jazzcash', 'easypaisa'];
    if (!validPaymentMethods.includes(body.paymentMethod)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Must be one of: ${validPaymentMethods.join(', ')}`
      });
    }

    // Check product stock and validity
    for (const item of body.cartItems) {
      if (!item.productId || !item.quantity || !item.price) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: 'Each cart item must have productId, quantity and price'
        });
      }

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
          message: `Insufficient stock for ${product.title}. Available: ${product.totalStock}, Requested: ${item.quantity}`
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
      subtotal: body.subtotal || body.totalAmount - (body.shippingFee || 0),
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
        { session, new: true }
      );
    }

    // Clear cart
    await Cart.findByIdAndDelete(body.cartId, { session });

    await session.commitTransaction();
    session.endSession();

    console.log('Order created successfully:', savedOrder._id);
    return res.status(201).json({
      success: true,
      data: savedOrder,
      message: 'Order created successfully'
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error('Order creation failed:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// ... (keep other controller methods the same as before)

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails
};