// app.js

// --- Globaler Zustand und Konstanten ---

let transactions = [];
let nextTransactionId = 1;
let currentBudget = { monthly: 0.00, yearly: 0.00, includeIncome: false };
let autoSaveTimeout = null;
let currentUsername = null;
const AUTO_SAVE_DELAY = 1000; // 1 Sekunde Verzögerung für Auto-Save in der Web-Demo
const USER_STORAGE_PREFIX = 'FTracker_';
const CURRENT_USER_KEY = 'FTracker_CurrentUser';

// UI Elemente
const statusMessageEl = document.getElementById('statusMessage');
const balanceEl = document.getElementById('currentBalance');
const transactionsListEl = document.getElementById('transactionsList');
const transactionForm = document.getElementById('transactionForm');
const errorMessageEl = document.getElementById('errorMessage');
const noTransactionsMessageEl = document.getElementById('noTransactionsMessage');
const authContainer = document.getElementById('authContainer');
const authForm = document.getElementById('authForm');
const authMessage = document.getElementById('authMessage');
const mainContent = document.getElementById('mainContent');
const logoutContainer = document.getElementById('logoutContainer');
const logoutButton = document.getElementById('logoutButton');
const monthlyBudgetDisplay = document.getElementById('monthlyBudgetDisplay');
const remainingBudgetDisplay = document.getElementById('remainingBudgetDisplay');
const remainingBudgetCard = document.getElementById('remainingBudgetCard');
const monthlyBudgetInput = document.getElementById('monthlyBudgetInput');
const yearlyBudgetInput = document.getElementById('yearlyBudgetInput');
const budgetForm = document.getElementById('budgetForm');
const includeIncomeCheckbox = document.getElementById('includeIncomeCheckbox');
const saveButton = document.getElementById('saveButton');
const exportButton = document.getElementById('exportButton');


// --- Speicherung (Simuliert Backend mit localStorage) ---

/**
 * Speichert alle aktuellen Daten (Transaktionen & Budget) im Browser (localStorage).
 */
const saveDataToLocalStorage = () => {
    if (!currentUsername) return; 

    const dataToSave = {
        app_version: '1.2',
        timestamp: Date.now(),
        transactions: transactions,
        budget: currentBudget
    };
    
    // Speichere die Daten unter dem Usernamen-Schlüssel
    localStorage.setItem(USER_STORAGE_PREFIX + currentUsername, JSON.stringify(dataToSave));
    
    statusMessageEl.textContent = 'Daten automatisch im Browser gespeichert.';
    statusMessageEl.className = 'text-center py-3 mb-4 text-sm font-medium text-blue-600';
    setTimeout(() => statusMessageEl.textContent = '', 2000);
};

/**
 * Lädt Daten aus dem Browser-Speicher für den aktuellen Benutzer.
 * @returns {Object} Geladene Daten oder leeres Standard-Objekt.
 */
const loadDataFromLocalStorage = (username) => {
    const dataString = localStorage.getItem(USER_STORAGE_PREFIX + username);
    if (dataString) {
        return JSON.parse(dataString);
    }
    // Standard-Startdaten für neuen Benutzer
    return {
        transactions: [],
        budget: currentBudget
    };
};

/**
 * Ruft den Auto-Save nach einer kurzen Verzögerung auf.
 */
const triggerAutoSave = () => {
    if (!currentUsername) return; 

    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        saveDataToLocalStorage();
    }, AUTO_SAVE_DELAY);
};


// --- Hilfsfunktionen (Unverändert von Electron) ---

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
};

const calculateTotalBalance = () => {
    return transactions.reduce((sum, t) => {
        const amount = parseFloat(t.amount);
        return t.type === 'income' ? sum + amount : sum - amount;
    }, 0);
};

// --- Daten-Rendering und Saldo-Berechnung (Unverändert von Electron) ---

