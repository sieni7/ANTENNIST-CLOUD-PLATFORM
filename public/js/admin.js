/**
 * Admin - Logique principale
 */

let currentView = 'pending';
let currentMembers = [];
let currentCertifications = [];
let selectedMemberId = null;

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadView('pending');
});

// ===== STATS =====
async function loadStats() {
  try {
    // Stats membres
    const members = await API.getMembers({ limit: 1 });
    document.getElementById('statTotal').textContent = members.total || 0;
    
    // Stats certifications
    const certStats = await API.getCertificationStats();
    document.getElementById('statPending').textContent = certStats.pending || 0;
    document.getElementById('statCertified').textContent = certStats.approved || 0;
    document.getElementById('statRejected').textContent = certStats.rejected || 0;
  } catch (error) {
    console.error('Stats error:', error);
  }
}

// ===== VUES =====
async function loadView(view) {
  currentView = view;
  
  const loading = document.getElementById('loadingSpinner');
  const content = document.getElementById('adminContent');
  loading.classList.remove('hidden');
  content.classList.add('hidden');
  
  try {
    let members = [];
    
    if (view === 'pending') {
      // Demandes en attente
      const certs = await API.getPendingCertifications();
      currentCertifications = certs.certifications || [];
      
      // Récupérer les membres correspondants
      const memberIds = currentCertifications.map(c => c.member_id);
      const allMembers = await API.getMembers({ limit: 100 });
      members = allMembers.members.filter(m => memberIds.includes(m._id));
      
      // Enrichir avec les infos de certification
      members = members.map(m => {
        const cert = currentCertifications.find(c => c.member_id === m._id);
        return { ...m, _certification: cert };
      });
      
    } else if (view === 'certified') {
      const result = await API.getMembers({ certified: true, limit: 100 });
      members = result.members || [];
      
    } else {
      const result = await API.getMembers({ limit: 100 });
      members = result.members || [];
    }
    
    currentMembers = members;
    renderTable(members, view);
    
    loading.classList.add('hidden');
    content.classList.remove('hidden');
    
  } catch (error) {
    loading.classList.add('hidden');
    Utils.showToast('Erreur de chargement: ' + error.message, 'error');
    console.error('View error:', error);
  }
}

