import React, { useState } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ isAdmin, setIsAdmin }) {
  const [pinInput, setPinInput] = useState('');
  const OWNER_PIN = '1776';
  const [showPINScreen, setShowPINScreen] = useState(!isAdmin);
  const [shakingClass, setShakingClass] = useState('');

  const handlePINSubmit = (e) => {
    e.preventDefault();
    if (pinInput === OWNER_PIN) {
      setIsAdmin(true);
      setShowPINScreen(false);
      setPinInput('');
    } else {
      setShakingClass('shake');
      setTimeout(() => setShakingClass(''), 500);
      setPinInput('');
    }
  };

  const handleLock = () => {
    setIsAdmin(false);
    setShowPINScreen(true);
    setPinInput('');
  };

  if (showPINScreen) {
    return (
      <div className={`admin-container ${shakingClass}`}>
        <div className="pin-screen">
          <div className="pin-header">
            <h1>🔐 OWNER PIN REQUIRED</h1>
            <p>Enter PIN to access admin dashboard</p>
          </div>
          <form onSubmit={handlePINSubmit} className="pin-form">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN"
              autoFocus
            />
            <button type="submit">UNLOCK</button>
          </form>
          <p className="pin-hint">PIN: 1776</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>👑 OWNER CONTROL PANEL</h1>
        <button className="btn-lock" onClick={handleLock}>🔒 LOCK</button>
      </div>

      <section className="overview-panel">
        <h2>📊 System Overview</h2>
        <div className="overview-cards">
          <div className="overview-card">
            <div className="card-label">Treasury Balance</div>
            <div className="card-value">$487,234</div>
            <div className="card-subtext">Real-time ticker</div>
          </div>
          <div className="overview-card">
            <div className="card-label">FLAP in Rewards Pool</div>
            <div className="card-value">50,000</div>
            <div className="card-subtext">Weekly distribution</div>
          </div>
          <div className="overview-card">
            <div className="card-label">Active Users</div>
            <div className="card-value">347</div>
            <div className="card-subtext">Last 30 days</div>
          </div>
          <div className="overview-card">
            <div className="card-label">System Uptime</div>
            <div className="card-value">99.97%</div>
            <div className="card-subtext">6 agents running</div>
          </div>
        </div>
      </section>

      <section className="kpi-section">
        <h2>📈 Key Performance Indicators</h2>
        <div className="kpi-grid">
          <div className="kpi-group">
            <h3>Floor 1: Talent</h3>
            <div className="kpi-item">
              <span>Profiles Listed</span>
              <span className="value">6+</span>
            </div>
            <div className="kpi-item">
              <span>Avg P-Score</span>
              <span className="value">84</span>
            </div>
            <div className="kpi-item">
              <span>Active Matches</span>
              <span className="value">89</span>
            </div>
          </div>
          <div className="kpi-group">
            <h3>Floor 2: Employers</h3>
            <div className="kpi-item">
              <span>Open Roles</span>
              <span className="value">5</span>
            </div>
            <div className="kpi-item">
              <span>Avg Match Time</span>
              <span className="value">4.2h</span>
            </div>
            <div className="kpi-item">
              <span>Satisfaction Rate</span>
              <span className="value">96%</span>
            </div>
          </div>
          <div className="kpi-group">
            <h3>Floor 3: Agents</h3>
            <div className="kpi-item">
              <span>Active Agents</span>
              <span className="value">5/6</span>
            </div>
            <div className="kpi-item">
              <span>Tasks Completed</span>
              <span className="value">3,740</span>
            </div>
            <div className="kpi-item">
              <span>Placements</span>
              <span className="value">67</span>
            </div>
          </div>
        </div>
      </section>

      <section className="settings-section">
        <h2>⚙️ Settings & Configuration</h2>
        <div className="settings-grid">
          <div className="setting-card">
            <h3>Platform Fee</h3>
            <div className="setting-control">
              <input type="number" defaultValue="5" min="0" max="100" /> %
            </div>
            <p>Fee taken on successful placements (first month)</p>
          </div>
          <div className="setting-card">
            <h3>Weekly FLAP Pool</h3>
            <div className="setting-control">
              <input type="number" defaultValue="50000" /> FLAP
            </div>
            <p>Amount distributed weekly to successful placements</p>
          </div>
          <div className="setting-card">
            <h3>Fraud Shield</h3>
            <div className="setting-control toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-label">ON</span>
            </div>
            <p>AEGIS-2 fraud detection enabled</p>
          </div>
          <div className="setting-card">
            <h3>Auto-Match</h3>
            <div className="setting-control toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-label">ON</span>
            </div>
            <p>NEXUS-1 automatic matching enabled</p>
          </div>
          <div className="setting-card">
            <h3>Payouts</h3>
            <div className="setting-control toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-label">ON</span>
            </div>
            <p>FLAP token distribution enabled</p>
          </div>
          <div className="setting-card">
            <h3>Email Notifications</h3>
            <div className="setting-control toggle">
              <input type="checkbox" defaultChecked />
              <span className="toggle-label">ON</span>
            </div>
            <p>Send notifications to owners and users</p>
          </div>
        </div>
      </section>

      <section className="management-section">
        <h2>👥 User Management</h2>
        <div className="management-tabs">
          <div className="tab-content">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button className="btn-action">👁️ View All Employees</button>
              <button className="btn-action">👁️ View All Employers</button>
              <button className="btn-action">🚫 View Flagged Users</button>
              <button className="btn-action">📊 Export Data</button>
              <button className="btn-action">🔄 Clear Cache</button>
              <button className="btn-action danger">⚠️ System Reset</button>
            </div>
          </div>
        </div>
      </section>

      <section className="security-section">
        <h2>🔒 Security & Backup</h2>
        <div className="security-grid">
          <div className="security-card">
            <h3>Session Info</h3>
            <p>Last Login: Today at 15:32:04</p>
            <p>Session Duration: 45 minutes</p>
            <p>Timeout in: 15 minutes</p>
          </div>
          <div className="security-card">
            <h3>Backup & Export</h3>
            <div className="security-buttons">
              <button className="btn-security">💾 Backup Data</button>
              <button className="btn-security">📥 Export CSV</button>
              <button className="btn-security">📥 Export JSON</button>
            </div>
          </div>
          <div className="security-card">
            <h3>Contract Management</h3>
            <div className="security-buttons">
              <button className="btn-security">📜 View Contracts</button>
              <button className="btn-security">⚙️ Update Contracts</button>
              <button className="btn-security">🔍 Verify ABI</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
