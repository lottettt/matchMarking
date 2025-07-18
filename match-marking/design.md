# Professional Design Document

## Overview

The Badminton Match Marking System is a high-performance, real-time web application engineered with modern architectural patterns and professional development practices. Built on FastAPI (Python) backend and Next.js (TypeScript) frontend, the system delivers scalable concurrent user handling, real-time match updates, and comprehensive match management with immersive 3D UI experiences.

### Core Design Principles

- **Clean Architecture**: Domain-driven design with clear separation of concerns
- **SOLID Principles**: Maintainable, extensible, and testable codebase
- **Performance First**: Optimized for low latency and high throughput
- **Security by Design**: Zero-trust architecture with comprehensive validation
- **Scalability**: Horizontal scaling capabilities with microservice readiness

## Professional Architecture

### Clean Architecture Pattern

```mermaid
graph TB
    subgraph "Presentation Layer"
        A[Next.js 14 App Router]
        B[3D UI Components]
        C[WebSocket Client]
        D[State Management]
    end

    subgraph "Application Layer"
        E[FastAPI + Pydantic V2]
        F[WebSocket Manager]
        G[Background Tasks]
        H[Middleware Stack]
    end

    subgraph "Domain Layer"
        I[Business Logic]
        J[Domain Models]
        K[Use Cases]
        L[Domain Events]
    end

    subgraph "Infrastructure Layer"
        M[PostgreSQL + AsyncPG]
        N[Redis Cluster]
        O[Local OAuth Provider]
        P[File System Cache]
    end

    A --> E
    B --> F
    C --> G
    E --> I
    F --> J
    G --> K
    I --> M
    J --> N
    K --> O
```

### Professional Folder Structure

#### Backend Structure (FastAPI)

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # FastAPI application entry
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py              # Environment configuration
│   │   ├── security.py            # JWT & OAuth handlers
│   │   ├── database.py            # Database connection pool
│   │   ├── cache.py               # Redis connection manager
│   │   └── exceptions.py          # Custom exception classes
│   ├── domain/
│   │   ├── __init__.py
│   │   ├── entities/              # Domain entities
│   │   │   ├── player.py
│   │   │   ├── match.py
│   │   │   ├── court.py
│   │   │   └── score.py
│   │   ├── repositories/          # Abstract repositories
│   │   │   ├── base.py
│   │   │   ├── player.py
│   │   │   ├── match.py
│   │   │   └── court.py
│   │   └── services/              # Domain services
│   │       ├── matchmaking.py
│   │       ├── scoring.py
│   │       └── notifications.py
│   ├── infrastructure/
│   │   ├── __init__.py
│   │   ├── database/
│   │   │   ├── models.py          # SQLAlchemy models
│   │   │   ├── migrations/        # Alembic migrations
│   │   │   └── repositories/      # Concrete repositories
│   │   ├── cache/
│   │   │   ├── redis_client.py
│   │   │   └── cache_service.py
│   │   └── external/
│   │       └── oauth_providers.py
│   ├── application/
│   │   ├── __init__.py
│   │   ├── use_cases/             # Application use cases
│   │   │   ├── player_use_cases.py
│   │   │   ├── match_use_cases.py
│   │   │   └── court_use_cases.py
│   │   ├── schemas/               # Pydantic schemas
│   │   │   ├── player.py
│   │   │   ├── match.py
│   │   │   └── responses.py
│   │   └── dependencies.py        # FastAPI dependencies
│   ├── presentation/
│   │   ├── __init__.py
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py
│   │   │   │   ├── players.py
│   │   │   │   ├── matches.py
│   │   │   │   └── courts.py
│   │   │   └── middleware/
│   │   │       ├── auth.py
│   │   │       ├── cors.py
│   │   │       └── rate_limit.py
│   │   └── websocket/
│   │       ├── connection_manager.py
│   │       ├── handlers.py
│   │       └── events.py
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── e2e/
├── requirements/
│   ├── base.txt
│   ├── dev.txt
│   └── prod.txt
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
└── scripts/
    ├── start.sh
    ├── test.sh
    └── migrate.sh
