import mongoose from "mongoose"


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [],
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