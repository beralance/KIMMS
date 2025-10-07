import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        // Link back to Inventory
        inventoryId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Inventory", 
            required: true 
        },

        // IDs for tracking
        productId: { type: String, required: true }, // carry over from Inventory

        // Product details
        productName: { type: String, required: true },
        physicalCode: {type: String, required: true},
        description: { type: String, required: true },
        details: {type: String, required: true},
        price: { type: Number, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        condition: {
            type: String,
            enum: ['used', 'like new', 'new', 'refurbished'],
            required: true,
            default: 'used',
        },
        images: [{ type: String }],
        tags: [{type: String}],
        isLocal: {type: Boolean, default: true},

        // Status for Products tab
        visibility: { 
            type: String, 
            enum: ["active", "inactive", "sold", "pending"], 
            default: "active" 
        },

        // Purchase workflow status
        purchaseStatus: {
            type: String,
            enum: ["available", "pending", "sold"],
            default: "available", // available for checkout
        },

        highlight: {
            type: String,
            enum: ["mostViewed", "featured", "none"],
            default: "none"
        },

        views: { type: Number, default: 0 },

        // Optional: track the user who bought it
        purchasedBy: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User", 
            default: null 
        },

        postedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

export default mongoose.model("Product", productSchema);
