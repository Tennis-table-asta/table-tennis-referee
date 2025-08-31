import React from 'react';
import { MatchState, Player } from '../types';
import Confetti from '../components/Confetti';

interface SpectateurProps {
  matchState: MatchState | null;
  isConnected: boolean;
}

const Spectateurs: React.FC<SpectateurProps> = ({ matchState, isConnected }) => {
  if (!matchState) {
    return (
      <div className="min-h-screen bg-sport-gradient flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-8xl mb-8">🏓</div>
          <h1 className="text-4xl font-bold mb-4">TENNIS DE TABLE</h1>
          <p className="text-xl text-white/70">En attente d'un match...</p>
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
    status, 
    coteActuel = { A: 'gauche', B: 'droite' }, 
    changementCoteEffectue = false 
  } = matchState;
  const setsWonA = setsHistory.filter(([a, b]) => a > b).length;
  const setsWonB = setsHistory.filter(([a, b]) => b > a).length;
  
  // Vue inversée pour les spectateurs (miroir de l'arbitre)
  const getPlayerOrder = () => {
    // Les spectateurs voient l'inverse de l'arbitre
    const playerALeft = coteActuel.A === 'droite'; // Inversé par rapport à l'arbitre
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

  const getScoreBarWidth = (score: number) => {
    const maxScore = Math.max(scoreActuel[0], scoreActuel[1], 11);
    return Math.min((score / maxScore) * 100, 100);
  };

  const renderSetScore = (setIndex: number) => {
    const setScore = setsHistory[setIndex];
    if (!setScore) {
      return (
        <div key={setIndex} className="text-center">
          <div className="text-white/50 font-bold">SET {setIndex + 1}</div>
          <div className="text-white/30">-</div>
          <div className="text-white/30">-</div>
        </div>
      );
    }

    return (
      <div key={setIndex} className="text-center">
        <div className="text-white/70 font-bold text-sm">SET {setIndex + 1}</div>
        <div className={`text-xl font-bold ${setScore[0] > setScore[1] ? 'text-accent' : 'text-white'}`}>
          {setScore[0]}
        </div>
        <div className={`text-xl font-bold ${setScore[1] > setScore[0] ? 'text-accent' : 'text-white'}`}>
          {setScore[1]}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-sport-gradient p-8">
      <Confetti show={status === 'finished'} />
      {!isConnected && (
        <div className="fixed top-4 right-4 bg-red-500/20 border border-red-500/50 rounded-lg px-4 py-2">
          <span className="text-red-300">⚡ Connexion perdue</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">🏓 TENNIS DE TABLE</h1>
          <div className="text-3xl text-white/80 font-semibold">
            MANCHE {mancheActuelle}/5
            {mancheActuelle === 5 && <span className="text-red-400 animate-pulse ml-4">⚠️ BELLE</span>}
          </div>
          {getSideChangeMessage() && (
            <div className="mt-4 bg-orange-500/20 border border-orange-500/50 rounded-lg p-3 max-w-2xl mx-auto">
              <span className="text-orange-300 text-xl">{getSideChangeMessage()}</span>
            </div>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-8">
          <div className="grid grid-cols-3 gap-8 items-center mb-8">
            {/* Joueur à gauche (vue spectateurs) */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                {playerOrder.leftName}
              </h2>
              <div className="text-8xl font-bold text-white mb-4">{playerOrder.leftScore}</div>
              <div className="w-full bg-white/20 rounded-full h-4 mb-2">
                <div 
                  className="bg-primary h-4 rounded-full transition-all duration-500"
                  style={{ width: `${getScoreBarWidth(playerOrder.leftScore)}%` }}
                ></div>
              </div>
            </div>

            <div className="text-center">
              <div className="text-6xl font-bold text-white/50 mb-8">VS</div>
              <div className="text-8xl">🏓</div>
            </div>

            {/* Joueur à droite (vue spectateurs) */}
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                {playerOrder.rightName}
              </h2>
              <div className="text-8xl font-bold text-white mb-4">{playerOrder.rightScore}</div>
              <div className="w-full bg-white/20 rounded-full h-4 mb-2">
                <div 
                  className="bg-secondary h-4 rounded-full transition-all duration-500"
                  style={{ width: `${getScoreBarWidth(playerOrder.rightScore)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-secondary/20 rounded-xl p-6 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                🏓 {serveur === 'A' ? config.joueurA : config.joueurB} AU SERVICE
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6">
            <h3 className="text-2xl font-bold text-white text-center mb-6">SCORE DES SETS</h3>
            <div className="grid grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-white/70 font-bold text-sm">SETS</div>
                <div className="text-xl font-bold text-accent">{setsWonA}</div>
                <div className="text-xl font-bold text-secondary">{setsWonB}</div>
              </div>
              {[0, 1, 2, 3, 4].map(renderSetScore)}
            </div>
          </div>

          {status === 'finished' && (
            <div className="mt-8 bg-accent/20 border-2 border-accent rounded-xl p-8 text-center victory-glow match-finished">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-4xl font-bold text-accent mb-4">MATCH TERMINÉ</h2>
              <p className="text-2xl text-white">
                Vainqueur: {setsWonA > setsWonB ? config.joueurA : config.joueurB}
              </p>
              <p className="text-xl text-white/70 mt-2">
                Score final: {setsWonA} - {setsWonB}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Spectateurs;