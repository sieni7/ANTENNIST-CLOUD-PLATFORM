/**
 * Profil - Logique principale
 */

let map = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  
  if (!id) {
    Utils.showToast('ID de membre manquant', 'error');
    window.location.href = '/annuaire.html';
    return;
  }
  
  loadProfile(id);
});

// ===== CHARGEMENT =====
async function loadProfile(id) {
  const loading = document.getElementById('loadingSpinner');
  const content = document.getElementById('profileContent');
  
  try {
    const result = await API.getMember(id);
    const member = result.member;
    
    if (!member) {
      Utils.showToast('Membre non trouvé', 'error');
      window.location.href = '/annuaire.html';
      return;
    }
    
    loading.classList.add('hidden');
    content.classList.remove('hidden');
    
    renderProfile(member);
    
  } catch (error) {
    loading.classList.add('hidden');
    Utils.showToast('Erreur lors du chargement du profil', 'error');
    console.error('Load profile error:', error);
  }
}

// ===== RENDU =====
function renderProfile(member) {
  const profile = member.profile || {};
  const identity = profile.identity || {};
  const professional = profile.professional || {};
  const location = profile.location || {};
  const stats = member.stats || {};
  const system = member.system || {};
  
  // Photo
  const photo = profile.media?.photo || '/assets/default-avatar.png';
  document.getElementById('profilePhoto').src = photo;
  document.getElementById('profilePhoto').onerror = function() {
    this.src = '/assets/default-avatar.png';
  };
  
  // Nom
  const fullName = `${identity.first_name || ''} ${identity.last_name || ''}`.trim() || 'Antenniste';
  document.getElementById('profileName').textContent = fullName;
  
  // Badge
  const badge = document.getElementById('profileBadge');
  if (system.status?.certified) {
    badge.innerHTML = '<span class="badge badge-success">🎖️ Certifié FITA</span>';
  } else if (system.status?.state === 'referenced') {
    badge.innerHTML = '<span class="badge badge-primary">📡 Référencé</span>';
  } else {
    badge.innerHTML = '<span class="badge badge-warning">⏳ En attente</span>';
  }
  
  // Numéro FITA
  document.getElementById('profileFitaNumber').textContent = member.fita_number || 'Non attribué';
  
  // Spécialités
  const specialties = professional.specialties || [];
  const specialtiesContainer = document.getElementById('profileSpecialties');
  if (specialties.length > 0) {
    specialtiesContainer.innerHTML = specialties.map(s => 
      `<span class="badge badge-primary">${s}</span>`
    ).join('');
  } else {
    specialtiesContainer.innerHTML = '<span class="text-muted">Aucune spécialité renseignée</span>';
  }
  
  // Expérience
  const experienceYears = professional.experience_years || 0;
  document.getElementById('profileExperience').textContent = 
    `${experienceYears} an${experienceYears > 1 ? 's' : ''} d'expérience`;
  
  // Équipements
  const equipment = professional.equipment || [];
  document.getElementById('profileEquipment').textContent = 
    equipment.length > 0 ? `Équipements: ${equipment.join(', ')}` : 'Aucun équipement renseigné';
  
  // Localisation
  const city = location.city || '';
  const region = location.region || '';
  document.getElementById('profileLocation').textContent = 
    city || region ? `${city}${city && region ? ', ' : ''}${region}` : 'Non renseigné';
  
  // Carte
  const lat = location.lat;
  const lng = location.lng;
  if (lat && lng) {
    renderMap(lat, lng);
  } else {
    document.getElementById('profileMap').innerHTML = '<p class="text-muted">Position non disponible</p>';
  }
  
  // Statistiques
  document.getElementById('statViews').textContent = stats.views || 0;
  document.getElementById('statContacts').textContent = stats.contacts || 0;
  document.getElementById('statRating').textContent = stats.rating ? stats.rating.toFixed(1) : '0';
  
  // Contact
  const phone = identity.phone || '';
  const whatsapp = identity.whatsapp || phone;
  
  const phoneLink = document.getElementById('profilePhone');
  if (phone) {
    phoneLink.href = `tel:${phone}`;
    phoneLink.textContent = `📞 ${phone}`;
  } else {
    phoneLink.href = '#';
    phoneLink.textContent = '📞 Non renseigné';
    phoneLink.style.opacity = '0.5';
    phoneLink.style.pointerEvents = 'none';
  }
  
  const whatsappLink = document.getElementById('profileWhatsApp');
  if (whatsapp) {
    whatsappLink.href = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;
    whatsappLink.textContent = `💬 WhatsApp`;
  } else {
    whatsappLink.href = '#';
    whatsappLink.textContent = '💬 Non renseigné';
    whatsappLink.style.opacity = '0.5';
    whatsappLink.style.pointerEvents = 'none';
  }
  
  // QR Code
  generateQR(member._id);
}

// ===== CARTE =====
function renderMap(lat, lng) {
  const container = document.getElementById('profileMap');
  container.innerHTML = '';
  
  map = L.map('profileMap').setView([lat, lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);
  
  L.marker([lat, lng]).addTo(map);
  setTimeout(() => map.invalidateSize(), 100);
}

// ===== QR CODE =====
function generateQR(id) {
  const container = document.getElementById('qrContainer');
  container.innerHTML = '';
  
  const url = `${window.location.origin}/profil.html?id=${id}`;
  
  new QRCode(container, {
    text: url,
    width: 180,
    height: 180,
    colorDark: '#ffffff',
    colorLight: '#0a1628',
    correctLevel: QRCode.CorrectLevel.H
  });
}
