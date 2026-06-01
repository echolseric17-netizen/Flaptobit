import React, { useState } from 'react';
import './Floor2.css';

function Floor2() {
  const [roles, setRoles] = useState([
    {
      id: 1,
      company: 'TechCorp Inc',
      title: 'Senior React Developer',
      budget: '$150k - $200k',
      type: 'Full-time',
      urgency: 'High',
      candidates: 8,
      posted: '2 days ago'
    },
    {
      id: 2,
      company: 'Crypto Labs',
      title: 'Smart Contract Engineer',
      budget: '$120k - $180k',
      type: 'Contract',
      urgency: 'Urgent',
      candidates: 5,
      posted: '6 hours ago'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    budget: '',
    type: 'Full-time',
    urgency: 'Medium'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRole = (e) => {
    e.preventDefault();
    const newRole = {
      id: roles.length + 1,
      ...formData,
      candidates: Math.floor(Math.random() * 12),
      posted: 'Just now'
    };
    setRoles([...roles, newRole]);
    setFormData({ company: '', title: '', budget: '', type: 'Full-time', urgency: 'Medium' });
    setShowForm(false);
  };

  const getUrgencyColor = (urgency) => {
    switch(urgency) {
      case 'Urgent': return '#ff1744';
      case 'High': return '#ffa500';
      case 'Medium': return '#00ff41';
      default: return '#00d4ff';
    }
  };

  return (
    <div className="floor2-container">
      <section className="floor2-header">
        <h1>🏢 Floor 2: Employer Hub</h1>
        <p>Post roles and let AI agents surface pre-vetted candidates instantly</p>
        <button className="btn-post-role" onClick={() => setShowForm(!showForm)}>
          + POST ROLE
        </button>
      </section>

      {showForm && (
        <section className="role-form-section">
          <form onSubmit={handleSubmitRole} className="role-form">
            <h2>Post a New Role</h2>
            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="title"
              placeholder="Job Title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="budget"
              placeholder="Budget Range (e.g., $100k - $150k)"
              value={formData.budget}
              onChange={handleInputChange}
              required
            />
            <select name="type" value={formData.type} onChange={handleInputChange}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Temporary</option>
            </select>
            <select name="urgency" value={formData.urgency} onChange={handleInputChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
            <div className="form-buttons">
              <button type="submit" className="btn-submit">Post Role</button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      <section className="roles-section">
        <h2>📋 Open Positions ({roles.length})</h2>
        <div className="roles-grid">
          {roles.map(role => (
            <div key={role.id} className="role-card">
              <div className="role-header">
                <div>
                  <h3>{role.title}</h3>
                  <p className="company">{role.company}</p>
                </div>
                <div className="urgency-badge" style={{ borderColor: getUrgencyColor(role.urgency) }}>
                  {role.urgency}
                </div>
              </div>
              <div className="role-details">
                <div className="detail">
                  <span className="label">💰 Budget:</span>
                  <span className="value">{role.budget}</span>
                </div>
                <div className="detail">
                  <span className="label">📅 Type:</span>
                  <span className="value">{role.type}</span>
                </div>
                <div className="detail">
                  <span className="label">📊 Candidates:</span>
                  <span className="value">{role.candidates} matched</span>
                </div>
                <div className="detail">
                  <span className="label">⏰ Posted:</span>
                  <span className="value">{role.posted}</span>
                </div>
              </div>
              <button className="btn-view-candidates">View {role.candidates} Candidates</button>
            </div>
          ))}
        </div>
      </section>

      <section className="benefits-section">
        <h2>✨ Why Use Flaptobit?</h2>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">🤖</div>
            <h3>AI Matching</h3>
            <p>NEXUS-1 agents scan all profiles and match top candidates in real-time</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">⚡</div>
            <h3>Fast Hiring</h3>
            <p>Average 4.2 hours to first qualified candidate match</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">✅</div>
            <h3>Pre-Vetted</h3>
            <p>ORACLE-7 verifies credentials, GitHub, and blockchain history</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">💰</div>
            <h3>Zero Upfront</h3>
            <p>Pay only 5% platform fee on successful placement (first month)</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">📈</div>
            <h3>96% Satisfaction</h3>
            <p>Employer satisfaction rate with placements and candidates</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">🌍</div>
            <h3>Global Talent</h3>
            <p>Access 6,000+ pre-vetted candidates worldwide, 24/7</p>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <h2>💳 Transparent Pricing</h2>
        <div className="pricing-card">
          <div className="pricing-item">
            <span>Platform Fee (on successful hire):</span>
            <span className="price">5%</span>
          </div>
          <div className="pricing-item">
            <span>Flaptobit keeps:</span>
            <span className="price">3%</span>
          </div>
          <div className="pricing-item">
            <span>Rewards pool (candidate incentives):</span>
            <span className="price">2%</span>
          </div>
          <div className="pricing-divider"></div>
          <div className="pricing-item highlight">
            <span>Posting a role:</span>
            <span className="price">FREE</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Floor2;
