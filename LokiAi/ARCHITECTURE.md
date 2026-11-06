# 🏗️ LokiAI System Architecture

## Overview

LokiAI is a production-ready, fully Dockerized decentralized AI agent platform.

---

## 🎯 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                      (MetaMask Wallet)                           │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP/WebSocket
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX REVERSE PROXY                           │
│                         Port 80/443                              │
│          ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│          │    /     │  │  /api/   │  │/socket.io│               │
│          └──────────┘  └──────────┘  └──────────┘               │
└────┬────────────────┬────────────┬──────────────────────────────┘
     │                │            │
     ▼                ▼            ▼
┌─────────┐    ┌──────────────────────┐
│Frontend │    │      Backend         │
│ React   │    │  Node.js + Express   │
│  Vite   │    │    + Socket.IO       │
│Port 5175│    │  Port 5000/5050      │
└─────────┘    └──────────┬───────────┘
                          │
                          ▼
                ┌──────────────────┐
                │     MongoDB      │
                │   Port 27017     │
                │  Collections:    │
                │  - users         │
                │  - agents        │
                │  - transactions  │
                │  - activity_log  │
                └──────────────────┘
```

---

## 🔄 Data Flow

### 1. User Authentication Flow

```
User Browser
    │
    │ 1. Connect Wallet
    ▼
MetaMask Extension
    │
    │ 2. Request SIWE Message
    ▼
Backend API (/api/auth/message)
    │
    │ 3. Generate Challenge
    ▼
User Signs Message
    │
    │ 4. Submit Signature
    ▼
Backend API (/api/auth/verify)
    │
    │ 5. Verify with ethers.js
    ▼
MongoDB (users collection)
    │
    │ 6. Create/Update User
    ▼
Return JWT Token
```

### 2. AI Agent Execution Flow

```
Backend Server
    │
    │ 1. Fetch Agent Config
    ▼
MongoDB (agents collection)
    │
    │ 2. Get Agent Parameters
    ▼
Blockchain RPC (Alchemy)
    │
    │ 3. Fetch On-Chain Data
    ▼
Agent Logic (DeFi/Arbitrage/Rebalance)
    │
    │ 4. Execute Strategy
    ▼
MongoDB (transactions collection)
    │
    │ 5. Log Transaction
    ▼
Socket.IO
    │
    │ 6. Emit Real-Time Update
    ▼
Frontend Dashboard
```

### 3. Real-Time Updates Flow

```
Backend Server (Every 10s)
    │
    │ 1. Query Active Agents
    ▼
MongoDB (agents collection)
    │
    │ 2. Get Performance Data
    ▼
Socket.IO Server
    │
    │ 3. Emit 'updateAgent' Event
    ▼
Socket.IO Client (Frontend)
    │
    │ 4. Update UI State
    ▼
React Dashboard Components
```

---

## 🗄️ Database Schema

### users Collection
```javascript
{
    _id: ObjectId,
    walletAddress: String (indexed, unique),
    lastLogin: Date,
    createdAt: Date,
    updatedAt: Date
}
```

### agents Collection
```javascript
{
    _id: ObjectId,
    walletAddress: String (indexed),
    name: String,
    type: String, // 'yield' | 'arbitrage' | 'rebalancer' | 'risk'
    status: String, // 'active' | 'paused' | 'stopped'
    chains: [String],
    performance: {
        apy: Number,
        totalPnl: Number,
        winRate: Number,
        totalTrades: Number
    },
    config: Object,
    createdAt: Date,
    updatedAt: Date
}
```

### transactions Collection
```javascript
{
    _id: ObjectId,
    walletAddress: String (indexed),
    hash: String (unique),
    fromChain: String,
    toChain: String,
    token: String,
    amount: Number,
    fee: Number,
    status: String, // 'completed' | 'pending' | 'failed'
    timestamp: Date (indexed)
}
```

### activity_log Collection
```javascript
{
    _id: ObjectId,
    walletAddress: String (indexed),
    type: String,
    action: String,
    description: String,
    status: String,
    timestamp: Date (indexed),
    metadata: Object
}
```

### portfolio_history Collection
```javascript
{
    _id: ObjectId,
    walletAddress: String (indexed),
    totalValue: Number,
    timestamp: Date (indexed)
}
```

---

## 🔐 Security Architecture

### Authentication Layers

```
┌─────────────────────────────────────────┐
│         Layer 1: Wallet Auth            │
│  MetaMask + SIWE + Signature Verify     │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│      Layer 2: Session Management        │
│         JWT Tokens + CORS               │
└─────────────────────────────────────────┘
```

---

## 🌐 Network Architecture

### Docker Network Topology

```
┌─────────────────────────────────────────────────────────┐
│              lokiai-network (Bridge)                     │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │  nginx   │  │ frontend │  │ backend  │  │mongodb │ │
│  │  :80     │  │  :5175   │  │:5000/5050│  │ :27017 │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘ │
│       │             │             │             │      │
│       └─────────────┴─────────────┴─────────────┘      │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
                  External Networks
                  (Blockchain RPCs)
