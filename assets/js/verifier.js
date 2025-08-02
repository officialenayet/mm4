document.getElementById('verificationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const admitCard = document.getElementById('admitCard').value.trim();
    const resultContainer = document.getElementById('resultContainer');
    
    // গুগল শিট থেকে ডেটা ফেচ করা
    fetch(`https://docs.google.com/spreadsheets/d/1ia2pkU2Zx0IKF4XI4Os_pVZfdlFqb815IwkDmc9IBpc/gviz/tq?tqx=out:json`)
        .then(response => response.text())
        .then(data => {
            const jsonData = JSON.parse(data.substr(47).slice(0, -2));
            const rows = jsonData.table.rows;
            
            let found = false;
            for (let i = 0; i < rows.length; i++) {
                const cols = rows[i].c;
                if (cols && cols[0] && cols[0].v === admitCard) {
                    found = true;
                    displayResult(cols);
                    break;
                }
            }
            
            if (!found) {
                resultContainer.innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>কোনো তথ্য পাওয়া যায়নি!</p>
                    </div>
                `;
                resultContainer.classList.remove('hidden');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultContainer.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>ডেটা লোড করতে সমস্যা হচ্ছে</p>
                </div>
            `;
            resultContainer.classList.remove('hidden');
        });
});

function displayResult(cols) {
    const resultContainer = document.getElementById('resultContainer');
    const grade = cols[5].v;
    let gradeClass = '';
    
    // গ্রেড অনুযায়ী ক্লাস নির্ধারণ
    if (grade === 'A') gradeClass = 'grade-a';
    else if (grade === 'B') gradeClass = 'grade-b';
    else if (grade === 'A-') gradeClass = 'grade-a-minus';
    else if (grade === 'B-') gradeClass = 'grade-b-minus';
    
    resultContainer.innerHTML = `
        <div class="result-card">
            <div class="result-header">
                <h3><i class="fas fa-award"></i> সার্টিফিকেট বিবরণ</h3>
                <span class="result-grade ${gradeClass}">${grade}</span>
            </div>
            <div class="result-details">
                <div class="detail-item">
                    <span class="label">এ্যাডমিট নাম্বার:</span>
                    <span class="value">${cols[0].v}</span>
                </div>
                <div class="detail-item">
                    <span class="label">নাম:</span>
                    <span class="value">${cols[1].v}</span>
                </div>
                <div class="detail-item">
                    <span class="label">বাবার নাম:</span>
                    <span class="value">${cols[2].v}</span>
                </div>
                <div class="detail-item">
                    <span class="label">মায়ের নাম:</span>
                    <span class="value">${cols[3].v}</span>
                </div>
                <div class="detail-item">
                    <span class="label">কোর্স নাম:</span>
                    <span class="value">${cols[4].v}</span>
                </div>
                <div class="detail-item">
                    <span class="label">কেন্দ্র:</span>
                    <span class="value">ডাঃ মোস্তফা মেডিকেল ইনস্টিটিউট</span>
                </div>
            </div>
            <div class="result-footer">
                <p><i class="fas fa-check-circle"></i> সার্টিফিকেট সঠিক</p>
            </div>
        </div>
    `;
    resultContainer.classList.remove('hidden');
}
