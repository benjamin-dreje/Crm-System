import mongoose from "mongoose";

const activitiesSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    performedBy: {
      type: String,
      required: true,
    },
    statusAtTime: {
      type: String,
      enum: ["lead", "in_progress", "closed_won"],
      required: true,
    },
    prices: {
      type: [Number],
      default: [],
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const Activity = mongoose.model("Activity", activitiesSchema);
