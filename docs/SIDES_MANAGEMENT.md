# Évolution : Gestion des Côtés des Joueurs - Tennis de Table

## 🎯 OBJECTIF DE L'ÉVOLUTION
Ajouter la gestion complète des côtés des joueurs avec les règles officielles du tennis de table, y compris le changement de côté au 5ème set à 5 points.

## 📋 NOUVELLES FONCTIONNALITÉS À IMPLÉMENTER

### **1. Configuration Initiale des Côtés (/setup)**

Ajouter à l'interface de configuration :

```typescript
interface MatchConfig {
  typeMatch: 'simple' | 'double';
  joueurA: string;
  joueurB: string;
  equipierA?: string;
  equipierB?: string;
  premierServeur: 'A' | 'B';
  // ✅ NOUVEAU : Côtés initiaux
  coteInitialA: 'gauche' | 'droite'; // Du point de vue arbitre
  coteInitialB: 'gauche' | 'droite'; // Du point de vue arbitre
}
```

Interface de setup mise à jour :
```
┌─────────────────────────────────────────────┐
│           CONFIGURATION DU MATCH            │
├─────────────────────────────────────────────┤
│ Type: ◉ Simple  ○ Double                    │
├─────────────────────────────────────────────┤
│ Joueur A: [________________]                │
│ Joueur B: [________________]                │
├─────────────────────────────────────────────┤
│         POSITIONNEMENT INITIAL              │
│    (Du point de vue de l'arbitre)           │
│                                             │
│    GAUCHE        TABLE         DROITE       │
│   ┌─────────┐               ┌─────────┐     │
│   │ ○ Jou.A │      🏓       │ ◉ Jou.B │     │
│   │ ◉ Jou.B │               │ ○ Jou.A │     │
│   └─────────┘               └─────────┘     │
├─────────────────────────────────────────────┤
│ Premier serveur:                            │
│ ◉ Joueur A    ○ Joueur B                    │
├─────────────────────────────────────────────┤
│          [COMMENCER LE MATCH]               │
└─────────────────────────────────────────────┘
```

### **2. État du Match Étendu**

```typescript
interface MatchState {
  // ... propriétés existantes
  
  // ✅ NOUVEAU : Gestion des côtés
  coteActuel: {
    A: 'gauche' | 'droite';
    B: 'gauche' | 'droite';
  };
  changementCoteEffectue: boolean; // Pour le 5ème set uniquement
}
```

### **3. Règles de Changement de Côté**

```typescript
// Logique à implémenter
const gererChangementCote = (state: MatchState): MatchState => {
  // Changement normal entre les sets (sets 1-4)
  if (nouvelleManche && mancheActuelle <= 4) {
    return {
      ...state,
      coteActuel: {
        A: state.coteActuel.A === 'gauche' ? 'droite' : 'gauche',
        B: state.coteActuel.B === 'gauche' ? 'droite' : 'gauche'
      }
    };
  }
  
  // ✅ RÈGLE SPÉCIALE : 5ème set (Belle)
  if (mancheActuelle === 5 && !state.changementCoteEffectue) {
    const scoreMax = Math.max(scoreActuel[0], scoreActuel[1]);
    
    // Changement quand un joueur atteint 5 points
    if (scoreMax === 5) {
      return {
        ...state,
        coteActuel: {
          A: state.coteActuel.A === 'gauche' ? 'droite' : 'gauche',
          B: state.coteActuel.B === 'gauche' ? 'droite' : 'gauche'
        },
        changementCoteEffectue: true
      };
    }
  }
  
  return state;
};
```

## 🖥️ INTERFACES MISES À JOUR

### **Interface Arbitre (Vue de face)**
```
┌─────────────────────────────────────┐
│      MANCHE 5/5 - SET 2-2           │
│             ⚠️ BELLE                │
├─────────────────────────────────────┤
│  MARTIN (G)    vs    DUBOIS (D)     │
│      4                    5         │
│   [+1]  [-1]        [+1]  [-1]      │
├─────────────────────────────────────┤
│  🔄 CHANGEMENT DE CÔTÉ À 5 POINTS   │
│     🏓 DUBOIS SERT (1/2)            │
├─────────────────────────────────────┤
│ Sets: [11-8] [9-11] [11-6] [8-11]   │
│       [4-5*]                        │
├─────────────────────────────────────┤
│     [ANNULER DERNIER POINT]         │
│     [STATISTIQUES]                  │
└─────────────────────────────────────┘

Légende: (G) = Gauche, (D) = Droite
```

