// Menu hamburger
const hamburger = document.querySelector("#hamburger-menu")
const sidebar = document.querySelector(".sidebar")
const hamburgerIcon = hamburger.querySelector("i") // Pobieramy ikonę ze środka przycisku

hamburger.addEventListener("click", () => {
	// 1. Przełączamy widoczność menu
	sidebar.classList.toggle("active")

	// 2. Sprawdzamy czy menu ma klasę 'active' i zmieniamy ikonę
	if (sidebar.classList.contains("active")) {
		// Zmień na X (fa-xmark)
		hamburgerIcon.classList.remove("fa-bars")
		hamburgerIcon.classList.add("fa-xmark")
	} else {
		// Wróć do hamburgera (fa-bars)
		hamburgerIcon.classList.remove("fa-xmark")
		hamburgerIcon.classList.add("fa-bars")
	}
})
// To już mamy, ale upewnij się, że resetuje też ikonę!
const navButtons = document.querySelectorAll(".sidebar-nav button")

navButtons.forEach((btn) => {
	btn.addEventListener("click", () => {
		sidebar.classList.remove("active")
		// Reset ikony do hamburgera
		hamburgerIcon.classList.remove("fa-xmark")
		hamburgerIcon.classList.add("fa-bars")
	})
})
const defaultExpenses = {
	mortgage: 0,
	insurance: 0,
	internet: 0,
	tvLicence: 0,
}
// Formater dla walut
const formatter = new Intl.NumberFormat("en-GB", {
	style: "currency",
	currency: "GBP",
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
})
// crud box
const showStatus = (message, type = "info") => {
	const statusAlert = document.querySelector(".crud-info-box")

	// 1. Ustawiamy tekst
	statusAlert.textContent = message

	// 2. Czyścimy stare klasy kolorów i dodajemy nową
	statusAlert.classList.remove("success", "danger", "info", "warning")
	statusAlert.classList.add(type)

	// 3. Pokazujemy alert
	statusAlert.classList.add("show")

	// 4. Chowamy po 3 sekundach
	setTimeout(() => {
		statusAlert.classList.remove("show")
	}, 3000)
}
// Menu przełączanie
function showContent(sectionId, element) {
	// 1. Lista wszystkich sekcji do ukrycia
	const sections = [
		"dashboard",
		"monthly-income",
		"portfolio",
		"tenants",
		"settings",
	]

	sections.forEach((id) => {
		const el = document.getElementById(id + "-section")
		if (el) el.style.display = "none"
	})

	// 2. Pokaż wybraną sekcję
	const target = document.getElementById(sectionId + "-section")
	if (target) {
		// Dashboard i Monthly Income potrzebują 'flex', żeby zachować Twój layout z CSS
		if (
			sectionId === "dashboard" ||
			sectionId === "monthly-income" ||
			sectionId === "portfolio" ||
			sectionId === "tenants" ||
			sectionId === "settings"
		) {
			target.style.display = "flex"
		} else {
			target.style.display = "block"
		}
	}
	if (sectionId === "tenants") {
		fetchTenants() // Ładuj dane tylko gdy użytkownik kliknie w Tenants
	}
	// 3. Aktualizacja klas active
	const buttons = document.querySelectorAll(".sidebar-nav button")
	buttons.forEach((btn) => btn.classList.remove("active"))
	element.classList.add("active")
}

const monthlyGrossIncome = document.querySelector("#monthly-gross-income")
const monthlyMortgagePayment = document.querySelector(
	"#monthly-mortgage-payment",
)
const monthlyGasBill = document.querySelector("#monthly-gas-bill")
const monthlyElectrictyBill = document.querySelector(
	"#monthly-electricity-bill",
)
const monthlyWaterBill = document.querySelector("#monthly-water-bill")
const monthlyInternet = document.querySelector("#monthly-internet")
const monthlyTvlicence = document.querySelector("#monthly-tv-licence")
const monthlyInsurance = document.querySelector("#monthly-insurance")
const monthlyCleaning = document.querySelector("#monthly-cleaning")
const monthlyManagment = document.querySelector("#monthly-managment")
const monthlyOtherCosts = document.querySelector("#monthly-other-costs")

// Results
const kpiTotalIncome = document.querySelector("#kpi-total-income")
const btnCalculateIncome = document.querySelector("#btn-calculate-income")
const kpiTotalExpenses = document.querySelector("#kpi-total-expenses")
const kpiNetProfit = document.querySelector("#kpi-net-profit")

const calcFormMonthlyIncome = document.querySelector(
	"#calc-form-monthly-income",
)
const clearInputsMonthlyIncome = () => {
	const clearFields = [
		monthlyGrossIncome,
		monthlyGasBill,
		monthlyElectrictyBill,
		monthlyWaterBill,
		monthlyCleaning,
		monthlyManagment,
		monthlyOtherCosts,
	]
	clearFields.forEach((element) => {
		if (element) element.value = ""
	})
}

