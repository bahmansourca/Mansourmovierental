const Movie = require('../models/Movie');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const sharp = require('sharp');
require('dotenv').config();

class MovieImageDownloadController {
  static async downloadAndAddImages(req, res) {
    try {
      const { id } = req.params;
      const movie = await Movie.findById(id);
      
      if (!movie) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      // Search for movie in TMDB
      const searchResponse = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: process.env.TMDB_API_KEY,
          query: movie.title,
          year: movie.releaseYear
        }
      });

      if (!searchResponse.data.results || searchResponse.data.results.length === 0) {
        return res.status(404).json({ error: 'Movie not found in TMDB' });
      }

      const tmdbMovie = searchResponse.data.results[0];
      
      // Get movie details including images
      const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${tmdbMovie.id}/images`, {
        params: {
          api_key: process.env.TMDB_API_KEY
        }
      });

      const uploadDir = path.join(__dirname, '../../public/images/movies', id.toString());
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const downloadedImages = [];
      const baseImageUrl = 'https://image.tmdb.org/t/p/original';

      // Download poster
      if (tmdbMovie.poster_path) {
        const posterUrl = `${baseImageUrl}${tmdbMovie.poster_path}`;
        await this.downloadAndProcessImage(posterUrl, uploadDir, id, 'poster', downloadedImages);
      }

      // Download backdrop
      if (tmdbMovie.backdrop_path) {
        const backdropUrl = `${baseImageUrl}${tmdbMovie.backdrop_path}`;
        await this.downloadAndProcessImage(backdropUrl, uploadDir, id, 'backdrop', downloadedImages);
      }

      // Download additional images if available
      if (detailsResponse.data.backdrops) {
        for (let i = 0; i < Math.min(3, detailsResponse.data.backdrops.length); i++) {
          const imageUrl = `${baseImageUrl}${detailsResponse.data.backdrops[i].file_path}`;
          await this.downloadAndProcessImage(imageUrl, uploadDir, id, `scene-${i}`, downloadedImages);
        }
      }

      res.status(201).json({ 
        message: 'Images downloaded and added successfully',
        images: downloadedImages
      });
    } catch (error) {
      console.error('Error in downloadAndAddImages:', error);
      res.status(500).json({ error: 'Error downloading and adding images' });
    }
  }

  static async downloadAndProcessImage(imageUrl, uploadDir, movieId, imageType, downloadedImages) {
    try {
      const response = await axios({
        method: 'GET',
        url: imageUrl,
        responseType: 'arraybuffer'
      });

      const fileName = `${Date.now()}-${imageType}.jpg`;
      const filePath = path.join(uploadDir, fileName);

      // Process image with sharp
      await sharp(response.data)
        .resize(imageType === 'poster' ? 800 : 1920, imageType === 'poster' ? 1200 : 1080, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ quality: 80 })
        .toFile(filePath);

      // Save image path to database
      const imagePath = `/images/movies/${movieId}/${fileName}`;
      await Movie.addImage(movieId, imagePath);

      downloadedImages.push({
        id: Date.now(),
        path: imagePath,
        type: imageType,
        originalUrl: imageUrl
      });
    } catch (error) {
      console.error(`Error downloading ${imageType} image:`, error);
    }
  }
}

module.exports = MovieImageDownloadController; 