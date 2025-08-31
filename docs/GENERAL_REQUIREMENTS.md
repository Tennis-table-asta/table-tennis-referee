# Prompt pour Claude Code : Application d'Arbitrage Tennis de Table

## 🎯 OBJECTIF
Développer une application web d'arbitrage de tennis de table avec interface multi-écrans (arbitre + spectateurs) en temps réel, style sportif moderne.

## 📋 SPÉCIFICATIONS FONCTIONNELLES DÉTAILLÉES

### **Architecture Générale**
- **Frontend** : React + TypeScript + Tailwind CSS
- **Backend** : Node.js + Express + Socket.io
- **Communication** : WebSockets temps réel
- **Persistance** : localStorage (gestion déconnexion)
- **Déploiement** : Structure monorepo (client + server)

### **Structure des Routes**
```
/                    - Page d'accueil (choix du mode)
/setup              - Configuration du match
/arbitre            - Interface de contrôle arbitre (tablette)
/spectateurs        - Affichage public (TV/ordinateur)  
/historique         - Historique détaillé des points
/statistiques       - Stats du match en cours
```

### **Règles Tennis de Table à Implémenter**
- **Format** : Match au meilleur des 5 manches (3 gagnantes)
- **Points par manche** : 11 points avec 2 points d'écart minimum
- **Prolongation** : Si 10-10, continuer jusqu'à 2 points d'écart
- **Service** : 
  - Premier serveur saisi manuellement par l'arbitre
  - 2 services consécutifs par joueur
  - À partir de 10-10 : alternance à chaque point
  - Changement de premier serveur à chaque manche
- **Simple** : Service libre sur toute la table
- **Double** : Service en diagonale obligatoire, alternance des partenaires

### **Interface Arbitre (Tablette - Portrait)**
```
┌─────────────────────────────────┐
│      MANCHE 2/5 - SET 1-1       │
├─────────────────────────────────┤
│  JOUEUR A     vs     JOUEUR B   │
│      8                  6       │
│   [+1]  [-1]        [+1]  [-1]  │
├─────────────────────────────────┤
│    🏓 JOUEUR A SERT (2/2)       │
├─────────────────────────────────┤
│ Sets: [11-9] [6-11] [8-6*]      │
├─────────────────────────────────┤
│     [ANNULER DERNIER POINT]     │
│     [NOUVELLE MANCHE]           │
│     [STATISTIQUES]              │
└─────────────────────────────────┘
```

### **Interface Spectateurs (TV/PC - Paysage)**
```
┌───────────────────────────────────────────────────────────┐
│                    TENNIS DE TABLE                        │
│                     MANCHE 2/5                           │
├─────────────────┬─────────────┬─────────────────────────┤
│    JOUEUR A     │      VS     │       JOUEUR B          │
│       8         │             │         6               │
│   ████████      │     🏓      │     ██████              │
├─────────────────┼─────────────┼─────────────────────────┤
│              JOUEUR A SERT                              │
├─────────────────────────────────────────────────────────┤
│ SETS  │  SET 1  │  SET 2  │  SET 3  │  SET 4  │  SET 5  │
│   A   │   11    │    6    │   8*    │    -    │    -    │
│   B   │    9    │   11    │   6*    │    -    │    -    │
└─────────────────────────────────────────────────────────┘
```

## 🎨 DESIGN "AMBIANCE SPORTIVE"

