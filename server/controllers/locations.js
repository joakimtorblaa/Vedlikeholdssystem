import Location from "../models/Location.js";

export const newLocation = async (req, res) => {
    try {
        const {
            locationName,
            description,
            locationType,
            coordsLat,
            coordsLng,
            locationFiles,
        } = req.body;

        const newLocation = new Location ({
            locationName,
            description,
            locationType,
            coordsLat,
            coordsLng,
            locationFiles,
            picturePath: 'locations/location_header/' + req.file.filename
        }); 
        const savedLocation = await newLocation.save();
        res.status(201).json(savedLocation);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

}

export const getLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const location = await Location.findById(id);
        res.status(200).json(location);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const getLocationFiles = async (req, res) => {
    try {
        const { id } = req.params;
        const location = await Location.findById(id);
        res.status(200).json(location.locationFiles);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
}

export const uploadFileLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const location = await Location.findById(id);

        location.locationFiles.push(req.file);
        await location.save();

        const newFile = location.locationFiles;
        res.status(201).json(newFile);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}

export const deleteFileLocation = async (req, res) => {
    try {
        const { id, fileIndex } = req.params;
        const location = await Location.findById(id);
        
        location.locationFiles.splice(fileIndex, 1);
        
        await location.save();
        const newFile = location.locationFiles;

        res.status(201).json(newFile);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
}