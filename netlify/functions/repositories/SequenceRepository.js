/**
 * SequenceRepository - Gestion des séquences (FITA Number)
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../../data');
const SEQUENCE_FILE = path.join(DATA_DIR, 'sequence.json');

class SequenceRepository {
  constructor() {
    this.cache = null;
    this.isLoaded = false;
  }
  
  async loadData() {
    if (this.isLoaded) return;
    
    try {
      const data = await fs.readFile(SEQUENCE_FILE, 'utf-8');
      this.cache = JSON.parse(data);
    } catch {
      this.cache = {
        sequences: {
          ant: { year: new Date().getFullYear(), counter: 0 },
          fo: { year: new Date().getFullYear(), counter: 0 },
          starlink: { year: new Date().getFullYear(), counter: 0 },
          cctv: { year: new Date().getFullYear(), counter: 0 },
          fibre: { year: new Date().getFullYear(), counter: 0 }
        },
        last_updated: null
      };
      // fallback legacy format
      if (!this.cache.sequences) {
        this.cache = {
          sequences: {
            ant: { year: this.cache.year || new Date().getFullYear(), counter: this.cache.counter || 0 }
          },
          last_updated: this.cache.last_updated
        };
      }
      await this.saveData();
    }
    
    // Check if legacy sequence needs to be upgraded to sequences format
    if(this.cache.year !== undefined && !this.cache.sequences) {
       this.cache = {
         sequences: {
            ant: { year: this.cache.year, counter: this.cache.counter }
         },
         last_updated: this.cache.last_updated
       };
       await this.saveData();
    }
    
    this.isLoaded = true;
  }
  
  async saveData() {
    await fs.writeFile(SEQUENCE_FILE, JSON.stringify(this.cache, null, 2));
  }
  
  async getNextNumber(domain = 'ant') {
    await this.loadData();
    
    const year = new Date().getFullYear();
    if (!this.cache.sequences) {
       this.cache.sequences = {};
    }
    let seq = this.cache.sequences[domain];
    
    if (!seq) {
      seq = { year, counter: 0 };
      this.cache.sequences[domain] = seq;
    }
    
    if (seq.year !== year) {
      seq.year = year;
      seq.counter = 0;
    }
    
    seq.counter++;
    this.cache.last_updated = new Date().toISOString();
    
    await this.saveData();
    
    return `${domain.toUpperCase()}-${year}-${String(seq.counter).padStart(6, '0')}`;
  }
  
  async resetCounter(domain) {
    await this.loadData();
    
    if (this.cache.sequences && this.cache.sequences[domain]) {
      this.cache.sequences[domain].counter = 0;
      this.cache.sequences[domain].year = new Date().getFullYear();
      await this.saveData();
      return true;
    }
    
    return false;
  }
}

module.exports = new SequenceRepository();
