const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { nanoid } = require("nanoid");

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Base de données
const db = new sqlite3.Database(path.resolve(__dirname, "database.sqlite"), (err) => {
  if (err) console.error("Erreur DB:", err.message);
  else console.log("✅ Base de données connectée.");
});

db.run(`
  CREATE TABLE IF NOT EXISTS links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE,
    original_url TEXT
  )
`);

// Route principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API : créer un lien court
app.post("/shorten", (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Aucun lien fourni." });

  const code = nanoid(6);
  db.run(
    "INSERT INTO links (code, original_url) VALUES (?, ?)",
    [code, url],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erreur interne." });
      }
      res.json({ shortUrl: `${req.headers.origin}/${code}` });
    }
  );
});

// Redirection
app.get("/:code", (req, res) => {
  const { code } = req.params;
  db.get("SELECT original_url FROM links WHERE code = ?", [code], (err, row) => {
    if (err || !row) return res.status(404).send("Lien non trouvé 😢");
    res.redirect(row.original_url);
  });
});

app.listen(PORT, () =>
  console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`)
);
const fs = require("fs");
const dbPath = path.resolve(__dirname, "database.sqlite");

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, "");
}
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Erreur DB:", err.message);
  else console.log("✅ Base de données connectée.");
});




