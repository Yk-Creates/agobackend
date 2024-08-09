import mongoose from "mongoose";

const employmentTypes = Object.freeze({
  SALARIED: "Salaried",
  FREELANCER: "Freelancer",
});

const carTypes = Object.freeze({
  SUV: "SUV",
  SEDAN: "Sedan",
  TRAVELLER: "Traveller",
});

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    carNumber: {
      type: String,
      required: true,
      unique: true,
    },
    drivingLicense: {
      type: String,
      required: true,
      unique: true,
    },
    aadhaarCard: {
      type: String,
      required: true,
      unique: true,
    },
    employmentType: {
      type: String,
      required: true,
      enum: Object.values(employmentTypes),
    },
    carType: {
      type: String,
      required: true,
      enum: Object.values(carTypes),
    },
    carModel: {
      type: String,
      required: true,
    },
    carYear: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    driverType: {
      type: String,
      enum: ["cab", "ambulance"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Driver = mongoose.model("Driver", driverSchema);
