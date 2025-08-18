import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    aliases: [String], // Alternative names
    isActive: {
      type: Boolean,
      default: true,
    },
    popularity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

citySchema.index({ name: 'text', state: 'text', aliases: 'text' });

export const City = mongoose.model('City',citySchema)
