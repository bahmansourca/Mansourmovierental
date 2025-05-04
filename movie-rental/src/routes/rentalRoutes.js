const express = require('express');
const router = express.Router();
const RentalController = require('../controllers/rentalController');
const authMiddleware = require('../middleware/authMiddleware');

// Toutes les routes de location nécessitent une authentification
router.use(authMiddleware);

router.post('/rent', RentalController.rentMovie);
router.post('/return/:id', RentalController.returnMovie);
router.get('/my-rentals', RentalController.getUserRentals);

module.exports = router; 