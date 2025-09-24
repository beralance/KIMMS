// Counter.js
import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
    category: String,
    date: String, // YYYYMMDD
    seq: { type: Number, default: 0 }
});

export default mongoose.model("Counter", counterSchema);