```

#### Frontend Structure (Next.js 14)

```
frontend/
├── src/
│   ├── app/                       # App Router (Next.js 14)
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   ├── player/
│   │   │   ├── admin/
│   │   │   └── spectator/
│   │   └── api/                   # API routes
│   │       └── auth/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   └── 3d/               # 3D UI components
│   │   │       ├── court-3d.tsx
│   │   │       ├── scoreboard-3d.tsx
│   │   │       └── player-avatar-3d.tsx
│   │   ├── features/             # Feature-specific components
│   │   │   ├── auth/
│   │   │   ├── match/
│   │   │   ├── player/
│   │   │   └── court/
│   │   └── layout/               # Layout components
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── footer.tsx
│   ├── lib/
│   │   ├── api.ts                # API client
│   │   ├── websocket.ts          # WebSocket client
│   │   ├── auth.ts               # Authentication utilities
│   │   ├── utils.ts              # Utility functions
│   │   └── validations.ts        # Form validations
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-auth.ts
│   │   ├── use-websocket.ts
│   │   ├── use-match.ts
│   │   └── use-3d-scene.ts
│   ├── store/                    # State management
│   │   ├── auth-store.ts
│   │   ├── match-store.ts
│   │   └── ui-store.ts
│   ├── types/                    # TypeScript definitions
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── match.ts
│   └── styles/
│       ├── globals.css
│       └── components.css
├── public/
│   ├── models/                   # 3D models
│   ├── textures/                 # 3D textures
│   └── icons/
├── tests/
│   ├── __tests__/
│   ├── __mocks__/
│   └── setup.ts
└── docs/
    └── components.md
```

### Modern Technology Stack

#### Backend Technologies

- **FastAPI 0.104+**: High-performance async web framework
- **Pydantic V2**: Data validation with 5-20x performance improvement
- **SQLAlchemy 2.0**: Modern async ORM with type safety
- **AsyncPG**: High-performance PostgreSQL driver
- **Redis 7.0**: In-memory data structure store
- **Uvicorn**: Lightning-fast ASGI server
- **Alembic**: Database migration tool

#### Frontend Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript 5.0+**: Type-safe JavaScript
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **Three.js**: 3D graphics library for immersive UI
- **React Three Fiber**: React renderer for Three.js
- **Zustand**: Lightweight state management
- **React Hook Form**: Performant form library
- **Framer Motion**: Animation library

## Professional Components & Code Architecture

### Advanced Frontend Architecture

#### 3D Immersive UI Components

```typescript
// components/ui/3d/court-3d.tsx
"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";

interface Court3DProps {
  matchData: MatchData;
  onScoreUpdate: (score: ScoreUpdate) => void;
}

export const Court3D = ({ matchData, onScoreUpdate }: Court3DProps) => {
  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-2xl">
      <Canvas camera={{ position: [0, 5, 10], fov: 60 }}>
        <Suspense fallback={<LoadingSpinner />}>
          <Environment preset="studio" />
          <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2} />
          <CourtMesh />
          <PlayerAvatars players={matchData.players} />
          <ScoreDisplay score={matchData.score} />
          <InteractiveElements onScoreUpdate={onScoreUpdate} />
        </Suspense>
      </Canvas>
    </div>
  );
};
```

#### State Management with Zustand

```typescript
// store/match-store.ts
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface MatchState {
  activeMatches: Match[];
  currentMatch: Match | null;
  queue: Player[];
  courts: Court[];
  // Actions
  updateScore: (matchId: string, score: ScoreUpdate) => void;
  joinQueue: (playerId: string) => void;
  leaveQueue: (playerId: string) => void;
  createMatch: (players: Player[]) => void;
}

export const useMatchStore = create<MatchState>()(
  subscribeWithSelector(
    immer((set, get) => ({
      activeMatches: [],
      currentMatch: null,
      queue: [],
      courts: [],

      updateScore: (matchId, score) =>
        set((state) => {
          const match = state.activeMatches.find((m) => m.id === matchId);
          if (match) {
            match.score = { ...match.score, ...score };
          }
        }),

      joinQueue: (playerId) =>
        set((state) => {
          if (!state.queue.find((p) => p.id === playerId)) {
            state.queue.push({ id: playerId, joinedAt: Date.now() });
          }
        }),

      // Additional actions...
    }))
  )
);
```

#### Custom Hooks for Business Logic

```typescript
// hooks/use-match.ts
import { useCallback, useEffect } from "react";
import { useMatchStore } from "@/store/match-store";
import { useWebSocket } from "./use-websocket";
import { api } from "@/lib/api";

export const useMatch = (matchId?: string) => {
  const { socket, isConnected } = useWebSocket();
  const { currentMatch, updateScore, activeMatches } = useMatchStore();

  const submitScore = useCallback(
    async (score: ScoreUpdate) => {
      try {
        // Optimistic update
        updateScore(matchId!, score);

        // Send to server
        await api.matches.updateScore(matchId!, score);

        // Broadcast via WebSocket
        socket?.emit("score-update", { matchId, score });
      } catch (error) {
        // Revert optimistic update on error
        console.error("Score update failed:", error);
        // Implement rollback logic
      }
    },
    [matchId, socket, updateScore]
  );

  useEffect(() => {
    if (!socket || !matchId) return;

    socket.on("score-updated", (data) => {
      updateScore(data.matchId, data.score);
    });

    return () => {
      socket.off("score-updated");
    };
  }, [socket, matchId, updateScore]);

  return {
    match: currentMatch,
    submitScore,
    isConnected,
  };
};
```

### Professional Backend Architecture

#### FastAPI Application Structure

```python
# app/main.py - Application entry point
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.core.config import settings
from app.core.database import init_db
from app.presentation.api.v1 import auth, players, matches, courts
from app.presentation.websocket.connection_manager import ConnectionManager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    await cleanup_resources()

