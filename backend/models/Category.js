import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        productCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);
const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        productCount: { type: Number, default: 0 },
        subCategories: [subCategorySchema],
    },
    { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
