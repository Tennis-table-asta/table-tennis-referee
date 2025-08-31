import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { MatchState, Player, MatchConfig } from '../types';
import { migrateMatchState, clearIncompatibleState } from '../utils/stateCompatibility';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketUrl = process.env.NODE_ENV === 'production' 
      ? `${window.location.protocol}//${window.location.hostname}:3001`
      : `http://${window.location.hostname}:3001`;
    
    console.log('Tentative de connexion à:', socketUrl);
    const newSocket = io(socketUrl);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connecté au serveur');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Déconnecté du serveur');
    });

    newSocket.on('match-update', (state: MatchState) => {
      setMatchState(state);
      localStorage.setItem('matchState', JSON.stringify(state));
    });

    newSocket.on('connection-lost', () => {
      setIsConnected(false);
    });

    const savedState = localStorage.getItem('matchState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        const migratedState = migrateMatchState(parsed);
        
        if (migratedState) {
          setMatchState(migratedState);
        } else {
          console.warn('État incompatible détecté, nettoyage du localStorage');
          clearIncompatibleState();
        }
      } catch (error) {
        console.error('Erreur lors de la restauration de l\'état:', error);
        clearIncompatibleState();
      }
    }

    return () => {
      newSocket.close();
    };
  }, []);

  const scorePoint = (joueur: Player) => {
    socket?.emit('point-scored', { joueur });
  };

  const undoPoint = () => {
    socket?.emit('undo-point');
  };

  const newSet = () => {
    socket?.emit('new-set');
  };

  const configureMatch = (config: MatchConfig) => {
    socket?.emit('match-config', config);
  };

  return {
    matchState,
    isConnected,
    scorePoint,
    undoPoint,
    newSet,
    configureMatch
  };
};