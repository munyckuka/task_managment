const jwt = require('jsonwebtoken');

exports.ensureAuthenticated = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized. Please log in.' });
};
