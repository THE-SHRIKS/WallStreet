import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import dashboardRouter from './backend-dashboard-api.js';
import agentRouter from './routes/agents.js';
import analyticsRouter from './routes/analytics.js';
import crosschainRouter from './routes/crosschain.js';
import activityRouter from './routes/activity.js';

const app = express();
const PORT = 5000;

// Middleware - Allow all common dev server ports
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'http://127.0.0.1:5173', 
        'http://localhost:5174', 
        'http://127.0.0.1:5174',
        'http://localhost:5175',
        'http://127.0.0.1:5175',
        'http://localhost:5176', 
        'http://127.0.0.1:5176',
        'http://192.168.31.233:5173',  // Network IP
        'http://192.168.31.233:5174',
        'http://192.168.31.233:5175',
        'http://192.168.31.233:5176'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'cache-control']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        message: 'Backend server is running (Node.js fallback)'
    });
});

// ✅ Generate SIWE (Sign-In with Ethereum) message for MetaMask login
app.get('/api/auth/message', (req, res) => {
    const { address } = req.query;
    
    if (!address) {
        return res.status(400).json({ 
            error: 'Wallet address required' 
        });
    }
    
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(8).toString('hex');
    const message = `Welcome to LokiAI! Sign this message to authenticate your wallet.\n\nAddress: ${address}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;
    
    res.json({ message });
});

// Generate challenge for wallet verification
app.post('/challenge', (req, res) => {
    const { walletAddress } = req.body;
    
    if (!walletAddress) {
        return res.status(400).json({
            error: 'Wallet address is required'
        });
    }
    
    const timestamp = Math.floor(Date.now() / 1000);
    const nonce = crypto.randomBytes(4).toString('hex');
    const message = `Please sign this message to verify your wallet ownership.\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}\nNonce: ${nonce}`;
    
    res.json({ message });
});

// Verify wallet signature (simplified - would need ethers.js for full verification)
app.post('/verify-wallet', (req, res) => {
    const { walletAddress, signature, message } = req.body;
    
    if (!walletAddress || !signature || !message) {
        return res.status(400).json({
            valid: false,
            message: 'Missing required fields'
        });
    }
    
    if (!walletAddress.startsWith('0x') || walletAddress.length !== 42) {
        return res.status(400).json({
            valid: false,
            message: 'Invalid wallet address format'
        });
    }
    
    // For now, return success for demo purposes
    // In production, you'd verify the signature using ethers.js
    res.json({
        valid: true,
        message: 'Wallet signature verified successfully (demo mode)'
    });
});

// Mock users endpoint for testing
app.get('/users', (req, res) => {
    res.json([
        {
            id: 1,
            name: 'Demo User',
            email: 'demo@example.com',
            wallet_address: '0x742d35Cc6Cd3B7a8917fe5b3B8b3C9f5d5e5d9a'
        }
    ]);
});

// Create user endpoint
app.post('/users', (req, res) => {
    const { name, email, walletAddress } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({
            error: 'Name and email are required'
        });
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        wallet_address: walletAddress || null
    };
    
    res.json(newUser);
});

// MongoDB connection
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://lokiuser:%24hrishii%21okii25@loki-ai-cluster.b63sh3c.mongodb.net/?retryWrites=true&w=majority&appName=loki-ai-cluster';
const DB_NAME = 'loki_agents';

let mongoClient = null;
let db = null;

// Initialize MongoDB connection
async function connectMongoDB() {
    if (db) return db;
    
    try {
        mongoClient = new MongoClient(MONGODB_URI);
        await mongoClient.connect();
        db = mongoClient.db(DB_NAME);
        console.log('✅ Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
    }
}

// Mount dashboard API routes
app.use('/api/dashboard', dashboardRouter);

// Mount agents API routes
app.use('/api/agents', agentRouter);

app.listen(PORT, '0.0.0.0', async () => {
    console.log('🚀 LokiAI Backend Server');
    console.log(`📍 Server running on: http://0.0.0.0:${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`📍 Network: http://192.168.31.233:${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
    
    // Initialize MongoDB connection
    try {
        const database = await connectMongoDB();
        app.locals.db = database; // Make DB available to routes
        console.log('✅ MongoDB connected and ready');
        console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard/summary`);
    } catch (error) {
        console.error('❌ MongoDB connection failed - using fallback mode');
    }
});
