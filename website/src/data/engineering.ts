import type { EvidenceStatus } from "./project-facts";

export interface SystemNode {
  id: string;
  name: string;
  shortName: string;
  status: EvidenceStatus;
  role: string;
  description: string;
  boundary: string;
  sourcePaths: string[];
  column: 1 | 2 | 3;
  row: 1 | 2 | 3;
}

export const SYSTEM_NODES: SystemNode[] = [
  {
    id: "browser",
    name: "Browser application",
    shortName: "React UI",
    status: "Implemented",
    role: "Interface",
    description: "A React, TypeScript, and Vite app lives under LokiAi/. It contains portfolio, agent, and cross-chain views.",
    boundary: "Some displayed values and the cross-chain completion state are simulated. A rendered interface does not prove a wallet action or transaction occurred.",
    sourcePaths: ["LokiAi/src/App.tsx", "LokiAi/src/pages/CrossChain.tsx"],
    column: 1,
    row: 1,
  },
  {
    id: "api",
    name: "API service",
    shortName: "Node / Express",
    status: "Prototype",
    role: "Service boundary",
    description: "A separate Node/Express server defines API routes and Socket.IO setup, with MongoDB-related packages in its own manifest.",
    boundary: "No external database or deployed API was connected during this source review; secrets and local configuration are not part of this website.",
    sourcePaths: ["LokiAi/backend/server.js", "LokiAi/backend/package.json"],
    column: 2,
    row: 1,
  },
  {
    id: "orchestrator",
    name: "Agent orchestration",
    shortName: "Agent layer",
    status: "Prototype",
    role: "Coordination",
    description: "The frontend service layer defines an orchestrator and specialist agent interfaces; a separate backend also contains agent modules.",
    boundary: "These modules are described as code areas, not a claim that every agent is deployed, funded, or connected to live market data.",
    sourcePaths: [
      "LokiAi/src/services/agents/agent-orchestrator.ts",
      "LokiAi/backend/services/agents/yield-optimizer-agent.js",
    ],
    column: 3,
    row: 1,
  },
  {
    id: "events",
    name: "Event updates",
    shortName: "Socket.IO",
    status: "Prototype",
    role: "Updates",
    description: "The API server imports and configures Socket.IO alongside its HTTP service.",
    boundary: "A server-side event path is not a verified production feed or a source of live trading state.",
    sourcePaths: ["LokiAi/backend/server.js"],
    column: 1,
    row: 2,
  },
  {
    id: "gateway",
    name: "Task gateway",
    shortName: "FastAPI / Celery",
    status: "Prototype",
    role: "Background work",
    description: "A separate FastAPI application exposes Celery-backed task handling.",
    boundary: "The broker, worker, and app were not verified as a single running deployment in this review.",
    sourcePaths: ["task_gateway/app.py"],
    column: 2,
    row: 2,
  },
  {
    id: "rebalancer",
    name: "Portfolio rebalancer",
    shortName: "Python workflow",
    status: "Simulated",
    role: "Recommendations",
    description: "The Python engine calculates allocation deviations and produces candidate rebalance recommendations.",
    boundary: "Its execution method explicitly calls a simulated trade path; it is not evidence of a bridge or exchange transaction.",
    sourcePaths: ["portfolio_rebalancer/rebalance_engine.py"],
    column: 3,
    row: 2,
  },
  {
    id: "persistence",
    name: "Database and persistence",
    shortName: "MongoDB surface",
    status: "Prototype",
    role: "Data boundary",
    description: "MongoDB-oriented client, service, and model files appear in separate packages; their external endpoint and integrated runtime were not verified.",
    boundary: "A dependency or model file is not evidence of a running production database. No connection string or credential is included here.",
    sourcePaths: [
      "LokiAi/src/services/database/mongodb-service.ts",
      "LokiAi/backend/models/AgentResult.js",
      "LokiAi/backend/package.json",
    ],
    column: 2,
    row: 3,
  },
  {
    id: "contracts",
    name: "Solidity contract set",
    shortName: "Hardhat contracts",
    status: "Simulated",
    role: "Contract prototypes",
    description: "Arbitrage, yield, risk, and portfolio-rebalancing contract sources are present under loki-contracts/contracts/.",
    boundary: "Mock paths in source are not an audit, deployment, or guarantee of execution. No live address is presented here.",
    sourcePaths: [
      "loki-contracts/contracts/ArbitrageBot.sol",
      "loki-contracts/contracts/YieldOptimizer.sol",
      "loki-contracts/contracts/RiskManager.sol",
      "loki-contracts/contracts/PortfolioRebalancer.sol",
    ],
    column: 3,
    row: 3,
  },
  {
    id: "identity",
    name: "Ghost Key research",
    shortName: "Separate identity study",
    status: "Research",
    role: "Separate experiment",
    description: "A neighboring repository directory documents a keystroke and voice-authentication experiment.",
    boundary: "Its integration with the primary app and any production identity enforcement are not verified. This branch is intentionally drawn apart from the service path.",
    sourcePaths: ["ghost-key-main/ghost-key-main/README.md"],
    column: 1,
    row: 3,
  },
];

