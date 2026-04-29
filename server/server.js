
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require('path');
require("dotenv").config();

const app = express(); // TO JEST JEDYNA DEKLARACJA APP

// 1. MODELE
const MonthlyReport = require("./models/MonthlyReport");
const FixedExpensesReport = require("./models/FixedExpensesReport");
const Tenant = require("./models/TenantsReport");

// 2. MIDDLEWARE
app.use(cors());
app.use(express.json());

// 3. OBSŁUGA FRONTENDU
// Wyjście z folderu /server do głównego katalogu, gdzie jest index.htm
const frontendPath = path.resolve(__dirname, '..');
app.use(express.static(frontendPath));

// 4. POŁĄCZENIE Z BAZĄ
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Połączono z MongoDB Atlas!"))
    .catch((err) => console.error("❌ Błąd połączenia z MongoDB:", err));

// 5. ENDPOINTY API

// Raporty
app.post("/api/reports", async (req, res) => {
    try {
        const { propertyId, year, month } = req.body;
        const updatedReport = await MonthlyReport.findOneAndUpdate(
            { propertyId, year: parseInt(year), month },
            req.body,
            { new: true, upsert: true, runValidators: true }
        );
        res.status(200).json({ message: "✅ Dane zsynchronizowane!", data: updatedReport });
    } catch (err) {
        res.status(400).json({ message: "❌ Błąd zapisu", error: err.message });
    }
});

app.get("/api/reports/:propertyId/:year/:month", async (req, res) => {
    try {
        const { propertyId, year, month } = req.params;
        const report = await MonthlyReport.findOne({ propertyId, year: parseInt(year), month });
        if (!report) return res.status(404).json({ message: "Nie znaleziono raportu." });
        res.json(report);
    } catch (err) {
        res.status(500).json({ message: "Błąd serwera", error: err.message });
    }
});

// Ustawienia
app.post("/api/settings", async (req, res) => {
    try {
        const { user, propertyId, defaultExpenses } = req.body;
        const settings = await FixedExpensesReport.findOneAndUpdate(
            { user, propertyId },
            { defaultExpenses, updatedAt: Date.now() },
            { upsert: true, new: true }
        );
        res.json({ message: "✅ Ustawienia zapisane!", settings });
    } catch (err) {
        res.status(500).json({ message: "Błąd zapisu", error: err.message });
    }
});

app.get("/api/settings/:user/:propertyId", async (req, res) => {
    try {
        const settings = await FixedExpensesReport.findOne({
            user: req.params.user,
            propertyId: req.params.propertyId,
        });
        if (!settings) return res.status(404).json({ message: "Brak ustawień" });
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: "Błąd pobierania", error: err.message });
    }
});

// Najemcy
app.get("/api/tenants/:user", async (req, res) => {
    try {
        const tenants = await Tenant.find({ user: req.params.user });
        res.status(200).json(tenants);
    } catch (err) {
        res.status(500).json({ message: "Błąd pobierania", error: err.message });
    }
});

app.post("/api/tenants", async (req, res) => {
    try {
        const newTenant = new Tenant(req.body);
        const savedTenant = await newTenant.save();
        res.status(201).json({ message: "Najemca dodany", data: savedTenant });
    } catch (err) {
        res.status(400).json({ message: "Błąd dodawania", error: err.message });
    }
});

app.put("/api/tenants/:id", async (req, res) => {
    try {
        const updatedTenant = await Tenant.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json({ message: "Dane zaktualizowane", data: updatedTenant });
    } catch (err) {
        res.status(400).json({ message: "Błąd edycji", error: err.message });
    }
});

app.delete("/api/tenants/:id", async (req, res) => {
    try {
        await Tenant.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Najemca usunięty" });
    } catch (err) {
        res.status(500).json({ message: "Błąd usuwania", error: err.message });
    }
});

// 6. OBSŁUGA STRONY GŁÓWNEJ (Fallback)
app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.htm'));
});

// 7. START SERWERA
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Serwer działa na porcie ${PORT}`);
});
