module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { email } = req.body || {};
    const name = email ? email.split('@')[0] : 'Traveler';
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    const user = {
        id: 'usr_' + Date.now(),
        name: formattedName,
        email: email || 'traveler@aagman.com'
    };

    return res.status(200).json({
        message: 'Signed in successfully',
        user: user,
        token: 'token_' + Date.now()
    });
};
