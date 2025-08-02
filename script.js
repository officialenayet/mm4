// Configuration
const CONFIG = {
    API_KEY: 'AIzaSyCiEgyS_hZLOPYfntM2b5imvAx9iIWBSHY',
    SHEET_ID: '1ia2pkU2Zx0IKF4XI4Os_pVZfdlFqb815IwkDmc9IBpc',
    SHEET_NAME: 'Sheet1'
};

// DOM Elements
const admitNumberInput = document.getElementById('admitNumber');
const loadingSection = document.getElementById('loadingSection');
const resultSection = document.getElementById('resultSection');
const errorSection = document.getElementById('errorSection');
const resultCard = document.getElementById('resultCard');

// Global variable to store current result
let currentResult = null;

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add enter key support for search input
    admitNumberInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchResult();
        }
    });
    
    // Add input validation
    admitNumberInput.addEventListener('input', function(e) {
        // Remove any non-alphanumeric characters
        e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
    });
});

// Main search function
async function searchResult() {
    const admitNumber = admitNumberInput.value.trim();
    
    // Validation
    if (!admitNumber) {
        showError('দয়া করে একটি এ্যাডমিট নাম্বার লিখুন।');
        return;
    }
    
    if (admitNumber.length < 3) {
        showError('এ্যাডমিট নাম্বার কমপক্ষে ৩ অক্ষরের হতে হবে।');
        return;
    }
    
    // Show loading
    showLoading();
    
    try {
        const result = await fetchStudentData(admitNumber);
        if (result) {
            showResult(result);
        } else {
            showError();
        }
    } catch (error) {
        console.error('Error searching result:', error);
        showError('ডেটা লোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
    }
}

// Fetch data from Google Sheets
async function fetchStudentData(admitNumber) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${CONFIG.SHEET_NAME}!A1:G?key=${CONFIG.API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.values || data.values.length < 2) {
            throw new Error('No data found in sheet');
        }
        
        const headers = data.values[0];
        const rows = data.values.slice(1);
        
        // Search for the admit number
        for (const row of rows) {
            if (row[0] && row[0].toString().toLowerCase() === admitNumber.toLowerCase()) {
                return {
                    admitNumber: row[0] || 'N/A',
                    studentName: row[1] || 'N/A',
                    fatherName: row[2] || 'N/A',
                    motherName: row[3] || 'N/A',
                    institution: row[4] || 'N/A',
                    course: row[5] || 'N/A',
                    result: row[6] || 'N/A'
                };
            }
        }
        
        return null; // Not found
        
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Show loading state
function showLoading() {
    hideAllSections();
    loadingSection.style.display = 'block';
    loadingSection.classList.add('fade-in');
}

// Show result
function showResult(result) {
    currentResult = result;
    hideAllSections();
    
    // Create result HTML
    const resultHTML = `
        <div class="result-item">
            <div class="result-label">
                <i class="fas fa-id-card"></i>
                এ্যাডমিট নাম্বার
            </div>
            <div class="result-value">${result.admitNumber}</div>
        </div>
        <div class="result-item">
            <div class="result-label">
                <i class="fas fa-user"></i>
                পরীক্ষার্থীর নাম
            </div>
            <div class="result-value">${result.studentName}</div>
        </div>
        <div class="result-item">
            <div class="result-label">
                <i class="fas fa-male"></i>
                বাবার নাম
            </div>
            <div class="result-value">${result.fatherName}</div>
        </div>
        <div class="result-item">
            <div class="result-label">
                <i class="fas fa-female"></i>
                মায়ের নাম
            </div>
            <div class="result-value">${result.motherName}</div>
        </div>
        <div class="result-item">
            <div class="result-label">
                <i class="fas fa-university"></i>
                প্রতিষ্ঠান
            </div>
            <div class="result-value">${result.institution}</div>
        </div>
        <div class="result-item">
            <div class="result-label">
                <i class="fas fa-book"></i>
                কোর্স
            </div>
            <div class="result-value">${result.course}</div>
        </div>
        <div class="result-item">
            <div class="result-label">
                <i class="fas fa-trophy"></i>
                রেজাল্ট
            </div>
            <div class="result-value" style="font-weight: 700; color: #4CAF50;">${result.result}</div>
        </div>
    `;
    
    resultCard.innerHTML = resultHTML;
    resultSection.style.display = 'block';
    resultSection.classList.add('slide-up');
}

// Show error
function showError(message = null) {
    hideAllSections();
    
    if (message) {
        const errorContainer = errorSection.querySelector('.error-container');
        const errorMessage = errorContainer.querySelector('p');
        errorMessage.textContent = message;
    }
    
    errorSection.style.display = 'block';
    errorSection.classList.add('fade-in');
}

// Hide all sections
function hideAllSections() {
    loadingSection.style.display = 'none';
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
    
    // Remove animation classes
    loadingSection.classList.remove('fade-in');
    resultSection.classList.remove('slide-up');
    errorSection.classList.remove('fade-in');
}

// Reset search
function resetSearch() {
    hideAllSections();
    admitNumberInput.value = '';
    admitNumberInput.focus();
    currentResult = null;
}

// Print result
function printResult() {
    if (!currentResult) {
        alert('কোনো ফলাফল প্রিন্ট করার জন্য নেই।');
        return;
    }
    
    window.print();
}

// Download result as text file
function downloadResult() {
    if (!currentResult) {
        alert('কোনো ফলাফল ডাউনলোড করার জন্য নেই।');
        return;
    }
    
    const resultText = `
সার্টিফিকেট ভেরিফিকেশন রিপোর্ট
=====================================

এ্যাডমিট নাম্বার: ${currentResult.admitNumber}
পরীক্ষার্থীর নাম: ${currentResult.studentName}
বাবার নাম: ${currentResult.fatherName}
মায়ের নাম: ${currentResult.motherName}
প্রতিষ্ঠান: ${currentResult.institution}
কোর্স: ${currentResult.course}
রেজাল্ট: ${currentResult.result}

ভেরিফিকেশনের তারিখ: ${new Date().toLocaleDateString('bn-BD')}
ভেরিফিকেশনের সময়: ${new Date().toLocaleTimeString('bn-BD')}

=====================================
সার্টিফিকেট ভেরিফায়ার সিস্টেম
    `;
    
    const blob = new Blob([resultText], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate_verification_${currentResult.admitNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Utility function to show temporary messages
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#f44336' : '#4CAF50'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// Add CSS for message animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