### **Interface Spectateurs (Vue inversée)**
```
┌───────────────────────────────────────────────────────────┐
│                    TENNIS DE TABLE                        │
│              MANCHE 5/5 - BELLE ⚠️                       │
├─────────────────┬─────────────┬─────────────────────────┤
│    DUBOIS (G)   │      VS     │      MARTIN (D)         │
│       5         │             │         4               │
│   ██████████    │     🏓      │     ████████            │
├─────────────────┼─────────────┼─────────────────────────┤
│           🔄 CHANGEMENT DE CÔTÉ À 5 POINTS              │
│               DUBOIS SERT                               │
├─────────────────────────────────────────────────────────┤
│ SETS  │  SET 1  │  SET 2  │  SET 3  │  SET 4  │  SET 5  │
│ MARTIN│   11    │    9    │   11    │    8    │   4*    │
│ DUBOIS│    8    │   11    │    6    │   11    │   5*    │
└─────────────────────────────────────────────────────────┘

🔄 = Changement de côté effectué
```

## 🎨 AMÉLIORATIONS VISUELLES

### **Indicateurs Visuels**

1. **Badges de Position** : 
   - (G) pour Gauche
   - (D) pour Droite
   - Couleurs différentes par côté

2. **Animation Changement de Côté** :
   - Effet de rotation 180° des noms
   - Message flash "CHANGEMENT DE CÔTÉ"
   - Son/vibration si possible

3. **Alerte 5ème Set** :
   - Badge "BELLE" clignotant
   - Message "Changement à 5 points"
   - Couleur d'alerte (orange/rouge)

### **CSS/Tailwind pour les Côtés**

```css
.cote-gauche {
  @apply bg-blue-500 text-white px-2 py-1 rounded-l-lg;
}

.cote-droite {
  @apply bg-green-500 text-white px-2 py-1 rounded-r-lg;
}

.changement-cote {
  @apply animate-spin duration-1000;
}

.belle-alert {
  @apply bg-red-500 text-white animate-pulse;
}
```

## 🔄 LOGIQUE DE CHANGEMENT

### **Déclencheurs de Changement**

```typescript
const checkChangementCote = (state: MatchState, newState: MatchState) => {
  // 1. Fin de manche (sauf si déjà en cours de 5ème set)
  if (state.mancheActuelle < newState.mancheActuelle && newState.mancheActuelle <= 5) {
    return true;
  }
  
  // 2. Règle spéciale 5ème set à 5 points
  if (newState.mancheActuelle === 5 && !state.changementCoteEffectue) {
    const maxScore = Math.max(newState.scoreActuel[0], newState.scoreActuel[1]);
    const oldMaxScore = Math.max(state.scoreActuel[0], state.scoreActuel[1]);
    
    // Déclenchement quand on passe de 4 à 5 points
    return maxScore === 5 && oldMaxScore < 5;
  }
  
  return false;
};
```

### **Messages d'Information**

```typescript
const getMessageCote = (state: MatchState): string => {
  if (state.mancheActuelle === 5 && !state.changementCoteEffectue) {
    const maxScore = Math.max(state.scoreActuel[0], state.scoreActuel[1]);
    if (maxScore === 4) {
      return "⚠️ ATTENTION : Changement de côté au prochain point !";
    }
    return `🔄 Changement de côté à 5 points (actuellement ${maxScore})`;
  }
  
  if (state.mancheActuelle === 5 && state.changementCoteEffectue) {
    return "✅ Changement de côté effectué";
  }
  
  return "";
};
```

## 🛠️ MODIFICATIONS À APPORTER

### **1. Composant Setup**
- Ajouter sélecteur de position initiale
- Interface radio buttons pour côtés
- Validation de la configuration

### **2. Store/État Global**
- Étendre `MatchState` avec `coteActuel`
- Ajouter `changementCoteEffectue` pour le 5ème set
- Fonction `gererChangementCote()`

### **3. Interface Arbitre**
- Afficher les côtés à côté des noms
- Messages d'alerte pour changements
- Animation lors des changements

### **4. Interface Spectateurs**
- Inversion complète par rapport à l'arbitre
- Même logique mais affichage miroir
- Synchronisation temps réel des côtés

### **5. WebSocket Events**
- Nouvel événement `'cote-changed'`
- Synchronisation état des côtés
- Persistance dans localStorage

## ✅ TESTS À EFFECTUER

1. **Configuration initiale** : Vérifier sélection côtés
2. **Changements normaux** : Sets 1-4
3. **5ème set** : Changement à exactement 5 points
4. **Synchronisation** : Arbitre ↔ Spectateurs inversés
5. **Persistance** : Sauvegarde des côtés en cas de déconnexion

## 🎯 PRIORITÉ D'IMPLÉMENTATION

1. **CRITIQUE** : Logique changement de côté (règles officielles)
2. **IMPORTANT** : Interface inversée spectateurs
3. **SOUHAITABLE** : Animations et alertes visuelles
4. **BONUS** : Messages d'aide contextuelle

---

**Cette évolution respecte les règles officielles FFTT et améliore significativement l'expérience d'arbitrage !**