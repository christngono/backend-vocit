const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * tags:
 *   name: Authentification
 *   description: Routes pour l'authentification et l'inscription
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connexion via numéro de téléphone
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "699999999"
 *               password:
 *                 type: string
 *                 example: "MonPassword@123"
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token et les infos utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     pseudo:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Enregistrement d’un nouvel utilisateur
 *     tags: [Authentification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pseudo
 *               - phone
 *               - password
 *               - confirmPassword
 *             properties:
 *               pseudo:
 *                 type: string
 *                 example: "john_doe"
 *               phone:
 *                 type: string
 *                 example: "612345678"
 *               password:
 *                 type: string
 *                 example: "MotDePasse@2024"
 *               confirmPassword:
 *                 type: string
 *                 example: "MotDePasse@2024"
 *               role:
 *                 type: string
 *                 example: "user"
 *               region:
 *                 type: string
 *                 example: "Douala"
 *     responses:
 *       201:
 *         description: Utilisateur enregistré avec succès
 *       400:
 *         description: Erreur de validation (mot de passe faible, numéro ou pseudo existant, etc.)
 */
router.post('/register', authController.register);

module.exports = router;
