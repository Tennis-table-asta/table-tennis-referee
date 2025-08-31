# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Table tennis referee application with real-time multi-screen interfaces. Built as a client-server architecture with WebSocket communication for live match updates across multiple devices.

## Development Commands

```bash
# Start both client and server in development mode
npm run dev

# Install all dependencies (root, client, and server)
npm run install-all

# Client only (runs on port 3000)
npm run client

# Server only (runs on port 3001)
npm run server

# Build client for production
npm run build
```

### Individual Component Commands

**Client (React app):**
```bash
cd client
npm start     # Development mode
npm test      # Run tests
npm run build # Production build
```

**Server (Node.js/Express):**
```bash
cd server
npm run dev   # Development with nodemon
npm run build # TypeScript compilation
npm start     # Production mode
```

## Architecture

### Client-Server Communication
- **Real-time sync**: Socket.io WebSocket connection between client and server
- **State persistence**: Match state stored in localStorage for offline resilience
- **Multi-screen support**: Same match state synchronized across multiple interfaces

### Key Components

**Server (`server/src/`):**
- `index.ts`: Main server with Socket.io handlers and match state management
- `utils/gameRules.ts`: Tennis table scoring rules and service rotation logic
- `types.ts`: Shared TypeScript interfaces

**Client (`client/src/`):**
- `hooks/useSocket.ts`: WebSocket connection management and match operations
- `types.ts`: Shared TypeScript interfaces (must stay in sync with server)
- `pages/`: Route-based components for different interfaces
  - `Setup.tsx`: Match configuration
  - `Arbitre.tsx`: Referee interface (tablet/phone)
  - `Spectateurs.tsx`: Public display (TV/projector)
  - `Historique.tsx`: Point history
- `components/Confetti.tsx`: Victory celebration animation

### Data Flow
1. Match configuration created in `Setup` → sent via socket to server
2. Server maintains authoritative match state with scoring rules
3. All connected clients receive `match-update` events
4. UI interfaces (`Arbitre`, `Spectateurs`) render synchronized state

### Tennis Table Rules Implementation
- Standard scoring: 11 points, win by 2
- Service alternation: 2 serves per player (1 serve when 10-10)
- Match format: Best of 5 sets
- **Side Changes**: 
  - Change sides at the end of each set (sets 1-5)
  - **Special 5th set rule**: Additional side change when first player reaches 5 points
- Service rotation logic handled in `GameRules` class
- Side management with mirrored spectator view

### Socket Events
- `match-config`: Initialize new match
- `point-scored`: Award point to player
- `undo-point`: Revert last point
- `match-update`: Broadcast current match state
- `new-set`: Start next set

## Interface Usage Patterns

**Multi-device Setup:**
- Referee device (tablet): Navigate to `/arbitre`
- Public display (TV): Navigate to `/spectateurs`  
- Match setup: Use `/setup` to configure players and settings

**State Synchronization:**
- All connected devices automatically sync via WebSocket
- Offline resilience through localStorage backup
- Connection status indicators on each interface