const renderBudget = () => {
    monthlyBudgetDisplay.textContent = formatCurrency(currentBudget.monthly);

    let expensesThisMonth = 0;
    let incomeThisMonth = 0;
    const currentMonth = new Date().toISOString().substring(0, 7); // YYYY-MM

    transactions.filter(t => t.date.startsWith(currentMonth)).forEach(t => {
        const amount = parseFloat(t.amount);
        if (t.type === 'expense') {
            expensesThisMonth += amount;
        } else if (t.type === 'income') {
            incomeThisMonth += amount;
        }
    });

    let remainingBudget;

    if (currentBudget.includeIncome) {
        remainingBudget = currentBudget.monthly - expensesThisMonth + incomeThisMonth;
    } else {
        remainingBudget = currentBudget.monthly - expensesThisMonth;
    }

    remainingBudgetDisplay.textContent = formatCurrency(remainingBudget);
    
    // Visuelle Anzeige (Farbe der Karte)
    remainingBudgetCard.classList.remove('bg-yellow-500', 'bg-green-600', 'bg-red-600');
    if (remainingBudget < 0) {
        remainingBudgetCard.classList.add('bg-red-600');
    } else if (remainingBudget < currentBudget.monthly * 0.2) {
        remainingBudgetCard.classList.add('bg-yellow-500');
    } else {
        remainingBudgetCard.classList.add('bg-green-600');
    }
};

const renderTransactions = () => {
    transactionsListEl.innerHTML = '';
    
    const totalBalance = calculateTotalBalance();
    balanceEl.textContent = formatCurrency(totalBalance);
    
    if (transactions.length === 0) {
        noTransactionsMessageEl.classList.remove('hidden');
        exportButton.disabled = true;
    } else {
        noTransactionsMessageEl.classList.add('hidden');
        exportButton.disabled = false;
    }

    // Sortiere Transaktionen nach Datum (neueste zuerst)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    transactions.forEach(t => {
        const amount = parseFloat(t.amount);
        const isExpense = t.type === 'expense';
        const sign = isExpense ? '-' : '+';
        const color = isExpense ? 'text-red-600' : 'text-green-600';
        const bgColor = isExpense ? 'bg-red-50' : 'bg-green-50';

        const transactionItem = document.createElement('div');
        transactionItem.className = `p-3 rounded-lg flex justify-between items-center transition duration-150 ease-in-out ${bgColor} border-l-4 ${isExpense ? 'border-red-400' : 'border-green-400'}`;
        transactionItem.innerHTML = `
            <div class="flex-grow">
                <p class="font-medium text-gray-800">${t.description}</p>
                <p class="text-xs text-gray-500">${t.date}</p>
            </div>
            <div class="text-right">
                <p class="font-bold text-lg ${color}">${sign} ${formatCurrency(amount)}</p>
                <button data-id="${t.id}" class="delete-btn text-xs text-gray-400 hover:text-red-500 ml-4">Löschen</button>
            </div>
        `;
        transactionsListEl.appendChild(transactionItem);
    });

    renderBudget(); 
};

/**
 * Lädt die Transaktionsdaten in den globalen Zustand und aktualisiert die UI.
 * @param {Object} data - Geladene Daten.
 */
const loadData = (data) => {
    transactions = data.transactions || [];
    
    currentBudget = { 
        monthly: parseFloat(data.budget?.monthly || 0.00), 
        yearly: parseFloat(data.budget?.yearly || 0.00),
        includeIncome: data.budget?.includeIncome === true 
    };

    if (transactions.length > 0) {
        nextTransactionId = Math.max(...transactions.map(t => t.id)) + 1;
    } else {
        nextTransactionId = 1;
    }
    
    monthlyBudgetInput.value = currentBudget.monthly.toFixed(2);
    yearlyBudgetInput.value = currentBudget.yearly.toFixed(2);
    includeIncomeCheckbox.checked = currentBudget.includeIncome;

    renderTransactions();
    saveButton.disabled = false;
};

// --- Event-Handler (Logik unverändert, nur IPC-Aufrufe entfernt) ---

