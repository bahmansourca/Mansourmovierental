const Movie = require('../models/Movie');
const path = require('path');
const fs = require('fs');

class MovieImageController {
  static async uploadImages(req, res) {
    try {
      const { id } = req.params;
      const movie = await Movie.findById(id);
      
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No images uploaded' });
      }

      const uploadDir = path.join(__dirname, '../../public/images/movies', id.toString());
      
      // Create directory if it doesn't exist
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadedImages = [];
      
      for (const file of req.files) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadDir, fileName);
        
        // Move file to upload directory
        fs.renameSync(file.path, filePath);
        
        // Save image path to database
        const imagePath = `/images/movies/${id}/${fileName}`;
        await Movie.addImage(id, imagePath);
        
        uploadedImages.push({
          id: Date.now(),
          path: imagePath
        });
      }

      res.status(201).json({ images: uploadedImages });
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({ error: 'Error uploading images' });
    }
  }

  static async getImages(req, res) {
    try {
      const { id } = req.params;
      const movie = await Movie.findById(id);
      
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      const images = await Movie.getImages(id);
      res.json(images);
    } catch (error) {
      console.error('Error getting images:', error);
      res.status(500).json({ error: 'Error getting images' });
    }
  }

  static async deleteImage(req, res) {
    try {
      const { id, imageId } = req.params;
      const movie = await Movie.findById(id);
      
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      const image = await Movie.getImage(id, imageId);
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      // Delete file from filesystem
      const filePath = path.join(__dirname, '../../public', image.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete image from database
      await Movie.deleteImage(id, imageId);

      res.json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ error: 'Error deleting image' });
    }
  }
}

module.exports = MovieImageController; 