const mongoose = require("mongoose");
// schema for product

const schema = mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  password: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "user","client"],
    default: "admin",
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  }
});
// model for product
const productModel = mongoose.model("produits", schema);

module.exports = productModel;