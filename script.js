// تحديد العناصر البرمجية لشريط التحميل والنسبة المئوية
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const statusText = document.getElementById('statusText');

let progress = 0;

// تشغيل عدّاد التحميل التلقائي بشكل عشوائي واقعي وفخم
const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 4) + 2; 
    
    if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        statusText.innerText = "اكتمل التحميل بنجاح";
        statusText.style.color = "var(--secondary-neon)";
    }
    
    progressBar.style.width = progress + '%';
    progressPercent.innerText = progress + '%';
}, 120);

// تفعيل ميزة التبديل بين الوضعين الداكن والفاتح بسلاسة عند الضغط على الزر
const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        themeBtn.innerText = 'الوضع الفاتح';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeBtn.innerText = 'الوضع الداكن';
    }
});