### **Palette de Couleurs**
- **Primaire** : Bleu énergique (#1E40AF)
- **Secondaire** : Orange vif (#F97316)  
- **Accent** : Vert sport (#16A34A)
- **Neutre** : Gris moderne (#64748B)
- **Fond** : Dégradé sombre (#0F172A → #1E293B)

### **Typographie & Style**
- Police moderne : Inter/Roboto
- Tailles grandes et lisibles
- Animations fluides (score, changements)
- Icônes sportives (🏓, ⚡, 🎯)
- Ombres et effets de profondeur
- Design responsive complet

### **Animations à Implémenter**
- Transition point marqué (effet flash)
- Changement de serveur (rotation icône)
- Fin de manche (effet célébration)
- Décompte prolongation (pulsation)

## 🔧 FONCTIONNALITÉS TECHNIQUES DÉTAILLÉES

### **1. Configuration du Match (/setup)**
```typescript
interface MatchConfig {
  typeMatch: 'simple' | 'double';
  joueurA: string;
  joueurB: string;
  equipierA?: string; // Si double
  equipierB?: string; // Si double
  premierServeur: 'A' | 'B';
}
```

### **2. État du Match (Store Global)**
```typescript
interface MatchState {
  config: MatchConfig;
  mancheActuelle: number;
  scoreActuel: [number, number];
  setsHistory: Array<[number, number]>;
  serveur: 'A' | 'B';
  servicesRestants: number;
  historique: HistoriquePoint[];
  statistiques: MatchStats;
  status: 'setup' | 'playing' | 'paused' | 'finished';
}
```

### **3. Historique des Points**
```typescript
interface HistoriquePoint {
  id: string;
  timestamp: Date;
  manche: number;
  avant: [number, number];
  apres: [number, number];
  gagnant: 'A' | 'B';
  serveur: 'A' | 'B';
  typePoint: 'normal' | 'service' | 'faute';
}
```

### **4. Statistiques en Temps Réel**
```typescript
interface MatchStats {
  pointsService: { A: number; B: number };
  pointsRetour: { A: number; B: number };
  dureeManches: number[];
  plusLongueSequence: { joueur: 'A' | 'B'; points: number };
  pourcentageService: { A: number; B: number };
}
```

## 🌐 COMMUNICATION WEBSOCKET

### **Événements à Gérer**
```typescript
// Client → Server
'point-scored' : { joueur: 'A' | 'B' }
'undo-point'   : {}
'new-set'      : {}
'match-config' : MatchConfig

// Server → Client  
'match-update'     : MatchState
'connection-lost'  : { timestamp: Date }
'reconnected'      : { state: MatchState }
```

### **Gestion des Déconnexions**
- Sauvegarde auto toutes les 10s dans localStorage
- Message "Connexion perdue" avec icône
- Tentative reconnexion automatique
- Restauration état depuis localStorage si échec

## 📱 RESPONSIVE & UX

### **Interface Arbitre (Tablette)**
- Boutons larges et tactiles (min 44px)
- Feedback haptic simulé (animations)
- Mode portrait optimisé
- Swipe pour naviguer entre écrans

### **Interface Spectateurs (TV/PC)**
- Mode paysage plein écran
- Texte visible à distance (grandes tailles)
- Animations attrayantes
- Auto-refresh si déconnexion

## 🚀 PLAN DE DÉVELOPPEMENT (1H MAX)

### **Phase 1 (20min) - Structure de base**
- Setup projet React + Node.js
- Routing et navigation
- Composants de base (scores, boutons)

### **Phase 2 (25min) - Logique métier**
- Gestion des états de match
- Règles tennis de table
- WebSocket basique

### **Phase 3 (15min) - Design & finitions**
- Styling sportif complet
- Animations principales
- Tests rapides multi-écrans

## ⚙️ COMMANDES DE DÉVELOPPEMENT

### **Structure des dossiers demandée**
```
table-tennis-referee/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Composants réutilisables
│   │   ├── pages/          # Pages principales
│   │   ├── hooks/          # Custom hooks
│   │   ├── store/          # Gestion d'état
│   │   └── utils/          # Utilitaires
│   └── public/
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── socket/         # WebSocket handlers
│   │   └── utils/          # Utilitaires serveur
└── README.md
```

### **Scripts package.json**
```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "client": "cd client && npm start",
    "server": "cd server && npm run dev",
    "build": "cd client && npm run build"
  }
}
```

## 🎯 PRIORITÉS DE DÉVELOPPEMENT
1. **CRITIQUE** : Attribution points + affichage score temps réel
2. **IMPORTANT** : Règles service + changements de manche
3. **SOUHAITABLE** : Statistiques + animations avancées
4. **BONUS** : Gestion déconnexions robuste

## ✅ CRITÈRES DE SUCCÈS
- ✅ Interface arbitre fonctionnelle sur tablette
- ✅ Écran spectateurs synchronisé en temps réel
- ✅ Respect des règles tennis de table (service, manches)
- ✅ Design sportif moderne et attractif
- ✅ Bouton annulation fonctionnel
- ✅ Persistance en cas de déconnexion

---

**Note importante** : Prioriser la fonctionnalité sur la perfection. L'objectif est d'avoir une application fonctionnelle en 1 heure qui peut être utilisée pour arbitrer un vrai match de tennis de table.