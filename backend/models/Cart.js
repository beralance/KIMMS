import mongoose from "mongoose";

// Each item inside the cart
const cartItemSchema = new mongoose.Schema({
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product",    // references Product collection
        required: true 
    },
});

// Main cart schema
const cartSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User",    // references User collection
            required: true,
            unique: true,
        },
        items: [cartItemSchema], // array of product references
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
