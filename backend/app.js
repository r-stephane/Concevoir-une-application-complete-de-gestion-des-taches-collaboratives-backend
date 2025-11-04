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

// Middleware CSP pour résoudre l'erreur favicon
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data: https:; connect-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self' data:"
  );
  next();
});

// Middleware to handle any json payload data sent from a client
app.use(express.json());
app.use(cors());

// Routes
app.use("/clients", routeClient);
app.use("/users", userRouter);

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