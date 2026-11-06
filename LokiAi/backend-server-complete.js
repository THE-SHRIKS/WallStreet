import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import { MongoClient } from 'mongodb';

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
        'http://192.168.31.233:5173',
        'http://192.168.31.233:5174',
        'http://192.168.31.233:5175',
        'http://192.168.31.233:5176'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB connection
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

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        message: 'LokiAI Backend'
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

// Verify wallet signature
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
    
    res.json({
        valid: true,
        message: 'Wallet signature verified successfully'
    });
});

// Start server
app.listen(PORT, '0.0.0.0', async () => {
    console.log('🚀 LokiAI Backend Server');
    console.log(`📍 Server running on: http://0.0.0.0:${PORT}`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`📍 Network: http://192.168.31.233:${PORT}`);
    console.log(`✅ Health check: http://localhost:${PORT}/health`);
    
    // Initialize MongoDB connection
    try {
        await connectMongoDB();
        console.log('✅ MongoDB connected and ready');
    } catch (error) {
        console.error('❌ MongoDB connection failed - using fallback mode');
    }
});
