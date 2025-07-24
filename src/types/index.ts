export type Player = { 
  id: string; 
  name: string; 
  state: string; 
  image: string; 
  rank: number; 
  team?: number; 
  level?: string;
  todayMatches?: number;
  lastPlayTime?: Date; // When they last finished playing
}

export type Court = { 
  id: string; 
  name: string; 
  status: string;
  timeAvailable?: string; // Time when court becomes available (e.g., "10:30 AM", "Available Now")
  createdAt?: Date; // When the court was created
}

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