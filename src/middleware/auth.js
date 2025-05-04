const jwt = require('jsonwebtoken');
const db = require('../db/pgDatabase');

module.exports = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Get user from PostgreSQL
        const { rows } = await db.query('SELECT * FROM users WHERE id = $1', [decoded.id]);
        const user = rows[0];
        
        if (!user) {
            console.error('User not found in database:', decoded.id);
            return res.status(401).json({ error: 'User not found' });
        }

        // Add user info to request
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name
        };
        
        next();
    } catch (error) {
        console.error('Auth error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Server error' });
    }
}; 