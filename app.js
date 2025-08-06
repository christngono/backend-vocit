const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

// Routes
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const vocitRoutes = require('./routes/vocitRoutes');

// Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// ====== MIDDLEWARES ======
app.use(express.json());

// ✅ CORS : liste des domaines autorisés
const allowedOrigins = [
  'http://localhost:3000',
  'https://vocit-api.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    // Autorise les requêtes sans origin (ex: Postman) ou venant des domaines autorisés
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Dossier static pour les fichiers uploadés
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ====== SWAGGER DOC ======
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Vocits',
      version: '1.0.0',
      description: 'Documentation Swagger pour l\'API Vocits (votes citoyens)'
    },
    servers: [
      { url: 'http://localhost:3333', description: 'Serveur de développement' },
      { url: 'https://vocit-api.onrender.com', description: 'Serveur Render' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ====== ROUTES ======
app.use('/api/auth', authRoutes);
app.use('/api/vocits', vocitRoutes);
app.use('/api/admin', adminRoutes);

// ====== MONGODB ======
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB :', err));

// ====== LANCEMENT SERVEUR ======
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur le port ${PORT}`));
