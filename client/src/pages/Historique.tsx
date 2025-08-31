import React from 'react';
import { Link } from 'react-router-dom';
import { MatchState, HistoriquePoint } from '../types';

interface HistoriqueProps {
  matchState: MatchState | null;
}

const Historique: React.FC<HistoriqueProps> = ({ matchState }) => {
  if (!matchState) {
    return (
      <div className="min-h-screen bg-sport-gradient flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="text-6xl mb-6">📊</div>
          <h1 className="text-3xl font-bold mb-4">Historique des Points</h1>
          <p className="text-xl text-white/70">Aucun match en cours</p>
        </div>
      </div>
    );
  }

  const { config, historique, setsHistory } = matchState;
  
  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getPointIcon = (point: HistoriquePoint) => {
    switch (point.typePoint) {
      case 'service': return '🏓';
      case 'faute': return '❌';
      default: return '⚡';
    }
  };

  const getScoreColor = (point: HistoriquePoint, player: 'A' | 'B') => {
    if (point.gagnant === player) {
      return 'text-accent font-bold';
    }
    return 'text-white/70';
  };

  const groupedBySet = historique.reduce((acc, point) => {
    if (!acc[point.manche]) {
      acc[point.manche] = [];
    }
    acc[point.manche].push(point);
    return acc;
  }, {} as Record<number, HistoriquePoint[]>);

  return (
    <div className="min-h-screen bg-sport-gradient p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to="/arbitre" 
            className="inline-flex items-center text-white/70 hover:text-white mb-4 transition-all"
          >
            ← Retour à l'arbitrage
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">📊 Historique des Points</h1>
          <div className="text-white/70 text-lg">
            {config.joueurA} vs {config.joueurB}
          </div>
        </div>

        {/* Résumé des sets */}
        {setsHistory.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">Résumé des Sets</h2>
            <div className="grid grid-cols-1 gap-4">
              {setsHistory.map((set, index) => (
                <div key={index} className="flex justify-between items-center bg-white/5 rounded-lg p-4">
                  <span className="text-white font-bold">SET {index + 1}</span>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-white/70 text-sm">{config.joueurA}</div>
                      <div className={`text-2xl font-bold ${set[0] > set[1] ? 'text-accent' : 'text-white'}`}>
                        {set[0]}
                      </div>
                    </div>
                    <div className="text-white/50">-</div>
                    <div className="text-center">
                      <div className="text-white/70 text-sm">{config.joueurB}</div>
                      <div className={`text-2xl font-bold ${set[1] > set[0] ? 'text-accent' : 'text-white'}`}>
                        {set[1]}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historique des points */}
        {historique.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🤔</div>
            <h2 className="text-2xl font-bold text-white mb-2">Aucun point marqué</h2>
            <p className="text-white/70">L'historique apparaîtra dès qu'un point sera marqué</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedBySet).reverse().map(([manche, points]) => (
              <div key={manche} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-white">
                    Manche {manche}
                  </h3>
                  <div className="text-white/70">
                    {points.length} point{points.length > 1 ? 's' : ''}
                  </div>
                </div>

                <div className="space-y-3">
                  {points.slice().reverse().map((point, index) => (
                    <div 
                      key={point.id} 
                      className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">{getPointIcon(point)}</div>
                          <div>
                            <div className="text-white font-bold">
                              Point pour {point.gagnant === 'A' ? config.joueurA : config.joueurB}
                            </div>
                            <div className="text-white/70 text-sm">
                              {formatTime(point.timestamp)} • 
                              Serveur: {point.serveur === 'A' ? config.joueurA : config.joueurB}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <div className="text-white/70 text-sm">Avant</div>
                            <div className="flex space-x-2">
                              <span className={getScoreColor(point, 'A')}>{point.avant[0]}</span>
                              <span className="text-white/50">-</span>
                              <span className={getScoreColor(point, 'B')}>{point.avant[1]}</span>
                            </div>
                          </div>
                          
                          <div className="text-2xl text-white/50">→</div>
                          
                          <div className="text-right">
                            <div className="text-white/70 text-sm">Après</div>
                            <div className="flex space-x-2">
                              <span className={getScoreColor(point, 'A')}>{point.apres[0]}</span>
                              <span className="text-white/50">-</span>
                              <span className={getScoreColor(point, 'B')}>{point.apres[1]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Statistiques rapides */}
        {historique.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mt-6">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Statistiques</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-2">
                  {historique.filter(p => p.gagnant === 'A').length}
                </div>
                <div className="text-white/70">Points {config.joueurA}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary mb-2">
                  {historique.filter(p => p.gagnant === 'B').length}
                </div>
                <div className="text-white/70">Points {config.joueurB}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Historique;