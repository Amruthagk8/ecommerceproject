// models/Banner.js
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({

  description:{type:String,required:true},
  image: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate:{type:Date,required:true},
  status: { type: String, default: true }
});

module.exports = mongoose.model('Banner', bannerSchema);
