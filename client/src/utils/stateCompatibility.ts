import { MatchState } from '../types';

export const migrateMatchState = (savedState: any): MatchState | null => {
  try {
    if (!savedState || typeof savedState !== 'object') {
      return null;
    }

    // Vérifier que les propriétés essentielles existent
    if (!savedState.config || !savedState.scoreActuel) {
      return null;
    }

    // Ajouter les propriétés manquantes pour la compatibilité avec les côtés
    if (!savedState.coteActuel && savedState.config) {
      savedState.coteActuel = {
        A: savedState.config.coteInitialA || 'gauche',
        B: savedState.config.coteInitialB || 'droite'
      };
    }

    if (savedState.changementCoteEffectue === undefined) {
      savedState.changementCoteEffectue = false;
    }

    // Ajouter les propriétés manquantes de config
    if (savedState.config && !savedState.config.coteInitialA) {
      savedState.config.coteInitialA = 'gauche';
      savedState.config.coteInitialB = 'droite';
    }

    return savedState as MatchState;
  } catch (error) {
    console.error('Erreur lors de la migration de l\'état:', error);
    return null;
  }
};

export const clearIncompatibleState = () => {
  localStorage.removeItem('matchState');
};