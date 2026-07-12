import mongoose from "mongoose";

const customersSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    idNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["lead", "in_progress", "closed_won", "pending", "rejected"],
      default: "lead",
    },

    address: {
      city: {
        type: String,
        default: "",
      },
      street: {
        type: String,
        default: "",
      },
      houseNumber: {
        type: String,
        default: "",
      },
      apartment: {
        type: String,
        default: "",
      },
      entrance: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  },
);

export const Customer = mongoose.model("Customer", customersSchema);
