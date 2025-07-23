const mongoose = require('mongoose');

const regionsCameroun = [
  "Adamaoua",
  "Centre",
  "Est",
  "Extrême-Nord",
  "Littoral",
  "Nord",
  "Nord-Ouest",
  "Ouest",
  "Sud",
  "Sud-Ouest"
];

const userSchema = new mongoose.Schema({
  pseudo: { type: String, required: true, unique: true }, // Ajout de unique: true
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  region: {
    type: String,
    enum: regionsCameroun,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

module.exports = mongoose.model('User', userSchema);
