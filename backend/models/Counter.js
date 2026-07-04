import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    category: String,
    date: String,
    seq: { type: Number, default: 0 }
});

export default mongoose.model("Counter", counterSchema);
