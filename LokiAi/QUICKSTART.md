# ⚡ LokiAI Quick Start Guide

Get LokiAI running in 5 minutes!

## 🚀 One-Command Deploy

### Windows PowerShell (Recommended)

```powershell
# 1. Verify setup
.\verify-setup.ps1

# 2. Deploy
.\docker-start-production.ps1

# 3. Test
node test-production-deployment.js

# 4. Open browser
start http://localhost
```

### Windows CMD

```cmd
REM 1. Deploy
docker-start-production.bat

REM 2. Test
node test-production-deployment.js

REM 3. Open browser
start http://localhost
```

---

## 📋 Prerequisites

- ✅ Docker Desktop installed and running
- ✅ 8GB+ RAM
- ✅ 10GB+ free disk space

**Don't have Docker?** [Download here](https://www.docker.com/products/docker-desktop)

---

## 🎯 Step-by-Step

### Step 1: Verify Setup

```powershell
.\verify-setup.ps1
```

This checks:
- Docker installation
- Required files
- Port availability
- System resources

### Step 2: Configure (Optional)

Copy environment template:

```powershell
copy .env.production .env
```

Edit `.env` to add your API keys (optional):

```env
ALCHEMY_API_KEY=your_key_here
COINGECKO_API_KEY=your_key_here
```

### Step 3: Deploy

```powershell
.\docker-start-production.ps1
```

This will:
1. Stop existing containers
2. Build all images
3. Start all services
4. Show service status

**Wait 30-60 seconds** for services to be healthy.

### Step 4: Verify

```powershell
# Check services
docker-compose -f docker-compose.prod.yml ps

# Run tests
node test-production-deployment.js
```

All services should show "Up" and tests should pass.

### Step 5: Access

Open your browser:

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api/health

---

## 🎮 Using LokiAI

### 1. Connect Wallet

1. Click "Connect Wallet"
2. Select MetaMask
3. Approve connection
4. Sign authentication message

### 2. Explore Features

**Dashboard**
- View portfolio summary
- See active AI agents
- Monitor recent activity

**AI Agents**
- View all deployed agents
- Check performance metrics
- Monitor real-time updates

**Analytics**
- Performance charts
- Risk metrics
- Historical data

**Cross-Chain**
- View transactions
- Track bridge activity
- Monitor chains

---

## 🔧 Common Commands

### View Logs

```powershell
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Restart Service

```powershell
docker-compose -f docker-compose.prod.yml restart backend
```

### Stop All

```powershell
docker-compose -f docker-compose.prod.yml down
```

### Monitor Services

```powershell
.\monitor-services.ps1
```

---

## 🐛 Troubleshooting

### Services Won't Start

```powershell
# Check logs
docker-compose -f docker-compose.prod.yml logs

# Restart
docker-compose -f docker-compose.prod.yml restart
```

### Port Already in Use

```powershell
# Find process
netstat -ano | findstr :80

# Kill process
taskkill /PID <PID> /F
```

### Clean Restart

```powershell
# Stop and remove everything
docker-compose -f docker-compose.prod.yml down -v

# Rebuild and start
docker-compose -f docker-compose.prod.yml up -d --build
```

### Frontend Not Loading

```powershell
# Check NGINX logs
docker-compose -f docker-compose.prod.yml logs nginx

# Restart NGINX
docker-compose -f docker-compose.prod.yml restart nginx
```

---

## 📊 Service Status

Check if services are healthy:

```powershell
# Backend
curl http://localhost/api/health

# MongoDB
docker exec lokiai-mongodb mongosh --eval "db.adminCommand('ping')"
```

---

## 🎯 What's Running?

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost | React dashboard |
| Backend | http://localhost/api | REST API |
| MongoDB | mongodb://localhost:27017 | Database |
| Socket.IO | ws://localhost/socket.io | Real-time updates |

---

## 📚 Next Steps

1. **Read Full Guide**: See `PRODUCTION_DEPLOYMENT.md`
2. **Check Checklist**: Review `DEPLOYMENT_CHECKLIST.md`
3. **View Summary**: Read `INTEGRATION_SUMMARY.md`

---

## 🆘 Need Help?

### Check Logs
```powershell
docker-compose -f docker-compose.prod.yml logs -f
```

### Verify Setup
```powershell
.\verify-setup.ps1
```

### Run Tests
```powershell
node test-production-deployment.js
```

### Monitor Services
```powershell
.\monitor-services.ps1
```

---

## ✅ Success Checklist

- [ ] Docker Desktop running
- [ ] All services started
- [ ] Health checks passing
- [ ] Tests passing
- [ ] Frontend accessible
- [ ] MetaMask connected
- [ ] Dashboard loading

---

**That's it! You're ready to use LokiAI! 🎉**

For detailed information, see:
- `PRODUCTION_DEPLOYMENT.md` - Complete guide
- `DEPLOYMENT_CHECKLIST.md` - Go-live checklist
- `INTEGRATION_SUMMARY.md` - Technical summary