app = FastAPI(
    title="Badminton Match Marking API",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(players.router, prefix="/api/v1/players", tags=["players"])
app.include_router(matches.router, prefix="/api/v1/matches", tags=["matches"])
app.include_router(courts.router, prefix="/api/v1/courts", tags=["courts"])

# WebSocket Manager
connection_manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await connection_manager.connect(websocket, client_id)
```

#### Domain-Driven Design Implementation

```python
# domain/entities/match.py
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime
from enum import Enum

class MatchStatus(Enum):
    PENDING = "pending"
    ONGOING = "ongoing"
    FINISHED = "finished"

@dataclass
class Match:
    id: str
    court_id: str
    players: List[str]  # Player IDs
    status: MatchStatus
    team1_score: int = 0
    team2_score: int = 0
    current_game: int = 1
    started_at: Optional[datetime] = None
    ended_at: Optional[datetime] = None

    def update_score(self, team: int, points: int) -> None:
        """Update team score with business logic validation"""
        if self.status != MatchStatus.ONGOING:
            raise ValueError("Cannot update score for non-ongoing match")

        if team == 1:
            self.team1_score = points
        elif team == 2:
            self.team2_score = points
        else:
            raise ValueError("Invalid team number")

    def check_game_winner(self) -> Optional[int]:
        """Check if current game has a winner"""
        if max(self.team1_score, self.team2_score) >= 21:
            if abs(self.team1_score - self.team2_score) >= 2:
                return 1 if self.team1_score > self.team2_score else 2
        return None
```

#### Repository Pattern with AsyncPG

```python
# infrastructure/database/repositories/match_repository.py
from typing import List, Optional
from asyncpg import Connection
from app.domain.entities.match import Match, MatchStatus
from app.domain.repositories.match import MatchRepository

class PostgreSQLMatchRepository(MatchRepository):
    def __init__(self, connection: Connection):
        self.connection = connection

    async def create(self, match: Match) -> Match:
        """Create new match with optimized query"""
        query = """
            INSERT INTO matches (id, court_id, status, team1_score, team2_score)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        """
        row = await self.connection.fetchrow(
            query, match.id, match.court_id, match.status.value,
            match.team1_score, match.team2_score
        )
        return self._row_to_match(row)

    async def get_active_matches(self) -> List[Match]:
        """Get all active matches with single query"""
        query = """
            SELECT m.*, array_agg(mp.player_id) as players
            FROM matches m
            LEFT JOIN match_players mp ON m.id = mp.match_id
            WHERE m.status IN ('pending', 'ongoing')
            GROUP BY m.id
            ORDER BY m.created_at DESC
        """
        rows = await self.connection.fetch(query)
        return [self._row_to_match(row) for row in rows]

    async def update_score(self, match_id: str, team1_score: int, team2_score: int) -> None:
        """Atomic score update with optimistic locking"""
        query = """
            UPDATE matches
            SET team1_score = $2, team2_score = $3, updated_at = NOW()
            WHERE id = $1 AND status = 'ongoing'
        """
        result = await self.connection.execute(query, match_id, team1_score, team2_score)
        if result == "UPDATE 0":
            raise ValueError("Match not found or not in ongoing state")
```

#### High-Performance WebSocket Manager

```python
# presentation/websocket/connection_manager.py
import asyncio
import json
from typing import Dict, Set
from fastapi import WebSocket
from collections import defaultdict

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.match_rooms: Dict[str, Set[str]] = defaultdict(set)
        self.player_connections: Dict[str, str] = {}  # player_id -> client_id

    async def connect(self, websocket: WebSocket, client_id: str):
        """Accept WebSocket connection with authentication"""
        await websocket.accept()
        self.active_connections[client_id] = websocket

        try:
            while True:
                data = await websocket.receive_text()
                await self.handle_message(client_id, json.loads(data))
        except Exception as e:
            await self.disconnect(client_id)

    async def disconnect(self, client_id: str):
        """Clean disconnect with room cleanup"""
        if client_id in self.active_connections:
            # Remove from all match rooms
            for match_id, clients in self.match_rooms.items():
                clients.discard(client_id)

            # Remove player connection mapping
            player_id = next((pid for pid, cid in self.player_connections.items()
                            if cid == client_id), None)
            if player_id:
                del self.player_connections[player_id]

            del self.active_connections[client_id]

    async def join_match_room(self, client_id: str, match_id: str):
        """Join match room for real-time updates"""
        self.match_rooms[match_id].add(client_id)
        await self.send_to_client(client_id, {
            "type": "room_joined",
            "match_id": match_id
        })

    async def broadcast_to_match(self, match_id: str, message: dict):
        """Broadcast message to all clients in match room"""
        if match_id not in self.match_rooms:
            return

        disconnected_clients = []
        for client_id in self.match_rooms[match_id]:
            try:
                await self.send_to_client(client_id, message)
            except:
                disconnected_clients.append(client_id)

        # Clean up disconnected clients
        for client_id in disconnected_clients:
            await self.disconnect(client_id)

    async def send_to_client(self, client_id: str, message: dict):
        """Send message to specific client"""
        if client_id in self.active_connections:
            websocket = self.active_connections[client_id]
            await websocket.send_text(json.dumps(message))
```

#### Performance Optimization Strategies

##### Database Connection Pooling

```python
# core/database.py
import asyncpg
from asyncpg.pool import Pool
from app.core.config import settings

class DatabaseManager:
    def __init__(self):
        self.pool: Optional[Pool] = None

    async def init_pool(self):
        """Initialize connection pool with optimized settings"""
        self.pool = await asyncpg.create_pool(
            settings.DATABASE_URL,
            min_size=10,
            max_size=50,
            max_queries=50000,
            max_inactive_connection_lifetime=300,
            command_timeout=60
        )

    async def get_connection(self):
        """Get connection from pool"""
        if not self.pool:
            await self.init_pool()
        return self.pool.acquire()

db_manager = DatabaseManager()
```

##### Redis Caching Strategy

```python
# infrastructure/cache/cache_service.py
import redis.asyncio as redis
import json
from typing import Optional, Any
from app.core.config import settings

class CacheService:
    def __init__(self):
        self.redis = redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            max_connections=20
        )

    async def get_match_cache(self, match_id: str) -> Optional[dict]:
        """Get cached match data"""
        cached = await self.redis.get(f"match:{match_id}")
        return json.loads(cached) if cached else None

    async def set_match_cache(self, match_id: str, match_data: dict, ttl: int = 300):
        """Cache match data with TTL"""
        await self.redis.setex(
            f"match:{match_id}",
            ttl,
            json.dumps(match_data)
        )

    async def invalidate_match_cache(self, match_id: str):
        """Remove match from cache"""
        await self.redis.delete(f"match:{match_id}")

    async def get_queue_status(self) -> list:
        """Get cached queue status"""
        queue_data = await self.redis.lrange("ready_queue", 0, -1)
        return [json.loads(item) for item in queue_data]

    async def add_to_queue(self, player_data: dict):
        """Add player to ready queue"""
        await self.redis.lpush("ready_queue", json.dumps(player_data))
        await self.redis.expire("ready_queue", 1800)  # 30 minutes TTL
