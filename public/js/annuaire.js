/**
 * Annuaire - Logique principale
 */

let map = null;
let markers = [];
let allMembers = [];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  // Charger les filtres
  await loadFilters();
  
  // Charger les membres
  await loadMembers();
  
  // Événements
  document.getElementById('filterApply').addEventListener('click', applyFilters);
  document.getElementById('filterSearch').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') applyFilters();
  });
});

// ===== FILTRES =====
async function loadFilters() {
  try {
    // Régions
    const regions = await API.getRegions();
    const regionSelect = document.getElementById('filterRegion');
    regions.regions.forEach(region => {
      const option = document.createElement('option');
      option.value = region.id;
      option.textContent = region.label;
      regionSelect.appendChild(option);
    });
    
    // Spécialités
    const specialties = await API.getSpecialties();
    const specialtySelect = document.getElementById('filterSpecialty');
    specialties.specialties.forEach(spec => {
      const option = document.createElement('option');
      option.value = spec.id;
      option.textContent = spec.label;
      specialtySelect.appendChild(option);
    });
  } catch (error) {
    console.error('Error loading filters:', error);
  }
}

// ===== MEMBRES =====
async function loadMembers(filters = {}) {
  const grid = document.getElementById('membersGrid');
  const loading = document.getElementById('loadingSpinner');
  const noResults = document.getElementById('noResults');
  
  loading.classList.remove('hidden');
  grid.innerHTML = '';
  noResults.classList.add('hidden');
  
  try {
    const result = await API.getMembers(filters);
    allMembers = result.members || [];
    
    loading.classList.add('hidden');
    
    if (allMembers.length === 0) {
      noResults.classList.remove('hidden');
      return;
    }
    
    renderMembers(allMembers);
    renderMap(allMembers);
    
  } catch (error) {
    loading.classList.add('hidden');
    Utils.showToast('Erreur lors du chargement des membres', 'error');
    console.error('Load members error:', error);
  }
}

function renderMembers(members) {
  const grid = document.getElementById('membersGrid');
  grid.innerHTML = '';
  
  members.forEach(member => {
    const card = document.createElement('div');
    card.className = 'member-card';
    card.onclick = () => window.location.href = `/profil.html?id=${member._id}`;
    
    const avatar = member.profile?.media?.photo || '/assets/default-avatar.png';
    const fullName = `${member.profile?.identity?.first_name || ''} ${member.profile?.identity?.last_name || ''}`.trim() || 'Antenniste';
    const specialties = member.profile?.professional?.specialties || [];
    const city = member.profile?.location?.city || '';
    const region = member.profile?.location?.region || '';
    const experience = member.profile?.professional?.experience_years || 0;
    const rating = member.stats?.rating || 0;
    const reviews = member.stats?.reviews || 0;
    const certified = member.system?.status?.certified || false;
    
    card.innerHTML = `
      <img src="${avatar}" alt="${fullName}" class="avatar" 
           onerror="this.src='/assets/default-avatar.png'">
      <div class="name">${fullName}</div>
      ${certified ? '<span class="badge badge-success">🎖️ Certifié</span>' : ''}
      <div class="specialties">
        ${specialties.map(s => `<span class="badge badge-primary">${s}</span>`).join('')}
      </div>
      <div class="location">📍 ${city}${city && region ? ', ' : ''}${region}</div>
      <div class="stats">
        <span class="stat-item">⭐ ${rating.toFixed(1)} (${reviews})</span>
        <span class="stat-item">📅 ${experience} ans</span>
      </div>
      <div class="contact-buttons">
        <a href="tel:${member.profile?.identity?.phone}" class="btn btn-secondary btn-sm">📞 Appeler</a>
        <a href="https://wa.me/${member.profile?.identity?.whatsapp}" target="_blank" class="btn btn-success btn-sm">💬 WhatsApp</a>
      </div>
    `;
    
    grid.appendChild(card);
  });
}

// ===== CARTE =====
function renderMap(members) {
  if (!map) {
    map = L.map('map').setView([6.6, -5.0], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map);
  }
  
  // Supprimer les anciens marqueurs
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];
  
  // Ajouter les nouveaux
  members.forEach(member => {
    const lat = member.profile?.location?.lat;
    const lng = member.profile?.location?.lng;
    
    if (lat && lng) {
      const marker = L.marker([lat, lng]).addTo(map);
      const fullName = `${member.profile?.identity?.first_name || ''} ${member.profile?.identity?.last_name || ''}`.trim() || 'Antenniste';
      
      marker.bindPopup(`
        <strong>${fullName}</strong><br>
        ${member.profile?.professional?.specialties?.join(', ') || ''}<br>
        📍 ${member.profile?.location?.city || ''}
        <br><a href="/profil.html?id=${member._id}">Voir le profil</a>
      `);
      
      markers.push(marker);
    }
  });
  
  // Adapter la vue si des markers existent
  if (markers.length > 0) {
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.1));
  }
}

// ===== FILTRES =====
function applyFilters() {
  const filters = {
    region: document.getElementById('filterRegion').value || undefined,
    specialty: document.getElementById('filterSpecialty').value || undefined,
    search: document.getElementById('filterSearch').value || undefined
  };
  
  loadMembers(filters);
}
