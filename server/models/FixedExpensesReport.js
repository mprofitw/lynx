const mongoose = require("mongoose")

const FixedExpensesReportSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
	},
	propertyId: {
		type: String,
		required: true,
	},
	defaultExpenses: {
		mortgage: { type: Number, default: 0 },
		internet: { type: Number, default: 0 },
		tvLicence: { type: Number, default: 0 },
		insurance: { type: Number, default: 0 },
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
})

// Kluczowe: unikalność pary user + propertyId
// Jeden użytkownik może mieć tylko jeden zestaw ustawień dla danej nieruchomości
FixedExpensesReportSchema.index({ user: 1, propertyId: 1 }, { unique: true })

module.exports = mongoose.model(
	"FixedExpensesReport",
	FixedExpensesReportSchema,
)
