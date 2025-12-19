import mongoose from "mongoose"


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        title: {
        type: String,
        required: true
        },
        inStock: {
        type: Boolean,
        default: true
        },
        totalPrice: {
        type: Number,
        default: 0,
        min: 0
        },
        addedAt: {
        type: Date,
        default: Date.now
        }
    }],
    totalPrice: {
        type: Number,
        default: 0,
        min: 0
    },
    totalQuantity: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

export const Cart = mongoose.model("Cart", cartSchema);