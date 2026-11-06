export const REPOSITORY_URL = "https://github.com/THE-SHRIKS/WallStreet";
export const AUDIT_COMMIT = "b7207a8177b4d9a564bf3596b8c450372d5d050b";
export const AUDIT_DATE = "2026-11-04";

export type EvidenceStatus =
  | "Documented"
  | "Implemented"
  | "Prototype"
  | "Simulated"
  | "Research"
  | "Not verified";

export interface ProjectFact {
  label: string;
  statement: string;
  status: EvidenceStatus;
  sourcePaths: string[];
  note?: string;
}

export const PROJECT_FACTS: ProjectFact[] = [
  {
    label: "Project stage",
    statement: "The repository describes the work as in development.",
    status: "Documented",
    sourcePaths: ["README.md"],
  },
  {
    label: "Browser application",
    statement: "A React, TypeScript, and Vite application is present under LokiAi/.",
    status: "Implemented",
    sourcePaths: ["LokiAi/package.json", "LokiAi/src/App.tsx"],
  },
  {
    label: "API service",
    statement: "A separate Node/Express service includes API and Socket.IO wiring.",
    status: "Prototype",
    sourcePaths: ["LokiAi/backend/server.js", "LokiAi/backend/package.json"],
  },
  {
    label: "Database and persistence",
    statement: "MongoDB-facing service and model modules are present; an external database connection was not verified during this review.",
    status: "Prototype",
    sourcePaths: ["LokiAi/src/services/database/mongodb-service.ts", "LokiAi/backend/models/AgentResult.js"],
  },
  {
    label: "Agent orchestration",
    statement: "Agent orchestration and specialist service modules exist in the source tree; their production wiring is not verified here.",
    status: "Prototype",
    sourcePaths: [
      "LokiAi/src/services/agents/agent-orchestrator.ts",
      "LokiAi/backend/services/agents/yield-optimizer-agent.js",
    ],
  },
  {
    label: "Portfolio workflow",
    statement: "The Python rebalancer explicitly describes its trade path as simulated rather than a live DEX or bridge transaction.",
    status: "Simulated",
    sourcePaths: ["portfolio_rebalancer/rebalance_engine.py"],
  },
  {
    label: "Cross-chain interface",
    statement: "The browser flow contains a simulated transfer result; it is not evidence of a settled on-chain transfer.",
    status: "Simulated",
    sourcePaths: ["LokiAi/src/pages/CrossChain.tsx"],
  },
  {
    label: "Solidity contracts",
    statement: "Four contract sources are present. Their mock paths and tests do not establish a deployed, audited protocol.",
    status: "Simulated",
    sourcePaths: [
      "loki-contracts/contracts/ArbitrageBot.sol",
      "loki-contracts/contracts/YieldOptimizer.sol",
      "loki-contracts/contracts/RiskManager.sol",
      "loki-contracts/contracts/PortfolioRebalancer.sol",
    ],
  },
  {
    label: "Task gateway",
    statement: "A FastAPI/Celery task gateway exists as a separate service; a working broker connection was not verified.",
    status: "Prototype",
    sourcePaths: ["task_gateway/app.py"],
  },
  {
    label: "Deployment status",
    statement: "This review did not verify a public production domain, deployed contract address, or audited release.",
    status: "Not verified",
    sourcePaths: ["README.md", "loki-contracts/package.json"],
  },
  {
    label: "License status",
    statement: "No repository-level LICENSE file was present in the reviewed source snapshot; a package metadata field is not a substitute for a published licence file.",
    status: "Not verified",
    sourcePaths: ["LokiAi/package.json", "loki-contracts/package.json"],
  },
];

export function sourceHref(path: string, kind: "blob" | "tree" = "blob") {
  return `${REPOSITORY_URL}/${kind}/${AUDIT_COMMIT}/${path.replace(/^\/+/, "")}`;
}

export const latestSourceHref = `${REPOSITORY_URL}/tree/main`;
export const issueTrackerHref = `${REPOSITORY_URL}/issues`;
