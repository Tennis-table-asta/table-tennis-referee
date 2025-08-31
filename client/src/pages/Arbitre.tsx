import React from 'react';
import { MatchState, Player } from '../types';

interface ArbitreProps {
  matchState: MatchState | null;
  scorePoint: (joueur: Player) => void;
  undoPoint: () => void;
  newSet: () => void;
  isConnected: boolean;
}

const Arbitre: React.FC<ArbitreProps> = ({ 
  matchState, 
  scorePoint, 
  undoPoint, 
  newSet, 
  isConnected 
}) => {
  if (!matchState) {
    return (
      <div className="min-h-screen bg-sport-gradient flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Aucun match configuré</h1>
          <p>Veuillez configurer un match d'abord.</p>
        </div>
      </div>
    );
  }

  const { 
    config, 
    mancheActuelle, 
    scoreActuel, 
    setsHistory, 
    serveur, 
    servicesRestants, 
    status, 
    coteActuel = { A: 'gauche', B: 'droite' }, 
    changementCoteEffectue = false 
  } = matchState;
  const setsWonA = setsHistory.filter(([a, b]) => a > b).length;
  const setsWonB = setsHistory.filter(([a, b]) => b > a).length;
  
  // Détermine l'ordre d'affichage des joueurs (le joueur à gauche s'affiche à gauche)
  const getPlayerOrder = () => {
    const playerALeft = coteActuel.A === 'gauche';
    if (playerALeft) {
      return {
        leftPlayer: 'A' as Player,
        rightPlayer: 'B' as Player,
        leftName: config.joueurA,
        rightName: config.joueurB,
        leftScore: scoreActuel[0],
        rightScore: scoreActuel[1]
      };
    } else {
      return {
        leftPlayer: 'B' as Player,
        rightPlayer: 'A' as Player,
        leftName: config.joueurB,
        rightName: config.joueurA,
        leftScore: scoreActuel[1],
        rightScore: scoreActuel[0]
      };
    }
  };
  
  const getSideChangeMessage = () => {
    if (mancheActuelle === 5 && !changementCoteEffectue) {
      const maxScore = Math.max(scoreActuel[0], scoreActuel[1]);
      if (maxScore === 4) {
        return "⚠️ ATTENTION : Changement de côté au prochain point !";
      }
      return `🔄 Changement de côté à 5 points (actuellement ${maxScore})`;
    }
    
    if (mancheActuelle === 5 && changementCoteEffectue) {
      return "✅ Changement de côté effectué";
    }
    
    return "";
  };
  
  const playerOrder = getPlayerOrder();

  const getSetDisplay = (sets: Array<[number, number]>, currentScore: [number, number]) => {
    const allSets = [...sets];
    if (status === 'playing') {
      allSets.push(currentScore);
    }
    return allSets;
  };

  return (
    <div className="min-h-screen bg-sport-gradient p-4">
      <div className="max-w-md mx-auto">
        {!isConnected && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4 text-center">
            <span className="text-red-300">⚡ Connexion perdue</span>
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">
              MANCHE {mancheActuelle}/5 - SET {setsWonA}-{setsWonB}
              {mancheActuelle === 5 && <span className="text-red-400 animate-pulse ml-2">⚠️ BELLE</span>}
            </h1>
            <div className="text-white/70">🏓 Tennis de Table</div>
            {getSideChangeMessage() && (
              <div className="mt-2 bg-orange-500/20 border border-orange-500/50 rounded-lg p-2">
                <span className="text-orange-300 text-sm">{getSideChangeMessage()}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Joueur à gauche */}
            <div className="text-center">
              <h2 className="text-white font-bold text-lg mb-2">
                {playerOrder.leftName}
              </h2>
              <div className="bg-primary/30 rounded-lg p-4 mb-3">
                <div className="text-4xl font-bold text-white">{playerOrder.leftScore}</div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => scorePoint(playerOrder.leftPlayer)}
                  className="w-full bg-accent hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform active:scale-95"
                  disabled={status !== 'playing'}
                >
                  +1
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-white font-bold text-xl">VS</div>
            </div>

            {/* Joueur à droite */}
            <div className="text-center">
              <h2 className="text-white font-bold text-lg mb-2">
                {playerOrder.rightName}
              </h2>
              <div className="bg-primary/30 rounded-lg p-4 mb-3">
                <div className="text-4xl font-bold text-white">{playerOrder.rightScore}</div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => scorePoint(playerOrder.rightPlayer)}
                  className="w-full bg-accent hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform active:scale-95"
                  disabled={status !== 'playing'}
                >
                  +1
                </button>
              </div>
            </div>
          </div>

          <div className="bg-secondary/20 rounded-lg p-4 mb-6 text-center">
            <div className="text-white font-bold text-lg">
              🏓 {serveur === 'A' ? config.joueurA : config.joueurB} SERT ({servicesRestants}/2)
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <h3 className="text-white font-bold mb-3 text-center">SETS</h3>
            <div className="space-y-2">
              {getSetDisplay(setsHistory, scoreActuel).map((set, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-white/70">SET {index + 1}</span>
                  <div className="flex space-x-2">
                    <span className={`px-3 py-1 rounded ${set[0] > set[1] ? 'bg-accent/50 text-white' : 'text-white/70'}`}>
                      {set[0]}
                    </span>
                    <span className="text-white/50">-</span>
                    <span className={`px-3 py-1 rounded ${set[1] > set[0] ? 'bg-accent/50 text-white' : 'text-white/70'}`}>
                      {set[1]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={undoPoint}
              className="w-full bg-neutral hover:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg transition-all"
              disabled={status !== 'playing' || matchState.historique.length === 0}
            >
              ↶ ANNULER DERNIER POINT
            </button>

            {status === 'finished' && (
              <div className="bg-accent/20 border border-accent rounded-lg p-4 text-center victory-glow match-finished">
                <h2 className="text-accent font-bold text-xl mb-2">🎉 MATCH TERMINÉ</h2>
                <p className="text-white">
                  Vainqueur: {setsWonA > setsWonB ? config.joueurA : config.joueurB}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Arbitre;