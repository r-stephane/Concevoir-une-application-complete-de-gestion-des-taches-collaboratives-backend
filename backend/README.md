# API authentification des urlisateurs
L’authentification des utilisateurs sert à vérifier leur identité afin de sécuriser l’accès aux données et fonctionnalités réservées de l’application.

 ## Fonctionnalités

- Enregistrer un utilisateur
- Connecter un utilisateur
- Envoi un mail de confirmation à l'utilisateur
- Modifier le mot passe
  
 ## Technologies utilisées

- Node.js
- Express.js 
- MongoDB
- Dotenv
- uuid :identifint unique qui attribue un nombre unique à un jeton
- jesonwebtoken tester l'authentification
- bcrypt:permet de chiffrer un mot de passe
- nodemailler qui transpoter des emails

## Processus d'installation et d'utilisation 
1- Clonez le projet 

```
git clone git@github.com:Hounaida-ali/projet-authentification-utilisateur.git

```
2-Accéder au dossier du projet
```
cd projet-authentification-utilisateur/
code .

```

3-nstaller les dépendances
```
npm install

```
4-lancer le serveur en mode developpement
```
npm run dev

```

## Authentification
### Enregistrement

- l'utilisateur doit entrer un nom,un email et un mot de passe
- le mot sera haché avant de stocker dans la base de donnée
- un message de confirmation lui sera envoyer

 ### connexion
 - pour pouvoir se connecter l'utilisateur envoie son email et son mot de passe
 - API vérifie les informations
 - S'ils sont correct, un token JWT est généré et lui renvoyé

### Accès aux routes protégées
- si l'utilisateur veut acceder aux donner on envoie son token dans header  Authorization: Bearer TOKEN
- le middleware à son tour, vérifie le token avantde donner l'autorisation à accéder aux données
   
  


## Test des requêtes
### Methode: `POST`:ajouter un utilisateur.
- URL:`http://localhost:3000/auth/register` 
- Reponse:

  
  <img width="477" height="482" alt="Capture d’écran du 2025-08-04 16-45-01" src="https://github.com/user-attachments/assets/996c323b-2c21-44bd-9e36-67adb6f6d5f7" />



<img width="900" height="600" alt="image" src="https://github.com/user-attachments/assets/91019cac-378b-4d11-833c-e7baf1d3ccbf" />
