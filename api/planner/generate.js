module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { circuit, travelers, date, preferences } = req.body || {};
    const c = circuit || 'Heritage Tour';

    const journey = {
        _id: 'j_' + Date.now(),
        circuit: c,
        travelers: travelers || '2-4 Family/Friends',
        date: date || new Date().toISOString().split('T')[0],
        preferences: preferences || 'Local Maharashtrian cuisine and heritage sightseeing',
        createdAt: new Date().toISOString()
    };

    return res.status(200).json({
        message: 'Itinerary generated successfully by Gemini AI',
        journey: journey
    });
};
