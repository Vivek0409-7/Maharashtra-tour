const { GoogleGenAI } = require('@google/genai');
const Journey = require('../models/Journey');

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

exports.generateItinerary = async (req, res) => {
    try {
        const { circuit, travelers, date, preferences } = req.body;

        if (!circuit) {
            return res.status(400).json({ message: 'Please select a journey circuit.' });
        }

        const prompt = `
You are an expert tour guide for Maharashtra Tourism ("Aagman").
Create a detailed, customized travel itinerary based on these preferences:

- Journey Circuit: ${circuit}
- Travelers Count: ${travelers || 'Not specified'}
- Start Date: ${date || 'Not specified'}
- Special Preferences / Requests: ${preferences || 'None'}

Formatting Rules:
1. Provide a day-by-day itinerary (e.g., Day 1, Day 2, etc.).
2. Include specific places to visit, local Maharashtrian dishes/food recommendations, and night stay options for each day.
3. Tailor the places directly to the requested preferences and selected circuit.
4. Keep the output clean, structured, and easy to read using Markdown formatting with bullet points.
`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt
        });

        const itineraryContent = response.text;

        const newJourney = new Journey({
            user: req.user ? req.user.id : null,
            circuit,
            travelers,
            date,
            preferences,
            itinerary: itineraryContent
        });

        await newJourney.save();

        res.status(200).json({
            message: 'Itinerary generated successfully by Gemini AI',
            journey: newJourney
        });

    } catch (error) {
        console.error('Gemini AI Generation Error:', error.message);
        res.status(500).json({
            message: 'Failed to generate AI itinerary.',
            error: error.message
        });
    }
};

exports.getSavedItineraries = async (req, res) => {
    try {
        const journeys = await Journey.find().sort({ createdAt: -1 });
        res.status(200).json(journeys);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching saved itineraries' });
    }
};