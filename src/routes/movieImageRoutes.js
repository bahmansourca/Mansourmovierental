const express = require('express');
const router = express.Router();
const MovieImageController = require('../controllers/movieImageController');
const MovieImageDownloadController = require('../controllers/movieImageDownloadController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload images for a movie (admin only)
router.post('/:id/images', 
  authMiddleware, 
  adminMiddleware, 
  upload.array('images', 5), // Allow up to 5 images
  MovieImageController.uploadImages
);

// Get all images for a movie
router.get('/:id/images', MovieImageController.getImages);

// Delete a movie image (admin only)
router.delete('/:id/images/:imageId', 
  authMiddleware, 
  adminMiddleware, 
  MovieImageController.deleteImage
);

// Download and add images from URLs (admin only)
router.post('/:id/download-images', 
  authMiddleware, 
  adminMiddleware, 
  MovieImageDownloadController.downloadAndAddImages
);

module.exports = router; 