/**
 * AuditService - Gestion des logs d'audit
 */

const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../../data');
const AUDIT_FILE = path.join(DATA_DIR, 'audit.log');

class AuditService {
  
  async log(entry) {
    const logEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      ip: entry.ip || null,
      user_agent: entry.user_agent || null
    };
    
    try {
      // Lire le fichier existant
      let logs = [];
      try {
        const data = await fs.readFile(AUDIT_FILE, 'utf-8');
        logs = JSON.parse(data);
      } catch {
        logs = [];
      }
      
      logs.push(logEntry);
      
      // Garder seulement les 10 000 derniers logs
      if (logs.length > 10000) {
        logs = logs.slice(-10000);
      }
      
      await fs.writeFile(AUDIT_FILE, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error('AuditService: Error writing log', error);
    }
  }
  
  async getLogs(filters = {}) {
    try {
      const data = await fs.readFile(AUDIT_FILE, 'utf-8');
      let logs = JSON.parse(data);
      
      if (filters.entity_id) {
        logs = logs.filter(l => l.entity_id === filters.entity_id);
      }
      if (filters.action) {
        logs = logs.filter(l => l.action === filters.action);
      }
      if (filters.actor) {
        logs = logs.filter(l => l.actor === filters.actor);
      }
      if (filters.from) {
        logs = logs.filter(l => l.timestamp >= filters.from);
      }
      if (filters.to) {
        logs = logs.filter(l => l.timestamp <= filters.to);
      }
      
      const limit = parseInt(filters.limit) || 100;
      return logs.slice(0, limit);
      
    } catch {
      return [];
    }
  }
}

module.exports = new AuditService();
