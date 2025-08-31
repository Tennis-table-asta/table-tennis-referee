# Application d'Arbitrage Tennis de Table

Application web d'arbitrage de tennis de table avec interface multi-écrans en temps réel.

## Structure

```
table-tennis-referee/
├── client/         # React frontend (interface arbitre + spectateurs)
├── server/         # Node.js backend (WebSocket + API)
└── README.md
```

## Démarrage rapide

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement (client + server)
npm run dev
```

## Routes

- `/` - Page d'accueil (choix du mode)
- `/setup` - Configuration du match  
- `/arbitre` - Interface arbitre (tablette)
- `/spectateurs` - Affichage public (TV/PC)
- `/historique` - Historique des points
- `/statistiques` - Statistiques du match

## Technologies

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Socket.io
- **Communication**: WebSockets temps réel
- **Persistance**: localStorage