// const loadDefaultsExpenses = () => {
// 	const savedMortgage = localStorage.getItem("monthlyMortgageSet")
// 	if (savedMortgage !== null) {
// 		monthlyMortgagePayment.value = parseFloat(savedMortgage).toFixed(2)
// 	} else {
// 		monthlyMortgagePayment.value = defaultExpenses.mortgage.toFixed(2)
// 	}

// 	const savedInternet = localStorage.getItem("monthlyInternetSet")
// 	if (savedInternet !== null) {
// 		monthlyInternet.value = parseFloat(savedInternet).toFixed(2)
// 	} else {
// 		monthlyInternet.value = defaultExpenses.internet.toFixed(2)
// 	}
// 	const savedTvLicence = localStorage.getItem("yearTvLicenceSet") / 12
// 	if (savedTvLicence !== null) {
// 		monthlyTvlicence.value = parseFloat(savedTvLicence).toFixed(2)
// 	} else {
// 		monthlyTvlicence.value = defaultExpenses.tvLicence.toFixed(2)
// 	}
// 	const savedInsurance = localStorage.getItem("yearInsuranceSet") / 12
// 	if (savedInsurance !== null) {
// 		monthlyInsurance.value = parseFloat(savedInsurance).toFixed(2)
// 	} else {
// 		monthlyInsurance.value = defaultExpenses.insurance.toFixed(2)
// 	}
// }
// loadSettingsFromDatabase()

const calculateMonthlyProfit = (e) => {
	if (e) e.preventDefault()

	// 1. Pobieranie wartości
	const monthlyIncome = monthlyGrossIncome.valueAsNumber || 0
	const monthlyTotalExpenses =
		(monthlyMortgagePayment.valueAsNumber || 0) +
		(monthlyGasBill.valueAsNumber || 0) +
		(monthlyElectrictyBill.valueAsNumber || 0) +
		(monthlyWaterBill.valueAsNumber || 0) +
		(monthlyInternet.valueAsNumber || 0) +
		(monthlyTvlicence.valueAsNumber || 0) +
		(monthlyInsurance.valueAsNumber || 0) +
		(monthlyCleaning.valueAsNumber || 0) +
		(monthlyManagment.valueAsNumber || 0) +
		(monthlyOtherCosts.valueAsNumber || 0)

	const monthlyNetProfit = monthlyIncome - monthlyTotalExpenses
	kpiTotalIncome.textContent = formatter.format(monthlyIncome)
	kpiTotalExpenses.textContent = formatter.format(monthlyTotalExpenses)
	kpiNetProfit.textContent = formatter.format(monthlyNetProfit)
	// Aktualizacja danych w tabeli breakdown
	document.querySelector("#breakdown-mortgage").textContent = formatter.format(
		monthlyMortgagePayment.valueAsNumber || 0,
	)
	document.querySelector("#breakdown-insurance").textContent = formatter.format(
		monthlyInsurance.valueAsNumber || 0,
	)
	document.querySelector("#breakdown-internet").textContent = formatter.format(
		monthlyInternet.valueAsNumber || 0,
	)
	document.querySelector("#breakdown-tv").textContent = formatter.format(
		monthlyTvlicence.valueAsNumber || 0,
	)

	document.querySelector("#breakdown-gas").textContent = formatter.format(
		monthlyGasBill.valueAsNumber || 0,
	)
	document.querySelector("#breakdown-electricity").textContent =
		formatter.format(monthlyElectrictyBill.valueAsNumber || 0)
	document.querySelector("#breakdown-water").textContent = formatter.format(
		monthlyWaterBill.valueAsNumber || 0,
	)
	document.querySelector("#breakdown-cleaning").textContent = formatter.format(
		monthlyCleaning.valueAsNumber || 0,
	)
	document.querySelector("#breakdown-management").textContent =
		formatter.format(monthlyManagment.valueAsNumber || 0)
	document.querySelector("#breakdown-other").textContent = formatter.format(
		monthlyOtherCosts.valueAsNumber || 0,
	)

	document.querySelector("#breakdown-total-expenses").textContent =
		formatter.format(monthlyTotalExpenses)
	if (monthlyNetProfit < 0) {
		kpiNetProfit.style.color = "#e74c3c"
	}
	if ((monthlyNetProfit > 0) & (monthlyNetProfit < 300)) {
		kpiNetProfit.style.color = "#d99c52"
	}
	if (monthlyNetProfit > 300) {
		kpiNetProfit.style.color = "#2ecc71"
	}

	// Wykres kołowy
	// 1. Grupa Utilities (Gaz, Prąd, Woda)
	const utilitiesSum =
		(monthlyGasBill.valueAsNumber || 0) +
		(monthlyElectrictyBill.valueAsNumber || 0) +
		(monthlyWaterBill.valueAsNumber || 0)

	// 2. Grupa Koszty Stałe (Internet, TV, Insurance)
	const fixedCostsSum =
		(monthlyInternet.valueAsNumber || 0) +
		(monthlyTvlicence.valueAsNumber || 0) +
		(monthlyInsurance.valueAsNumber || 0)

	// 3. Grupa Pozostałe (Cleaning, Management, Other)
	const otherCostsSum =
		(monthlyCleaning.valueAsNumber || 0) +
		(monthlyManagment.valueAsNumber || 0) +
		(monthlyOtherCosts.valueAsNumber || 0)

	// 4. Aktualizacja wykresu
	if (myPieChart) {
		myPieChart.data.datasets[0].data = [
			monthlyMortgagePayment.valueAsNumber || 0,
			utilitiesSum,
			fixedCostsSum,
			otherCostsSum,
		]
		document.getElementById("chart-total-amount").textContent =
			formatter.format(monthlyTotalExpenses)
		myPieChart.update()
	}
	// return { monthlyIncome, monthlyTotalExpenses, monthlyNetProfit };

	// calcFormMonthlyIncome.reset();
	loadSettingsFromDatabase()
	return {
		income: monthlyIncome,
		expenses: monthlyTotalExpenses,
		profit: monthlyNetProfit,
	}
}

