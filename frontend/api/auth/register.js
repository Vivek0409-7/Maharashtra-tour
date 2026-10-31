module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { name, email } = req.body || {};
    const user = {
        id: 'usr_' + Date.now(),
        name: name || (email ? email.split('@')[0] : 'Traveler'),
        email: email || 'traveler@aagman.com'
    };

    return res.status(200).json({
        message: 'Account created successfully',
        user: user,
        token: 'token_' + Date.now()
    });
};
