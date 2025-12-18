import mongoose from "mongoose";

const userShema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 1,
    }
}, {
    timestamps: true
})

export const User = mongoose.model('User', userShema);