import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    categoryId: {
    type: String,
    ref: 'Category',
    required: true
    },
    inStock: {
        type: Boolean,
        default: false
    },
    imageUrl: {
        type: String,
        default: ""
    },
    quantity: {
        type: Number,
        default: 0
    },
    createdAt: {
    type: Date,
    default: Date.now
    }
}, {
    timestamps: true
})

export const Product = mongoose.model('Product', productSchema);