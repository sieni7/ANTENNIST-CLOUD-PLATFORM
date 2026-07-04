/**
 * Feature Flags - Activation/désactivation des fonctionnalités
 * Permet un déploiement progressif et sécurisé
 *
 * @version 0.0.1
 * @author FITA - TECH_LEAD
 */

module.exports = {
  // ─── Certification ─────────────────────────────────────────────────────────
  ENABLE_CERTIFICATION:      true,
  ENABLE_SKILLS_MATRIX:      true,
  ENABLE_AUTO_CERTIFICATION: false,

  // ─── Dispatch ──────────────────────────────────────────────────────────────
  ENABLE_DISPATCH:    false,
  ENABLE_GEO_TRACKING: false,
  ENABLE_REAL_TIME:   false,

  // ─── Marketplace ───────────────────────────────────────────────────────────
  ENABLE_MARKETPLACE: false,
  ENABLE_QUOTATION:   false,
  ENABLE_PAYMENT:     false,

  // ─── Communications ────────────────────────────────────────────────────────
  ENABLE_WHATSAPP:         true,
  ENABLE_SMS:              false,
  ENABLE_PUSH_NOTIFICATIONS: false,

  // ─── Admin ─────────────────────────────────────────────────────────────────
  ENABLE_ADMIN_DASHBOARD: true,
  ENABLE_EXPORT:          true,
  ENABLE_AUDIT_TRAIL:     true,

  // ─── Public ────────────────────────────────────────────────────────────────
  ENABLE_PUBLIC_ANNUAIRE: true,
  ENABLE_QR_CODE:         true,
  ENABLE_PROFIL_PUBLIC:   true,

  // ─── Developer ─────────────────────────────────────────────────────────────
  ENABLE_DEBUG_MODE: process.env.NODE_ENV === 'development',
  ENABLE_API_DOCS:   process.env.NODE_ENV === 'development'
};
