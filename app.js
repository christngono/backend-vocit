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

// Middlewares
app.use(express.json());

app.use(cors({
 origin: ['http://localhost:3000', 'https://vocit-api.onrender.com', '*'],
credentials: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 💡 Swagger configuration améliorée
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Vocits',
      version: '1.0.0',
      description: 'Documentation Swagger pour l\'API Vocits (votes citoyens)'
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Serveur de développement'
      },
      {
    url: 'https://vocit-api.onrender.com',
    description: 'Serveur Render'
  }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js'], // 🧠 Détection automatique des annotations Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vocits', vocitRoutes);
app.use('/api/admin', adminRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connecté'))
.catch(err => console.error('❌ Erreur MongoDB :', err));

// Lancement du serveur
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`✅ Serveur démarré sur le port ${PORT}`));
