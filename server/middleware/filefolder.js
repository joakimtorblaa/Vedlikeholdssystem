export const setFileFolderLocation = (req, res, next) => {
    try {
        const { id } = req.params;
        req.imagesFolder = `locations/${id}`;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const setFileFolderTask = (req, res, next) => {
    try {
        const { id } = req.params;
        req.imagesFolder = `tasks/${id}`;
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}