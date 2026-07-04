/**
 * StatsService - Statistiques de la plateforme
 */

const MemberRepository = require('../repositories/MemberRepository');

class StatsService {
  constructor() {
    this.repo = MemberRepository;
  }
  
  async getStats() {
    const result = await this.repo.findAll();
    const members = result.members;
    const total = result.total;
    
    // Par statut
    const byStatus = {
      draft: 0,
      referenced: 0,
      pending: 0,
      verified: 0,
      certified: 0
    };
    
    // Par certification
    let certified = 0;
    let notCertified = 0;
    
    // Par région
    const byRegion = {};
    
    // Par spécialité
    const bySpecialty = {};
    
    // Par plan
    const byPlan = {
      basic: 0,
      pro: 0,
      expert: 0
    };
    
    members.forEach(m => {
      // Statut
      const state = m.system?.status?.state || 'draft';
      if (byStatus[state] !== undefined) byStatus[state]++;
      
      // Certification
      if (m.system?.status?.certified) {
        certified++;
      } else {
        notCertified++;
      }
      
      // Région
      const region = m.profile?.location?.region;
      if (region) {
        byRegion[region] = (byRegion[region] || 0) + 1;
      }
      
      // Spécialité
      (m.profile?.professional?.specialties || []).forEach(s => {
        bySpecialty[s] = (bySpecialty[s] || 0) + 1;
      });
      
      // Plan
      const plan = m.membership?.plan || 'basic';
      if (byPlan[plan] !== undefined) byPlan[plan]++;
    });
    
    return {
      total,
      byStatus,
      certified,
      notCertified,
      byRegion,
      bySpecialty,
      byPlan,
      last_updated: new Date().toISOString()
    };
  }
}

module.exports = new StatsService();
