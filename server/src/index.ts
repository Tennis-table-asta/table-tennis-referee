import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { MatchState, Player, MatchConfig, HistoriquePoint } from './types';
import { GameRules } from './utils/gameRules';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors());
app.use(express.json());

let currentMatch: MatchState | null = null;

function createInitialStats() {
  return {
    pointsService: { A: 0, B: 0 },
    pointsRetour: { A: 0, B: 0 },
    dureeManches: [],
    plusLongueSequence: { joueur: 'A' as Player, points: 0 },
    pourcentageService: { A: 0, B: 0 }
  };
}

function createNewMatch(config: MatchConfig): MatchState {
  return {
    config,
    mancheActuelle: 1,
    scoreActuel: [0, 0],
    setsHistory: [],
    serveur: config.premierServeur,
    servicesRestants: 2,
    historique: [],
    statistiques: createInitialStats(),
    status: 'playing',
    startTime: new Date(),
    coteActuel: {
      A: config.coteInitialA,
      B: config.coteInitialB
    },
    changementCoteEffectue: false
  };
}

io.on('connection', (socket) => {
  console.log('Client connecté:', socket.id);

  if (currentMatch) {
    socket.emit('match-update', currentMatch);
  }

  socket.on('match-config', (config: MatchConfig) => {
    currentMatch = createNewMatch(config);
    io.emit('match-update', currentMatch);
  });

  socket.on('point-scored', (data: { joueur: Player }) => {
    if (!currentMatch || currentMatch.status !== 'playing') return;

    const oldState = { ...currentMatch };
    const { joueur } = data;
    const [scoreA, scoreB] = currentMatch.scoreActuel;
    const newScore: [number, number] = joueur === 'A' ? [scoreA + 1, scoreB] : [scoreA, scoreB + 1];

    const pointHistorique: HistoriquePoint = {
      id: Date.now().toString(),
      timestamp: new Date(),
      manche: currentMatch.mancheActuelle,
      avant: currentMatch.scoreActuel,
      apres: newScore,
      gagnant: joueur,
      serveur: currentMatch.serveur,
      typePoint: 'normal'
    };

    const serviceState = GameRules.updateServiceState(currentMatch, joueur);

    currentMatch = {
      ...currentMatch,
      scoreActuel: newScore,
      serveur: serviceState.serveur,
      servicesRestants: serviceState.servicesRestants,
      historique: [...currentMatch.historique, pointHistorique]
    };

    // Vérifier s'il faut changer de côtés (règle du 5ème set à 5 points)
    if (GameRules.shouldChangeSides(oldState, currentMatch)) {
      currentMatch.coteActuel = GameRules.changeSides(currentMatch);
      if (currentMatch.mancheActuelle === 5) {
        currentMatch.changementCoteEffectue = true;
      }
    }

    if (GameRules.isSetWon(newScore)) {
      currentMatch.setsHistory.push(newScore);
      
      if (GameRules.isMatchFinished(currentMatch.setsHistory)) {
        currentMatch.status = 'finished';
      } else {
        currentMatch.mancheActuelle++;
        currentMatch.scoreActuel = [0, 0];
        currentMatch.serveur = GameRules.getFirstServerNextSet(
          currentMatch.config.premierServeur,
          currentMatch.mancheActuelle
        );
        currentMatch.servicesRestants = 2;
        
        // Changement de côté à chaque fin de set (tous les sets)
        currentMatch.coteActuel = GameRules.changeSides(currentMatch);
        
        // Reset du flag pour le 5ème set
        if (currentMatch.mancheActuelle === 5) {
          currentMatch.changementCoteEffectue = false;
        }
      }
    }

    io.emit('match-update', currentMatch);
  });

  socket.on('undo-point', () => {
    if (!currentMatch || currentMatch.historique.length === 0) return;

    const lastPoint = currentMatch.historique[currentMatch.historique.length - 1];
    
    if (lastPoint.manche !== currentMatch.mancheActuelle) {
      currentMatch.mancheActuelle = lastPoint.manche;
      currentMatch.setsHistory.pop();
      currentMatch.status = 'playing';
    }

    currentMatch = {
      ...currentMatch,
      scoreActuel: lastPoint.avant,
      serveur: lastPoint.serveur,
      servicesRestants: GameRules.getServicesPerPlayer(lastPoint.avant[0], lastPoint.avant[1]),
      historique: currentMatch.historique.slice(0, -1)
    };

    io.emit('match-update', currentMatch);
  });

  socket.on('new-set', () => {
    if (!currentMatch) return;

    currentMatch = {
      ...currentMatch,
      mancheActuelle: currentMatch.mancheActuelle + 1,
      scoreActuel: [0, 0],
      serveur: GameRules.getFirstServerNextSet(
        currentMatch.config.premierServeur,
        currentMatch.mancheActuelle
      ),
      servicesRestants: 2,
      status: 'playing'
    };

    io.emit('match-update', currentMatch);
  });

  socket.on('disconnect', () => {
    console.log('Client déconnecté:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});