```

#### Local OAuth Implementation

```python
# infrastructure/external/oauth_providers.py
from typing import Dict, Optional
import jwt
from datetime import datetime, timedelta
from app.core.config import settings

class LocalOAuthProvider:
    """Local OAuth implementation for offline deployment"""

    def __init__(self):
        self.users_db = {}  # In production, use proper database
        self.secret_key = settings.JWT_SECRET_KEY

    async def authenticate_user(self, username: str, password: str) -> Optional[Dict]:
        """Authenticate user with local credentials"""
        # In production, hash passwords properly
        user = self.users_db.get(username)
        if user and user.get('password') == password:
            return {
                'id': user['id'],
                'username': username,
                'email': user['email'],
                'name': user['name']
            }
        return None

    def generate_token(self, user_data: Dict) -> str:
        """Generate JWT token"""
        payload = {
            'user_id': user_data['id'],
            'username': user_data['username'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }
        return jwt.encode(payload, self.secret_key, algorithm='HS256')

    def verify_token(self, token: str) -> Optional[Dict]:
        """Verify JWT token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
```

#### API Endpoints with Professional Standards

**RESTful API Design**

```python
# presentation/api/v1/matches.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import List
from app.application.use_cases.match_use_cases import MatchUseCases
from app.application.schemas.match import MatchResponse, ScoreUpdateRequest
from app.presentation.api.dependencies import get_current_user, get_match_use_cases

router = APIRouter()

@router.get("/active", response_model=List[MatchResponse])
async def get_active_matches(
    match_use_cases: MatchUseCases = Depends(get_match_use_cases)
):
    """Get all active matches with caching"""
    return await match_use_cases.get_active_matches()

@router.put("/{match_id}/score", response_model=MatchResponse)
async def update_match_score(
    match_id: str,
    score_update: ScoreUpdateRequest,
    background_tasks: BackgroundTasks,
    current_user = Depends(get_current_user),
    match_use_cases: MatchUseCases = Depends(get_match_use_cases)
):
    """Update match score with real-time broadcasting"""
    try:
        updated_match = await match_use_cases.update_score(
            match_id, score_update, current_user.id
        )

        # Background task for real-time updates
        background_tasks.add_task(
            broadcast_score_update, match_id, updated_match
        )

        return updated_match
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))

async def broadcast_score_update(match_id: str, match_data: dict):
    """Background task for WebSocket broadcasting"""
    from app.main import connection_manager
    await connection_manager.broadcast_to_match(match_id, {
        "type": "score_updated",
        "match_id": match_id,
        "data": match_data
    })
```

## Data Models

### Database Schema

```sql
-- Players table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    oauth_id VARCHAR(255) UNIQUE NOT NULL,
    provider VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    registered_skill_level INTEGER CHECK (registered_skill_level BETWEEN 1 AND 6),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courts table
CREATE TABLE courts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court_id UUID REFERENCES courts(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'ongoing', 'finished')),
    played_skill_level INTEGER CHECK (played_skill_level BETWEEN 1 AND 6),
    team1_score INTEGER DEFAULT 0,
    team2_score INTEGER DEFAULT 0,
    current_game INTEGER DEFAULT 1,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match participants table
CREATE TABLE match_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    player_id UUID REFERENCES players(id),
    team INTEGER CHECK (team IN (1, 2)),
    UNIQUE(match_id, player_id)
);

-- Game scores table
CREATE TABLE game_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    game_number INTEGER,
    team1_score INTEGER DEFAULT 0,
    team2_score INTEGER DEFAULT 0,
    is_finished BOOLEAN DEFAULT FALSE,
    finished_at TIMESTAMP
);

-- Player readiness queue
CREATE TABLE ready_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    player_id UUID REFERENCES players(id) UNIQUE,
    queued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Match events log
CREATE TABLE match_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Data Access Layer

#### Repository Pattern

- **PlayerRepository**: Player CRUD operations and statistics
- **MatchRepository**: Match lifecycle and scoring operations
- **CourtRepository**: Court management and availability
- **QueueRepository**: Ready queue management

#### Service Layer

- **AuthService**: OAuth integration and session management
- **MatchmakingService**: Team creation and balancing logic
- **ScoringService**: Score validation and game progression
- **NotificationService**: Real-time event broadcasting

## Error Handling

### Client-Side Error Handling

1. **Network Errors**: Retry mechanism with exponential backoff
2. **Authentication Errors**: Automatic redirect to login
3. **Validation Errors**: Form-level error display
4. **WebSocket Disconnection**: Automatic reconnection with state sync

### Server-Side Error Handling

1. **Database Errors**: Transaction rollback and error logging
2. **Authentication Failures**: Proper HTTP status codes and messages
3. **Business Logic Errors**: Validation with descriptive error responses
4. **Rate Limiting**: Prevent abuse with request throttling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid skill level provided",
    "details": {
      "field": "skill_level",
      "value": 7,
      "allowed": [1, 2, 3, 4, 5, 6]
    }
  }
}
```

## Testing Strategy

### Unit Testing

- **Frontend**: Jest + React Testing Library for Next.js component testing
- **Backend**: pytest + FastAPI TestClient for API endpoint testing
- **Database**: SQLAlchemy with in-memory SQLite for repository testing

### Integration Testing

- **API Integration**: FastAPI TestClient for full request/response cycle testing
- **WebSocket Testing**: WebSocket client simulation with pytest-asyncio
- **OAuth Flow**: Mock OAuth providers for authentication testing

### End-to-End Testing

- **Playwright**: Complete user journey testing with Next.js
- **Match Flow**: Full match creation to completion
- **Real-time Updates**: Multi-client score synchronization

### Performance Testing

- **Load Testing**: Concurrent user simulation
- **WebSocket Stress**: Multiple simultaneous connections
- **Database Performance**: Query optimization validation

### Test Data Management

- **Fixtures**: Predefined test data sets
- **Factories**: Dynamic test data generation
- **Database Seeding**: Consistent test environment setup

## Security Considerations

### Authentication & Authorization

- Local OAuth 2.0 implementation for offline deployment
- JWT tokens with short expiration times and refresh token rotation
- Role-based access control with granular permissions
- Rate limiting per user and endpoint

### Data Protection

- Input validation with Pydantic V2 models
- SQL injection prevention with parameterized queries
- XSS protection with Content Security Policy headers
- CSRF protection with SameSite cookies

### Real-time Security

- WebSocket authentication verification on connection
- Message validation and sanitization
- Rate limiting on real-time updates
- Connection timeout and cleanup

## Performance Optimization & Best Practices

### Backend Performance Strategies

#### Async Processing with Background Tasks

```python
# application/use_cases/match_use_cases.py
from fastapi import BackgroundTasks
import asyncio
from typing import List

class MatchUseCases:
    def __init__(self, match_repo, cache_service, notification_service):
        self.match_repo = match_repo
        self.cache = cache_service
        self.notifications = notification_service

    async def create_match_from_queue(self, background_tasks: BackgroundTasks) -> Match:
        """Create match with async processing"""
        # Get players from queue
        players = await self.get_ready_players()
        if len(players) < 4:
            raise ValueError("Not enough players in queue")

        # Create match synchronously
        match = await self.match_repo.create(
            Match(players=players[:4], status=MatchStatus.PENDING)
        )

        # Background tasks for non-critical operations
        background_tasks.add_task(self._notify_players, match.id, players)
        background_tasks.add_task(self._update_statistics, players)
        background_tasks.add_task(self._clear_queue, players[:4])

        return match

    async def _notify_players(self, match_id: str, players: List[str]):
        """Background task for player notifications"""
        await asyncio.gather(*[
            self.notifications.send_match_notification(player_id, match_id)
            for player_id in players
        ])

    async def _update_statistics(self, players: List[str]):
        """Background task for statistics update"""
        await asyncio.gather(*[
            self.match_repo.increment_matches_played(player_id)
            for player_id in players
        ])
```

#### Database Query Optimization

```python
# infrastructure/database/repositories/optimized_queries.py
class OptimizedMatchRepository:
    async def get_player_statistics(self, player_id: str) -> dict:
        """Single query for comprehensive player stats"""
        query = """
            WITH player_matches AS (
                SELECT m.*, mp.team,
                       CASE WHEN m.status = 'finished' THEN
                           CASE WHEN (mp.team = 1 AND m.team1_score > m.team2_score) OR
                                    (mp.team = 2 AND m.team2_score > m.team1_score)
                           THEN 1 ELSE 0 END
                       END as won
                FROM matches m
                JOIN match_players mp ON m.id = mp.match_id
                WHERE mp.player_id = $1 AND m.status = 'finished'
            ),
            teammate_stats AS (
                SELECT mp2.player_id as teammate_id, COUNT(*) as games_together
                FROM match_players mp1
                JOIN match_players mp2 ON mp1.match_id = mp2.match_id
                    AND mp1.team = mp2.team AND mp1.player_id != mp2.player_id
                WHERE mp1.player_id = $1
                GROUP BY mp2.player_id
                ORDER BY games_together DESC
                LIMIT 5
            )
            SELECT
                COUNT(*) as total_matches,
                SUM(won) as matches_won,
                ROUND(AVG(won) * 100, 2) as win_percentage,
                json_agg(DISTINCT jsonb_build_object(
                    'teammate_id', ts.teammate_id,
                    'games_together', ts.games_together
                )) as frequent_teammates
            FROM player_matches pm
            LEFT JOIN teammate_stats ts ON true
            GROUP BY pm.player_id
        """
        return await self.connection.fetchrow(query, player_id)

    async def get_active_matches_with_details(self) -> List[dict]:
        """Optimized query for match dashboard"""
        query = """
            SELECT
                m.*,
                c.name as court_name,
                json_agg(
                    json_build_object(
                        'id', p.id,
                        'name', p.name,
                        'team', mp.team,
                        'skill_level', p.registered_skill_level
                    ) ORDER BY mp.team, p.name
                ) as players
            FROM matches m
            JOIN courts c ON m.court_id = c.id
            JOIN match_players mp ON m.id = mp.match_id
            JOIN players p ON mp.player_id = p.id
            WHERE m.status IN ('pending', 'ongoing')
            GROUP BY m.id, c.name
            ORDER BY m.created_at DESC
        """
        return await self.connection.fetch(query)
```

#### Caching Strategy Implementation

```python
# infrastructure/cache/advanced_cache.py
import asyncio
from functools import wraps
from typing import Callable, Any
import pickle
import hashlib

class AdvancedCacheService:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.local_cache = {}  # L1 cache
        self.cache_stats = {"hits": 0, "misses": 0}

    def cache_result(self, ttl: int = 300, key_prefix: str = ""):
        """Decorator for caching function results"""
        def decorator(func: Callable) -> Callable:
            @wraps(func)
            async def wrapper(*args, **kwargs):
                # Generate cache key
                cache_key = self._generate_cache_key(
                    key_prefix, func.__name__, args, kwargs
                )

                # Try L1 cache first
                if cache_key in self.local_cache:
                    self.cache_stats["hits"] += 1
                    return self.local_cache[cache_key]

                # Try Redis cache
                cached_result = await self.redis.get(cache_key)
                if cached_result:
                    result = pickle.loads(cached_result)
                    self.local_cache[cache_key] = result  # Store in L1
                    self.cache_stats["hits"] += 1
                    return result

                # Execute function and cache result
                result = await func(*args, **kwargs)

                # Store in both caches
                serialized = pickle.dumps(result)
                await self.redis.setex(cache_key, ttl, serialized)
                self.local_cache[cache_key] = result

                self.cache_stats["misses"] += 1
                return result
            return wrapper
        return decorator

    def _generate_cache_key(self, prefix: str, func_name: str, args, kwargs) -> str:
        """Generate deterministic cache key"""
        key_data = f"{prefix}:{func_name}:{str(args)}:{str(sorted(kwargs.items()))}"
        return hashlib.md5(key_data.encode()).hexdigest()

    async def invalidate_pattern(self, pattern: str):
        """Invalidate cache keys matching pattern"""
        keys = await self.redis.keys(pattern)
        if keys:
            await self.redis.delete(*keys)

        # Clear matching L1 cache entries
        to_remove = [k for k in self.local_cache.keys() if pattern in k]
        for key in to_remove:
            del self.local_cache[key]
```

### Frontend Performance Optimization

#### Code Splitting and Lazy Loading

```typescript
// app/layout.tsx - Next.js 14 App Router
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy load heavy 3D components
const Court3D = dynamic(() => import("@/components/ui/3d/court-3d"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />,
  ssr: false, // Disable SSR for 3D components
});

const SpectatorDashboard = dynamic(
  () => import("@/components/spectator-dashboard"),
  {
    loading: () => <SpectatorDashboardSkeleton />,
  }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<GlobalLoadingSpinner />}>{children}</Suspense>
      </body>
    </html>
  );
}
```

#### Optimized State Management

```typescript
// store/performance-store.ts
import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface PerformanceState {
  // Memoized selectors
  activeMatchesCount: number;
  queueLength: number;
  // Optimized actions
  batchUpdateMatches: (updates: MatchUpdate[]) => void;
  optimisticScoreUpdate: (matchId: string, score: ScoreUpdate) => void;
}

export const usePerformanceStore = create<PerformanceState>()(
  persist(
    subscribeWithSelector(
      immer((set, get) => ({
        matches: new Map(), // Use Map for O(1) lookups
        queue: [],

        // Computed values
        get activeMatchesCount() {
          return Array.from(get().matches.values()).filter(
            (m) => m.status === "ongoing"
          ).length;
        },

        get queueLength() {
          return get().queue.length;
        },

        // Batch operations for better performance
        batchUpdateMatches: (updates) =>
          set((state) => {
            updates.forEach((update) => {
              if (state.matches.has(update.id)) {
                Object.assign(state.matches.get(update.id)!, update.data);
              }
            });
          }),

        // Optimistic updates with rollback capability
        optimisticScoreUpdate: (matchId, score) =>
          set((state) => {
            const match = state.matches.get(matchId);
            if (match) {
              // Store previous state for rollback
              match._previousScore = { ...match.score };
              match.score = { ...match.score, ...score };
            }
          }),
      }))
    ),
    {
      name: "match-storage",
      partialize: (state) => ({
        // Only persist essential data
        matches: Array.from(state.matches.entries()),
        queue: state.queue.slice(0, 10), // Limit queue size
      }),
    }
  )
);
```

#### WebSocket Optimization

```typescript
// lib/optimized-websocket.ts
class OptimizedWebSocketClient {
  private ws: WebSocket | null = null;
  private messageQueue: Array<any> = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  constructor(private url: string) {
    this.connect();
  }

  private connect() {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.flushMessageQueue();
      };

      this.ws.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data));
      };

      this.ws.onclose = () => {
        this.stopHeartbeat();
        this.scheduleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.scheduleReconnect();
    }
  }

  private handleMessage(message: any) {
    // Batch process messages for better performance
    requestIdleCallback(() => {
      switch (message.type) {
        case "score_updated":
          this.handleScoreUpdate(message.data);
          break;
        case "match_created":
          this.handleMatchCreated(message.data);
          break;
        default:
          console.warn("Unknown message type:", message.type);
      }
    });
  }

  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000); // 30 seconds
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    }
  }

  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue messages when disconnected
      this.messageQueue.push(message);
    }
  }

  private flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }
}
```

## Local Deployment Architecture

### Docker Configuration for Local Development

```yaml
# docker/docker-compose.yml
version: "3.8"

services:
  backend:
    build:
      context: ../backend
      dockerfile: docker/Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://badminton:password@postgres:5432/badminton_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET_KEY=your-secret-key-here
    depends_on:
      - postgres
      - redis
    volumes:
      - ../backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build:
      context: ../frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - NEXT_PUBLIC_WS_URL=ws://localhost:8000
    volumes:
      - ../frontend:/app
      - /app/node_modules
    command: npm run dev

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=badminton_db
      - POSTGRES_USER=badminton
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  postgres_data:
  redis_data:
```

### Production Deployment Configuration

```yaml
# docker/docker-compose.prod.yml
version: "3.8"

services:
  backend:
    build:
      context: ../backend
      dockerfile: docker/Dockerfile.prod
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://badminton:${DB_PASSWORD}@postgres:5432/badminton_db
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: "1.0"
          memory: 1G
        reservations:
          cpus: "0.5"
          memory: 512M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build:
      context: ../frontend
      dockerfile: Dockerfile.prod
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    deploy:
      replicas: 2

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=badminton_db
      - POSTGRES_USER=badminton
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backup:/backup
    deploy:
      resources:
        limits:
          memory: 2G

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes --maxmemory 512mb --maxmemory-policy allkeys-lru

volumes:
  postgres_data:
  redis_data:
```

### Monitoring and Logging

```python
# core/monitoring.py
import logging
import time
from functools import wraps
from prometheus_client import Counter, Histogram, generate_latest

# Metrics
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')
WEBSOCKET_CONNECTIONS = Counter('websocket_connections_total', 'Total WebSocket connections')

def monitor_performance(func):
    """Decorator to monitor function performance"""
    @wraps(func)
    async def wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            return result
        finally:
            duration = time.time() - start_time
            REQUEST_DURATION.observe(duration)
            logging.info(f"{func.__name__} executed in {duration:.3f}s")
    return wrapper

class StructuredLogger:
    def __init__(self):
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)

    def log_match_event(self, event_type: str, match_id: str, data: dict):
        self.logger.info(
            "Match event",
            extra={
                "event_type": event_type,
                "match_id": match_id,
                "data": data
            }
        )

    def log_performance_metric(self, metric_name: str, value: float, tags: dict = None):
        self.logger.info(
            f"Performance metric: {metric_name}={value}",
            extra={"metric": metric_name, "value": value, "tags": tags or {}}
        )
```

## Summary

### English Summary

This professional design document outlines a comprehensive Badminton Match Marking System built with modern technologies and best practices. The system features:

- **Clean Architecture**: Domain-driven design with clear separation of concerns
- **High Performance**: Async processing, optimized database queries, and intelligent caching
- **Real-time Capabilities**: WebSocket connections with automatic reconnection and message queuing
- **3D Immersive UI**: Modern frontend with Three.js integration for engaging user experience
- **Local Deployment**: Complete offline capability with local OAuth and containerized services
- **Professional Standards**: Comprehensive testing, monitoring, and error handling
- **Scalability**: Designed for horizontal scaling with microservice readiness

The architecture prioritizes maintainability, performance, and user experience while ensuring the system can be deployed locally without external dependencies.

### Thai Summary (สรุปภาษาไทย)

เอกสารออกแบบระดับมืออาชีพนี้นำเสนอระบบบันทึกคะแนนแบดมินตันที่ครอบคลุมและสร้างด้วยเทคโนโลยีและแนวปฏิบัติที่ทันสมัย ระบบมีคุณสมบัติ:

- **สถาปัตยกรรมที่สะอาด**: การออกแบบที่ขับเคลื่อนด้วยโดเมนและแยกส่วนงานอย่างชัดเจน
- **ประสิทธิภาพสูง**: การประมวลผลแบบอะซิงค์, การสืบค้นฐานข้อมูลที่เหมาะสม, และการแคชอย่างชาญฉลาด
- **ความสามารถเรียลไทม์**: การเชื่อมต่อ WebSocket พร้อมการเชื่อมต่อใหม่อัตโนมัติและการจัดคิวข้อความ
- **UI แบบ 3D ที่ดื่มด่ำ**: ส่วนหน้าทันสมัยพร้อมการรวม Three.js เพื่อประสบการณ์ผู้ใช้ที่น่าสนใจ
- **การติดตั้งในเครื่อง**: ความสามารถออฟไลน์ที่สมบูรณ์พร้อม OAuth ในเครื่องและบริการแบบคอนเทนเนอร์
- **มาตรฐานมืออาชีพ**: การทดสอบ, การตรวจสอบ, และการจัดการข้อผิดพลาดที่ครอบคลุม
- **ความสามารถในการขยาย**: ออกแบบสำหรับการขยายแนวนอนพร้อมความพร้อมของไมโครเซอร์วิส

สถาปัตยกรรมให้ความสำคัญกับความสามารถในการบำรุงรักษา, ประสิทธิภาพ, และประสบการณ์ผู้ใช้ ขณะเดียวกันก็รับประกันว่าระบบสามารถติดตั้งในเครื่องได้โดยไม่ต้องพึ่งพาภายนอกmes

- Role-based access control for admin functions

### Data Protection

- Input validation and sanitization
- SQL injection prevention with parameterized queries
- XSS protection with content security policies

### Real-time Security

- WebSocket authentication verification
- Rate limiting on score updates
- Match participation validation

## Deployment Architecture

### Development Environment

- Docker containers for consistent development
- Hot reloading for rapid development cycles
- Local PostgreSQL and Redis instances

### Production Environment

- Container orchestration with Docker Compose
- Load balancing for high availability
- Database connection pooling
- Redis clustering for session management

### Monitoring & Logging

- Application performance monitoring
- Error tracking and alerting
- Real-time connection monitoring
- Database query performance tracking
