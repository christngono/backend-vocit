const express = require('express');
const router = express.Router();

const {
  createVocit,
  voteVocit,
  getVocitWithStats,
  getGlobalStats,
  updateVocit,
  deleteVocit,
  getAllVocits
} = require('../controllers/vocitController');

const isAuthenticated = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/upload');

/**
 * @swagger
 * tags:
 *   name: Vocits
 *   description: Endpoints pour gérer les publications (vocits)
 */

/**
 * @swagger
 * /api/vocits:
 *   get:
 *     summary: Récupérer tous les vocits
 *     tags: [Vocits]
 *     responses:
 *       200:
 *         description: Liste de tous les vocits
 */
router.get('/', getAllVocits);

/**
 * @swagger
 * /api/vocits/{id}:
 *   get:
 *     summary: Obtenir un vocit par ID avec ses statistiques
 *     tags: [Vocits]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du vocit
 *     responses:
 *       200:
 *         description: Détails du vocit
 *       404:
 *         description: Vocit non trouvé
 */
router.get('/:id', getVocitWithStats);

/**
 * @swagger
 * /api/vocits/stats-globales:
 *   get:
 *     summary: Récupérer les statistiques globales de tous les vocits
 *     tags: [Vocits]
 *     responses:
 *       200:
 *         description: Statistiques globales des votes
 */
router.get('/stats-globales', getGlobalStats);

/**
 * @swagger
 * /api/vocits/{vocitId}/vote:
 *   post:
 *     summary: Voter ou changer son vote sur un vocit
 *     tags: [Vocits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: vocitId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du vocit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - choice
 *             properties:
 *               choice:
 *                 type: string
 *                 enum: [pour, contre, abstention]
 *                 example: "pour"
 *     responses:
 *       200:
 *         description: Vote enregistré ou mis à jour
 *       400:
 *         description: Données invalides
 */
router.post('/:vocitId/vote', isAuthenticated, voteVocit);

/**
 * @swagger
 * /api/vocits:
 *   post:
 *     summary: Créer un nouveau vocit (admin uniquement)
 *     tags: [Vocits]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titre
 *               - mediaType
 *             properties:
 *               titre:
 *                 type: string
 *                 example: "Projet de loi sur l’environnement"
 *               descriptif:
 *                 type: string
 *                 example: "Ce projet vise à réduire les émissions de CO2."
 *               mediaType:
 *                 type: string
 *                 enum: [image, video, audio]
 *               categorie:
 *                 type: string
 *                 example: "Écologie"
 *               tags:
 *                 type: string
 *                 example: "loi,écologie,2025"
 *               media:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Vocit créé avec succès
 *       400:
 *         description: Erreur de validation ou format
 */
router.post('/', isAuthenticated, isAdmin, upload.single('media'), createVocit);

/**
 * @swagger
 * /api/vocits/{id}:
 *   put:
 *     summary: Mettre à jour un vocit (admin uniquement)
 *     tags: [Vocits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du vocit à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titre:
 *                 type: string
 *               descriptif:
 *                 type: string
 *               categorie:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               mediaType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vocit mis à jour
 *       404:
 *         description: Vocit non trouvé
 */
router.put('/:id', isAuthenticated, isAdmin, updateVocit);

/**
 * @swagger
 * /api/vocits/{id}:
 *   delete:
 *     summary: Supprimer un vocit (admin uniquement)
 *     tags: [Vocits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du vocit à supprimer
 *     responses:
 *       200:
 *         description: Vocit supprimé
 *       404:
 *         description: Vocit non trouvé
 */
router.delete('/:id', isAuthenticated, isAdmin, deleteVocit);

module.exports = router;
