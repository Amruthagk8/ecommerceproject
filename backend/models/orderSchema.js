const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  username: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true }
  },
  paymentMethod: { type: String, required: true },
  products: [
    {
      id: { type: Number, required: true },
      image:{type:String,required:true},
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      status: { type: String, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
