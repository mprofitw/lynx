const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

// 1. IMPORT MODELU (Ważne, aby endpoint wiedział co to jest MonthlyReport)
const MonthlyReport = require("./models/MonthlyReport")
const FixedExpensesReport = require("./models/FixedExpensesReport")
const Tenant = require("./models/TenantsReport")

const app = express()

// 2. MIDDLEWARE
app.use(cors())
app.use(express.json())

// 3. POŁĄCZENIE Z BAZĄ
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log("✅ Połączono z MongoDB Atlas!"))
	.catch((err) => console.error("❌ Błąd połączenia:", err))

// --- TU DODAJESZ ENDPOINTY ---

// Endpoint POST (z poprzedniej wiadomości)
// Tylko zapis
// app.post('/api/reports', async (req, res) => {
//     try {
//         const newReport = new MonthlyReport(req.body);
//         await newReport.save();
//         res.status(201).json({ message: '✅ Raport zapisany pomyślnie w MongoDB Atlas!' });
//     } catch (err) {
//         console.error("Błąd zapisu:", err);
//         res.status(400).json({ message: '❌ Błąd zapisu', error: err.message });
//     }
// });

// Zapis i update
app.post("/api/reports", async (req, res) => {
	try {
		const { propertyId, year, month } = req.body

		// Szukamy po tych 3 polach, aktualizujemy całą resztę (req.body)
		const updatedReport = await MonthlyReport.findOneAndUpdate(
			{ propertyId, year: parseInt(year), month },
			req.body,
			{
				new: true, // Zwróć zaktualizowany dokument
				upsert: true, // Jeśli nie ma, stwórz nowy
				runValidators: true,
			},
		)

		res.status(200).json({
			message:
				"✅ Dane zostały pomyślnie zsynchronizowane (zapisane/zaktualizowane)!",
			data: updatedReport,
		})
	} catch (err) {
		console.error("Błąd podczas zapisu/aktualizacji:", err)
		res.status(400).json({ message: "❌ Błąd zapisu", error: err.message })
	}
})

// TWÓJ KOD: Endpoint GET (do pobierania)
app.get("/api/reports/:propertyId/:year/:month", async (req, res) => {
	try {
		const { propertyId, year, month } = req.params

		const report = await MonthlyReport.findOne({
			propertyId,
			year: parseInt(year),
			month,
		})

		if (!report) {
			return res.status(404).json({ message: "Nie znaleziono raportu." })
		}

		res.json(report)
	} catch (err) {
		res.status(500).json({ message: "Błąd serwera", error: err.message })
	}
})
// Stałe koszty
// Zapisywanie ustawień dla konkretnej nieruchomości
app.post("/api/settings", async (req, res) => {
	try {
		const { user, propertyId, defaultExpenses } = req.body
		const settings = await FixedExpensesReport.findOneAndUpdate(
			{ user, propertyId }, // Szukamy po użytkowniku I nieruchomości
			{ defaultExpenses, updatedAt: Date.now() },
			{ upsert: true, new: true },
		)
		res.json({ message: "✅ Ustawienia nieruchomości zapisane!", settings })
	} catch (err) {
		res.status(500).json({ message: "Błąd zapisu", error: err.message })
	}
})

// Pobieranie ustawień dla konkretnej nieruchomości
app.get("/api/settings/:user/:propertyId", async (req, res) => {
	try {
		const settings = await FixedExpensesReport.findOne({
			user: req.params.user,
			propertyId: req.params.propertyId,
		})
		if (!settings) return res.status(404).json({ message: "Brak ustawień" })
		res.json(settings)
	} catch (err) {
		res.status(500).json({ message: "Błąd pobierania", error: err.message })
	}
})
// Crud Tenans **********

// 1. POBIERANIE (GET)
app.get("/api/tenants/:user", async (req, res) => {
	try {
		const tenants = await Tenant.find({ user: req.params.user })
		res.status(200).json(tenants)
	} catch (err) {
		res
			.status(500)
			.json({ message: "Błąd podczas pobierania najemców", error: err.message })
	}
})

// 2. WYSYŁANIE (POST)
app.post("/api/tenants", async (req, res) => {
	try {
		const newTenant = new Tenant(req.body)
		const savedTenant = await newTenant.save()
		res
			.status(201)
			.json({ message: "Najemca dodany pomyślnie", data: savedTenant })
	} catch (err) {
		res
			.status(400)
			.json({ message: "Błąd podczas dodawania najemcy", error: err.message })
	}
})

// 3. EDYCJA (PUT)
app.put("/api/tenants/:id", async (req, res) => {
	try {
		const updatedTenant = await Tenant.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true },
		)
		if (!updatedTenant)
			return res.status(404).json({ message: "Nie znaleziono najemcy" })
		res
			.status(200)
			.json({ message: "Dane zaktualizowane", data: updatedTenant })
	} catch (err) {
		res.status(400).json({ message: "Błąd podczas edycji", error: err.message })
	}
})

// 4. USUWANIE (DELETE)
app.delete("/api/tenants/:id", async (req, res) => {
	try {
		const deletedTenant = await Tenant.findByIdAndDelete(req.params.id)
		if (!deletedTenant)
			return res.status(404).json({ message: "Nie znaleziono najemcy" })
		res.status(200).json({ message: "Najemca usunięty" })
	} catch (err) {
		res
			.status(500)
			.json({ message: "Błąd podczas usuwania", error: err.message })
	}
})

// --- KONIEC ENDPOINTÓW ---

// 4. START SERWERA
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`🚀 Serwer działa na porcie ${PORT}`)
})
app.use(express.static) // Zakładając, że index.htm jest w folderze 'public'
