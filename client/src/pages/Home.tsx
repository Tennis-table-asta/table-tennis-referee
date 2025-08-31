import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-sport-gradient flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-12">
          <div className="text-8xl mb-6">🏓</div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Tennis de Table
          </h1>
          <p className="text-xl text-white/70 mb-8">
            Application d'arbitrage professionnelle
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link
            to="/setup"
            className="bg-primary/20 border-2 border-primary hover:bg-primary/30 rounded-2xl p-8 transition-all transform hover:scale-105 shadow-xl backdrop-blur-lg"
          >
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-2xl font-bold text-white mb-2">Configuration</h3>
            <p className="text-white/70">
              Configurer un nouveau match
            </p>
          </Link>

          <Link
            to="/arbitre"
            className="bg-secondary/20 border-2 border-secondary hover:bg-secondary/30 rounded-2xl p-8 transition-all transform hover:scale-105 shadow-xl backdrop-blur-lg"
          >
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-2xl font-bold text-white mb-2">Interface Arbitre</h3>
            <p className="text-white/70">
              Contrôle du match (tablette)
            </p>
          </Link>

          <Link
            to="/spectateurs"
            className="bg-accent/20 border-2 border-accent hover:bg-accent/30 rounded-2xl p-8 transition-all transform hover:scale-105 shadow-xl backdrop-blur-lg"
          >
            <div className="text-4xl mb-4">📺</div>
            <h3 className="text-2xl font-bold text-white mb-2">Affichage Public</h3>
            <p className="text-white/70">
              Vue spectateurs (TV/écran)
            </p>
          </Link>

          <Link
            to="/historique"
            className="bg-neutral/20 border-2 border-neutral hover:bg-neutral/30 rounded-2xl p-8 transition-all transform hover:scale-105 shadow-xl backdrop-blur-lg"
          >
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-white mb-2">Historique</h3>
            <p className="text-white/70">
              Historique des points
            </p>
          </Link>
        </div>

        <div className="text-center">
          <div className="text-white/50 text-sm">
            Application temps réel • Multi-écrans • Règles officielles
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;