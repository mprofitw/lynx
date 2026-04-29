const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
require("dotenv").config();

const app = express();

// 1. MODELE
const MonthlyReport = require("./models/MonthlyReport");
const FixedExpensesReport = require("./models/FixedExpensesReport");
const Tenant = require("./models/TenantsReport");

// 2. MIDDLEWARE
app.use(cors());
app.use(express.json());

// 3. OBSŁUGA FRONTENDU - POPRAWIONA
// Sprawdzamy ścieżkę logiem, aby upewnić się, że jest poprawna
const frontendPath = path.join(__dirname, '..');
console.log("📂 Próba serwowania plików z:", frontendPath);

// Używamy bezpiecznego sprawdzenia, czy ścieżka jest stringiem
if (typeof frontendPath === 'string') {
    app.use(express.static(frontendPath));
}

// 4. POŁĄCZENIE Z BAZĄ I START SERWERA
// Przeniosłem app.listen tutaj, aby upewnić się, że port otwiera się szybko
const PORT = process.env.PORT || 10000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Połączono z MongoDB Atlas!");
        // START SERWERA MUSI BYĆ TUTAJ
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Serwer nasłuchuje na porcie ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Błąd połączenia z MongoDB:", err);
        // Nawet jeśli baza padnie, spróbujmy odpalić serwer, żeby Render nie ubił usługi
        app.listen(PORT, () => console.log(`⚠️ Serwer awaryjny na porcie ${PORT}`));
    });

// 5. ENDPOINTY API
app.post("/api/reports", async (req, res) => {
    try {
        const { propertyId, year, month } = req.body;
        const updatedReport = await MonthlyReport.findOneAndUpdate(
            { propertyId, year: parseInt(year), month },
            req.body,
            { new: true, upsert: true }
        );
        res.status(200).json({ message: "✅ Zapisano!", data: updatedReport });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get("/api/reports/:propertyId/:year/:month", async (req, res) => {
    try {
        const { propertyId, year, month } = req.params;
        const report = await MonthlyReport.findOne({ propertyId, year: parseInt(year), month });
        if (!report) return res.status(404).json({ message: "Brak raportu" });
        res.json(report);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/tenants/:user", async (req, res) => {
    try {
        const tenants = await Tenant.find({ user: req.params.user });
        res.status(200).json(tenants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. FALLBACK DLA HTML
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.htm'));
});
