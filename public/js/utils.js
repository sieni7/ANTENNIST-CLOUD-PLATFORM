/**
 * Utilitaires Frontend
 */

// ===== FORMATAGE =====
function formatPhone(phone) {
  if (!phone) return '';
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('+225')) {
    return cleaned;
  }
  if (cleaned.startsWith('0')) {
    return `+225${cleaned.substring(1)}`;
  }
  return `+225${cleaned}`;
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

function getInitials(firstName, lastName) {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
}

// ===== VALIDATION =====
function isValidPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/\s/g, '');
  return /^(?:\+225|0)[0-9]{8,10}$/.test(cleaned);
}

function isValidEmail(email) {
  if (!email) return true; // Optionnel
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== DOM HELPERS =====
function $(selector, context = document) {
  return context.querySelector(selector);
}

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

function createElement(tag, attributes = {}, children = []) {
  const el = document.createElement(tag);
  Object.keys(attributes).forEach(key => {
    if (key === 'class') {
      el.className = attributes[key];
    } else if (key === 'dataset') {
      Object.keys(attributes[key]).forEach(k => {
        el.dataset[k] = attributes[key][k];
      });
    } else if (key === 'html') {
      el.innerHTML = attributes[key];
    } else {
      el.setAttribute(key, attributes[key]);
    }
  });
  children.forEach(child => {
    if (typeof child === 'string') {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  });
  return el;
}

function showElement(el) {
  el.classList.remove('hidden');
}

function hideElement(el) {
  el.classList.add('hidden');
}

function toggleElement(el) {
  el.classList.toggle('hidden');
}

// ===== STORAGE =====
function saveDraft(key, data) {
  try {
    localStorage.setItem(`draft_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Save draft failed:', e);
  }
}

function loadDraft(key) {
  try {
    const data = localStorage.getItem(`draft_${key}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('Load draft failed:', e);
    return null;
  }
}

function clearDraft(key) {
  localStorage.removeItem(`draft_${key}`);
}

// ===== NOTIFICATIONS =====
function showToast(message, type = 'info', duration = 3000) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  
  const toast = createElement('div', {
    class: `toast toast-${type}`
  }, [message]);
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ===== EXPORT =====
window.Utils = {
  formatPhone,
  formatDate,
  formatDateTime,
  truncateText,
  getInitials,
  isValidPhone,
  isValidEmail,
  $,
  $$,
  createElement,
  showElement,
  hideElement,
  toggleElement,
  saveDraft,
  loadDraft,
  clearDraft,
  showToast
};
