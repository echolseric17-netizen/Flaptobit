import React, { useState, useEffect } from 'react';
import Floor1 from './components/Floor1';
import Floor2 from './components/Floor2';
import Floor3 from './components/Floor3';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

function App() {
  const [currentFloor, setCurrentFloor] = useState('home');
  const [connectedWallet, setConnectedWallet] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        setConnectedWallet(accounts[0]);
      } catch (error) {
        console.error('Wallet connection failed:', error);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="logo">⚡ FLAPTOBIT</h1>
          <p className="tagline">AI-Automated Hiring Protocol</p>
        </div>
        <div className="header-actions">
          {connectedWallet ? (
            <div className="wallet-info">
              <span className="wallet-address">
                {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}
              </span>
            </div>
          ) : (
            <button onClick={connectWallet} className="btn-connect">
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <nav className="main-nav">
        <button 
          onClick={() => setCurrentFloor('home')}
          className={`nav-btn ${currentFloor === 'home' ? 'active' : ''}`}
        >
          🏠 Home
        </button>
        <button 
          onClick={() => setCurrentFloor('floor1')}
          className={`nav-btn ${currentFloor === 'floor1' ? 'active' : ''}`}
        >
          🧑‍💼 Floor 1: Talent
        </button>
        <button 
          onClick={() => setCurrentFloor('floor2')}
          className={`nav-btn ${currentFloor === 'floor2' ? 'active' : ''}`}
        >
          🏢 Floor 2: Employers
        </button>
        <button 
          onClick={() => setCurrentFloor('floor3')}
          className={`nav-btn ${currentFloor === 'floor3' ? 'active' : ''}`}
        >
          🤖 Floor 3: Agents
        </button>
        <button 
          onClick={() => setCurrentFloor('admin')}
          className={`nav-btn ${currentFloor === 'admin' ? 'active' : ''}`}
        >
          🔐 Admin
        </button>
      </nav>

      <main className="main-content">
        {currentFloor === 'home' && <HomePage setCurrentFloor={setCurrentFloor} />}
        {currentFloor === 'floor1' && <Floor1 />}
        {currentFloor === 'floor2' && <Floor2 />}
        {currentFloor === 'floor3' && <Floor3 />}
        {currentFloor === 'admin' && <AdminDashboard setIsAdmin={setIsAdmin} isAdmin={isAdmin} />}
      </main>

      <footer className="app-footer">
        <p>Built with 🚀 by Flaptobit | Powered by AI Agents & $FLAP Token</p>
        <p className="footer-links">
          <a href="#">Docs</a> • 
          <a href="#">Discord</a> • 
          <a href="#">Twitter</a> • 
          <a href="#">Support</a>
        </p>
      </footer>
    </div>
  );
}

function HomePage({ setCurrentFloor }) {
  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to FLAPTOBIT</h1>
        <p className="hero-subtitle">
          The AI-powered hiring platform fueled by the $FLAP token. 
          Autonomous agents work 24/7 to connect talent with opportunities.
        </p>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">6+</div>
            <div className="stat-label">Talent Profiles</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">5</div>
            <div className="stat-label">Open Roles</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">89</div>
            <div className="stat-label">Active Matches</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">67</div>
            <div className="stat-label">Placements</div>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Choose Your Path</h2>
        <div className="feature-grid">
          <div className="feature-card" onClick={() => setCurrentFloor('floor1')}>
            <h3>🧑‍💼 Are You Talent?</h3>
            <p>Post your profile and let AI agents match you with opportunities.</p>
            <button className="btn-cta">Enter Floor 1</button>
          </div>
          <div className="feature-card" onClick={() => setCurrentFloor('floor2')}>
            <h3>🏢 Are You an Employer?</h3>
            <p>Post roles and AI agents surface pre-vetted candidates instantly.</p>
            <button className="btn-cta">Enter Floor 2</button>
          </div>
          <div className="feature-card" onClick={() => setCurrentFloor('floor3')}>
            <h3>🤖 Meet the Agents</h3>
            <p>See 6 autonomous AI agents working 24/7 for your success.</p>
            <button className="btn-cta">Enter Floor 3</button>
          </div>
        </div>
      </section>

      <section className="about">
        <h2>About $FLAP Token</h2>
        <div className="about-content">
          <p>
            FLAP is the native token that fuels the Flaptobit ecosystem. 
            Earn FLAP by completing placements, stake it for governance, 
            and unlock exclusive benefits.
          </p>
          <div className="token-stats">
            <div>📊 Supply: 1,000,000 FLAP</div>
            <div>💰 Distributed: 124,000 FLAP</div>
            <div>🏦 Weekly Pool: 50,000 FLAP</div>
            <div>💵 Price: $0.25</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
