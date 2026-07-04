/**
 * Templates de notifications
 * Messages prédéfinis par événement et canal
 */

const TEMPLATES = {
  // ===== CERTIFICATION =====
  certification_approved: {
    whatsapp: {
      subject: '✅ Certification FITA Approuvée',
      body: (data) => `
🎖️ Félicitations ${data.first_name} ${data.last_name} !

Votre certification FITA a été approuvée avec succès.

📋 Détails :
• Niveau : ${data.level}
• Numéro FITA : ${data.fita_number}
• Date : ${new Date(data.date).toLocaleDateString('fr-FR')}

Vous êtes désormais un antenniste certifié FITA.

📱 Consultez votre profil :
${data.profile_url}

📞 Contactez-nous pour toute question : +225 07 08 12 34 56

L'équipe FITA
      `
    },
    email: {
      subject: (data) => `✅ Certification FITA Approuvée - ${data.fita_number}`,
      body: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0a1628; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; border: 1px solid #ddd; }
    .badge { display: inline-block; background: #00ff88; color: #0a1628; padding: 4px 12px; border-radius: 50px; font-weight: bold; }
    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📡 FITA Antennist</h1>
      <p>Certification Approuvée</p>
    </div>
    <div class="content">
      <h2>🎖️ Félicitations ${data.first_name} ${data.last_name} !</h2>
      <p>Votre certification FITA a été approuvée avec succès.</p>
      <br>
      <p><strong>Détails :</strong></p>
      <ul>
        <li>📋 Niveau : <strong>${data.level}</strong></li>
        <li>🔢 Numéro FITA : <strong>${data.fita_number}</strong></li>
        <li>📅 Date : <strong>${new Date(data.date).toLocaleDateString('fr-FR')}</strong></li>
      </ul>
      <br>
      <a href="${data.profile_url}" style="display: inline-block; background: #1a8cff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 50px;">
        📱 Voir mon profil
      </a>
      <br><br>
      <p>📞 Contact : +225 07 08 12 34 56</p>
    </div>
    <div class="footer">
      &copy; 2026 FITA Antennist Cloud Platform
    </div>
  </div>
</body>
</html>
      `
    },
    sms: {
      subject: '',
      body: (data) => `
FITA: Félicitations ${data.first_name}! Certification approuvée. Niveau: ${data.level}. Numéro FITA: ${data.fita_number}. Voir profil: ${data.short_url || data.profile_url}
      `
    }
  },
  
  // ===== CERTIFICATION REJETÉE =====
  certification_rejected: {
    whatsapp: {
      subject: '❌ Certification FITA Rejetée',
      body: (data) => `
❌ Bonjour ${data.first_name} ${data.last_name},

Votre demande de certification FITA a été rejetée.

Raison : ${data.reason || 'Non conforme aux critères FITA'}

📝 Que faire ?
1. Vérifiez que votre dossier est complet
2. Assurez-vous d'avoir au moins 2 ans d'expérience
3. Vérifiez vos spécialités et équipements
4. Soumettez une nouvelle demande

📱 Consultez votre dossier :
${data.profile_url}

L'équipe FITA
      `
    },
    email: {
      subject: (data) => `❌ Certification FITA Rejetée - ${data.fita_number}`,
      body: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0a1628; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; border: 1px solid #ddd; }
    .reason { background: #ff4444; color: #fff; padding: 12px; border-radius: 8px; margin: 10px 0; }
    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📡 FITA Antennist</h1>
      <p>Certification Rejetée</p>
    </div>
    <div class="content">
      <h2>❌ Bonjour ${data.first_name} ${data.last_name},</h2>
      <p>Votre demande de certification FITA a été rejetée.</p>
      <div class="reason">
        <strong>Raison :</strong> ${data.reason || 'Non conforme aux critères FITA'}
      </div>
      <h3>📝 Que faire ?</h3>
      <ul>
        <li>Vérifiez que votre dossier est complet</li>
        <li>Assurez-vous d'avoir au moins 2 ans d'expérience</li>
        <li>Vérifiez vos spécialités et équipements</li>
        <li>Soumettez une nouvelle demande</li>
      </ul>
      <br>
      <a href="${data.profile_url}" style="display: inline-block; background: #1a8cff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 50px;">
        📱 Voir mon dossier
      </a>
    </div>
    <div class="footer">
      &copy; 2026 FITA Antennist Cloud Platform
    </div>
  </div>
</body>
</html>
      `
    },
    sms: {
      subject: '',
      body: (data) => `
FITA: Certification rejetée pour ${data.first_name}. Raison: ${data.reason || 'Non conforme'}. Contactez-nous: +2250708123456
      `
    }
  },
  
  // ===== BIENVENUE =====
  welcome: {
    whatsapp: {
      subject: '👋 Bienvenue sur la plateforme FITA',
      body: (data) => `
👋 Bienvenue ${data.first_name} ${data.last_name} !

Vous êtes désormais référencé sur la plateforme FITA Antennist.

📋 Votre profil :
• Nom : ${data.first_name} ${data.last_name}
• Téléphone : ${data.phone}
• Numéro FITA : ${data.fita_number}

📱 Consultez votre profil :
${data.profile_url}

🔧 Étapes suivantes :
1. Complétez votre profil (équipements, expérience)
2. Demandez votre certification FITA
3. Soyez visible par les clients

L'équipe FITA
      `
    },
    email: {
      subject: (data) => `👋 Bienvenue sur FITA Antennist - ${data.fita_number}`,
      body: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0a1628; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; border: 1px solid #ddd; }
    .steps { background: #f5f5f5; padding: 16px; border-radius: 8px; }
    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📡 FITA Antennist</h1>
      <p>Bienvenue sur la plateforme</p>
    </div>
    <div class="content">
      <h2>👋 Bienvenue ${data.first_name} ${data.last_name} !</h2>
      <p>Vous êtes désormais référencé sur la plateforme FITA Antennist.</p>
      <br>
      <p><strong>📋 Détails de votre profil :</strong></p>
      <ul>
        <li>👤 Nom : ${data.first_name} ${data.last_name}</li>
        <li>📱 Téléphone : ${data.phone}</li>
        <li>🔢 Numéro FITA : <strong>${data.fita_number}</strong></li>
      </ul>
      <br>
      <a href="${data.profile_url}" style="display: inline-block; background: #1a8cff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 50px;">
        📱 Voir mon profil
      </a>
      <br><br>
      <div class="steps">
        <h3>🔧 Étapes suivantes :</h3>
        <ol>
          <li>Complétez votre profil (équipements, expérience)</li>
          <li>Demandez votre certification FITA</li>
          <li>Soyez visible par les clients</li>
        </ol>
      </div>
    </div>
    <div class="footer">
      &copy; 2026 FITA Antennist Cloud Platform
    </div>
  </div>
</body>
</html>
      `
    },
    sms: {
      subject: '',
      body: (data) => `
FITA: Bienvenue ${data.first_name}! Référencé sous le numéro ${data.fita_number}. Voir profil: ${data.short_url}
      `
    }
  },
  
  // ===== RAPPEL COTISATION =====
  membership_renewal: {
    whatsapp: {
      subject: '⏳ Renouvellement de votre adhésion FITA',
      body: (data) => `
⏳ Bonjour ${data.first_name},

Votre adhésion FITA expire le ${new Date(data.expiry_date).toLocaleDateString('fr-FR')}.

📋 Pour renouveler :
1. Connectez-vous à votre compte
2. Rendez-vous dans "Mon abonnement"
3. Suivez les instructions de paiement

📱 Accès rapide :
${data.profile_url}

L'équipe FITA
      `
    },
    email: {
      subject: (data) => `⏳ Renouvellement adhésion FITA - ${data.fita_number}`,
      body: (data) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #0a1628; color: #fff; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 20px; border: 1px solid #ddd; }
    .warning { background: #ffaa00; color: #0a1628; padding: 12px; border-radius: 8px; margin: 10px 0; }
    .footer { text-align: center; padding: 20px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📡 FITA Antennist</h1>
      <p>Renouvellement d'adhésion</p>
    </div>
    <div class="content">
      <h2>⏳ Bonjour ${data.first_name},</h2>
      <div class="warning">
        ⚠️ Votre adhésion FITA expire le <strong>${new Date(data.expiry_date).toLocaleDateString('fr-FR')}</strong>
      </div>
      <h3>📋 Comment renouveler :</h3>
      <ol>
        <li>Connectez-vous à votre compte</li>
        <li>Rendez-vous dans "Mon abonnement"</li>
        <li>Suivez les instructions de paiement</li>
      </ol>
      <br>
      <a href="${data.profile_url}" style="display: inline-block; background: #1a8cff; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 50px;">
        📱 Accéder à mon compte
      </a>
    </div>
    <div class="footer">
      &copy; 2026 FITA Antennist Cloud Platform
    </div>
  </div>
</body>
</html>
      `
    },
    sms: {
      subject: '',
      body: (data) => `
FITA: Votre adhésion expire le ${new Date(data.expiry_date).toLocaleDateString('fr-FR')}. Renouvelez sur ${data.short_url || data.profile_url}
      `
    }
  }
};

module.exports = TEMPLATES;
