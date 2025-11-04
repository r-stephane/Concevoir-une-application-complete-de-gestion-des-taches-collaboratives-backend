require("dotenv").config();
const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const routeClient = require("./routers/routeClient");
const userRouter = require("./routers/userRouter.js");
const authMiddleware = require("./middlewares/authMiddleware");

const app = express();
const PORT = process.env.PORT;

// Connecter la base de données
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database successfully.");
  })
  .catch((error) => {
    console.log("Connection to database failed:::", error);
  });

// Middleware CORS en premier
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Middleware CSP CORRIGÉ - version simplifiée et fonctionnelle
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https://concevoir-une-application-complete-de.onrender.com; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'"
  );
  next();
});

// Routes
app.use("/clients", routeClient);
app.use("/users", userRouter);

// Route pour servir le favicon explicitement
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // No Content - si vous n'avez pas de favicon
});

app.post('/register', (req, res) => {
  console.log(req.body); 
  res.json({ message: 'Utilisateur enregistré avec succès' });
});

app.post('/clients', (req, res) => {
  res.send('Client ajouté');
});

app.post('/login', (req, res) => {
  res.send('Utilisateur connecté');
});

app.post('/logout', (req, res) => {
  res.send('Utilisateur déconnecté');
});

app.get("/test", authMiddleware, (req, res) => {
  res.send({ message: "message" });
});

// Écoute le port
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});