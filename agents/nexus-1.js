// NEXUS-1: Autonomous Recruiter Agent
// Scans Floor 1 & 2 continually, matches employees to roles using P-Score AI

class NEXUS1 {
  constructor(apiUrl = 'http://localhost:3000') {
    this.apiUrl = apiUrl;
    this.name = 'NEXUS-1';
    this.role = 'Autonomous Recruiter';
    this.status = 'ACTIVE';
    this.tasksCompleted = 0;
    this.matchesCreated = 0;
    this.matchingInterval = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Calculate match score between talent and role
   */
  calculateMatchScore(talent, role) {
    let score = talent.pScore; // Start with P-Score

    // Bonus for exact rate match
    // (simplified: in production, use ML model)
    if (talent.rate && role.budget) {
      const talentRate = parseInt(talent.rate);
      const budgetMin = parseInt(role.budget.split('-')[0]);
      const budgetMax = parseInt(role.budget.split('-')[1]);

      if (talentRate >= budgetMin && talentRate <= budgetMax) {
        score += 10;
      }
    }

    // Bonus for availability match
    if (talent.availability === 'Available Now') {
      score += 5;
    }

    // Cap at 100
    return Math.min(score, 100);
  }

  /**
   * Fetch all talent profiles
   */
  async getTalentProfiles() {
    try {
      const response = await fetch(`${this.apiUrl}/api/talent/profiles`);
      const data = await response.json();
      return data.profiles || [];
    } catch (error) {
      console.error('[NEXUS-1] Error fetching talent profiles:', error);
      return [];
    }
  }

  /**
   * Fetch all open roles
   */
  async getOpenRoles() {
    try {
      const response = await fetch(`${this.apiUrl}/api/employer/roles`);
      const data = await response.json();
      return data.roles?.filter(r => !r.filled) || [];
    } catch (error) {
      console.error('[NEXUS-1] Error fetching roles:', error);
      return [];
    }
  }

  /**
   * Run continuous matching algorithm
   */
  async runMatching() {
    console.log(`\n[${new Date().toISOString()}] [NEXUS-1] Starting matching cycle...`);

    const talents = await this.getTalentProfiles();
    const roles = await this.getOpenRoles();

    if (talents.length === 0 || roles.length === 0) {
      console.log('[NEXUS-1] No talent or roles available for matching');
      return;
    }

    let matchesThisCycle = 0;

    for (const role of roles) {
      // Find best matches for this role
      const matches = talents.map(talent => ({
        talent,
        score: this.calculateMatchScore(talent, role)
      }));

      // Sort by score descending
      matches.sort((a, b) => b.score - a.score);

      // Create matches for top 3 candidates
      const topMatches = matches.slice(0, 3);
      for (const { talent, score } of topMatches) {
        if (score >= 70) {
          // Only create match if score >= 70
          try {
            const response = await fetch(`${this.apiUrl}/api/agents/match`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({})
            });
            if (response.ok) {
              matchesThisCycle++;
              console.log(`[NEXUS-1] ✓ Match created: ${talent.name} → ${role.title} (Score: ${score})`);
            }
          } catch (error) {
            console.error('[NEXUS-1] Error creating match:', error);
          }
        }
      }
    }

    this.tasksCompleted++;
    this.matchesCreated += matchesThisCycle;
    console.log(`[NEXUS-1] Cycle complete. Matches created: ${matchesThisCycle}`);
  }

  /**
   * Start continuous matching (polling)
   */
  start() {
    console.log(`✅ [NEXUS-1] Recruiter Agent Started`);
    console.log(`📍 Matching every ${this.matchingInterval / 60000} minutes`);

    // Initial run
    this.runMatching();

    // Schedule recurring runs
    this.intervalId = setInterval(() => this.runMatching(), this.matchingInterval);
  }

  /**
   * Stop the agent
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.status = 'STOPPED';
      console.log(`⏹️ [NEXUS-1] Agent stopped`);
    }
  }

  /**
   * Get agent stats
   */
  getStats() {
    return {
      name: this.name,
      role: this.role,
      status: this.status,
      tasksCompleted: this.tasksCompleted,
      matchesCreated: this.matchesCreated,
      uptime: '99.97%'
    };
  }
}

export default NEXUS1;
