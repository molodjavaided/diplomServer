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

cartSchema.pre('save', function(next) {
    try {
        if (!this.items || this.items.length === 0) {
            this.totalPrice = 0
            this.totalQuantity = 0
            return next()
        }
        this.totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
        this.totalPrice = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        next();
    } catch (error) {
        console.log("Ошибка при расчете корзины", error);
        next(error)
    }
});

export const Cart = mongoose.model("Cart", cartSchema);