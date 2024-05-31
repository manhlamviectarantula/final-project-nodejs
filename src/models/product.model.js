const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true
    },
    newPrice: {
        type: Number,
        required: false
    },
    thumbnail: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: false,
        default: []
    },
    brand: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    color: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        required: false,
        default: 1
    },
    feedback: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: false,
        default: 0
    },
    created_by: {
        type: String,
        required: true,
    },
    updated_by: {
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
})

const ProductModel = mongoose.model('Products', productSchema)

module.exports = ProductModel