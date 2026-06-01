import React, { useState } from 'react';
import './Floor3.css';

function Floor3() {
  const [agents] = useState([
    {
      id: 1,
      name: 'NEXUS-1',
      role: 'Autonomous Recruiter',
      icon: '🧲',
      status: 'ACTIVE',
      tasks: 1247,
      matches: 89,
      uptime: '99.97%',
      description: 'Scans Floor 1 & 2 continually, matches employees to roles using P-Score AI'
    },
    {
      id: 2,
      name: 'ORACLE-7',
      role: 'Skill Verifier',
      icon: '🔍',
      status: 'ACTIVE',
      tasks: 342,
      matches: 342,
      uptime: '99.99%',
      description: 'Cross-validates credentials, GitHub repos, blockchain history. Auto-certifies profiles.'
    },
    {
      id: 3,
      name: 'FLUX-3',
      role: 'Deal Closer',
      icon: '⚡',
      status: 'ACTIVE',
      tasks: 67,
      matches: 67,
      uptime: '99.95%',
      description: 'Handles contract negotiations, rate adjustments, onboarding docs. Closes in 3.8h avg.'
    },
    {
      id: 4,
      name: 'SIGMA-9',
      role: 'Market Intelligence',
      icon: '📊',
      status: 'ACTIVE',
      tasks: 847,
      matches: 0,
      uptime: '100%',
      description: 'Monitors crypto job market globally (47 markets). Adjusts salary benchmarks in real-time.'
    },
    {
      id: 5,
      name: 'AEGIS-2',
      role: 'Fraud Detection',
      icon: '🛡️',
      status: 'ACTIVE',
      tasks: 2104,
      matches: 12,
      uptime: '99.98%',
      description: 'AI-powered identity and fraud prevention. Zero false positives in last 30 days.'
    },
    {
      id: 6,
      name: 'VAULT-X',
      role: 'Rewards Distribution',
      icon: '💎',
      status: 'TRAINING',
      tasks: 0,
      matches: 0,
      uptime: '—',
      description: 'Manages $FLAP token distribution. Interfaces with FLAPStakingPool.sol. Coming soon.'
    }
  ]);

  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [agentStates, setAgentStates] = useState({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: false
  });

  const toggleAgent = (id) => {
    setAgentStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleAllAgents = () => {
    const allActive = Object.values(agentStates).every(s => s);
    const newState = {};
    agents.forEach(agent => {
      newState[agent.id] = !allActive && agent.id !== 6;
    });
    setAgentStates(newState);
  };

  const activeAgents = Object.values(agentStates).filter(Boolean).length;

  return (
    <div className="floor3-container">
      <section className="floor3-header">
        <h1>🤖 Floor 3: Autonomous Agent Command Center</h1>
        <p>Six AI agents running 24/7 with zero manual intervention</p>
        <div className="agent-stats">
          <div className="agent-stat">
            <span className="label">Active Agents:</span>
            <span className="value">{activeAgents}/6</span>
          </div>
          <div className="agent-stat">
            <span className="label">Total Tasks:</span>
            <span className="value">3,740</span>
          </div>
          <div className="agent-stat">
            <span className="label">System Uptime:</span>
            <span className="value">99.97%</span>
          </div>
          <div className="agent-stat">
            <span className="label">Coverage:</span>
            <span className="value">Global 24/7</span>
          </div>
        </div>
      </section>

      <section className="control-section">
        <div className="control-header">
          <h2>Agent Control Panel</h2>
          <button className="btn-control" onClick={toggleAllAgents}>
            {Object.values(agentStates).some(Boolean) ? '⏸️ STOP ALL' : '▶️ START ALL'}
          </button>
        </div>
        <div className="agents-grid">
          {agents.map(agent => (
            <div
              key={agent.id}
              className={`agent-card ${agentStates[agent.id] ? 'active' : 'inactive'} ${selectedAgent.id === agent.id ? 'selected' : ''}`}
              onClick={() => setSelectedAgent(agent)}
            >
              <div className="agent-icon">{agent.icon}</div>
              <h3>{agent.name}</h3>
              <p className="agent-role">{agent.role}</p>
              <div className={`status-badge ${agentStates[agent.id] ? 'active' : 'inactive'}`}>
                {agentStates[agent.id] ? '🟢 ONLINE' : '🔴 OFFLINE'}
              </div>
              <button
                className={`btn-toggle ${agentStates[agent.id] ? 'stop' : 'start'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAgent(agent.id);
                }}
                disabled={agent.id === 6}
              >
                {agentStates[agent.id] ? '⏹️ Stop' : '▶️ Start'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="agent-details">
        <h2>Agent Details: {selectedAgent.name}</h2>
        <div className="details-card">
          <div className="details-header">
            <div className="detail-icon">{selectedAgent.icon}</div>
            <div className="detail-info">
              <h3>{selectedAgent.name}</h3>
              <p className="detail-role">{selectedAgent.role}</p>
              <p className="detail-desc">{selectedAgent.description}</p>
            </div>
          </div>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className={`detail-value ${selectedAgent.status === 'ACTIVE' ? 'active' : 'training'}`}>
                {selectedAgent.status === 'ACTIVE' ? '🟢 ACTIVE' : '🟡 TRAINING'}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tasks Completed</span>
              <span className="detail-value">{selectedAgent.tasks.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Successful Matches</span>
              <span className="detail-value">{selectedAgent.matches}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">System Uptime</span>
              <span className="detail-value">{selectedAgent.uptime}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="agents-overview">
        <h2>All Agents Overview</h2>
        <div className="overview-table">
          <div className="table-header">
            <div className="col-name">Agent</div>
            <div className="col-role">Role</div>
            <div className="col-status">Status</div>
            <div className="col-tasks">Tasks</div>
            <div className="col-matches">Matches</div>
            <div className="col-uptime">Uptime</div>
          </div>
          {agents.map(agent => (
            <div key={agent.id} className="table-row">
              <div className="col-name">
                <span className="icon">{agent.icon}</span>
                <span className="name">{agent.name}</span>
              </div>
              <div className="col-role">{agent.role}</div>
              <div className="col-status">
                <span className={`status ${agentStates[agent.id] ? 'active' : 'inactive'}`}>
                  {agentStates[agent.id] ? '🟢 ONLINE' : '🔴 OFFLINE'}
                </span>
              </div>
              <div className="col-tasks">{agent.tasks.toLocaleString()}</div>
              <div className="col-matches">{agent.matches}</div>
              <div className="col-uptime">{agent.uptime}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="ai-features">
        <h2>🧠 AI Capabilities</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Real-time Matching</h3>
            <p>Continuous scanning of Floor 1 & 2, matching profiles every 5 minutes</p>
          </div>
          <div className="feature">
            <h3>Credential Verification</h3>
            <p>Cross-validates GitHub, blockchain history, and professional references</p>
          </div>
          <div className="feature">
            <h3>Market Intelligence</h3>
            <p>Monitors 47 crypto job markets, adjusts salary benchmarks in real-time</p>
          </div>
          <div className="feature">
            <h3>Fraud Detection</h3>
            <p>Zero false positives in 30 days, catches bad actors instantly</p>
          </div>
          <div className="feature">
            <h3>Autonomous Contracts</h3>
            <p>Negotiates terms, creates contracts, and manages onboarding automatically</p>
          </div>
          <div className="feature">
            <h3>Token Distribution</h3>
            <p>Manages FLAP rewards on-chain without manual intervention (coming soon)</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Floor3;
