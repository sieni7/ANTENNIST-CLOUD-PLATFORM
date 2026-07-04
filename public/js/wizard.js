/**
 * Wizard - Logique de référencement
 */

let currentStep = 1;
const totalSteps = 4;
let map = null;
let marker = null;
const formData = {
  specialties: []
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadRegions();
  await loadSpecialties();
  
  // Géoloc bouton
  document.getElementById('getLocationBtn').addEventListener('click', requestLocation);
  
  // Checkboxes spécialités
  document.getElementById('specialtiesContainer').addEventListener('change', (e) => {
    if(e.target.type === 'checkbox') {
      if(e.target.checked) {
        formData.specialties.push(e.target.value);
      } else {
        formData.specialties = formData.specialties.filter(s => s !== e.target.value);
      }
    }
  });
});

async function loadRegions() {
  try {
    const data = await API.getRegions();
    const select = document.getElementById('region');
    data.regions.forEach(r => {
      select.add(new Option(r.label, r.id));
    });
  } catch (e) {
    console.error(e);
  }
}

async function loadSpecialties() {
  try {
    const data = await API.getSpecialties();
    const container = document.getElementById('specialtiesContainer');
    data.specialties.forEach(s => {
      const div = document.createElement('label');
      div.className = 'specialty-item';
      div.innerHTML = `
        <input type="checkbox" value="${s.id}">
        <span class="specialty-label">${s.label}</span>
      `;
      container.appendChild(div);
    });
  } catch (e) {
    console.error(e);
  }
}

// ===== NAVIGATION WIZARD =====
function updateProgress() {
  document.getElementById('progressFill').style.width = `${(currentStep / totalSteps) * 100}%`;
  
  document.querySelectorAll('.step-label').forEach(label => {
    label.classList.remove('active');
    if (parseInt(label.dataset.step) <= currentStep) {
      label.classList.add('active');
    }
  });
}

function showStep(stepIndex) {
  document.querySelectorAll('.step').forEach(step => {
    step.classList.remove('active');
    if (parseInt(step.dataset.step) === stepIndex) {
      step.classList.add('active');
    }
  });
  
  // Init map if step 3
  if (stepIndex === 3 && !map) {
    setTimeout(initMap, 200);
  }
  
  // Update summary if step 4
  if (stepIndex === 4) {
    updateSummary();
  }
  
  updateProgress();
}

function validateStep(stepIndex) {
  if (stepIndex === 1) {
    const phone = document.getElementById('phone').value;
    if (!Utils.isValidPhone(phone)) {
      document.getElementById('phoneError').textContent = "Numéro invalide";
      return false;
    } else {
      document.getElementById('phoneError').textContent = "";
    }
    
    if (!document.getElementById('firstName').value || !document.getElementById('lastName').value) {
      Utils.showToast("Remplissez tous les champs obligatoires", "error");
      return false;
    }
  }
  
  if (stepIndex === 2) {
    if (formData.specialties.length === 0) {
      Utils.showToast("Sélectionnez au moins une spécialité", "error");
      return false;
    }
  }
  
  if (stepIndex === 3) {
    if (!document.getElementById('region').value || !document.getElementById('city').value) {
      Utils.showToast("La région et la ville sont obligatoires", "error");
      return false;
    }
  }
  
  return true;
}

window.nextStep = function() {
  if (validateStep(currentStep)) {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  }
}

window.prevStep = function() {
  if (currentStep > 1) {
    currentStep--;
    showStep(currentStep);
  }
}

// ===== MAP & LOCATION =====
function initMap() {
  map = L.map('locationMap').setView([6.6, -5.0], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
  
  map.on('click', function(e) {
    setMarker(e.latlng.lat, e.latlng.lng);
  });
}

function setMarker(lat, lng) {
  if (marker) {
    map.removeLayer(marker);
  }
  marker = L.marker([lat, lng]).addTo(map);
  document.getElementById('lat').value = lat;
  document.getElementById('lng').value = lng;
}

function requestLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      setMarker(lat, lng);
      map.setView([lat, lng], 15);
    }, () => {
      Utils.showToast("Impossible d'obtenir la position", "warning");
    });
  }
}

// ===== SOUMISSION =====
function updateSummary() {
  const summary = document.getElementById('summaryCard');
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const phone = document.getElementById('phone').value;
  const city = document.getElementById('city').value;
  
  summary.innerHTML = `
    <div class="summary-item">
      <div class="summary-label">Nom</div>
      <div class="summary-value">${firstName} ${lastName}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Contact</div>
      <div class="summary-value">${phone}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Localisation</div>
      <div class="summary-value">${city}</div>
    </div>
    <div class="summary-item">
      <div class="summary-label">Spécialités</div>
      <div class="summary-value">${formData.specialties.join(', ')}</div>
    </div>
  `;
}

window.submitForm = async function() {
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Envoi en cours...';
  
  const equipmentInput = document.getElementById('equipment').value;
  
  const payload = {
    profile: {
      identity: {
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        phone: Utils.formatPhone(document.getElementById('phone').value),
        whatsapp: Utils.formatPhone(document.getElementById('whatsapp').value)
      },
      professional: {
        specialties: formData.specialties,
        experience_years: parseInt(document.getElementById('experienceYears').value) || 0,
        equipment: equipmentInput ? equipmentInput.split(',').map(e => e.trim()) : []
      },
      location: {
        region: document.getElementById('region').value,
        city: document.getElementById('city').value,
        lat: document.getElementById('lat').value ? parseFloat(document.getElementById('lat').value) : null,
        lng: document.getElementById('lng').value ? parseFloat(document.getElementById('lng').value) : null
      }
    }
  };
  
  try {
    const res = await API.createMember(payload);
    Utils.showToast("Inscription réussie !", "success");
    setTimeout(() => {
      window.location.href = res.profile_url || `/profil.html?id=${res.member._id}`;
    }, 1500);
  } catch (e) {
    btn.disabled = false;
    btn.textContent = "Soumettre l'inscription";
    Utils.showToast(e.message || "Erreur lors de l'inscription", "error");
  }
}
