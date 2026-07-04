/**
 * Notifications - Interface de gestion (extensions API + composant UI)
 */

// ===== API EXTENSIONS =====
API.getNotificationHistory = function(memberId, filters = {}) {
  const params = new URLSearchParams(filters);
  const qs = params.toString();
  return this.request(`/notifications/history/${memberId}${qs ? '?' + qs : ''}`);
};

API.getNotificationStats = function(filters = {}) {
  const params = new URLSearchParams(filters);
  const qs = params.toString();
  return this.request(`/notifications/stats${qs ? '?' + qs : ''}`);
};

API.sendNotification = function(data) {
  return this.request('/notifications/send', {
    method: 'POST',
    body: JSON.stringify(data)
  });
};

API.processPendingNotifications = function(limit = 10) {
  return this.request('/notifications/process', {
    method: 'POST',
    body: JSON.stringify({ limit })
  });
};

// ===== COMPOSANT UI =====
function renderNotificationHistory(notifications, container) {
  if (!notifications || notifications.length === 0) {
    container.innerHTML = '<p class="text-muted">Aucune notification</p>';
    return;
  }
  
  container.innerHTML = notifications.map(n => {
    const channelIcon = n.channel === 'whatsapp' ? '💬' : n.channel === 'email' ? '📧' : '📱';
    const statusClass = n.status === 'sent' || n.status === 'delivered' ? 'badge-success' :
                        n.status === 'failed' ? 'badge-danger' : 'badge-warning';
    const statusLabel = n.status === 'sent' ? 'Envoyé' :
                        n.status === 'delivered' ? 'Délivré' :
                        n.status === 'failed' ? 'Échoué' : 'En attente';
    const date = new Date(n.created_at).toLocaleDateString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    
    return `
      <div class="notif-item" style="
        background: var(--color-dark-card);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        padding: 14px;
        margin-bottom: 10px;
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
          <span style="font-size: var(--font-size-small);">${channelIcon} ${n.channel.toUpperCase()}</span>
          <span class="badge ${statusClass}">${statusLabel}</span>
        </div>
        <div style="font-weight: 500; margin-bottom: 4px;">${n.subject || n.event}</div>
        <div style="font-size: var(--font-size-small); color: var(--color-text-muted);">${date}</div>
        ${n.error ? `<div style="font-size: 0.7rem; color: var(--color-danger); margin-top: 4px;">⚠️ ${n.error}</div>` : ''}
      </div>
    `;
  }).join('');
}

// ===== STATS COMPOSANT =====
function renderNotificationStats(stats, container) {
  container.innerHTML = `
    <div class="admin-stats" style="margin-bottom: 20px;">
      <div class="admin-stat-card">
        <span class="number">${stats.total || 0}</span>
        <span class="label">Total</span>
      </div>
      <div class="admin-stat-card">
        <span class="number" style="color: var(--color-success);">${stats.sent || 0}</span>
        <span class="label">✅ Envoyés</span>
      </div>
      <div class="admin-stat-card">
        <span class="number" style="color: var(--color-warning);">${stats.pending || 0}</span>
        <span class="label">⏳ En attente</span>
      </div>
      <div class="admin-stat-card">
        <span class="number" style="color: var(--color-danger);">${stats.failed || 0}</span>
        <span class="label">❌ Échoués</span>
      </div>
    </div>
    <div style="display: flex; gap: 12px; font-size: var(--font-size-small); color: var(--color-text-muted);">
      <span>💬 WhatsApp: ${stats.by_channel?.whatsapp || 0}</span>
      <span>📧 Email: ${stats.by_channel?.email || 0}</span>
      <span>📱 SMS: ${stats.by_channel?.sms || 0}</span>
    </div>
  `;
}

// Export
window.NotificationsUI = {
  renderHistory: renderNotificationHistory,
  renderStats: renderNotificationStats
};
