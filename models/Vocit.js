const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const voteSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  choice: {
    type: String,
    enum: ['pour', 'contre', 'abstention'],
    required: true
  }
}, { _id: false });

const vocitSchema = new Schema({
  media: String,
  mediaType: { type: String, enum: ['image', 'video', 'none'], default: 'none' },
  titre: { type: String, required: true },
  descriptif: String,
  categorie: {
    type: String,
    enum: ['politique', 'social', 'économie', 'santé', 'éducation', 'culture', 'autre'],
    default: 'autre'
  },
  tags: [String],
  datePublication: { type: Date, default: Date.now },
  votes: [voteSchema],
  votePour: { type: Number, default: 0 },
  voteContre: { type: Number, default: 0 },
  voteAbstention: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = model('Vocit', vocitSchema);
