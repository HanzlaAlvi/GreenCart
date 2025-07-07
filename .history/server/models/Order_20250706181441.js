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
  cartItems: [{
    productId: String,
    title: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  addressInfo: {
    addressId: String,
    address: String,
    city: String,
    pincode: String,
    phone: String,
    notes: String
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'confirmed'
  },
  paymentMethod: {
    type: String,
    enum: ['cod'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  subtotal: Number,
  shippingFee: Number,
  totalAmount: Number,
  orderDate: {
    type: Date,
    default: Date.now
  },
  orderUpdateDate: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);