const Vocit = require('../models/Vocit');

// Créer un Vocit
const createVocit = async (req, res) => {
  try {
    const { mediaType, titre, descriptif, categorie, tags } = req.body;
    const mediaPath = req.file ? req.file.path : '';

    const parsedTags = typeof tags === 'string'
      ? tags.split(',').map(tag => tag.trim())
      : tags;

    const newVocit = new Vocit({
      titre,
      descriptif,
      mediaType,
      media: mediaPath,
      categorie,
      tags: parsedTags,
    });

    await newVocit.save();
    res.status(201).json({ message: 'Publication créée.', vocit: newVocit });
  } catch (err) {
    console.error('Erreur createVocit:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Voter ou changer son vote
const voteVocit = async (req, res) => {
  try {
    const { choice } = req.body;
    const { vocitId } = req.params;
    const userId = req.user._id.toString();

    if (!['pour', 'contre', 'abstention'].includes(choice)) {
      return res.status(400).json({ message: 'Choix invalide.' });
    }

    const vocit = await Vocit.findById(vocitId);
    if (!vocit) return res.status(404).json({ message: 'Vocit introuvable.' });

    // Chercher un vote existant de l'utilisateur
    const voteIndex = vocit.votes.findIndex(v => v.user.toString() === userId);

    let previousChoice = null;

    if (voteIndex !== -1) {
      // Utilisateur a déjà voté, on récupère l'ancien vote
      previousChoice = vocit.votes[voteIndex].choice;

      // Si le choix est le même, on ne change rien
      if (previousChoice === choice) {
        return res.status(200).json({ message: 'Vote inchangé.' });
      }

      // Mettre à jour le vote
      vocit.votes[voteIndex].choice = choice;
    } else {
      // Ajouter un nouveau vote
      vocit.votes.push({ user: userId, choice });
    }

    // Réinitialiser les compteurs
    vocit.votePour = 0;
    vocit.voteContre = 0;
    vocit.voteAbstention = 0;

    // Recalculer tous les votes
    vocit.votes.forEach(v => {
      if (v.choice === 'pour') vocit.votePour += 1;
      if (v.choice === 'contre') vocit.voteContre += 1;
      if (v.choice === 'abstention') vocit.voteAbstention += 1;
    });

    await vocit.save();
    res.status(200).json({ message: 'Vote enregistré.', vocit });
  } catch (err) {
    console.error('Erreur voteVocit:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Obtenir tous les vocits
const getAllVocits = async (req, res) => {
  try {
    const vocits = await Vocit.find().sort({ createdAt: -1 });
    res.json(vocits);
  } catch (err) {
    console.error('Erreur getAllVocits:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Obtenir un vocit avec stats
const getVocitWithStats = async (req, res) => {
  try {
    const vocit = await Vocit.findById(req.params.id);
    if (!vocit) {
      return res.status(404).json({ message: 'Vocit non trouvé.' });
    }

    const totalVotes = vocit.votes.length;
    const pour = vocit.votePour;
    const contre = vocit.voteContre;
    const abstention = vocit.voteAbstention;

    const stats = {
      pour: totalVotes ? Math.round((pour / totalVotes) * 100) : 0,
      contre: totalVotes ? Math.round((contre / totalVotes) * 100) : 0,
      abstention: totalVotes ? Math.round((abstention / totalVotes) * 100) : 0,
      total: totalVotes,
    };

    res.json({ vocit, stats });
  } catch (err) {
    console.error('Erreur getVocitWithStats:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Modifier un vocit
const updateVocit = async (req, res) => {
  try {
    const updatedVocit = await Vocit.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedVocit) {
      return res.status(404).json({ message: 'Vocit non trouvé.' });
    }
    res.json({ message: 'Vocit mis à jour.', vocit: updatedVocit });
  } catch (err) {
    console.error('Erreur updateVocit:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Supprimer un vocit
const deleteVocit = async (req, res) => {
  try {
    const deletedVocit = await Vocit.findByIdAndDelete(req.params.id);
    if (!deletedVocit) {
      return res.status(404).json({ message: 'Vocit non trouvé.' });
    }
    res.json({ message: 'Vocit supprimé.' });
  } catch (err) {
    console.error('Erreur deleteVocit:', err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};
// Statistiques globales pour tous les vocits
 
// controllers/vocitController.js

const getGlobalStats = async (req, res) => {
  try {
    const vocits = await Vocit.find();

    const stats = vocits.map(vocit => {
      const votes = { pour: 0, contre: 0, abstention: 0 };

      vocit.votes.forEach(vote => {
        votes[vote.choice] += 1;
      });

      return {
        id: vocit._id,
        titre: vocit.titre,
        categorie: vocit.categorie,
        votes,
      };
    });

    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur stats globales' });
  }
};


module.exports = {
  createVocit,
  voteVocit,
  getAllVocits,
  getVocitWithStats,
  getGlobalStats,
  updateVocit,
  deleteVocit,
};
