// تحديد عناصر واجهة المستخدم والتحميل
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');
const statusText = document.getElementById('statusText');
const flashOverlay = document.getElementById('flashOverlay');

let progress = 0;

// تشغيل العداد التلقائي لثوانٍ معدودة
const interval = setInterval(() => {
    // زيادة عشوائية تصاعدية ذكية تعطي انطباعاً حقيقياً بالتحميل
    progress += Math.floor(Math.random() * 4) + 2; 
    
    if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        statusText.innerText = "اكتمل التحميل بنجاح";
        statusText.style.color = "var(--secondary-neon)";
        
        // تفعيل حركة الوميض الفخم والانتقال السينمائي
        setTimeout(() => {
            // تفعيل طبقة الوميض الأبيض المضيء
            flashOverlay.classList.add('active');
            
            // التوجيه التلقائي للمستودع الجديد بعد نصف ثانية من الوميض
            setTimeout(() => {
                window.location.href = "/tahakom/login.html"; 
            }, 400);
            
        }, 500); // الانتظار لنصف ثانية بعد اكتمال الـ 100% قبل إطلاق الوميض
    }
    
    progressBar.style.width = progress + '%';
    progressPercent.innerText = progress + '%';
}, 100); // سرعة عد مناسبة لتجربة مستخدم مريحة وفخمة

// تفعيل ميزة تبديل الألوان (الداكن / الفاتح) بسلاسة
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
