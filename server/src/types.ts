export type Player = 'A' | 'B';

export interface MatchConfig {
  typeMatch: 'simple' | 'double';
  joueurA: string;
  joueurB: string;
  equipierA?: string;
  equipierB?: string;
  premierServeur: Player;
  coteInitialA: 'gauche' | 'droite';
  coteInitialB: 'gauche' | 'droite';
}

export interface HistoriquePoint {
  id: string;
  timestamp: Date;
  manche: number;
  avant: [number, number];
  apres: [number, number];
  gagnant: Player;
  serveur: Player;
  typePoint: 'normal' | 'service' | 'faute';
}

export interface MatchStats {
  pointsService: { A: number; B: number };
  pointsRetour: { A: number; B: number };
  dureeManches: number[];
  plusLongueSequence: { joueur: Player; points: number };
  pourcentageService: { A: number; B: number };
}

export interface MatchState {
  config: MatchConfig;
  mancheActuelle: number;
  scoreActuel: [number, number];
  setsHistory: Array<[number, number]>;
  serveur: Player;
  servicesRestants: number;
  historique: HistoriquePoint[];
  statistiques: MatchStats;
  status: 'setup' | 'playing' | 'paused' | 'finished';
  startTime?: Date;
  coteActuel: {
    A: 'gauche' | 'droite';
    B: 'gauche' | 'droite';
  };
  changementCoteEffectue: boolean;
}