const handleBudgetSave = (e) => {
    e.preventDefault();
    const monthly = parseFloat(monthlyBudgetInput.value) || 0;
    let yearly = parseFloat(yearlyBudgetInput.value) || 0;
    const includeIncome = includeIncomeCheckbox.checked;

    if (yearly === 0 && monthly > 0) {
        yearly = monthly * 12;
        yearlyBudgetInput.value = yearly.toFixed(2);
    }

    currentBudget = { monthly, yearly, includeIncome };
    renderBudget();
    triggerAutoSave();
    
    statusMessageEl.textContent = 'Budget-Einstellungen gespeichert.';
    statusMessageEl.className = 'text-center py-3 mb-4 text-sm font-medium text-green-600';
    setTimeout(() => statusMessageEl.textContent = '', 3000);
};

const handleTransactionSubmit = (e) => {
    e.preventDefault();
    errorMessageEl.classList.add('hidden');
    errorMessageEl.textContent = '';

    const description = document.getElementById('description').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;

    if (!description || isNaN(amount) || amount <= 0 || !date) {
        errorMessageEl.textContent = 'Bitte alle Felder korrekt ausfüllen (Betrag muss > 0 sein).';
        errorMessageEl.classList.remove('hidden');
        return;
    }

    const newTransaction = {
        id: nextTransactionId++,
        description: description,
        amount: amount,
        date: date,
        type: type 
    };
    transactions.push(newTransaction);
    transactionForm.reset();
    document.getElementById('date').valueAsDate = new Date();

    renderTransactions();
    triggerAutoSave();
};

const handleDelete = (e) => {
    if (e.target.classList.contains('delete-btn')) {
        const idToDelete = parseInt(e.target.dataset.id, 10);
        transactions = transactions.filter(t => t.id !== idToDelete);
        renderTransactions();
        triggerAutoSave();
    }
};

const resetUI = () => {
    currentUsername = null;
    localStorage.removeItem(CURRENT_USER_KEY); // Aktuellen Benutzer aus dem Speicher entfernen
    transactions = [];
    nextTransactionId = 1;
    currentBudget = { monthly: 0.00, yearly: 0.00, includeIncome: false };
    
    mainContent.classList.add('hidden');
    logoutContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
    authForm.reset();
    authMessage.textContent = '';
    statusMessageEl.textContent = 'Bitte melden Sie sich an oder registrieren Sie sich.';
    statusMessageEl.className = 'text-center py-3 mb-4 text-sm font-medium text-gray-600';
    saveButton.disabled = true;
    exportButton.disabled = true;
};


// --- AUTH-Logik (Simuliert Registrierung/Login im Browser) ---

const handleAuthSubmit = (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (username.length < 3 || password.length < 6) {
        authMessage.textContent = 'Benutzername (min 3) und Passwort (min 6) sind erforderlich.';
        authMessage.className = 'mt-4 text-center text-sm text-red-600';
        return;
    }

    // SIMULIERE EIN SERVERSCHLÜSSEL-SPEICHERUNG (Hier: Passwort-Hash/Speicherung)
    const storedPasswordKey = USER_STORAGE_PREFIX + username + '_PASS';
    const storedDataKey = USER_STORAGE_PREFIX + username;

    let response = {};

    if (localStorage.getItem(storedPasswordKey)) {
        // LOGIN VERSUCH
        if (localStorage.getItem(storedPasswordKey) === password) { // Einfacher Vergleich für Demo
            response = { success: true, message: `Willkommen zurück, ${username}. Daten geladen.`, data: loadDataFromLocalStorage(username), username: username };
        } else {
            response = { success: false, message: 'Falsches Passwort.' };
        }
    } else {
        // REGISTRIERUNG
        localStorage.setItem(storedPasswordKey, password); // Speichere Passwort (ACHTUNG: Unsicher, nur für Demo!)
        localStorage.setItem(storedDataKey, JSON.stringify(loadDataFromLocalStorage(username))); // Leere Daten speichern
        response = { success: true, message: `Registrierung erfolgreich. Willkommen, ${username}.`, data: loadDataFromLocalStorage(username), username: username };
    }
    
    handleLoginReply(response);
};

