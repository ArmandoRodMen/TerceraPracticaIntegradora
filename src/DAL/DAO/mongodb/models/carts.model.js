import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    products: [
        {
            product:{
                type: mongoose.SchemaTypes.ObjectId,
                ref: "products"
            },
            quantity:{
                type: Number,
            },
            _id: false,
        },
    ],
});

export const cartsModel = mongoose.model("carts", cartsSchema);


