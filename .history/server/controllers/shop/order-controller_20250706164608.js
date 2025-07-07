const paypal = require("../../helpers/payfast");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
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
    if (!userId || !cartId || !cartItems?.length || !addressInfo || !paymentMethod || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required order fields"
      });
    }

    // Validate stock before creating order
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.title} not found`
        });
      }
      if (product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.title} (Available: ${product.totalStock})`
        });
      }
    }

    // Handle COD orders
    if (paymentMethod === 'cod') {
      const newOrder = new Order({
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
        paymentStatus: 'pending',
        subtotal,
        shippingFee,
        totalAmount,
        orderDate: new Date(),
        orderUpdateDate: new Date()
      });

      await newOrder.save();

      // Update product stock
      for (const item of cartItems) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { totalStock: -item.quantity }
        });
      }

      // Clear cart
      await Cart.findByIdAndDelete(cartId);

      return res.status(201).json({
        success: true,
        data: newOrder,
        message: "COD order created successfully"
      });
    }

    // Handle online payments (PayFast/PayPal)
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "payfast",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/payfast-return",
        cancel_url: "http://localhost:5173/shop/payfast-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "Payment for order",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.error("Payment creation error:", error);
        return res.status(500).json({
          success: false,
          message: "Error while creating payment"
        });
      }

      const newOrder = new Order({
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
        paymentStatus: 'unpaid',
        subtotal,
        shippingFee,
        totalAmount,
        orderDate: new Date(),
        orderUpdateDate: new Date()
      });

      await newOrder.save();

      const approvalURL = paymentInfo.links.find(
        (link) => link.rel === "approval_url"
      ).href;

      res.status(201).json({
        success: true,
        approvalURL,
        orderId: newOrder._id,
        message: "Payment initiated"
      });
    });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order"
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    if (!paymentId || !orderId) {
      return res.status(400).json({
        success: false,
        message: "Payment ID and Order ID are required"
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Verify stock again before confirming payment
    for (const item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${item.title} not found`
        });
      }
      if (product.totalStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.title} (Available: ${product.totalStock})`
        });
      }
    }

    // Update order status
    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;
    order.orderUpdateDate = new Date();

    // Update product stock
    for (const item of order.cartItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { totalStock: -item.quantity }
      });
    }

    // Clear cart
    await Cart.findByIdAndDelete(order.cartId);

    await order.save();

    res.status(200).json({
      success: true,
      data: order,
      message: "Payment captured and order confirmed"
    });

  } catch (error) {
    console.error("Payment capture error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to capture payment"
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
      .lean();

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        data: [],
        message: "No orders found"
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
      message: "Orders retrieved successfully"
    });

  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve orders"
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

    res.status(200).json({
      success: true,
      data: order,
      message: "Order details retrieved successfully"
    });

  } catch (error) {
    console.error("Get order details error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve order details"
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails
};