const handleUpdateAndSave = async (e) => {
	if (e) e.preventDefault()

	// 1. Wykonaj obliczenia i odbierz policzone wartości
	// const results = calculateMonthlyProfit(e);
	const { income, expenses, profit } = calculateMonthlyProfit()
	//  clearInputsMonthlyIncome()
	// 2. Przygotuj dane do bazy (pobierając wartości bezpośrednio z pól)
	const dataToSend = {
		user: "65f123456789012345678901",
		propertyId: "London-Flat-1",
		month: document.getElementById("month").value,
		year: parseInt(document.getElementById("year-select").value),
		income: {
			rent:
				parseFloat(document.getElementById("monthly-gross-income").value) || 0,
		},
		expenses: {
			mortgage:
				parseFloat(document.getElementById("monthly-mortgage-payment").value) ||
				0,
			utilities: {
				gas: parseFloat(document.getElementById("monthly-gas-bill").value) || 0,
				electricity:
					parseFloat(
						document.getElementById("monthly-electricity-bill").value,
					) || 0,
				water:
					parseFloat(document.getElementById("monthly-water-bill").value) || 0,
			},
			fixedCosts: {
				internet:
					parseFloat(document.getElementById("monthly-internet").value) || 0,
				tvLicence:
					parseFloat(document.getElementById("monthly-tv-licence").value) || 0,
				insurance:
					parseFloat(document.getElementById("monthly-insurance").value) || 0,
			},
			variableCosts: {
				cleaning:
					parseFloat(document.getElementById("monthly-cleaning").value) || 0,
				management:
					parseFloat(document.getElementById("monthly-managment").value) || 0,
				other:
					parseFloat(document.getElementById("monthly-other-costs").value) || 0,
			},
		},
		// totalExpenses: results.monthlyTotalExpenses,
		// netProfit: results.monthlyNetProfit
		totalExpenses: expenses,
		netProfit: profit,
	}

	console.log("Wysyłam do Atlasa:", dataToSend)
	await saveToDatabase(dataToSend)
}
// Funkcja wysyłająca (czysta)
async function saveToDatabase(data) {
	try {
		const response = await fetch("/api/reports", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})

		const result = await response.json()
		if (!response.ok) throw new Error(result.error || result.message)

		console.log("✅ Serwer:", result.message)
		// alert("Zapisano pomyślnie!")
		showStatus("✅ Saved succefully", "success")
		clearInputsMonthlyIncome()
		loadFullYearDashboard()
	} catch (err) {
		console.error("❌ Błąd zapisu:", err)
		// alert("Błąd serwera: " + err.message)
		showStatus("❌ Error connecting to the server. " + err.message, "danger")
	}
}

// PRZYPISANIE

// btnCalculateIncome.addEventListener("click", handleUpdateAndSave)

const setMortgage = document.querySelector("#set-mortgage")
const setInternet = document.querySelector("#set-internet")
const setTvLicence = document.querySelector("#set-tv-licence")
const setInsurance = document.querySelector("#set-insurance")
const btnSaveSettings = document.querySelector("#btn-save-settings")

