import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // או השם של מודל המשתמשים שלך
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer", // קישור ללקוח הרלוונטי
      required: true,
    },
    amount: {
      type: Number,
      default: 0, 
    },
    saleDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const Sale = mongoose.model("Sale", saleSchema);
