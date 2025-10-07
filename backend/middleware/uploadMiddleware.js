const handleUploads = upload.array('images');
const uploadMiddleware = (req, res, next) => {
    handleUploads(req, res, (err) => {
        if (err instanceof multer.MulterError) return res.status(400).json({ error: err.message });
        if (err) return res.status(500).json({ error: 'File upload error' });
        next();
    });
};
