document.getElementById('shortenBtn').addEventListener('click', async () => {
  const longUrl = document.getElementById('longUrl').value.trim();
  const resultDiv = document.getElementById('result');
  const shortUrlInput = document.getElementById('shortUrl');
  const copiedMsg = document.getElementById('copiedMsg');

  if (!longUrl) {
    alert('Veuillez entrer un lien valide.');
    return;
  }

  try {
    const res = await fetch('/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ long: longUrl })
    });

    const data = await res.json();

    if (res.ok) {
      resultDiv.style.display = 'block';
      shortUrlInput.value = data.short;
      copiedMsg.style.display = 'none';
    } else {
      alert(data.error || 'Erreur lors de la création du lien.');
    }
  } catch (err) {
    alert('Erreur de connexion au serveur.');
  }
});

document.getElementById('copyBtn').addEventListener('click', () => {
  const shortUrlInput = document.getElementById('shortUrl');
  shortUrlInput.select();
  document.execCommand('copy');

  const copiedMsg = document.getElementById('copiedMsg');
  copiedMsg.style.display = 'block';

  setTimeout(() => copiedMsg.style.display = 'none', 2000);
});
// --- Mode clair / sombre ---
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Charger le thème choisi
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark');
  themeToggle.textContent = '🌞 Mode clair';
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  
  if (body.classList.contains('dark')) {
    themeToggle.textContent = '🌞 Mode clair';
    localStorage.setItem('theme', 'dark');
  } else {
    themeToggle.textContent = '🌙 Mode sombre';
    localStorage.setItem('theme', 'light');
  }
});