const loadSettingsFromDatabase = async () => {
	const user = "65f123456789012345678901"
	const propertyId = "London-Flat-1"

	try {
		const response = await fetch(
			`/api/settings/${user}/${propertyId}`,
		)

		if (response.status === 404) {
			console.log("Brak zapisanych ustawień dla tej nieruchomości.")
			checkFixedCostsSettings(0)
			return
		}

		const data = await response.json()
		const deps = data.defaultExpenses

		// 1. Wypełnij pola w zakładce Settings
		setMortgage.value = deps.mortgage
		setInternet.value = deps.internet
		setTvLicence.value = deps.tvLicence
		setInsurance.value = deps.insurance

		// 2. Opcjonalnie: Jeśli pola w głównym formularzu są puste, wypełnij je domyślnymi
		// To jest przydatne przy tworzeniu nowego raportu
		if (!monthlyMortgagePayment.value)
			monthlyMortgagePayment.value = deps.mortgage
		if (!monthlyInternet.value)
			monthlyInternet.value = parseFloat(deps.internet).toFixed(2)
		if (!monthlyTvlicence.value)
			monthlyTvlicence.value = (parseFloat(deps.tvLicence) / 12).toFixed(2)
		if (!monthlyInsurance.value)
			monthlyInsurance.value = (parseFloat(deps.insurance) / 12).toFixed(2)
		checkFixedCostsSettings(deps.mortgage)

		console.log("✅ Ustawienia wczytane z bazy.")
	} catch (err) {
		console.error("Błąd pobierania ustawień:", err)
		// checkFixedCostsSettings(0)
	}
}

// Wywołaj przy starcie strony
loadSettingsFromDatabase()
const saveSettingsToDatabase = async (e) => {
	if (e) e.preventDefault()

	const settingsData = {
		user: "65f123456789012345678901", // Twoje ID użytkownika
		propertyId: "London-Flat-1", // Twoje ID nieruchomości
		defaultExpenses: {
			mortgage: Number(setMortgage.valueAsNumber) || 0,
			internet: Number(setInternet.valueAsNumber) || 0,
			tvLicence: Number(setTvLicence.valueAsNumber) || 0,
			insurance: Number(setInsurance.valueAsNumber) || 0,
		},
	}
	try {
		const response = await fetch("/api/settings", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(settingsData),
		})

		if (!response.ok) throw new Error("Błąd zapisu ustawień")

		const result = await response.json()
		showStatus("✅  Saved successfully", "success")
		// Po zapisie od razu odświeżamy widok

		loadSettingsFromDatabase()
	} catch (err) {
		console.error("Błąd:", err)
		// alert("Nie udało się zapisać ustawień w bazie.")
		showStatus("❌ Error connecting to the server.", "danger")
	}
}
btnSaveSettings.addEventListener("click", saveSettingsToDatabase)

const checkFixedCostsSettings = (mortgageValue) => {
	const alertBox = document.getElementById("settings-alert")
	if (!alertBox) return

	// Jeśli wartość jest zerem, pusta lub NaN - pokaż alert
	if (!mortgageValue || parseFloat(mortgageValue) === 0) {
		alertBox.style.display = "block"
	} else {
		alertBox.style.display = "none"
	}
}
// checkFixedCostsSettings()

function goToSettings() {
	// Pobieramy przycisk settings z menu, żeby przekazać go do showContent
	const settingsBtn = document.querySelector('button[onclick*="settings"]')
	showContent("settings", settingsBtn)
}
let myPieChart

