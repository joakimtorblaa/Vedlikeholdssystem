import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
    locationName: {
        type: String,
        required: true,
        min: 2
    },
    description: {
        type: String,
        required: true,
        min: 5
    },
    locationType: {
        type: String,
        required: true,
        min: 2
    },
    coordsLat: {
        type: Number,
        required: true
    },
    coordsLng: {
        type: Number,
        required: true
    },
    locationFiles: {
        type: Array,
        default: [],
    },
    picturePath: {
        type: String,
        default: "placeholder/placeholder.jpg"
    }

})

const Location = mongoose.model("Location", LocationSchema);
export default Location;