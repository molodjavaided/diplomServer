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

userShema.set('toJSON', {
    transform: function(doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    }
});

export const User = mongoose.model('User', userShema);