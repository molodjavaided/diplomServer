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

productSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString()
        delete ret._id
        delete ret.__v

        if (!ret.imageUrl || ret.imageUrl.trim() === "") {
            ret.imageUrl = null;
        }

        return ret
    }
})

export const Product = mongoose.model('Product', productSchema);