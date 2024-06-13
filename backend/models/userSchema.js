const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  id: { type: Number, required: true }, // Assuming unique identifier (adjust as needed)
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: Number, unique: true }, // Assuming unique phone number (adjust as needed)
  password: { type: String, required: true },
  addresses: { type: [addressSchema], default: [] }, // Array of address subdocuments
  blocked: { type: Boolean, default: false },
  cartData: { type: Object },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Users', userSchema);
