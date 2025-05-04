# MansourMovieRental

Une application web de location de films développée avec Node.js, Express et SQLite.

## Fonctionnalités

- Inscription et connexion des utilisateurs
- Affichage des films disponibles
- Location de films
- Notation des films
- Visionnage des bandes-annonces
- Gestion du profil utilisateur

## Technologies utilisées

- Frontend : HTML, CSS, JavaScript
- Backend : Node.js, Express
- Base de données : SQLite
- Authentification : JWT

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/votre-username/MansourMovieRental.git
cd MansourMovieRental
```

2. Installez les dépendances :
```bash
npm install
```

3. Créez un fichier `.env` à la racine du projet avec les variables suivantes :
```
JWT_SECRET=votre-clé-secrète
PORT=3001
```

4. Initialisez la base de données :
```bash
node src/db/init.js
```

5. Démarrez le serveur :
```bash
node index.js
```

## Structure du projet

```
MansourMovieRental/
├── public/             # Fichiers statiques
│   ├── css/           # Styles CSS
│   ├── js/            # Scripts JavaScript
│   └── images/        # Images
├── src/               # Code source
│   ├── routes/        # Routes API
│   ├── middleware/    # Middleware
│   └── db/           # Configuration de la base de données
├── .env              # Variables d'environnement
├── .gitignore        # Fichiers ignorés par Git
├── index.js          # Point d'entrée
└── README.md         # Documentation
```

## Licence

Ce projet est sous licence MIT. 