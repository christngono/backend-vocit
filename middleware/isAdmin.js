// middleware/isAdmin.js
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Accès refusé. Admin requis.' });
};

module.exports = isAdmin; // ✅ export par défaut
