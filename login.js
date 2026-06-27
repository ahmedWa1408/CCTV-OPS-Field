document.addEventListener('DOMContentLoaded', () => {
    const planInput = document.getElementById('planNumberInput');
    const btnSubmit = document.getElementById('btnSubmitPlan');
    const btnBack = document.getElementById('btnGoBack');
    const themeCheckbox = document.getElementById('themeToggleCheckbox');

    // 1. إدارة تفضيلات المظهر (داكن / فاتح) والمزامنة مع شاشة الافتتاحية
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeCheckbox.checked = false; // الوضع الفاتح غير محدد بالصورة
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeCheckbox.checked = true; // الوضع الداكن محدد تلقائياً
    }

    // تبديل المظهر وحفظ خيار المستخدم
    themeCheckbox.addEventListener('change', () => {
        if (themeCheckbox.checked) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('app-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('app-theme', 'light');
        }
    });

    // 2. التحكم في حقل الإدخال ليقبل رقمين فقط وبصيغة أرقام صحيحة
    planInput.addEventListener('input', (e) => {
        // حذف أي رموز أو حروف غير رقمية فوراً
        let value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value;
    });

    // 3. زر المتابعة والانتقال الذكي (هنا سنربط الـ 6 خطط لاحقاً)
    btnSubmit.addEventListener('click', () => {
        const planNumber = planInput.value.trim();
        
        if (planNumber === "") {
            alert("يرجى إدخال رقم الخطة أولاً!");
            planInput.focus();
            return;
        }

        // تحويل الرقم لصيغة خانتين (مثال: إذا كتب 1 تتحول تلقائياً إلى 01 لتطابق المظهر الفخم)
        const formattedNumber = planNumber.padStart(2, '0');
        
        // حفظ الرقم المختار مؤقتاً لنعرضه في الصفحة القادمة باسم الخطة
        localStorage.setItem('selectedPlanNumber', formattedNumber);

        // تأثير تشتيت بسيط أو انتقال سلس قبل الانتقال لصفحة عرض الخطة
        btnSubmit.style.transform = "scale(0.98)";
        setTimeout(() => {
            alert(`سيتم فتح الصفحة الخاصة بـ (الخطة رقم ${formattedNumber}) مجرد تزويدي بتفاصيلها!`);
            // هنا سيكون أمر الانتقال الفعلي لاحقاً:
            // window.location.href = "plan-details.html";
        }, 150);
    });

    // 4. زر الرجوع للشاشة الافتتاحية السابقة
    btnBack.addEventListener('click', () => {
        window.location.href = "index.html";
    });
});
