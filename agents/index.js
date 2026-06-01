#!/usr/bin/env node
/**
 * FLAPTOBIT AGENT ORCHESTRATOR
 * Manages all 6 autonomous agents
 * Run: node agents/index.js
 */

import NEXUS1 from './nexus-1.js';
import ORACLE7 from './oracle-7.js';
import FLUX3 from './flux-3.js';
import SIGMA9 from './sigma-9.js';
import AEGIS2 from './aegis-2.js';
import VAULTX from './vault-x.js';

const API_URL = process.env.API_URL || 'http://localhost:3000';

const agents = {
  nexus1: new NEXUS1(API_URL),
  oracle7: new ORACLE7(API_URL),
  flux3: new FLUX3(API_URL),
  sigma9: new SIGMA9(API_URL),
  aegis2: new AEGIS2(API_URL),
  vaultx: new VAULTX(API_URL)
};

/**
 * Start all agents
 */
function startAllAgents() {
  console.log('\n═════════════════════════════════════════════════════════════');
  console.log('🤖 FLAPTOBIT AGENT ORCHESTRATOR');
  console.log('═════════════════════════════════════════════════════════════\n');

  console.log('⚡ Initializing autonomous agents...\n');

  agents.nexus1.start();
  agents.oracle7.start();
  agents.flux3.start();
  agents.sigma9.start();
  agents.aegis2.start();
  agents.vaultx.start();

  console.log('\n═════════════════════════════════════════════════════════════');
  console.log('✅ All agents operational. System is live.');
  console.log('═════════════════════════════════════════════════════════════\n');
}

/**
 * Get all agent stats
 */
function getAgentStats() {
  console.log('\n📊 AGENT STATISTICS\n');
  
  const stats = Object.values(agents).map(agent => agent.getStats());
  
  console.table(stats);
  
  const totalTasks = stats.reduce((sum, s) => sum + s.tasksCompleted, 0);
  console.log(`\n📈 Total Tasks Completed: ${totalTasks}`);
}

/**
 * Stop all agents
 */
function stopAllAgents() {
  console.log('\n🛑 Stopping all agents...');
  
  Object.values(agents).forEach(agent => agent.stop());
  
  console.log('✅ All agents stopped.\n');
  process.exit(0);
}

/**
 * Handle process signals
 */
process.on('SIGINT', () => {
  console.log('\n\n⚠️ Received SIGINT signal. Gracefully shutting down...');
  stopAllAgents();
});

process.on('SIGTERM', () => {
  console.log('\n\n⚠️ Received SIGTERM signal. Gracefully shutting down...');
  stopAllAgents();
});

/**
 * CLI Commands
 */
const command = process.argv[2];

switch (command) {
  case 'start':
    startAllAgents();
    setInterval(() => getAgentStats(), 5 * 60 * 1000); // Stats every 5 minutes
    break;
  case 'stats':
    getAgentStats();
    break;
  case 'stop':
    stopAllAgents();
    break;
  default:
    console.log(`\n📖 FLAPTOBIT Agent Orchestrator\n`);
    console.log('Usage: node agents/index.js [command]\n');
    console.log('Commands:');
    console.log('  start  - Start all agents');
    console.log('  stats  - Display agent statistics');
    console.log('  stop   - Stop all agents\n');
    console.log('Example:');
    console.log('  node agents/index.js start\n');
}
