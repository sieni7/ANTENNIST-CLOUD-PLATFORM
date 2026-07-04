/**
 * SpecialtyRepository - Accès aux spécialités
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../../data');
const SPECIALTIES_FILE = path.join(DATA_DIR, 'specialties.json');

let specialtiesCache = null;

class SpecialtyRepository {
  async loadData() {
    if (specialtiesCache) return;
    
    try {
      const data = await fs.readFile(SPECIALTIES_FILE, 'utf-8');
      specialtiesCache = JSON.parse(data);
    } catch {
      specialtiesCache = { specialties: [] };
    }
  }
  
  async findAll() {
    await this.loadData();
    return specialtiesCache.specialties || [];
  }
  
  async findById(id) {
    await this.loadData();
    return (specialtiesCache.specialties || []).find(s => s.id === id) || null;
  }
  
  async getLabels() {
    await this.loadData();
    return (specialtiesCache.specialties || []).map(s => ({ id: s.id, label: s.label }));
  }
}

module.exports = new SpecialtyRepository();