// ===== RENDU TABLEAU =====
function renderTable(members, view) {
  const tbody = document.getElementById('adminTableBody');
  tbody.innerHTML = '';
  
  if (members.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center text-muted" style="padding: 40px;">
          Aucun membre trouvé
        </td>
      </tr>
    `;
    return;
  }
  
  members.forEach(member => {
    const tr = document.createElement('tr');
    
    const fullName = `${member.profile?.identity?.first_name || ''} ${member.profile?.identity?.last_name || ''}`.trim() || 'Inconnu';
    const specialties = (member.profile?.professional?.specialties || []).join(', ') || '-';
    const region = member.profile?.location?.region || '-';
    const level = member.certification?.level || member._certification?.level || '-';
    const status = member.system?.status?.state || 'draft';
    const certified = member.system?.status?.certified || false;
    const isPending = view === 'pending' && member._certification;
    const avatar = member.profile?.media?.photo || '/assets/default-avatar.png';
    
    const statusBadge = certified ? 'badge-success' : 
                        status === 'pending' ? 'badge-warning' :
                        status === 'draft' ? 'badge-secondary' : 'badge-primary';
    const statusLabel = certified ? '🎖️ Certifié' :
                        status === 'pending' ? '⏳ En attente' :
                        status === 'draft' ? '📝 Brouillon' : '📡 Référencé';
    
    tr.innerHTML = `
      <td>
        <div class="member-cell">
          <img src="${avatar}" alt="${fullName}" class="avatar" onerror="this.src='/assets/default-avatar.png'">
          <span class="name">${fullName}</span>
        </div>
      </td>
      <td>${specialties}</td>
      <td>${region}</td>
      <td>${level}</td>
      <td><span class="badge ${statusBadge}">${statusLabel}</span></td>
      <td class="actions-cell">
        ${isPending ? `
          <button class="btn btn-success btn-sm" onclick="openApproveModal('${member._id}')">✅ Approuver</button>
          <button class="btn btn-danger btn-sm" onclick="rejectCertification('${member._id}')">❌ Rejeter</button>
        ` : `
          <a href="/profil.html?id=${member._id}" class="btn btn-secondary btn-sm">👤 Voir</a>
        `}
        ${view === 'members' ? `
          <button class="btn btn-primary btn-sm" onclick="requestCertification('${member._id}')">📡 Certifier</button>
        ` : ''}
      </td>
    `;
    
    tbody.appendChild(tr);
  });
}

// ===== MODAL D'APPROBATION =====
window.openApproveModal = function(memberId) {
  selectedMemberId = memberId;
  const member = currentMembers.find(m => m._id === memberId);
  
  if (member) {
    const fullName = `${member.profile?.identity?.first_name || ''} ${member.profile?.identity?.last_name || ''}`.trim() || 'Inconnu';
    document.getElementById('modalMemberName').textContent = `Certification de ${fullName}`;
    
    // Suggérer le niveau
    const years = member.profile?.professional?.experience_years || 0;
    let suggested = 'apprentice';
    if (years >= 10) suggested = 'master';
    else if (years >= 5) suggested = 'expert';
    else if (years >= 2) suggested = 'confirmed';
    
    document.getElementById('modalLevel').value = suggested;
    document.getElementById('modalNotes').value = '';
  }
  
  document.getElementById('approveModal').classList.remove('hidden');
}

window.closeModal = function() {
  document.getElementById('approveModal').classList.add('hidden');
  selectedMemberId = null;
}

window.confirmApprove = function() {
  const level = document.getElementById('modalLevel').value;
  const notes = document.getElementById('modalNotes').value;
  
  if (!selectedMemberId) return;
  
  // Trouver la certification en attente
  const cert = currentCertifications.find(c => c.member_id === selectedMemberId);
  if (!cert) {
    Utils.showToast('Demande de certification non trouvée', 'error');
    return;
  }
  
  approveCertification(cert.id, level, notes);
}

window.confirmReject = function() {
  const notes = document.getElementById('modalNotes').value || 'Rejeté par modérateur';
  
  if (!selectedMemberId) return;
  
  const cert = currentCertifications.find(c => c.member_id === selectedMemberId);
  if (!cert) {
    Utils.showToast('Demande de certification non trouvée', 'error');
    return;
  }
  
  rejectCertification(cert.id, notes);
}

// ===== ACTIONS =====
window.approveCertification = async function(certId, level, notes) {
  try {
    const result = await API.approveCertification(certId, { notes });
    
    if (result.success) {
      Utils.showToast('✅ Certification approuvée avec succès', 'success');
      closeModal();
      loadStats();
      loadView(currentView);
    }
  } catch (error) {
    Utils.showToast('Erreur: ' + error.message, 'error');
  }
}

window.rejectCertification = async function(certId, reason) {
  try {
    const result = await API.rejectCertification(certId, { reason });
    
    if (result.success) {
      Utils.showToast('❌ Certification rejetée', 'warning');
      closeModal();
      loadStats();
      loadView(currentView);
    }
  } catch (error) {
    Utils.showToast('Erreur: ' + error.message, 'error');
  }
}

window.requestCertification = async function(memberId) {
  try {
    const result = await API.requestCertification({ member_id: memberId });
    
    if (result.success) {
      Utils.showToast('📡 Demande de certification soumise', 'success');
      loadView(currentView);
    }
  } catch (error) {
    Utils.showToast('Erreur: ' + error.message, 'error');
  }
}

// ===== API EXTENSIONS =====
// Ajouter les méthodes manquantes à l'API
API.requestCertification = function(data) {
  return this.request('/certifications', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

API.getPendingCertifications = function() {
  return this.request('/certifications/pending');
};

API.approveCertification = function(id, data) {
  return this.request(`/certifications/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

API.rejectCertification = function(id, data) {
  return this.request(`/certifications/${id}/reject`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

API.getCertificationStats = function() {
  return this.request('/certifications/stats');
};

API.checkEligibility = function(memberId) {
  return this.request(`/certifications/eligibility/${memberId}`);
};
