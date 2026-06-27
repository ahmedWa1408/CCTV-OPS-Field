document.addEventListener('DOMContentLoaded', () => {
    const displayNum = document.getElementById('displayPlanNumber');
    const displayRoute = document.getElementById('displayRouteName');
    const themeCheckbox = document.getElementById('themeToggleCheckbox');
    
    const btnStart = document.getElementById('btnStartMission');
    const btnRecords = document.getElementById('btnViewRecords');
    const btnReturn = document.getElementById('btnReturnBack');

    // 1. قاعدة البيانات الذكية للمسارات الستة الخاصة بك
    const routesDatabase = {
        "01": "عنيزة والمذنب",
        "02": "حائل",
        "03": "أم سدة",
        "04": "البكيرية والبدائع",
        "05": "قبة",
        "06": "شري والبطين"
    };

    // 2. استدعاء الرقم المختار تلقائياً
    const selectedPlan = localStorage.getItem('selectedPlanNumber') || "01";
    displayNum.innerText = selectedPlan;

    // التحقق وعرض اسم المسار المطابق بدقة
    if (routesDatabase[selectedPlan]) {
        displayRoute.innerText = `مسار ${routesDatabase[selectedPlan]}`;
    } else {
        displayRoute.innerText = "خطة غير معرفة بقاعدة البيانات";
        displayRoute.style.color = "#ef4444";
    }

    // 3. مزامنة تفضيلات المظهر (داكن / فاتح)
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

    // 4. تفعيل وظائف الأزرار الثلاثة التفاعلية للمسار
    btnStart.addEventListener('click', () => {
        alert(`جاري تهيئة النظام لبدء المهمة الميدانية الخاصة بـ: مسار ${routesDatabase[selectedPlan] || selectedPlan}`);
    });

    btnRecords.addEventListener('click', () => {
        alert(`جاري استدعاء سجلات المهمات والتقارير السابقة لـ: مسار ${routesDatabase[selectedPlan] || selectedPlan}`);
    });

    // زر الرجوع الفوري لصفحة إدخال الأرقام لتغيير الرقم
    btnReturn.addEventListener('click', () => {
        window.location.href = "/tahakom/login.html";
    });
});
