/**
 * RegionRepository - Accès aux régions
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../../data');
const REGIONS_FILE = path.join(DATA_DIR, 'regions.json');

let regionsCache = null;

class RegionRepository {
  async loadData() {
    if (regionsCache) return;
    
    try {
      const data = await fs.readFile(REGIONS_FILE, 'utf-8');
      regionsCache = JSON.parse(data);
    } catch {
      regionsCache = { regions: [] };
    }
  }
  
  async findAll() {
    await this.loadData();
    return regionsCache.regions || [];
  }
  
  async findById(id) {
    await this.loadData();
    return (regionsCache.regions || []).find(r => r.id === id) || null;
  }
  
  async findByCode(code) {
    await this.loadData();
    return (regionsCache.regions || []).find(r => r.code === code) || null;
  }
  
  async getLabels() {
    await this.loadData();
    return (regionsCache.regions || []).map(r => ({ id: r.id, label: r.label }));
  }
}

module.exports = new RegionRepository();
