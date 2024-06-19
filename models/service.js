import mongoose, { Schema } from "mongoose";

const serviceTypes = Object.freeze({
  CAB: "cab",
  AMBULANCE: "ambulance",
  COURIER: "courier",
});

const serviceStatus = Object.freeze({
  PLACED: "placed",
  ACCEPTED: "accepted",
  DONE: "done",
});

const serviceSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(serviceTypes),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(serviceStatus),
      default: serviceStatus.PLACED,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    dropLocation: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);



export const Service = mongoose.model("Service", serviceSchema);
