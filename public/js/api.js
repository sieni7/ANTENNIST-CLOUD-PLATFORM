/**
 * Client API - Communication avec le backend
 * Version Sprint 1 - Architecture 3 couches
 */

const API = {
  base: '/api',
  
  // ===== REQUÊTE GENERIQUE =====
  async request(endpoint, options = {}) {
    const url = `${this.base}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Erreur ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`[API] ${endpoint} error:`, error);
      throw error;
    }
  },
  
  // ===== MEMBRES =====
  async getMembers(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
        params.append(key, filters[key]);
      }
    });
    const query = params.toString() ? `?${params}` : '';
    return this.request(`/members${query}`);
  },
  
  async getMember(id) {
    return this.request(`/members/${id}`);
  },
  
  async createMember(data) {
    return this.request('/members', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  async updateMember(id, data) {
    return this.request(`/members/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },
  
  async deleteMember(id) {
    return this.request(`/members/${id}`, {
      method: 'DELETE'
    });
  },
  
  // ===== STATISTIQUES =====
  async getStats() {
    return this.request('/stats');
  },
  
  // ===== HEALTH =====
  async health() {
    return this.request('/health');
  },
  
  // ===== RÉGIONS =====
  async getRegions() {
    // Pour Sprint 1, charger depuis le fichier JSON statique
    const response = await fetch('/data/regions.json');
    return response.json();
  },
  
  // ===== SPÉCIALITÉS =====
  async getSpecialties() {
    const response = await fetch('/data/specialties.json');
    return response.json();
  }
};

// Export global
window.API = API;
