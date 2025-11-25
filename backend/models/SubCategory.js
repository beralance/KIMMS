import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        productCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("SubCategory", subCategorySchema);
