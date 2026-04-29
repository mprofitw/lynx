const mongoose = require('mongoose');

const MonthlyReportSchema = new mongoose.Schema({
    // Relacje
    user: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        ref: 'User', // Docelowo połączymy to z modelem użytkownika
        required: true
    },
    propertyId: {
        type: String, // Na razie ID nieruchomości (np. adres lub nazwa)
        required: true
    },
    
    // Czas (kluczowe dla Twojego selecta)
    month: {
        type: String, // np. "January", "February"
        required: true
    },
    year: {
        type: Number, // np. 2024
        required: true
    },

    // Dochody
    income: {
        rent: { type: Number, default: 0 },
        otherIncome: { type: Number, default: 0 }
    },

    // Wydatki (podział, który już wypracowaliśmy)
    expenses: {
        mortgage: { type: Number, default: 0 },
        
        utilities: {
            gas: { type: Number, default: 0 },
            electricity: { type: Number, default: 0 },
            water: { type: Number, default: 0 }
        },
        
        fixedCosts: {
            internet: { type: Number, default: 0 },
            tvLicence: { type: Number, default: 0 },
            insurance: { type: Number, default: 0 }
        },
        
        variableCosts: {
            cleaning: { type: Number, default: 0 },
            management: { type: Number, default: 0 },
            // repairs: { type: Number, default: 0 },
            other: { type: Number, default: 0 }
        }
    },

    // Podsumowanie (obliczane przed zapisem lub w locie)
    totalExpenses: Number,
    netProfit: Number,
    
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Indeksowanie dla szybkości wyszukiwania (ważne przy tysiącach rekordów)
MonthlyReportSchema.index({ user: 1, propertyId: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('MonthlyReport', MonthlyReportSchema);