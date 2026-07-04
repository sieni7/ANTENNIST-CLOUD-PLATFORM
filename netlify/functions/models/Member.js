/**
 * Modèle Member ACP (Antennist Cloud Platform)
 * Version définitive - alignée avec la vision produit
 *
 * @version 0.0.1
 * @author FITA - DATA_LEAD
 */

class Member {
  constructor(data = {}) {
    // === IDENTIFICATION ===
    this._id = data._id || `ant_${Date.now()}`;
    this.fita_number = data.fita_number || null;

    // === PROFIL ===
    this.profile = {
      identity: {
        first_name:  data.profile?.identity?.first_name  || '',
        last_name:   data.profile?.identity?.last_name   || '',
        phone:       data.profile?.identity?.phone       || '',
        whatsapp:    data.profile?.identity?.whatsapp    || '',
        email:       data.profile?.identity?.email       || '',
        gender:      data.profile?.identity?.gender      || '',
        birth_date:  data.profile?.identity?.birth_date  || null,
        nationality: data.profile?.identity?.nationality || 'Ivoirienne'
      },
      professional: {
        specialties:      data.profile?.professional?.specialties      || [],
        experience_years: data.profile?.professional?.experience_years || 0,
        description:      data.profile?.professional?.description      || '',
        equipment:        data.profile?.professional?.equipment        || [],
        status:           data.profile?.professional?.status           || 'indépendant', // 'indépendant' | 'salarié' | 'entreprise'
        company:          data.profile?.professional?.company          || '',
        rccm:             data.profile?.professional?.rccm             || ''
      },
      location: {
        city:                data.profile?.location?.city                || '',
        region:              data.profile?.location?.region              || '',
        country:             data.profile?.location?.country             || "Côte d'Ivoire",
        lat:                 data.profile?.location?.lat                 || null,
        lng:                 data.profile?.location?.lng                 || null,
        address:             data.profile?.location?.address             || '',
        intervention_radius: data.profile?.location?.intervention_radius || 20
      },
      media: {
        photo:   data.profile?.media?.photo   || '',
        qr_code: data.profile?.media?.qr_code || ''
      },
      documents: {
        cni_recto:     data.profile?.documents?.cni_recto     || '',
        cni_verso:     data.profile?.documents?.cni_verso     || '',
        photo_terrain: data.profile?.documents?.photo_terrain || '',
        certificate:   data.profile?.documents?.certificate   || ''
      }
    };

    // === SYSTÈME ===
    this.system = {
      status: {
        state:     data.system?.status?.state     || 'draft', // 'draft' | 'referenced' | 'pending' | 'verified' | 'certified'
        certified: data.system?.status?.certified || false,
        visible:   data.system?.status?.visible   !== undefined ? data.system.status.visible : true,
        blocked:   data.system?.status?.blocked   || false
      },
      created_at: data.system?.created_at || new Date().toISOString(),
      updated_at: data.system?.updated_at || new Date().toISOString()
    };

    // === MEMBERSHIP ===
    this.membership = {
      plan:           data.membership?.plan           || 'basic', // 'basic' | 'pro' | 'expert'
      status:         data.membership?.status         || 'pending', // 'pending' | 'active' | 'expired'
      start_date:     data.membership?.start_date     || null,
      expiry_date:    data.membership?.expiry_date    || null,
      fees_paid:      data.membership?.fees_paid      || false,
      payment_method: data.membership?.payment_method || null
    };

    // === CERTIFICATION ===
    this.certification = {
      level:           data.certification?.level           || null, // 'apprentice' | 'confirmed' | 'expert' | 'master'
      certified_at:    data.certification?.certified_at    || null,
      validated_by:    data.certification?.validated_by    || null,
      certificate_url: data.certification?.certificate_url || '',
      skills: data.certification?.skills || {
        signal_analysis:         false,
        frequency_finding:       false,
        quality_optimization:    false,
        dish_installation:       false,
        antenna_alignment:       false,
        collective_installation: false,
        troubleshooting:         false,
        emergency_repair:        false,
        lnb_polarization:        false,
        cable_diagnostic:        false
      }
    };

    // === STATISTIQUES ===
    this.stats = {
      views:         data.stats?.views         || 0,
      contacts:      data.stats?.contacts      || 0,
      interventions: data.stats?.interventions || 0,
      rating:        data.stats?.rating        || 0,
      reviews:       data.stats?.reviews       || 0,
      response_time: data.stats?.response_time || 0 // minutes
    };

    // === AUDIT ===
    this.audit = data.audit || [];

    // === PRÉFÉRENCES ===
    this.preferences = {
      notifications: data.preferences?.notifications || {
        email:    true,
        whatsapp: true,
        sms:      false
      },
      availability: data.preferences?.availability || {
        hours:     '08:00-18:00',
        days:      '1-5', // 1-5 = lundi-vendredi
        emergency: false
      },
      language: data.preferences?.language || 'fr'
    };
  }

  // === MÉTHODES UTILITAIRES ===

  getFullName() {
    return `${this.profile.identity.first_name} ${this.profile.identity.last_name}`.trim();
  }

  getPhone() {
    return this.profile.identity.phone;
  }

  getSpecialties() {
    return this.profile.professional.specialties;
  }

  getLocation() {
    return {
      city:   this.profile.location.city,
      region: this.profile.location.region,
      lat:    this.profile.location.lat,
      lng:    this.profile.location.lng
    };
  }

  isCertified() {
    return this.system.status.certified === true;
  }

  isVisible() {
    return this.system.status.visible === true &&
           this.system.status.blocked === false;
  }

  getCertificationLevel() {
    return this.certification.level || 'non_certified';
  }

  getPlan() {
    return this.membership.plan || 'basic';
  }

  isActive() {
    return this.membership.status === 'active' &&
           this.system.status.blocked === false;
  }

  toJSON() {
    return {
      _id:           this._id,
      fita_number:   this.fita_number,
      profile:       this.profile,
      system:        this.system,
      membership:    this.membership,
      certification: this.certification,
      stats:         this.stats,
      audit:         this.audit,
      preferences:   this.preferences
    };
  }
}

module.exports = Member;