```

### Port Mapping

| Service | Internal Port | External Port | Protocol |
|---------|--------------|---------------|----------|
| NGINX | 80 | 80 | HTTP |
| NGINX | 443 | 443 | HTTPS (optional) |
| Frontend | 80 | 5175 | HTTP |
| Backend | 5000 | 5000 | HTTP |
| Backend | 5050 | 5050 | WebSocket |
| MongoDB | 27017 | 27017 | TCP |

---

## 🔄 Service Dependencies

```
┌──────────┐
│  NGINX   │ (Depends on: frontend, backend)
└────┬─────┘
     │
     ├─────► ┌──────────┐
     │       │ Frontend │ (Depends on: backend)
     │       └──────────┘
     │
     ├─────► ┌──────────┐
     │       │ Backend  │ (Depends on: mongodb)
     │       └────┬─────┘
     │            │
     │            └─────► ┌──────────┐
     │                    │ MongoDB  │ (No dependencies)
     │                    └──────────┘
```

---

## 📊 API Architecture

### REST API Endpoints

```
/api/
├── auth/
│   ├── GET  /message          # Generate SIWE message
│   └── POST /verify           # Verify signature
├── dashboard/
│   └── GET  /summary          # Dashboard overview
├── agents/
│   ├── GET  /status           # Get all agents
│   └── POST /update           # Update agent
├── analytics/
│   ├── GET  /performance      # Performance metrics
│   └── GET  /risk             # Risk analysis
├── crosschain/
│   ├── GET  /activity         # Cross-chain txs
│   └── GET  /bridges          # Available bridges
└── activity/
    ├── GET  /history          # Activity log
    └── GET  /stats            # Statistics
```

### WebSocket Events

```
Client → Server:
    - subscribe(walletAddress)
    - disconnect()

Server → Client:
    - updateAgent(agentData)
    - updatePortfolio(portfolioData)
    - updateActivity(activityData)
```

---

## 🔄 Deployment Pipeline

```
1. Build Phase
   ├── docker-compose build --no-cache
   ├── Build backend image
   └── Build frontend image

2. Start Phase
   ├── docker-compose up -d
   ├── Start MongoDB
   ├── Start Backend (wait for health)
   ├── Start Frontend
   └── Start NGINX

3. Initialize Phase
   ├── MongoDB collections
   ├── Create indexes
   └── Seed sample data (optional)

4. Verify Phase
   ├── Health checks
   ├── API tests
   └── Integration tests
```

---

## 📈 Scalability

### Horizontal Scaling

```
NGINX Load Balancer
    │
    ├─────► Backend Instance 1
    ├─────► Backend Instance 2
    └─────► Backend Instance 3
                │
                ▼
         MongoDB Replica Set
```

### Vertical Scaling

- Increase Docker container resources
- Optimize MongoDB indexes
- Cache frequently accessed data
- Use Redis for session storage

---

## 🔍 Monitoring & Logging

### Health Checks

```
Service         Endpoint                    Interval
-------         --------                    --------
Backend         /health                     30s
MongoDB         db.adminCommand('ping')     10s
NGINX           /health (proxy)             30s
```

### Logging Strategy

```
Application Logs
    ├── Backend: /app/logs/backend.log
    └── NGINX: /var/log/nginx/

Docker Logs
    └── docker-compose logs -f [service]

Monitoring
    └── monitor-services.ps1 (Real-time)
```

---

## 🎯 Production Considerations

### Performance Optimization

- NGINX gzip compression
- Static asset caching
- Database query optimization
- Connection pooling
- Lazy loading in frontend

### Security Hardening

- Change default passwords
- Enable SSL/TLS
- Restrict CORS origins
- Rate limiting
- Input validation
- Regular security audits

### Backup Strategy

- MongoDB daily backups
- Configuration backups
- Disaster recovery plan

---

**LokiAI Architecture** - Production-Ready Decentralized AI Platform

**Version**: 1.0.0

**Status**: ✅ Production Ready
