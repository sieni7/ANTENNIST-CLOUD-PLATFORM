/**
 * NumberService - Gestion des numéros FITA
 */

const SequenceRepository = require('../repositories/SequenceRepository');

const DOMAINS = {
  ANT: 'ant',
  FO: 'fo',
  STARLINK: 'starlink',
  CCTV: 'cctv',
  FIBRE: 'fibre'
};

class NumberService {
  constructor() {
    this.repo = SequenceRepository;
    this.domains = DOMAINS;
  }
  
  async generate(domain = 'ant') {
    if (!this.domains[domain.toUpperCase()]) {
      throw new Error(`Domaine invalide: ${domain}`);
    }
    return this.repo.getNextNumber(domain.toLowerCase());
  }
  
  async generateFitaAnt() {
    return this.generate('ANT');
  }
  
  async generateFitaFo() {
    return this.generate('FO');
  }
  
  async generateFitaStarlink() {
    return this.generate('STARLINK');
  }
  
  getDomains() {
    return Object.keys(this.domains);
  }
  
  async reset(domain) {
    return this.repo.resetCounter(domain.toLowerCase());
  }
}

module.exports = new NumberService();
