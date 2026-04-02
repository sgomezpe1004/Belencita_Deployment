import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

// Cargar variables de entorno
dotenv.config({ path: '../.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;
const URI = process.env.MONGODB_URI;

if (!URI) {
  throw new Error('❌ MONGODB_URI no definido en .env.local');
}

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Conexión a MongoDB (sin opciones obsoletas)
mongoose.connect(URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Servidor funcionando' });
});

// Endpoint para sincronizar usuarios
app.post('/api/sync-user', async (req, res) => {
  try {
    const { clerkId, email, firstName, lastName, imageUrl } = req.body;

    if (!clerkId || !email) return res.status(400).json({ error: 'Faltan datos obligatorios' });

    const user = await User.findOneAndUpdate(
      { clerkId },
      { email, firstName, lastName, imageUrl, lastSignIn: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`👤 Usuario sincronizado: ${email}`);
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('❌ Error sincronizando usuario:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar servidor
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));