/**
 * Script d'initialisation des données - Sprint Zero
 * Crée les fichiers JSON par défaut s'ils n'existent pas
 *
 * Usage: node scripts/init-data.js
 *
 * @version 0.0.1
 * @author FITA - DEVOPS
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');

// ─── S'assurer que le dossier data existe ─────────────────────────────────────
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('📁 Dossier data/ créé');
}

// ─── Données initiales ────────────────────────────────────────────────────────
const initialData = {
  'members.json': {
    members: [],
    metadata: {
      total: 0,
      last_updated: null,
      version: '0.0.1'
    }
  },

  'sequence.json': {
    year: new Date().getFullYear(),
    counter: 0,
    last_updated: null
  },

  'regions.json': {
    regions: [
      { id: 'abidjan',          label: 'Abidjan',          code: 'ABJ' },
      { id: 'lagunes',          label: 'Lagunes',          code: 'LAG' },
      { id: 'gbeke',            label: 'Gbêkê',            code: 'GBK' },
      { id: 'poro',             label: 'Poro',             code: 'POR' },
      { id: 'tchologo',         label: 'Tchologo',         code: 'TCH' },
      { id: 'hambol',           label: 'Hambol',           code: 'HAM' },
      { id: 'nzi-comoe',        label: 'Nzi-Comoé',        code: 'NCO' },
      { id: 'indenie-djuablin', label: 'Indénié-Djuablin', code: 'IDJ' },
      { id: 'agneby-tiassa',    label: 'Agneby-Tiassa',    code: 'AGT' },
      { id: 'sud-comoe',        label: 'Sud-Comoé',        code: 'SUC' },
      { id: 'cavally',          label: 'Cavally',          code: 'CAV' },
      { id: 'montagnes',        label: 'Montagnes',        code: 'MON' },
      { id: 'sassandra',        label: 'Sassandra',        code: 'SAS' },
      { id: 'bafing',           label: 'Bafing',           code: 'BAF' },
      { id: 'folon',            label: 'Folon',            code: 'FOL' },
      { id: 'bagoue',           label: 'Bagoué',           code: 'BAG' },
      { id: 'belier',           label: 'Bélier',           code: 'BEL' },
      { id: 'jerere',           label: 'Jéréré',           code: 'JER' },
      { id: 'kabadougou',       label: 'Kabadougou',       code: 'KAB' },
      { id: 'm-bahiakro',       label: "M'bahiakro",       code: 'MBA' }
    ]
  },

  'specialties.json': {
    specialties: [
      { id: 'tnt',        label: 'TNT Terrestre',          icon: '📡'   },
      { id: 'satellite',  label: 'Satellite / Parabole',   icon: '🛰️'  },
      { id: 'mixte',      label: 'TNT + Satellite',        icon: '📡🛰️'},
      { id: 'collective', label: 'Installation Collective', icon: '🏢'  },
      { id: 'depannage',  label: 'Dépannage Signal',       icon: '🔧'  }
    ]
  }
};

// ─── Créer chaque fichier ─────────────────────────────────────────────────────
let created = 0;
let skipped = 0;

Object.keys(initialData).forEach(filename => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(initialData[filename], null, 2), 'utf8');
    console.log(`✅ Créé    : data/${filename}`);
    created++;
  } else {
    console.log(`⚠️  Existant: data/${filename}`);
    skipped++;
  }
});

console.log(`\n✨ Init terminée — ${created} fichier(s) créé(s), ${skipped} ignoré(s).`);
