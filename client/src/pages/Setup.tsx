import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchConfig, Player } from '../types';

interface SetupProps {
  onConfigureMatch: (config: MatchConfig) => void;
}

const Setup: React.FC<SetupProps> = ({ onConfigureMatch }) => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<MatchConfig>({
    typeMatch: 'simple',
    joueurA: '',
    joueurB: '',
    premierServeur: 'A',
    coteInitialA: 'gauche',
    coteInitialB: 'droite'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.joueurA && config.joueurB) {
      onConfigureMatch(config);
      navigate('/arbitre');
    }
  };

  return (
    <div className="min-h-screen bg-sport-gradient flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🏓 Configuration</h1>
          <p className="text-white/70">Tennis de Table</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-medium mb-2">Type de match</label>
            <select
              value={config.typeMatch}
              onChange={(e) => setConfig(prev => ({ ...prev, typeMatch: e.target.value as 'simple' | 'double' }))}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="simple">Simple</option>
              <option value="double">Double</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Joueur A</label>
            <input
              type="text"
              value={config.joueurA}
              onChange={(e) => setConfig(prev => ({ ...prev, joueurA: e.target.value }))}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nom du joueur A"
              required
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Joueur B</label>
            <input
              type="text"
              value={config.joueurB}
              onChange={(e) => setConfig(prev => ({ ...prev, joueurB: e.target.value }))}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Nom du joueur B"
              required
            />
          </div>

          {config.typeMatch === 'double' && (
            <>
              <div>
                <label className="block text-white font-medium mb-2">Équipier A</label>
                <input
                  type="text"
                  value={config.equipierA || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, equipierA: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Équipier du joueur A"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Équipier B</label>
                <input
                  type="text"
                  value={config.equipierB || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, equipierB: e.target.value }))}
                  className="w-full p-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Équipier du joueur B"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-white font-medium mb-3">Positionnement initial</label>
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <p className="text-white/70 text-sm mb-4 text-center">
                (Du point de vue de l'arbitre)
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{config.joueurA || 'Joueur A'}</span>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="playerA"
                        value="gauche"
                        checked={config.coteInitialA === 'gauche'}
                        onChange={() => setConfig(prev => ({ 
                          ...prev, 
                          coteInitialA: 'gauche',
                          coteInitialB: 'droite'
                        }))}
                        className="mr-2 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-blue-300">Gauche</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="playerA"
                        value="droite"
                        checked={config.coteInitialA === 'droite'}
                        onChange={() => setConfig(prev => ({ 
                          ...prev, 
                          coteInitialA: 'droite',
                          coteInitialB: 'gauche'
                        }))}
                        className="mr-2 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-green-300">Droite</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{config.joueurB || 'Joueur B'}</span>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="playerB"
                        value="gauche"
                        checked={config.coteInitialB === 'gauche'}
                        onChange={() => setConfig(prev => ({ 
                          ...prev, 
                          coteInitialA: 'droite',
                          coteInitialB: 'gauche'
                        }))}
                        className="mr-2 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-blue-300">Gauche</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="playerB"
                        value="droite"
                        checked={config.coteInitialB === 'droite'}
                        onChange={() => setConfig(prev => ({ 
                          ...prev, 
                          coteInitialA: 'gauche',
                          coteInitialB: 'droite'
                        }))}
                        className="mr-2 text-green-500 focus:ring-green-500"
                      />
                      <span className="text-green-300">Droite</span>
                    </label>
                  </div>
                </div>
                
                <div className="text-center mt-3 pt-3 border-t border-white/20">
                  <div className="text-2xl mb-1">🏓</div>
                  <div className="text-white/50 text-xs">Position vue arbitre</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-2">Premier serveur</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="A"
                  checked={config.premierServeur === 'A'}
                  onChange={(e) => setConfig(prev => ({ ...prev, premierServeur: e.target.value as Player }))}
                  className="mr-2 text-primary focus:ring-primary"
                />
                <span className="text-white">Joueur A</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="B"
                  checked={config.premierServeur === 'B'}
                  onChange={(e) => setConfig(prev => ({ ...prev, premierServeur: e.target.value as Player }))}
                  className="mr-2 text-primary focus:ring-primary"
                />
                <span className="text-white">Joueur B</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg"
          >
            🏓 Commencer le Match
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;