const handleLoginReply = (response) => {
    if (response.success) {
        currentUsername = response.username;
        localStorage.setItem(CURRENT_USER_KEY, currentUsername); // Speichere den aktuellen Login-Status

        authContainer.classList.add('hidden');
        mainContent.classList.remove('hidden');
        logoutContainer.classList.remove('hidden');
        
        loadData(response.data);
        
        statusMessageEl.className = 'text-center py-3 mb-4 text-sm font-medium text-green-600';
        statusMessageEl.textContent = response.message;
        
        if (response.data.transactions.length === 0) {
            triggerAutoSave(); 
        }

    } else {
        authMessage.textContent = response.message;
        authMessage.className = 'mt-4 text-center text-sm text-red-600';
    }
};

const handleLogout = () => {
    resetUI();
    statusMessageEl.textContent = 'Erfolgreich abgemeldet. Ihre Daten wurden gesperrt.';
    statusMessageEl.className = 'text-center py-3 mb-4 text-sm font-medium text-green-600';
};


// --- Manuelles Speichern (Eigentlich Auto-Save in Web-Demo) ---

const handleManualSave = () => {
    saveButton.disabled = true;
    saveDataToLocalStorage();
    
    // Statusmeldung wird von saveDataToLocalStorage gesetzt
    saveButton.disabled = false;
};

// --- CSV Export (Reine Browser-Logik) ---

const handleExportCsv = () => {
    if (transactions.length === 0) {
        errorMessageEl.textContent = "Keine Daten zum Exportieren vorhanden.";
        errorMessageEl.classList.remove('hidden');
        return;
    }

    exportButton.disabled = true;
    statusMessageEl.textContent = 'Generiere CSV-Datei...';

    // 1. Header und Body generieren
    const headers = ["ID", "Beschreibung", "Betrag", "Datum", "Typ"];
    const csvContent = [headers.join(';')];
    
    transactions.forEach(t => {
        // Betrag im deutschen Format (z.B. 1234,56) für die Anzeige, aber mit Punkt für korrekte CSV-Interpretation, oder einfach nur Wert
        const amount = parseFloat(t.amount).toFixed(2).replace('.', ','); // Komma als Dezimaltrennzeichen
        const row = [
            t.id,
            `"${t.description.replace(/"/g, '""')}"`, // Beschreibung in Anführungszeichen (für Kommas in Beschreibung)
            amount,
            t.date,
            t.type
        ];
        csvContent.push(row.join(';'));
    });

    const csvString = csvContent.join('\n');
    
    // 2. Erzeuge Blob und lade herunter
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Finanz-Tracker-Export_${new Date().toISOString().substring(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    statusMessageEl.className = 'text-center py-3 mb-4 text-sm font-medium text-green-600';
    statusMessageEl.textContent = 'CSV-Export abgeschlossen.';
    
    exportButton.disabled = false;
    setTimeout(() => statusMessageEl.textContent = '', 3000);
};


// --- Initialisierung ---

window.onload = () => {
    document.getElementById('date').valueAsDate = new Date();

    transactionForm.addEventListener('submit', handleTransactionSubmit);
    transactionsListEl.addEventListener('click', handleDelete);
    
    authForm.addEventListener('submit', handleAuthSubmit);
    logoutButton.addEventListener('click', handleLogout);
    budgetForm.addEventListener('submit', handleBudgetSave);
    
    // Trigger Auto-Save für Budget-Änderungen
    monthlyBudgetInput.addEventListener('input', triggerAutoSave);
    yearlyBudgetInput.addEventListener('input', triggerAutoSave);
    
    includeIncomeCheckbox.addEventListener('change', () => {
        currentBudget.includeIncome = includeIncomeCheckbox.checked;
        renderBudget();
        triggerAutoSave();
    });
    
    // Manuelles Speichern (führt nur das Auto-Save aus)
    saveButton.addEventListener('click', handleManualSave);
    
    // Export-Button
    exportButton.addEventListener('click', handleExportCsv);

    // Prüfe, ob ein Benutzer bereits eingeloggt war (Session-Wiederherstellung)
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
        const data = loadDataFromLocalStorage(storedUser);
        handleLoginReply({
            success: true, 
            message: `Sitzung wiederhergestellt. Willkommen zurück, ${storedUser}.`, 
            data: data, 
            username: storedUser
        });
    } else {
        resetUI(); // Setze UI auf Anmelde-Modus
    }
};