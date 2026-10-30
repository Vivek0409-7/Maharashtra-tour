const express = require('express');
const router = express.Router();
const { generateItinerary, getSavedItineraries } = require('../controllers/plannerController');

router.post('/generate', generateItinerary);
router.get('/saved', getSavedItineraries);

module.exports = router;