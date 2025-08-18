import mongoose from "mongoose";

const busStopSchema = new mongoose.Schema({
    stop_name: {
        type: String,
        required: true,
    },
    arrival_time: {
        type: Date,
        required: true,
    },
    departure_time: {
        type: Date,
        required: true,
    },
    coordinates:{
        lat: {
            type: Number,
            required: true,
        },
        lng: {
            type: Number,
            required: true,
        }
    }
})
const BusStop = mongoose.model('BusStop', busStopSchema);
export default BusStop;