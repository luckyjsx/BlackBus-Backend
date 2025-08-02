import mongoose from 'mongoose';

const CountrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        required: true,
    },
    availableLanguages: [{
        type: String,
        required: true,
    }],
}, {
    timestamps: true,
});

export const CountryModel = mongoose.model("Country", CountrySchema);