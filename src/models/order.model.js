const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true},
    products: [{
        productId:{
            type: String
        },
        quantity:{
            type: Number,
        }
    }],
    amount: {type: Number, required: true},
    address:{type: Object, required: true},
    status: {type:String, default:"Đã đặt"},
    created_at: {
        type: Date,
        default: Date.now
    }
})

const OrderModel = mongoose.model("Order", orderSchema)

module.exports = OrderModel