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

cartSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v

        if (ret.items && Array.isArray(ret.items)) {
            ret.items = ret.items.map(item => {
                // Создаем новый объект для элемента
                const transformedItem = { ...item }

                // Преобразуем _id в id для каждого элемента
                if (transformedItem._id) {
                    transformedItem.id = transformedItem._id.toString()
                    delete transformedItem._id
                }

                return transformedItem
            })
        }

        return ret
    }
})

export const Cart = mongoose.model("Cart", cartSchema);