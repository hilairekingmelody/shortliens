const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
const PORT = 3000;

// --- Base de données ---
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('Erreur de connexion à la base de données :', err.message);
  else console.log('✅ Base de données connectée.');
});

db.run(`
  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    short TEXT UNIQUE,
    long TEXT
  )
`);

// --- Middleware ---
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Créer un lien court ---
app.post('/shorten', (req, res) => {
  try {
    const { long } = req.body;
    if (!long) return res.status(400).json({ error: 'Lien manquant' });

    const shortId = "hil-" + nanoid(6);
    const shortUrl = `http://localhost:${PORT}/${shortId}`;

    db.run(`INSERT INTO links (short, long) VALUES (?, ?)`, [shortId, long], (err) => {
      if (err) {
        console.error('Erreur lors de l\'insertion :', err.message);
        return res.status(500).json({ error: 'Erreur lors de la création du lien !' });
      }
      res.json({ short: shortUrl });
    });
  } catch (err) {
    console.error('Erreur serveur :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --- Redirection ---
app.get('/:short', (req, res) => {
  const short = req.params.short;

  db.get(`SELECT long FROM links WHERE short = ?`, [short], (err, row) => {
    if (err) {
      console.error('Erreur de recherche :', err.message);
      return res.status(500).send('Erreur interne du serveur');
    }

    if (row) res.redirect(row.long);
    else res.status(404).send('Lien introuvable 😢');
  });
});

// --- Lancement du serveur ---
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`);
});


