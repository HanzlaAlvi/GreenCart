const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  cartId: {
    type: String,
    required: true
  },
  cartItems: [
    {
      productId: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      image: String,
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
    },
  ],
  addressInfo: {
    addressId: String,
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    notes: String,
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'payfast'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  subtotal: {
    type: Number,
    required: true
  },
  shippingFee: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  orderUpdateDate: {
    type: Date,
    default: Date.now
  },
  paymentId: String,
  payerId: String,
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);