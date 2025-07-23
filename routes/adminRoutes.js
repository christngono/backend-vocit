const express = require('express');
const router = express.Router();
const User = require('../models/User');

const isAuthenticated = require('../middleware/auth'); // ✅ Import correct
const isAdmin = require('../middleware/isAdmin'); // ✅ Import correct

router.get('/users', isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

module.exports = router;