const initChart = () => {
	const ctx = document.getElementById("expensesChart").getContext("2d")

	myPieChart = new Chart(ctx, {
		type: "doughnut",
		data: {
			labels: ["Mortgage", "Utilities", "Fixed Costs", "Other"],
			datasets: [
				{
					data: [0, 0, 0, 0],
					backgroundColor: ["#2d4a59", "#d99c52", "#446e85", "#e74c3c"],
					hoverOffset: 10,
					borderWidth: 2,
					borderColor: "#ffffff",
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			cutout: "60%", // To robi miejsce na sumę w środku
			plugins: {
				legend: {
					position: "bottom",
					labels: { padding: 20, usePointStyle: true },
				},
			},
		},
	})
}

document.addEventListener("DOMContentLoaded", initChart)

// Ładowanie danych miesiąca
const btnLoadData = document.querySelector("#btn-load-data")

const loadDataFromDatabase = async () => {
	clearInputsMonthlyIncome()
	const propertyId = "London-Flat-1" // Musi być takie samo jak przy zapisie
	const year = document.getElementById("year-select").value
	const month = document.getElementById("month").value

	try {
		const response = await fetch(
			`/api/reports/${propertyId}/${year}/${month}`,
	
			
		)

		if (!response.ok) {
			if (response.status === 404)
				showStatus("ℹ️ No report found for this period.", "warning")
			return
		}

		const data = await response.json()

	

		// WPISYWANIE DANYCH DO FORMULARZA
		monthlyGrossIncome.value = data.income.rent
		monthlyMortgagePayment.value = data.expenses.mortgage

		// Utilities
		monthlyGasBill.value = data.expenses.utilities.gas
		monthlyElectrictyBill.value = data.expenses.utilities.electricity
		monthlyWaterBill.value = data.expenses.utilities.water
		
// console.log(data.previous.expenses.utilities.gas)
		// Fixed Costs
		monthlyInternet.value = data.expenses.fixedCosts.internet
		monthlyTvlicence.value = data.expenses.fixedCosts.tvLicence
		monthlyInsurance.value = data.expenses.fixedCosts.insurance

		// Variable Costs
		monthlyCleaning.value = data.expenses.variableCosts.cleaning
		monthlyManagment.value = data.expenses.variableCosts.management
		monthlyOtherCosts.value = data.expenses.variableCosts.other

		// Po wczytaniu danych przelicz wszystko, żeby zaktualizować wykres i KPI
		calculateMonthlyProfit()

		// alert(`Wczytano dane dla: ${month} ${year}`);
		showStatus("ℹ️ Loaded successfully", "warning")
	} catch (err) {
		console.error("Błąd podczas wczytywania:", err)
		showStatus("❌ Error connecting to the server.", "danger")
		// alert("Błąd połączenia z serwerem.")
	}
}

// KLIKNIĘCIE PRZYCISKU: Oblicza i ZAPISUJE to co aktualnie jest w selectach
btnCalculateIncome.addEventListener("click", handleUpdateAndSave)

// ZMIANA W SELECTACH: Tylko WCZYTUJE (nie zapisuje nic)
document
	.getElementById("month")
	.addEventListener("change", loadDataFromDatabase)
document
	.getElementById("year-select")
	.addEventListener("change", loadDataFromDatabase)

// const loadFullYearDashboard = async (year = 2026) => {
// 	const propertyId = "London-Flat-1"
// 	const rows = document.querySelectorAll(
// 		".income-year-table tbody tr[data-month]",
// 	)
// 	const footer = document.querySelector(".income-year-table tfoot tr")

// 	// Zmienne do sumowania całego roku
// 	let totalYearIncome = 0
// 	let totalYearExpenses = 0
// 	let totalYearProfit = 0

// 	// Iterujemy przez wszystkie wiersze zdefiniowane w HTML
// 	for (const row of rows) {
// 		const month = row.getAttribute("data-month")

// 		try {
// 			const response = await fetch(
// 				`http://localhost:5000/api/reports/${propertyId}/${year}/${month}`,
// 			)

// 			if (response.ok) {
// 				const data = await response.json()

// 				// 1. Obliczenia sumaryczne
// 				totalYearIncome += data.income.rent
// 				totalYearExpenses += data.totalExpenses
// 				totalYearProfit += data.netProfit

// 				// 2. Wypełnianie danych w wierszu
// 				row.cells[1].textContent = formatter.format(data.income.rent)
// 				row.cells[2].textContent = formatter.format(data.totalExpenses)
// 				row.cells[3].textContent = formatter.format(data.netProfit)

// 				// Kolorowanie zysku w wierszu
// 				row.cells[3].style.color = data.netProfit >= 0 ? "#2ecc71" : "#e74c3c"

// 				// 3. Pokaż wiersz
// 				row.style.display = "table-row"
// 			} else {
// 				// Jeśli brak raportu (404) - ukryj wiersz całkowicie
// 				row.style.display = "none"
// 			}
// 		} catch (err) {
// 			console.error(`Błąd podczas pobierania danych dla ${month}:`, err)
// 			row.style.display = "none"
// 		}
// 	}

// 	// 4. Aktualizacja stopki (Total) po zakończeniu pętli
// 	if (footer) {
// 		footer.cells[1].textContent = formatter.format(totalYearIncome)
// 		footer.cells[2].textContent = formatter.format(totalYearExpenses)
// 		footer.cells[3].textContent = formatter.format(totalYearProfit)

// 		// Kolorowanie zysku rocznego w stopce
// 		footer.cells[3].style.color = totalYearProfit >= 0 ? "#2ecc71" : "#e74c3c"
// 	}
// }
const loadFullYearDashboard = async () => {
	const propertyId = "London-Flat-1"
	const selectedYearValue = yearTableSelect.value // np. "2024" lub "2024/25"
	const rows = document.querySelectorAll(
		".income-year-table tbody tr[data-month]",
	)

	let totalYearIncome = 0
	let totalYearExpenses = 0
	let totalYearProfit = 0

	for (const row of rows) {
		const month = row.getAttribute("data-month")
		let queryYear

		// LOGIKA ROZPOZNAWANIA ROKU
		if (selectedYearValue.includes("/")) {
			// ROK FISKALNY (np. "2024/25")
			const parts = selectedYearValue.split("/") // ["2024", "25"]
			const startYear = parseInt(parts[0])
			const endYear = 2000 + parseInt(parts[1]) // zamienia "25" na 2025

			// Jeśli miesiąc to Jan, Feb lub Mar -> bierzemy endYear, reszta startYear
			const isQ1 = ["January", "February", "March"].includes(month)
			queryYear = isQ1 ? endYear : startYear
		} else {
			// ROK KALENDARZOWY (np. "2024")
			queryYear = parseInt(selectedYearValue)
		}

		try {
			const response = await fetch(
				`/api/reports/${propertyId}/${queryYear}/${month}`,
			)

			if (response.ok) {
				const data = await response.json()

				row.style.display = "table-row"
				row.cells[1].textContent = formatter.format(data.income.rent)
				row.cells[2].textContent = formatter.format(data.totalExpenses)
				row.cells[3].textContent = formatter.format(data.netProfit)
				row.cells[3].style.color = data.netProfit >= 0 ? "#2ecc71" : "#e74c3c"

				totalYearIncome += data.income.rent
				totalYearExpenses += data.totalExpenses
				totalYearProfit += data.netProfit
			} else {
				row.style.display = "none"
			}
		} catch (err) {
			console.error(`Błąd dla ${month} ${queryYear}:`, err)
			row.style.display = "none"
		}
	}

	// Aktualizacja stopki
	const footer = document.querySelector(".income-year-table tfoot tr")
	if (footer) {
		footer.cells[1].textContent = formatter.format(totalYearIncome)
		footer.cells[2].textContent = formatter.format(totalYearExpenses)
		footer.cells[3].textContent = formatter.format(totalYearProfit)
		footer.cells[3].style.color = totalYearProfit >= 0 ? "#2ecc71" : "#e74c3c"
	}
}

// tabela roczna dashboard

const fiscalYearSelect = document.querySelector("#fiscal-year")
const yearTableSelect = document.querySelector("#year-table-select")
const yearTableOptions = yearTableSelect.querySelectorAll("option")

// const selectingTypeOfYear = () => {
// 	const calendarYear = ["2022", "2023", "2024", "2025", "2026"]
// 	const fiscalYear = ["2022/23", "2023/24", "2024/25", "2025/26", "2026/27"]
// 	if (fiscalYearSelect.value == "calendar-year") {
// 		yearTableOptions.forEach((element, index) => {
// 			element.textContent = calendarYear[index]
// 			element.value = calendarYear[index]
// 		})
// 	} else {
// 		yearTableOptions.forEach((element, index) => {
// 			element.textContent = fiscalYear[index]
// 			element.value = fiscalYear[index]
// 		})
// 	}
// 	yearTableSelect.selectedIndex = 4
// }

const selectingTypeOfYear = () => {
	const calendarYear = ["2022", "2023", "2024", "2025", "2026"]
	const fiscalYear = ["2022/23", "2023/24", "2024/25", "2025/26", "2026/27"]

	// Miesiące dla obu typów lat
	const monthsCalendar = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	]
	const monthsFiscal = [
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
		"January",
		"February",
		"March",
	]

	const isFiscal = fiscalYearSelect.value === "fiscal-year"
	const selectedMonths = isFiscal ? monthsFiscal : monthsCalendar

	// 1. Aktualizacja Selecta z latami
	yearTableOptions.forEach((element, index) => {
		element.textContent = isFiscal ? fiscalYear[index] : calendarYear[index]
		element.value = isFiscal ? fiscalYear[index] : calendarYear[index]
	})

	// 2. Aktualizacja Tabeli (Miesiące i Atrybuty data-month)
	const rows = document.querySelectorAll(".income-year-table tbody tr")
	rows.forEach((row, index) => {
		const monthName = selectedMonths[index]
		row.setAttribute("data-month", monthName) // Zmienia styczeń na kwiecień itp.
		row.cells[0].textContent = monthName // Zmienia napis w pierwszej kolumnie
	})

	yearTableSelect.selectedIndex = 4

	// 3. Odśwież dane po zmianie typu roku
	loadFullYearDashboard()
}

let allTenants = []
let currentEditingTenantId = null
const displayTenants = (tenantsToDisplay) => {
	const tableBody = document.querySelector("#tenants-table-body")
	if (!tableBody) return

	tableBody.innerHTML = "" // Czyścimy tabelę

	if (tenantsToDisplay.length === 0) {
		tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No tenants found...</td></tr>`
		return
	}

	tenantsToDisplay.forEach((tenant) => {
		// Tworzymy wiersz
		const row = document.createElement("tr")

		// DODAJEMY ATRIBUT ID (Kluczowe!)
		row.setAttribute("data-id", tenant._id)

		// Zaokrąglamy depozyt (formatter już to robi, ale upewniamy się, że to liczba)
		const formattedDeposit = formatter.format(tenant.deposit || 0)

		// Opcjonalnie: formatowanie daty, jeśli chcesz ją w tabeli
		const startDate = tenant.tenancyStart
			? new Date(tenant.tenancyStart).toLocaleDateString("en-GB")
			: "-"

		row.innerHTML = `
            <td>${tenant.fullName}</td>
            <td>${tenant.propertyId}</td>
			 <td>
                    <span class="status-badge ${tenant.status ? "active" : "inactive"}">
                        ${tenant.status ? "Active" : "Inactive"}
                    </span>
                </td>
				 <td>${startDate}</td>
				     <td>${tenant.payDay}${getOrdinalSuffix(tenant.payDay)}</td>
					  <td>${formatter.format(tenant.deposit)}</td>
					  <td>${tenant.phone || "-"}</td>
            <td>${tenant.email || "-"}</td>
            
          
           
            <td>
                <div class="actions">
                    <button class="btn-edit-tenant" onclick="prepareEditTenant('${tenant._id}')">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-delete-tenant" onclick="deleteTenant('${tenant._id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        `
		tableBody.appendChild(row)
	})
}
const fetchTenants = async () => {
	const user = "65f123456789012345678901" // Twoje ID użytkownika

	try {
		const response = await fetch(`/api/tenants/${user}`)

		if (!response.ok) throw new Error("Failed to fetch tenants")

		const tenants = await response.json()

		allTenants = tenants // Zapisujemy kopię do wyszukiwarki
		tenants.sort((a, b) =>
			a.fullName.localeCompare(b.fullName, "pl", { sensitivity: "base" }),
		)

		displayTenants(tenants) // Renderujemy tabelę
	} catch (err) {
		console.error("Error loading tenants:", err)
		showStatus("❌ Could not load tenants list.", "danger")
	}
}

const searchInput = document.querySelector("#search-tenant")

if (searchInput) {
	searchInput.addEventListener("input", (e) => {
		const searchText = e.target.value.toLowerCase() // Pobieramy tekst i robimy małe litery

		// Filtrujemy naszą kopię 'allTenants'
		const filtered = allTenants.filter((tenant) => {
			return tenant.fullName.toLowerCase().includes(searchText)
		})

		// Używamy Twojej nowej funkcji do wyświetlenia tylko pasujących osób
		displayTenants(filtered)
	})
}
// Pomocnicza funkcja do ładnego wyświetlania dnia (np. 1st, 2nd, 3rd)
const getOrdinalSuffix = (day) => {
	if (day > 3 && day < 21) return "th"
	switch (day % 10) {
		case 1:
			return "st"
		case 2:
			return "nd"
		case 3:
			return "rd"
		default:
			return "th"
	}
}
let tenantIdToDelete = null // Zmienna przechowująca ID

const deleteTenant = (id) => {
	tenantIdToDelete = id // Zapamiętujemy, kogo chcemy usunąć
	document.querySelector("#delete-modal").style.display = "flex"
}
// window.prepareEditTenant = prepareEditTenant;
// window.deleteTenant = deleteTenant;
// Obsługa przycisków w modalu
document.querySelector("#cancel-delete").addEventListener("click", () => {
	document.querySelector("#delete-modal").style.display = "none"
	tenantIdToDelete = null
})

document
	.querySelector("#confirm-delete")
	.addEventListener("click", async () => {
		if (!tenantIdToDelete) return

		try {
			const response = await fetch(
				`/api/tenants/${tenantIdToDelete}`,
				{
					method: "DELETE",
				},
			)

			if (response.ok) {
				showStatus("✅ Tenant deleted successfully", "success")
				fetchTenants() // Odśwież tabelę
			} else {
				throw new Error("Delete failed")
			}
		} catch (err) {
			console.error(err)
			showStatus("❌ Error deleting tenant", "danger")
		} finally {
			// Zamknij modal i wyczyść ID
			document.querySelector("#delete-modal").style.display = "none"
			tenantIdToDelete = null
		}
	})
loadFullYearDashboard()
fiscalYearSelect.addEventListener("change", selectingTypeOfYear)

yearTableSelect.addEventListener("change", loadFullYearDashboard)

loadSettingsFromDatabase()

// CRUD Tenants CD*****************************

// Elementy modalu
const tenantModal = document.querySelector("#tenant-modal")
const addTenantBtn = document.querySelector("#add-tenant-btn") // Upewnij się, że Twój przycisk "Add New Tenant" ma to ID
const closeTenantModalBtn = document.querySelector("#close-tenant-modal")
const cancelTenantModalBtn = document.querySelector("#cancel-tenant-modal")
const tenantForm = document.querySelector("#tenant-form")

// Otwieranie modalu
// addTenantBtn.addEventListener("click", () => {
// 	tenantForm.reset() // Czyścimy formularz przed dodaniem nowego
// 	document.querySelector("#modal-title").innerText = "Add New Tenant"
// 	tenantModal.style.display = "flex"
// })
addTenantBtn.addEventListener("click", () => {
	currentEditingTenantId = null // Resetujemy ID, żeby nie edytować poprzedniego!
	tenantForm.reset()
	document.querySelector("#modal-title").innerText = "Add New Tenant"
	tenantModal.style.display = "flex"
})

// Zamykanie modalu (na krzyżyk i przycisk Cancel)
const closeModal = () => {
	tenantModal.style.display = "none"
	currentEditingTenantId = null // To jest bardzo ważne!
	tenantForm.reset()
}

closeTenantModalBtn.addEventListener("click", closeModal)
cancelTenantModalBtn.addEventListener("click", closeModal)

// Zamykanie po kliknięciu poza okno modalu
window.addEventListener("click", (e) => {
	if (e.target === tenantModal) closeModal()
})
tenantForm.addEventListener("submit", async (e) => {
	e.preventDefault()

	const user = "65f123456789012345678901"
	const formData = new FormData(tenantForm)

	const tenantData = {
		user: user,
		fullName: formData.get("fullName"),
		email: formData.get("email"),
		phone: formData.get("phone"),
		propertyId: formData.get("propertyId"),
		tenancyStart: formData.get("tenancyStart"),
		payDay: parseInt(formData.get("payDay")),
		deposit: parseFloat(formData.get("deposit")) || 0,
		status: tenantForm.querySelector('input[name="status"]').checked,
	}

	// DECYZJA: Edycja (PUT) czy Nowy (POST)?
	const isEditing = currentEditingTenantId !== null
	const url = isEditing
		? `/api/tenants/${currentEditingTenantId}`
		: "/api/tenants"
	const method = isEditing ? "PUT" : "POST"

	try {
		const response = await fetch(url, {
			method: method,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(tenantData),
		})

		if (response.ok) {
			showStatus(
				isEditing ? "✅ Tenant updated!" : "✅ Tenant added!",
				"success",
			)
			closeModal() // Zamyka i czyści currentEditingTenantId
			fetchTenants() // Odświeża tabelę
		} else {
			throw new Error("Server error")
		}
	} catch (err) {
		console.error("Save error:", err)
		showStatus("❌ Failed to save tenant", "danger")
	}
})

// Edycja
const prepareEditTenant = (id) => {
	currentEditingTenantId = id

	// Szukamy najemcy w pobranej już wcześniej liście
	const tenant = allTenants.find((t) => t._id === id)

	if (!tenant) {
		console.error("Nie znaleziono najemcy w lokalnej kopii danych")
		return
	}

	const form = document.querySelector("#tenant-form")
	form.elements["fullName"].value = tenant.fullName || ""
	form.elements["email"].value = tenant.email || ""
	form.elements["phone"].value = tenant.phone || ""
	form.elements["propertyId"].value = tenant.propertyId || ""
	form.elements["payDay"].value = tenant.payDay || ""
	form.elements["deposit"].value = tenant.deposit || 0

	if (tenant.tenancyStart) {
		form.elements["tenancyStart"].value = new Date(tenant.tenancyStart)
			.toISOString()
			.split("T")[0]
	}

	const statusCheckbox = form.querySelector('input[name="status"]')
	if (statusCheckbox) statusCheckbox.checked = tenant.status

	document.querySelector("#modal-title").innerText = "Edit Tenant Details"
	tenantModal.style.display = "flex"
}
// Rejestrujemy w window, aby onclick w tabeli działał
window.prepareEditTenant = prepareEditTenant
window.deleteTenant = deleteTenant

// Sortowanie tenants

const sortFullName = document.querySelector("#sort-full-name")
const sortName = document.querySelector(".sort-full-name")
let isAscending = true
const sortTenantsName = () => {
	if (isAscending) {
		allTenants.sort((a, b) =>
			b.fullName.localeCompare(a.fullName, "pl", { sensitivity: "base" }),
		)

		sortName.classList.replace("fa-arrow-up", "fa-arrow-down")
	} else {
		allTenants.sort((a, b) =>
			a.fullName.localeCompare(b.fullName, "pl", { sensitivity: "base" }),
		)
		sortName.classList.replace("fa-arrow-down", "fa-arrow-up")
	}
	displayTenants(allTenants)
	isAscending = !isAscending
}
sortFullName.addEventListener("click", sortTenantsName)

const tenantDeposit = document.querySelector("#tenant-deposit")
const sortDeposit = document.querySelector(".tenant-deposit")
const sortTenantDeposit = () => {
	if (isAscending) {
		allTenants.sort((a, b) => a.deposit - b.deposit)
		sortDeposit.classList.replace("fa-arrow-down", "fa-arrow-up")
	} else {
		allTenants.sort((a, b) => b.deposit - a.deposit)
		sortDeposit.classList.replace("fa-arrow-up", "fa-arrow-down")
	}
	displayTenants(allTenants)
	isAscending = !isAscending
}
tenantDeposit.addEventListener("click", sortTenantDeposit)

const sortTenancyStart = document.querySelector("#sort-tenancy-start")
const sortTenancy = document.querySelector(".sort-tenancy-start")

const sortTenancyStartFunction = () => {
	if (isAscending) {
		allTenants.sort(
			(a, b) => new Date(a.tenancyStart) - new Date(b.tenancyStart),
		)
		sortTenancy.classList.replace("fa-arrow-down", "fa-arrow-up")
	} else {
		allTenants.sort(
			(a, b) => new Date(b.tenancyStart) - new Date(a.tenancyStart),
		)
		sortTenancy.classList.replace("fa-arrow-up", "fa-arrow-down")
	}
	displayTenants(allTenants)
	isAscending = !isAscending
}
sortTenancyStart.addEventListener("click", sortTenancyStartFunction)
