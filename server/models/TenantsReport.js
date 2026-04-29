const mongoose = require("mongoose")
const TenantsReportSchema = new mongoose.Schema({
	user: { type: String, required: true },
	fullName: { type: String, required: true },
	propertyId: { type: String, required: false },
	status: {
		type: Boolean,
		default: false,
	},
	tenancyStart: { type: Date, default: Date.now },
	payDay: { type: Number }, // Łatwiej operować na liczbie 1-31
	deposit: { type: Number, default: 0 },
	phone: { type: String },
	email: { type: String },
})

// Usuwamy unikalność, aby móc dodać wielu najemców do jednego obiektu
TenantsReportSchema.index({ user: 1, propertyId: 1 }, { unique: false })
module.exports = mongoose.model("TenantsReport", TenantsReportSchema);
