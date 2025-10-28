import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
    {
        productId: { type: String, required: true, unique: true},
        physicalCode: {type: String, required: true},
        productName: { type: String, required: true },
        description: { type: String, required: true }, // short description
        details: {type: String, required: true}, // long specification text
        price: { type: Number, required: true },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        status: {type: String, enum: ['available', 'sold', 'reserved'], default: 'available'},
        images: [{ type: String }],
        condition: {
            type: String,
            enum: ['used', 'like new', 'new', 'refurbished'],
            required: true,
            default: 'used',
        },
        tags: [{type: String}],
        isLocal: {type: Boolean, default: true},
        addedBy: {type: mongoose.Schema.Types.ObjectId, required: false},
        createdAt: {type: Date, default: Date.now},
    },
    { timestamps: true }
);

export default mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);
