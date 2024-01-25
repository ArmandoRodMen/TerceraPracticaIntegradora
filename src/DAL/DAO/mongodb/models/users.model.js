import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        required: false,
        default: 18
    },
    cart:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "carts",
    },    
    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        required: true,
        default: 'user',
    },
    isGithub: {
        type: Boolean, 
        default: false,
    },
    isGoogle: {
        type: Boolean,
        default: false,
    },
    resetToken: {
        type: String,
        default: "0",
    },
    resetTokenExpiration: {
        type: Date,
        default: "0",
    },
});

export const usersModel = mongoose.model("users", usersSchema);