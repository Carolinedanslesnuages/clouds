import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

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
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur d\'envoi:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});