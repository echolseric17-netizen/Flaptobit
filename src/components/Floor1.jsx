import React, { useState } from 'react';
import './Floor1.css';

function Floor1() {
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      role: 'Full Stack Developer',
      skills: ['React', 'Node.js', 'Solidity'],
      rate: '$95/hr',
      score: 87,
      availability: 'Available Now',
      matches: 12
    },
    {
      id: 2,
      name: 'Bob Smith',
      role: 'Smart Contract Auditor',
      skills: ['Solidity', 'Security', 'Hardhat'],
      rate: '$120/hr',
      score: 94,
      availability: 'Part-time',
      matches: 8
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    skills: '',
    rate: '',
    availability: 'Available Now'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitProfile = (e) => {
    e.preventDefault();
    const newProfile = {
      id: profiles.length + 1,
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()),
      score: Math.floor(Math.random() * 30 + 70),
      matches: Math.floor(Math.random() * 15)
    };
    setProfiles([...profiles, newProfile]);
    setFormData({ name: '', role: '', skills: '', rate: '', availability: 'Available Now' });
    setShowForm(false);
  };

  return (
    <div className="floor1-container">
      <section className="floor1-header">
        <h1>🧑‍💼 Floor 1: Employee Marketplace</h1>
        <p>Post your profile and let AI agents match you with opportunities globally</p>
        <button className="btn-post-profile" onClick={() => setShowForm(!showForm)}>
          + POST PROFILE
        </button>
      </section>

      {showForm && (
        <section className="profile-form-section">
          <form onSubmit={handleSubmitProfile} className="profile-form">
            <h2>Create Your Profile</h2>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="role"
              placeholder="Job Title/Role"
              value={formData.role}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma-separated)"
              value={formData.skills}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="rate"
              placeholder="Hourly Rate (e.g., $95/hr)"
              value={formData.rate}
              onChange={handleInputChange}
              required
            />
            <select
              name="availability"
              value={formData.availability}
              onChange={handleInputChange}
            >
              <option>Available Now</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Full-time</option>
            </select>
            <div className="form-buttons">
              <button type="submit" className="btn-submit">Post Profile</button>
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      <section className="profiles-section">
        <h2>📋 Active Talent Profiles ({profiles.length})</h2>
        <div className="profiles-grid">
          {profiles.map(profile => (
            <div key={profile.id} className="profile-card">
              <div className="profile-header">
                <h3>{profile.name}</h3>
                <div className="p-score">{profile.score}</div>
              </div>
              <p className="role">{profile.role}</p>
              <div className="skills">
                {profile.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag">{skill}</span>
                ))}
              </div>
              <div className="profile-details">
                <div className="detail">
                  <span className="label">Rate:</span>
                  <span className="value">{profile.rate}</span>
                </div>
                <div className="detail">
                  <span className="label">Availability:</span>
                  <span className="value">{profile.availability}</span>
                </div>
                <div className="detail">
                  <span className="label">Active Matches:</span>
                  <span className="value">{profile.matches}</span>
                </div>
              </div>
              <button className="btn-view-offers">View Offers ({profile.matches})</button>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-section">
        <h2>📊 Floor 1 Statistics</h2>
        <div className="stats-cards">
          <div className="stat">
            <div className="stat-value">{profiles.length}+</div>
            <div className="stat-name">Active Profiles</div>
          </div>
          <div className="stat">
            <div className="stat-value">$94</div>
            <div className="stat-name">Avg Hourly Rate</div>
          </div>
          <div className="stat">
            <div className="stat-value">89</div>
            <div className="stat-name">Active Matches</div>
          </div>
          <div className="stat">
            <div className="stat-value">67</div>
            <div className="stat-name">Placements</div>
          </div>
          <div className="stat">
            <div className="stat-value">4.2h</div>
            <div className="stat-name">Avg Match Time</div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>⚡ How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Post Profile</h3>
            <p>Create your profile with skills, rate, and availability</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>AI Scoring</h3>
            <p>NEXUS-1 agent assigns your P-Score (0-100)</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Live Matching</h3>
            <p>Agents surface your profile to employers 24/7</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Get Offers</h3>
            <p>Receive job offers directly from employers</p>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <h3>Earn FLAP</h3>
            <p>Get paid + earn $FLAP tokens on placement</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Floor1;
