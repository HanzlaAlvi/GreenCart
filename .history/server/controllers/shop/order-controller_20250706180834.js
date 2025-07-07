const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      totalAmount,
      cartId,
      subtotal,
      shippingFee
    } = req.body;

    // Validate required fields
    if (!userId || !cartId || !cartItems || !addressInfo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create new order
    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: 'confirmed',
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      subtotal,
      shippingFee,
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date()
    });

    // Save order to database
    const savedOrder = await newOrder.save();

    // Update product stock
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.totalStock -= item.quantity;
        await product.save();
      }
    }

    // Delete the cart
    await Cart.findByIdAndDelete(cartId);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      orderId: savedOrder._id
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order'
    });
  }
};

// Other controller functions remain the same
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails
};