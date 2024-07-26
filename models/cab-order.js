import mongoose from "mongoose";

const cabOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    start: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },
    end: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    status: {
      type: String,
      enum: ["REQUESTED", "ACCEPTED", "COMPLETED"],
      default: "REQUESTED",
      index: true,
    },
    date: {
      type: String,
      default: Date.now(),
    },
    time: {
      type: String,
    },
    fare: {
      type: Number,
      default: 0,
      min: 0,
    },
    desc: {
      type: String,
    },
    type: {
      type: String,
      enum: ["CAB", "AMBULANCE", "COURRIER"],
      default: "CAB",
      required: true,
    },
    model: {
      type: String,
      enum: ["S", "M", "L"],
    },
  },

  {
    timestamps: true,
  }
);

export const CabOrder = mongoose.model("CabOrder", cabOrderSchema);
