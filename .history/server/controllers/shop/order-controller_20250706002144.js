const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      paymentMethod,
      totalAmount,
      cartId,
    } = req.body;

    // Validate required fields
    if (!userId || !cartItems || !addressInfo || !paymentMethod || !totalAmount || !cartId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields in order data",
        requiredFields: {
          userId: !userId,
          cartItems: !cartItems || cartItems.length === 0,
          addressInfo: !addressInfo,
          paymentMethod: !paymentMethod,
          totalAmount: !totalAmount,
          cartId: !cartId
        }
      });
    }

    // Validate cart items structure
    if (!Array.isArray(cartItems) || cartItems.some(item => 
      !item.productId || !item.quantity || !item.price
    )) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart items format"
      });
    }

    // Set order status based on payment method
    const orderStatus = paymentMethod === 'cod' ? 'confirmed' : 'pending';
    const paymentStatus = paymentMethod === 'cod' ? 'paid' : 'pending';

    // Create new order
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems: cartItems.map(item => ({
        productId: item.productId,
        title: item.title || 'No title',
        image: item.image || '',
        price: item.price,
        quantity: item.quantity
      })),
      addressInfo: {
        addressId: addressInfo.addressId,
        address: addressInfo.address,
        city: addressInfo.city,
        pincode: addressInfo.pincode,
        phone: addressInfo.phone,
        notes: addressInfo.notes || ''
      },
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
    });

    // Start transaction for atomic operations
    const session = await Order.startSession();
    session.startTransaction();

    try {
      // Save the order
      const savedOrder = await newlyCreatedOrder.save({ session });

      // Update product stock and validate stock availability
      for (const item of cartItems) {
        const product = await Product.findById(item.productId).session(session);
        
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.totalStock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.title}`);
        }

        product.totalStock -= item.quantity;
        await product.save({ session });
      }

      // Delete the cart
      await Cart.findByIdAndDelete(cartId).session(session);

      // Commit the transaction
      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        success: true,
        orderId: savedOrder._id,
        message: "Order created successfully",
        data: savedOrder
      });

    } catch (error) {
      // If any error occurs, abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  } catch (error) {
    console.error("Order creation failed:", {
      error: error.message,
      stack: error.stack,
      requestBody: req.body
    });

    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const capturePayment = async (req, res) => {
  const session = await Order.startSession();
  session.startTransaction();

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required"
      });
    }

    const order = await Order.findById(orderId).session(session);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // For COD orders, confirm payment and update status
    if (order.paymentMethod === 'cod') {
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      order.orderUpdateDate = new Date();
      
      // Update product stock for COD orders
      for (const item of order.cartItems) {
        const product = await Product.findById(item.productId).session(session);
        
        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.totalStock < item.quantity) {
          throw new Error(`Insufficient stock for product: ${product.title}`);
        }

        product.totalStock -= item.quantity;
        await product.save({ session });
      }

      await order.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Payment captured successfully",
      data: order
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Payment capture failed:", {
      error: error.message,
      stack: error.stack,
      requestBody: req.body
    });

    res.status(500).json({
      success: false,
      message: "Payment capture failed",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    const orders = await Order.find({ userId })
      .sort({ orderDate: -1 })
      .lean()
      .exec();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error("Failed to fetch orders:", {
      error: error.message,
      stack: error.stack,
      params: req.params
    });

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required"
      });
    }

    const order = await Order.findById(id).lean().exec();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error("Failed to fetch order details:", {
      error: error.message,
      stack: error.stack,
      params: req.params
    });

    res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};