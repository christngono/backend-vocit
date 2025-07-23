const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { pseudo, phone, password, confirmPassword, role, region } = req.body;

  // Vérifie si les mots de passe correspondent
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
  }

  // Vérifie la force du mot de passe
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole."
    });
  }

  // Vérifie le format du téléphone (exemple : 6XXXXXXXX)
  const phoneRegex = /^6\d{8}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: "Le numéro de téléphone doit commencer par 6 et contenir 9 chiffres." });
  }

  // Vérifie si l'utilisateur existe déjà
  const userExists = await User.findOne({ phone });
  if (userExists) {
    return res.status(400).json({ message: "Ce numéro est déjà utilisé." });
  }

  // Vérifie si le pseudo est déjà pris
  const pseudoExists = await User.findOne({ pseudo });
  if (pseudoExists) {
    return res.status(400).json({ message: "Ce pseudo est déjà utilisé." });
  }

  // Hash du mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Création du nouvel utilisateur
  const newUser = new User({
    pseudo,
    phone,
    password: hashedPassword,
    role: role || 'user',
    region // Assure-toi que `region` est bien envoyé depuis le frontend
  });

  await newUser.save();

  res.status(201).json({ message: "Utilisateur enregistré avec succès." });
};

exports.login = async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Identifiants invalides." });
  }

  // Création du token avec ID et rôle
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    user: {
      id: user._id,
      pseudo: user.pseudo,
      role: user.role
    }
  });
};
