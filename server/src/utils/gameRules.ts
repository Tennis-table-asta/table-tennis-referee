import { MatchState, Player } from '../types';

export class GameRules {
  static isSetWon(score: [number, number]): boolean {
    const [scoreA, scoreB] = score;
    return (scoreA >= 11 || scoreB >= 11) && Math.abs(scoreA - scoreB) >= 2;
  }

  static isMatchFinished(setsHistory: Array<[number, number]>): boolean {
    const setsWonA = setsHistory.filter(([a, b]) => a > b).length;
    const setsWonB = setsHistory.filter(([a, b]) => b > a).length;
    return setsWonA >= 3 || setsWonB >= 3;
  }

  static getServicesPerPlayer(scoreA: number, scoreB: number): number {
    if (scoreA >= 10 && scoreB >= 10) {
      return 1;
    }
    return 2;
  }

  static shouldChangeServer(
    servicesRestants: number,
    scoreA: number,
    scoreB: number
  ): boolean {
    const servicesPerPlayer = this.getServicesPerPlayer(scoreA, scoreB);
    return servicesRestants <= 0;
  }

  static getNextServer(currentServer: Player): Player {
    return currentServer === 'A' ? 'B' : 'A';
  }

  static getFirstServerNextSet(
    currentFirstServer: Player,
    setNumber: number
  ): Player {
    return setNumber % 2 === 1 ? currentFirstServer : this.getNextServer(currentFirstServer);
  }

  static updateServiceState(
    state: MatchState,
    pointWinner: Player
  ): { serveur: Player; servicesRestants: number } {
    const { scoreActuel: [scoreA, scoreB], serveur, servicesRestants } = state;
    const newScore: [number, number] = pointWinner === 'A' ? [scoreA + 1, scoreB] : [scoreA, scoreB + 1];
    const servicesPerPlayer = this.getServicesPerPlayer(newScore[0], newScore[1]);
    
    const newServicesRestants = servicesRestants - 1;
    
    if (this.shouldChangeServer(newServicesRestants, newScore[0], newScore[1])) {
      return {
        serveur: this.getNextServer(serveur),
        servicesRestants: servicesPerPlayer
      };
    }
    
    return {
      serveur,
      servicesRestants: newServicesRestants
    };
  }

  static shouldChangeSides(oldState: MatchState, newState: MatchState): boolean {
    // Changement à chaque fin de set (sets 1-5)
    if (oldState.mancheActuelle < newState.mancheActuelle) {
      return true;
    }
    
    // Règle spéciale : 5ème set UNIQUEMENT - changement supplémentaire à 5 points
    if (newState.mancheActuelle === 5 && !newState.changementCoteEffectue) {
      const maxScore = Math.max(newState.scoreActuel[0], newState.scoreActuel[1]);
      const oldMaxScore = Math.max(oldState.scoreActuel[0], oldState.scoreActuel[1]);
      
      // Déclenchement quand on passe de 4 à 5 points
      return maxScore === 5 && oldMaxScore < 5;
    }
    
    return false;
  }

  static changeSides(state: MatchState): { A: 'gauche' | 'droite'; B: 'gauche' | 'droite' } {
    return {
      A: state.coteActuel.A === 'gauche' ? 'droite' : 'gauche',
      B: state.coteActuel.B === 'gauche' ? 'droite' : 'gauche'
    };
  }

  static getSideChangeMessage(state: MatchState): string {
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
  }
}