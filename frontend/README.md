# Live Quiz Game Backend

A real-time quiz game backend built with Node.js, Socket.io, and featuring cron jobs and background job processing.

## Features

### 🔌 WebSocket Integration
- Real-time communication using Socket.io
- Live quiz state synchronization
- Instant answer submission and scoring
- Connection management with auto-reconnection

### ⏰ Cron Jobs
- **Daily Reminders**: 8 AM quiz notifications
- **Weekly Resets**: Sunday midnight leaderboard reset
- **Hourly Cleanup**: Remove inactive players
- **Performance Monitoring**: System health checks every 15 minutes
- **Weekend Marathon**: Special Saturday quiz events

### 🔄 Background Jobs
- **Question Timeouts**: Automatic question progression
- **Score Processing**: Delayed score calculation for better UX
- **Auto-save**: Periodic state persistence
- **Player Cleanup**: Remove disconnected players
- **Achievement Processing**: Calculate player achievements

### 🎮 Quiz Features
- Multi-player support with real-time tracking
- Dynamic scoring with time bonuses
- Question lifecycle management
- Live leaderboards
- Player statistics and achievements

## Quick Start

### Installation

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
\`\`\`

### Environment Variables

Create a `.env` file:

\`\`\`env
PORT=5000
NODE_ENV=development
\`\`\`

### Frontend Integration

Your frontend should connect to:
```javascript
const socket = io('http://localhost:5000')
