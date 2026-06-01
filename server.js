import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { ethers } from 'ethers';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Web3 Provider
const provider = new ethers.JsonRpcProvider(process.env.VITE_RPC_URL);

// Contract addresses (from deployment)
const FLAP_TOKEN_ADDRESS = process.env.VITE_FLAP_TOKEN_ADDRESS || '';
const PLATFORM_ADDRESS = process.env.VITE_PLATFORM_ADDRESS || '';

// In-memory data storage (replace with database in production)
const users = new Map();
const roles = new Map();
const matches = new Map();
const agentLogs = [];

/**
 * API ROUTES
 */

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'online', timestamp: new Date().toISOString() });
});

/**
 * TALENT (FLOOR 1) ROUTES
 */

// POST: Create talent profile
app.post('/api/talent/profile', (req, res) => {
  try {
    const { name, role, skills, rate, availability, walletAddress } = req.body;
    
    if (!name || !role || !skills || !rate || !walletAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const talentId = `talent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const profile = {
      id: talentId,
      name,
      role,
      skills: Array.isArray(skills) ? skills : skills.split(','),
      rate,
      availability,
      walletAddress,
      pScore: Math.floor(Math.random() * 30 + 70), // P-Score: 70-100
      createdAt: new Date(),
      matches: 0,
      earnings: 0
    };

    users.set(talentId, profile);
    
    // Log agent activity
    agentLogs.push({
      agent: 'NEXUS-1',
      action: 'PROFILE_CREATED',
      target: talentId,
      timestamp: new Date()
    });

    res.status(201).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve all talent profiles
app.get('/api/talent/profiles', (req, res) => {
  try {
    const profiles = Array.from(users.values());
    res.json({ count: profiles.length, profiles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Get single talent profile
app.get('/api/talent/profile/:id', (req, res) => {
  try {
    const profile = users.get(req.params.id);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * EMPLOYER (FLOOR 2) ROUTES
 */

// POST: Post a job role
app.post('/api/employer/role', (req, res) => {
  try {
    const { company, title, budget, type, urgency, walletAddress } = req.body;
    
    if (!company || !title || !budget || !walletAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const roleId = `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const role = {
      id: roleId,
      company,
      title,
      budget,
      type: type || 'Full-time',
      urgency: urgency || 'Medium',
      walletAddress,
      createdAt: new Date(),
      candidates: [],
      filled: false
    };

    roles.set(roleId, role);
    
    agentLogs.push({
      agent: 'NEXUS-1',
      action: 'ROLE_POSTED',
      target: roleId,
      timestamp: new Date()
    });

    res.status(201).json({ success: true, role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Retrieve all roles
app.get('/api/employer/roles', (req, res) => {
  try {
    const allRoles = Array.from(roles.values());
    res.json({ count: allRoles.length, roles: allRoles });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Get single role
app.get('/api/employer/role/:id', (req, res) => {
  try {
    const role = roles.get(req.params.id);
    if (!role) return res.status(404).json({ error: 'Role not found' });
    res.json({ role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * AI AGENT ROUTES
 */

// GET: Agent status
app.get('/api/agents/status', (req, res) => {
  try {
    const agents = [
      { name: 'NEXUS-1', role: 'Recruiter', status: 'ACTIVE', uptime: '99.97%' },
      { name: 'ORACLE-7', role: 'Skill Verifier', status: 'ACTIVE', uptime: '99.99%' },
      { name: 'FLUX-3', role: 'Deal Closer', status: 'ACTIVE', uptime: '99.95%' },
      { name: 'SIGMA-9', role: 'Market Intel', status: 'ACTIVE', uptime: '100%' },
      { name: 'AEGIS-2', role: 'Fraud Detection', status: 'ACTIVE', uptime: '99.98%' },
      { name: 'VAULT-X', role: 'Rewards', status: 'TRAINING', uptime: '—' }
    ];
    res.json({ agents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: Agent logs
app.get('/api/agents/logs', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const logs = agentLogs.slice(-limit);
    res.json({ count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Trigger AI matching
app.post('/api/agents/match', (req, res) => {
  try {
    const talents = Array.from(users.values());
    const allRoles = Array.from(roles.values());

    if (talents.length === 0 || allRoles.length === 0) {
      return res.json({ message: 'No talent or roles to match', matches: [] });
    }

    const matchResults = [];
    for (let role of allRoles) {
      if (role.filled) continue;

      // Simple matching: random selection (in production, use ML)
      const talentIndex = Math.floor(Math.random() * talents.length);
      const talent = talents[talentIndex];

      const match = {
        id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        talentId: talent.id,
        roleId: role.id,
        score: Math.floor(Math.random() * 30 + 70),
        timestamp: new Date()
      };

      matches.set(match.id, match);
      matchResults.push(match);

      agentLogs.push({
        agent: 'NEXUS-1',
        action: 'MATCH_CREATED',
        details: `${talent.name} matched with ${role.title}`,
        timestamp: new Date()
      });
    }

    res.json({ success: true, matchesCreated: matchResults.length, matches: matchResults });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * MATCHING ROUTES
 */

// GET: Get all matches
app.get('/api/matches', (req, res) => {
  try {
    const allMatches = Array.from(matches.values());
    res.json({ count: allMatches.length, matches: allMatches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Create placement (finalize a match)
app.post('/api/placement', (req, res) => {
  try {
    const { matchId, startDate } = req.body;

    const match = matches.get(matchId);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    const talent = users.get(match.talentId);
    const role = roles.get(match.roleId);

    const placement = {
      id: `placement_${Date.now()}`,
      matchId,
      talentId: match.talentId,
      roleId: match.roleId,
      talentName: talent.name,
      company: role.company,
      role: role.title,
      startDate: startDate || new Date(),
      status: 'ACTIVE',
      createdAt: new Date()
    };

    agentLogs.push({
      agent: 'FLUX-3',
      action: 'PLACEMENT_CREATED',
      details: `${talent.name} placed at ${role.company}`,
      timestamp: new Date()
    });

    res.status(201).json({ success: true, placement });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * PLATFORM STATS
 */

app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      talents: users.size,
      roles: roles.size,
      matches: matches.size,
      avgPScore: Array.from(users.values()).reduce((acc, t) => acc + t.pScore, 0) / (users.size || 1),
      avgMatchTime: '4.2h',
      employerSatisfaction: '96%',
      agentUptime: '99.97%',
      flapDistributed: 124000,
      weeklyFlapPool: 50000
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * ERROR HANDLING
 */

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

/**
 * START SERVER
 */

app.listen(PORT, () => {
  console.log(`\n⚡ Flaptobit Backend Server Running on http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/health`);
  console.log(`🤖 Agents: http://localhost:${PORT}/api/agents/status`);
  console.log(`📈 Stats: http://localhost:${PORT}/api/stats`);
  console.log(`\n✅ Ready to receive requests from frontend on http://localhost:5173\n`);
});
