const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  console.log('Processing file:', file.originalname, 'Mimetype:', file.mimetype);
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    console.log('Rejected file:', file.originalname, 'Invalid mimetype:', file.mimetype);
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create base multer instance with our config
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
    files: 10 // Maximum 10 files
  }
});

// Create a wrapper function for handling multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    console.error('Multer error:', err);
    return res.status(400).json({
      message: 'File upload error',
      error: err.message
    });
  } else if (err) {
    // An unknown error occurred
    console.error('Unknown upload error:', err);
    return res.status(400).json({
      message: 'Error uploading files',
      error: err.message
    });
  }
  // Everything went fine
  next();
};

// Export both the base multer instance and the error handler
module.exports = {
  upload,
  handleMulterError
};