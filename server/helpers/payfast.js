const crypto = require("crypto");

const payfast = {
  merchant_id: "demo",
  merchant_password: "demo",
  return_url: "http://localhost:3000/payment-success",
  cancel_url: "http://localhost:3000/payment-cancel",
  post_url: "https://sandbox.payfast.pk/merchant/web_checkout",

  generatePaymentData(amount = "500.00", order_id = "ORDER123") {
    const hashString = `${this.merchant_id}&${this.merchant_password}&${amount}&${order_id}`;
    const secure_hash = crypto
      .createHash("sha256")
      .update(hashString)
      .digest("hex");

    return {
      merchant_id: this.merchant_id,
      merchant_password: this.merchant_password,
      amount,
      order_id,
      return_url: this.return_url,
      cancel_url: this.cancel_url,
      currency: "PKR",
      description: "Test Payment",
      secure_hash,
      post_url: this.post_url,
    };
  },
};

module.exports = payfast;