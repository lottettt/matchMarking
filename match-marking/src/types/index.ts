export type Player = { 
  id: string; 
  name: string; 
  state: string; 
  image: string; 
  rank: number; 
  team?: number; 
  level?: string;
  todayMatches?: number;
}

export type Court = { id: string; name: string; status: string }

export type Match = { 
  id: string; 
  name: string; 
  status: string; 
  players: Player[]; 
  court: Court | null;
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in minutes
  winner?: string; // player id or team name
} 