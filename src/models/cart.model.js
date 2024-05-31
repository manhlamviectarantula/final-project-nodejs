const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
    userId: { type: String, required: true},
    products: [{
        productId:{
            type: String
        },
        quantity:{
            type: Number,
            // default:1
        }
    }],
    created_at: {
        type: Date,
        default: Date.now
    }
})

const CartModel = mongoose.model("Cart", cartSchema)

module.exports = CartModel