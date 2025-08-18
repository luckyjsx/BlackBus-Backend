import mongoose from "mongoose";

const BusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  busNumber: { type: String, required: true, unique: true }, // New field

  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BusRoute", // Relationship to route
    required: true,
  },
  // busType: {
  //   type: String,
  //   enum: ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper', 'Volvo'],
  //   required: true
  // },

  from: { type: String, required: true },
  to: { type: String, required: true },

  departureTime: { type: String, required: true }, // "14:00"
  arrivalTime: { type: String, required: true },   // "18:00"

  date: { type: Date, required: true },

  price: { type: Number, required: true },
  seatsAvailable: { type: Number, required: true },
}, { timestamps: true });

export const BusModel = mongoose.model("Bus", BusSchema);
