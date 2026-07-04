// ANTENNIST Cloud Platform - Script principal

async function testApi() {
  const btn = document.getElementById('testApiBtn');
  const result = document.getElementById('apiResult');

  btn.disabled = true;
  btn.textContent = 'Chargement...';
  result.textContent = '';

  try {
    const response = await fetch('/api/hello');
    const data = await response.json();
    result.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    result.textContent = 'Erreur : ' + error.message;
    result.style.color = '#ff6b6b';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Tester l\'API';
  }
}

console.log('📡 ANTENNIST Cloud Platform — V0.0.1 initialisée');
