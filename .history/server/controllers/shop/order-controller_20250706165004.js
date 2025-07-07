const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      paymentMethod,
      subtotal,
      shippingFee,
      totalAmount
    } = req.body;

    // Validate required fields
    const requiredFields = {
      userId: "User ID is required",
      cartId: "Cart ID is required",
      cartItems: "Cart items are required",
      addressInfo: "Address information is required",
      paymentMethod: "Payment method is required",
      totalAmount: "Total amount is required"
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message
        });
      }
    }

    // Validate cart items
    if (!Array.isArray(cartItems) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Cart items must be an array"
      });
    }

    // Validate payment method
    const validPaymentMethods = ['cod', 'jazzcash', 'easypaisa'];
    if (!validPaymentMethods.includes(paymentMethod)) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Must be one of: ${validPaymentMethods.join(', ')}`
      });
    }

    // Check product stock and validity
    for (const item of cartItems) {
      if (!item.productId || !item.quantity || !item.price) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: "Each cart item must have productId, quantity and price"
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

    // Create order
    const orderData = {
      userId,
      cartId,
      cartItems: cartItems.map(item => ({
        productId: item.productId,
        title: item.title,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        totalPrice: item.price * item.quantity
      })),
      addressInfo,
      orderStatus: 'pending',
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'unpaid',
      subtotal,
      shippingFee,
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date()
    };

    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save({ session });

    // Update product stock
    for (const item of cartItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { totalStock: -item.quantity } },
        { session }
      );
    }

    // Delete cart
    await Cart.findByIdAndDelete(cartId, { session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      data: savedOrder,
      message: "Order created successfully"
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Order creation error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  } finally {
    session.endSession();
  }
};

const capturePayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { paymentId, payerId, orderId } = req.body;

    // Validate input
    if (!paymentId || !orderId) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Payment ID and Order ID are required"
      });
    }

    // Find and validate order
    const order = await Order.findById(orderId).session(session);
    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Verify stock availability
    for (const item of order.cartItems) {
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

    // Update order status
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;
    order.orderUpdateDate = new Date();

    const updatedOrder = await order.save({ session });

    // Update product stock
    for (const item of order.cartItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { totalStock: -item.quantity } },
        { session }
      );
    }

    // Delete cart
    await Cart.findByIdAndDelete(order.cartId, { session });

    await session.commitTransaction();

    return res.status(200).json({
      success: true,
      data: updatedOrder,
      message: "Payment captured successfully"
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Payment capture error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to capture payment",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    session.endSession();
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
      .lean();

    return res.status(200).json({
      success: true,
      data: orders,
      message: "Orders retrieved successfully"
    });

  } catch (error) {
    console.error('Get orders error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

    const order = await Order.findById(id).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
      message: "Order details retrieved successfully"
    });

  } catch (error) {
    console.error('Get order details error:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve order details",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails
};