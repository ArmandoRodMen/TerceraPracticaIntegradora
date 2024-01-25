import mongoose from "mongoose";

const messagesSchema = new mongoose.Schema({
    username:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "users",
    },
    message:{
        type: String,
        required: true
    }
})


export const messagesModel = mongoose.model("messages", messagesSchema);