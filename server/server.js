const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
require("dotenv").config();

const app = express();

// 1. MODELE (Upewnij się, że te pliki istnieją w folderze server/models/)
const MonthlyReport = require("./models/MonthlyReport");
const FixedExpensesReport = require("./models/FixedExpensesReport");
const Tenant = require("./models/TenantsReport");

// 2. PODSTAWOWA KONFIGURACJA
app.use(cors());
app.use(express.json());

// 3. ROZWIĄZANIE PROBLEMU ZE ŚCIEŻKĄ
// Tworzymy ścieżkę i od razu sprawdzamy, czy jest poprawna
const folderGłówny = path.resolve(__dirname, '..');

// Logujemy do konsoli Rendera, żebyśmy widzieli co się dzieje
console.log("--- DEBUG START ---");
console.log("Folder serwera (__dirname):", __dirname);
console.log("Wyliczony folder główny:", folderGłówny);
console.log("--- DEBUG END ---");

// SERWUJEMY PLIKI TYLKO JEŚLI ŚCIEŻKA ISTNIEJE
app.use(express.static(folderGłówny));

// 4. POŁĄCZENIE Z BAZĄ I START (SZYBKI)
const PORT = process.env.PORT || 10000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ Połączono z MongoDB Atlas!");
    })
    .catch(err => console.error("❌ Błąd bazy:", err));

// Startujemy serwer od razu, nie czekając na bazę, żeby Render nie zrobił timeoutu
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Serwer nasłuchuje na porcie ${PORT}`);
});

// 5. ENDPOINTY API
app.get("/api/tenants/:user", async (req, res) => {
    try {
        const tenants = await Tenant.find({ user: req.params.user });
        res.json(tenants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Tutaj dodaj resztę swoich endpointów (Reports, Settings) analogicznie...
app.get('/', (req, res) => {
    res.sendFile(path.join(folderGłówny, 'index.htm'));
});