export const SYSTEM_EDGES = [
  { from: "browser", to: "api", kind: "unverified" },
  { from: "api", to: "orchestrator", kind: "unverified" },
  { from: "browser", to: "events", kind: "unverified" },
  { from: "api", to: "gateway", kind: "unverified" },
  { from: "api", to: "persistence", kind: "unverified" },
  { from: "orchestrator", to: "rebalancer", kind: "unverified" },
  { from: "rebalancer", to: "contracts", kind: "simulation" },
];

export const CONTRACTS = [
  {
    name: "ArbitrageBot",
    path: "loki-contracts/contracts/ArbitrageBot.sol",
    purpose: "An arbitrage-oriented contract prototype with source-level mock execution paths.",
    inputs: "Token pair, amount, and named venue labels enter the opportunity and execution methods.",
    stateAndEvents: "Venue configuration, opportunity records, and aggregate counters are stored; source events include OpportunityDetected and ArbitrageExecuted.",
    boundary: "Price and trade helpers are explicitly mocked. An event or recorded counter is not proof of a live route, executable liquidity, or net profitability.",
  },
  {
    name: "YieldOptimizer",
    path: "loki-contracts/contracts/YieldOptimizer.sol",
    purpose: "A strategy-selection and yield-optimization contract prototype.",
    inputs: "The execution method accepts a user address, token address, and amount; strategy records include protocol and risk fields.",
    stateAndEvents: "The source stores strategy metadata and user-position records; events include YieldOptimized and StrategyExecuted.",
    boundary: "Selection and protocol execution are explicitly mocked, including a 1:1 output path. Stored fields do not represent current offers or realized yield.",
  },
  {
    name: "RiskManager",
    path: "loki-contracts/contracts/RiskManager.sol",
    purpose: "A contract prototype for risk-score thresholds and related state changes.",
    inputs: "Risk assessment accepts a user address and evaluates source-held position records against configured score markers.",
    stateAndEvents: "Assessment, metrics, and alert state are stored; the source emits RiskAssessed, RiskAlert, and RiskParametersUpdated.",
    boundary: "Some liquidity and volatility calculations are mocked. A threshold is not a security review, an oracle guarantee, or a promise that loss can be prevented.",
  },
  {
    name: "PortfolioRebalancer",
    path: "loki-contracts/contracts/PortfolioRebalancer.sol",
    purpose: "A contract prototype that represents portfolio-rebalance operations.",
    inputs: "Strategy creation accepts a user, target allocation records, a threshold, and an auto-rebalance flag; other methods operate on a user portfolio.",
    stateAndEvents: "Portfolio allocations, strategies, and pending action records are stored; events include StrategyCreated, RebalanceTriggered, and PortfolioRebalanced.",
    boundary: "Current-value and action paths are mocked. No exchange transfer, wallet read, or settled on-chain rebalance is claimed.",
  },
];

export const CODE_MAP = [
  { label: "React/Vite application", path: "LokiAi/src", kind: "tree" as const },
  { label: "Agent orchestration", path: "LokiAi/src/services/agents/agent-orchestrator.ts", kind: "blob" as const },
  { label: "Backend API", path: "LokiAi/backend/server.js", kind: "blob" as const },
  { label: "MongoDB service and model", path: "LokiAi/src/services/database/mongodb-service.ts", kind: "blob" as const },
  { label: "Backend agent modules", path: "LokiAi/backend/services/agents", kind: "tree" as const },
  { label: "Python rebalancer", path: "portfolio_rebalancer/rebalance_engine.py", kind: "blob" as const },
  { label: "Task gateway", path: "task_gateway/app.py", kind: "blob" as const },
  { label: "Solidity contracts", path: "loki-contracts/contracts", kind: "tree" as const },
  { label: "Hardhat / Ethers package", path: "loki-contracts/package.json", kind: "blob" as const },
  { label: "Cross-chain UI simulation", path: "LokiAi/src/pages/CrossChain.tsx", kind: "blob" as const },
  { label: "Identity research", path: "ghost-key-main/ghost-key-main/README.md", kind: "blob" as const },
  { label: "Compose variants", path: "docker-compose.simple.yml", kind: "blob" as const },
];
