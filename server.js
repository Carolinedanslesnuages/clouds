import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', // Autoriser les requêtes locales pour le développement
    'https://clouds-blue-two.vercel.app' // Remplace par ton domaine Vercel
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS, // Ton email
    pass: process.env.EMAIL_PASSWORD // Mot de passe d'application Gmail
  }
});

// Vérification du transporteur
transporter.verify((error, success) => {
  if (error) {
    console.error('Erreur de connexion au service email :', error);
  } else {
    console.log('Transporteur d\'email prêt à l\'envoi');
  }
});

// Route pour soumettre l'humeur
app.post('/api/submit-mood', async (req, res) => {
  const { mood, comment } = req.body;

  const date = new Date().toLocaleDateString('fr-FR');
  const time = new Date().toLocaleTimeString('fr-FR');

  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: process.env.EMAIL_ADDRESS,
    subject: `Baromètre du bien-être - Nouveau retour ${date}`,
    html: `
      <h2>Nouveau retour d'humeur</h2>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Heure:</strong> ${time}</p>
      <p><strong>Humeur:</strong> ${mood}</p>
      <p><strong>Commentaire:</strong> ${comment || '(Aucun commentaire)'}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès');
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email :', error.message);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
  }
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
