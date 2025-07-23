// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Non autorisé.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    console.log('User trouvé :', req.user);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide.' });
  }
};

module.exports = isAuthenticated; // 👈 export par défaut
