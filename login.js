document.addEventListener('DOMContentLoaded', () => {
    const planInput = document.getElementById('planNumberInput');
    const btnSubmit = document.getElementById('btnSubmitPlan');
    const btnBack = document.getElementById('btnGoBack');
    const themeCheckbox = document.getElementById('themeToggleCheckbox');

    // 1. إدارة تفضيلات المظهر (داكن / فاتح) والمزامنة
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        themeCheckbox.checked = false;
    } else {
        document.documentElement.removeAttribute('data-theme');
        themeCheckbox.checked = true;
    }

    themeCheckbox.addEventListener('change', () => {
        if (themeCheckbox.checked) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('app-theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('app-theme', 'light');
        }
    });

    // 2. التحكم في حقل الإدخال ليقبل أرقاماً فقط
    planInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        e.target.value = value;
    });

    // 3. زر المتابعة والانتقال لصفحة تفاصيل الخطط والمسارات الستة
    btnSubmit.addEventListener('click', () => {
        const planNumber = planInput.value.trim();
        
        if (planNumber === "") {
            alert("يرجى إدخال رقم الخطة أولاً!");
            planInput.focus();
            return;
        }

        const formattedNumber = planNumber.padStart(2, '0');
        
        // حفظ الرقم المختار مؤقتاً لقراءته بالصفحة القادمة
        localStorage.setItem('selectedPlanNumber', formattedNumber);

        btnSubmit.style.transform = "scale(0.98)";
        setTimeout(() => {
            // الانتقال الفوري لصفحة عرض تفاصيل المسار المحددة
            window.location.href = "/tahakom/plan-details.html";
        }, 150);
    });

    // 4. زر الرجوع المحدث للشاشة الافتتاحية الأساسية
    btnBack.addEventListener('click', () => {
        window.location.href = "/tahakom/index.html";
    });
});
