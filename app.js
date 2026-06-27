/*======================================================
 CCTV FIELD OPERATIONS SYSTEM
 النسخة النهائية
======================================================*/

"use strict";

/*=========================================
 عناصر الصفحات
=========================================*/

const loadingScreen=document.getElementById("loadingScreen");

const homePage=document.getElementById("homePage");

const routePage=document.getElementById("routePage");

const operatorPage=document.getElementById("operatorPage");

const missionPage=document.getElementById("missionPage");

const logsPage=document.getElementById("logsPage");

const adminPage=document.getElementById("adminPage");


/*=========================================
 عناصر الإدخال
=========================================*/

const planNumber=document.getElementById("planNumber");

const routeName=document.getElementById("routeName");

const employeeID=document.getElementById("employeeID");

const employeeName=document.getElementById("employeeName");

const tableBody=document.getElementById("tableBody");


/*=========================================
 الأزرار
=========================================*/

const nextPlan=document.getElementById("nextPlan");

const startMission=document.getElementById("startMission");

const goMission=document.getElementById("goMission");

const finishMission=document.getElementById("finishMission");

const routeLogs=document.getElementById("routeLogs");

const adminMenu=document.getElementById("adminMenu");


/*=========================================
 الوقت
=========================================*/

const liveTime=document.getElementById("liveTime");

const liveDay=document.getElementById("liveDay");

const liveDate=document.getElementById("liveDate");

const hijriDate=document.getElementById("hijriDate");


/*=========================================
 GPS
=========================================*/

let currentLatitude=null;

let currentLongitude=null;

let currentAccuracy=null;

let currentSpeed=0;


/*=========================================
 المهمة الحالية
=========================================*/

let currentPlan=null;

let currentRoute=null;

let currentEmployee=null;

let currentSites=[];


/*=========================================
 قواعد البيانات
=========================================*/

let employees=[];

let users=[];

let plans={};

let announcements=[];

let reports=[];

let missionLogs=[];

let faults=[];

let referenceNumbers=[];

let settings={};


/*=========================================
 إعدادات النظام
=========================================*/

const SITE_ACCESS_RADIUS=3000;

const COMPANY_ACCESS_RADIUS=2000;

const MAX_STOP_MINUTES=180;

const DEFAULT_THEME="dark";/*=========================================
 الخطط الأساسية
=========================================*/

plans={

1:{
number:1,
name:"عنيزة والمذنب",
sites:[]
},

2:{
number:2,
name:"حائل",
sites:[]
},

3:{
number:3,
name:"أم سدرة",
sites:[]
},

4:{
number:4,
name:"البدايع",
sites:[]
},

5:{
number:5,
name:"قبة",
sites:[]
},

6:{
number:6,
name:"شري",
sites:[]
}

};


/*=========================================
 حالة النظام
=========================================*/

let missionStarted=false;

let missionFinished=false;

let currentSupervisor=null;

let currentReference=null;

let currentViolations=[];


/*=========================================
 تحميل النظام
=========================================*/

window.addEventListener("load",()=>{

loadTheme();

updateClock();

setInterval(updateClock,1000);

showHomePage();

});


/*=========================================
 إظهار الصفحة الرئيسية
=========================================*/

function showHomePage(){

loadingScreen.classList.add("fadeOut");

setTimeout(()=>{

loadingScreen.style.display="none";

homePage.classList.remove("hidden");

homePage.classList.add("fadeIn");

},700);

}


/*=========================================
 اختيار الخطة
=========================================*/

nextPlan.onclick=()=>{

const number=parseInt(planNumber.value);

if(!plans[number]){

alert("رقم الخطة غير موجود");

return;

}

currentPlan=number;

currentRoute=plans[number];

currentSites=currentRoute.sites;

routeName.textContent=currentRoute.name;

homePage.classList.add("hidden");

routePage.classList.remove("hidden");

routePage.classList.add("fadeIn");

};/*=========================================
 الانتقال بين الصفحات
=========================================*/

startMission.onclick=()=>{

routePage.classList.add("hidden");

operatorPage.classList.remove("hidden");

operatorPage.classList.add("fadeIn");

};


backRoute.onclick=()=>{

operatorPage.classList.add("hidden");

routePage.classList.remove("hidden");

routePage.classList.add("fadeIn");

};


routeLogs.onclick=()=>{

routePage.classList.add("hidden");

logsPage.classList.remove("hidden");

logsPage.classList.add("fadeIn");

};


adminMenu.onclick=()=>{

routePage.classList.add("hidden");

adminPage.classList.remove("hidden");

adminPage.classList.add("fadeIn");

};


/*=========================================
 التحقق من الموظف
=========================================*/

employeeID.addEventListener("change",()=>{

const id=employeeID.value.trim();

const employee=employees.find(item=>item.id===id);

if(!employee){

employeeName.value="";

alert("رقم الموظف غير موجود.");

return;

}

currentEmployee=employee;

employeeName.value=employee.name;

});


/*=========================================
 بدء المهمة
=========================================*/

goMission.onclick=()=>{

if(currentEmployee===null){

alert("أدخل رقم الموظف أولاً.");

return;

}

operatorPage.classList.add("hidden");

missionPage.classList.remove("hidden");

missionPage.classList.add("fadeIn");

missionStarted=true;

loadMission();

startGPS();

};/*=========================================
 تحميل بيانات المهمة
=========================================*/

function loadMission(){

tableBody.innerHTML="";

if(!currentSites || currentSites.length===0){

const row=document.createElement("tr");

row.innerHTML=`

<td colspan="11" class="center">

لا توجد مواقع مرتبطة بهذه الخطة.

</td>

`;

tableBody.appendChild(row);

return;

}

currentSites.forEach(site=>{

tableBody.appendChild(

createSiteRow(site)

);

});

}


/*=========================================
 إنشاء صف الموقع
=========================================*/

function createSiteRow(site){

const tr=document.createElement("tr");

tr.dataset.code=site.code;

tr.dataset.lat=site.lat;

tr.dataset.lng=site.lng;

tr.dataset.visited="false";

tr.innerHTML=`

<td>${site.code}</td>

<td>

<button

class="locationBtn"

onclick="openLocation('${site.map}')">

📍 الموقع

</button>

</td>

<td>

<span

id="gps-${site.code}"

class="badge offline">

خارج النطاق

</span>

</td>

<td>${site.storage}</td>

<td>${site.xml?"✔":"✖"}</td>

<td>

<select class="siteStatus">

<option value="">اختر</option>

<option value="working">

يعمل

</option>

<option value="fault">

لا يعمل وتوجد مخالفات

</option>

<option value="workingNoViolation">

يعمل ولا توجد مخالفات

</option>

<option value="stopped">

لا يعمل ولا توجد مخالفات

</option>

</select>

</td>

<td>

<input

type="datetime-local"

class="startFolder"

disabled>

</td><td>

<input

type="datetime-local"

class="endFolder"

disabled>

</td>

<td>

<input

type="text"

class="folderHours"

readonly

placeholder="تحسب تلقائياً">

</td>

<td>

<input

type="file"

class="photoInput"

accept="image/*"

capture="environment"

disabled>

</td>

<td>

<textarea

class="notes"

placeholder="ملاحظات الموقع"

disabled>

</textarea>

</td>

`;

initializeSiteRow(tr,site);

return tr;

}


/*=========================================
 فتح موقع Google Maps
=========================================*/

function openLocation(url){

if(!url)return;

window.open(

url,

"_blank"

);

}/*=========================================
 تهيئة صف الموقع
=========================================*/

function initializeSiteRow(row,site){

const start=row.querySelector(".startFolder");

const end=row.querySelector(".endFolder");

const hours=row.querySelector(".folderHours");

const status=row.querySelector(".siteStatus");

const notes=row.querySelector(".notes");

const photo=row.querySelector(".photoInput");


/* عند دخول نطاق الموقع */

row.enable=function(){

start.disabled=false;

end.disabled=false;

status.disabled=false;

notes.disabled=false;

photo.disabled=false;

};


/* عند الخروج من النطاق */

row.disable=function(){

start.disabled=true;

end.disabled=true;

status.disabled=true;

notes.disabled=true;

photo.disabled=true;

};


/* بداية المجلد */

start.addEventListener("change",()=>{

calculateFolderHours(start,end,hours);

});


/* نهاية المجلد */

end.addEventListener("change",()=>{

calculateFolderHours(start,end,hours);

});


/* تغيير حالة الموقع */

status.addEventListener("change",()=>{

handleSiteStatus(

site,

status.value,

photo,

notes

);

});

}/*=========================================
 معالجة حالة الموقع
=========================================*/

function handleSiteStatus(

site,

value,

photo,

notes

){

switch(value){

case"working":

photo.required=false;

notes.placeholder="لا توجد ملاحظات";

break;

case"fault":

photo.required=true;

notes.placeholder="اكتب تفاصيل العطل...";

registerFault(

site.code,

value,

notes.value

);

break;

case"workingNoViolation":

photo.required=true;

notes.placeholder="تم السحب ولا توجد مخالفات";

break;

case"stopped":

photo.required=true;

notes.placeholder="سبب عدم العمل";

break;

}

}


/*=========================================
 حساب ساعات المجلد
=========================================*/

function calculateFolderHours(

start,

end,

output

){

if(

start.value===""||

end.value===""

)return;

const s=new Date(start.value);

const e=new Date(end.value);

const diff=e-s;

if(diff<=0){

output.value="0 ساعة";

return;

}

const totalMinutes=

Math.floor(diff/60000);

const hours=

Math.floor(totalMinutes/60);

const minutes=

totalMinutes%60;

output.value=

hours+" ساعة "+

minutes+" دقيقة";

}/*=========================================
 الوقت والتاريخ
=========================================*/

function updateClock(){

const now=new Date();

liveTime.textContent=now.toLocaleTimeString("ar-SA",{

hour:"2-digit",

minute:"2-digit",

second:"2-digit",

hour12:true

});

liveDay.textContent=now.toLocaleDateString("ar-SA",{

weekday:"long"

});

liveDate.textContent=now.toLocaleDateString("en-CA");

hijriDate.textContent=

new Intl.DateTimeFormat(

"ar-SA-u-ca-islamic",

{

day:"numeric",

month:"long",

year:"numeric"

}

).format(now);

}

setInterval(updateClock,1000);

updateClock();


/*=========================================
 الوضع الداكن والفاتح
=========================================*/

themeButtons.forEach(button=>{

button.addEventListener("click",()=>{

document.body.classList.toggle("light");

localStorage.setItem(

"theme",

document.body.classList.contains("light")

?"light"

:"dark"

);

});

});


function loadTheme(){

const theme=

localStorage.getItem("theme");

if(theme==="light"){

document.body.classList.add("light");

}

}/*=========================================
 GPS
=========================================*/

function startGPS(){

if(!navigator.geolocation){

alert("هذا الجهاز لا يدعم GPS");

return;

}

navigator.geolocation.watchPosition(

updateGPS,

gpsError,

{

enableHighAccuracy:true,

maximumAge:0,

timeout:10000

}

);

}


function updateGPS(position){

currentLatitude=position.coords.latitude;

currentLongitude=position.coords.longitude;

currentAccuracy=position.coords.accuracy;

currentSpeed=Math.round(

(position.coords.speed||0)*3.6

);

document.getElementById("vehicleSpeed").textContent=

currentSpeed;

checkSitesRange();

}


function gpsError(error){

console.log(error);

}


/*=========================================
 التحقق من المواقع
=========================================*/

function checkSitesRange(){

if(currentSites.length===0)return;

document

.querySelectorAll("#tableBody tr")

.forEach(row=>{

const code=row.dataset.code;

const site=currentSites.find(

s=>s.code===code

);

if(!site)return;

const distance=getDistance(

currentLatitude,

currentLongitude,

site.lat,

site.lng

);

const badge=row.querySelector(".badge");

if(distance<=SITE_ACCESS_RADIUS){

badge.textContent="داخل النطاق";

badge.className="badge live";

row.dataset.visited="true";

row.enable();

}else{

badge.textContent="خارج النطاق";

badge.className="badge offline";

row.disable();

}

});

}/*=========================================
 حساب المسافة بين نقطتين
=========================================*/

function getDistance(

lat1,

lon1,

lat2,

lon2

){

const R=6371000;

const dLat=(lat2-lat1)*Math.PI/180;

const dLon=(lon2-lon1)*Math.PI/180;

const a=

Math.sin(dLat/2)*Math.sin(dLat/2)+

Math.cos(lat1*Math.PI/180)*

Math.cos(lat2*Math.PI/180)*

Math.sin(dLon/2)*

Math.sin(dLon/2);

const c=

2*Math.atan2(

Math.sqrt(a),

Math.sqrt(1-a)

);

return R*c;

}


/*=========================================
 فتح الموقع على Google Maps
=========================================*/

function openLocation(url){

if(!url)return;

window.open(

url,

"_blank"

);

}


/*=========================================
 تحديث سرعة المركبة
=========================================*/

function updateVehicleSpeed(speed){

const speedBox=

document.getElementById("vehicleSpeed");

speedBox.textContent=

Math.round(speed);

if(speed>120){

speedBox.classList.add("speedDanger");

}else{

speedBox.classList.remove("speedDanger");

}

}/*=========================================
 حفظ المهمة
=========================================*/

function saveMission(){

const mission={

plan:currentPlan,

route:currentRoute.name,

employee:currentEmployee,

startTime:new Date().toISOString(),

sites:[]

};

document.querySelectorAll("#tableBody tr").forEach(row=>{

mission.sites.push({

code:row.dataset.code,

visited:row.dataset.visited==="true",

status:row.querySelector(".siteStatus").value,

startFolder:row.querySelector(".startFolder").value,

endFolder:row.querySelector(".endFolder").value,

folderHours:row.querySelector(".folderHours").value,

notes:row.querySelector(".notes").value

});

});

missionLogs.push(mission);

localStorage.setItem(

"missionLogs",

JSON.stringify(missionLogs)

);

}


/*=========================================
 إنهاء المهمة
=========================================*/

finishMission.onclick=()=>{

if(!validateMission()){

return;

}

saveMission();

alert("تم حفظ المهمة بنجاح.");

missionPage.classList.add("hidden");

homePage.classList.remove("hidden");

missionStarted=false;

currentPlan=null;

currentRoute=null;

currentSites=[];

tableBody.innerHTML="";

planNumber.value="";

};/*=========================================
 التحقق قبل إنهاء المهمة
=========================================*/

function validateMission(){

if(!currentEmployee){

alert("لم يتم اختيار الموظف.");

return false;

}

if(currentSites.length===0){

alert("لا توجد مواقع في هذه الخطة.");

return false;

}

const rows=document.querySelectorAll("#tableBody tr");

for(const row of rows){

const status=row.querySelector(".siteStatus");

const start=row.querySelector(".startFolder");

const end=row.querySelector(".endFolder");

const notes=row.querySelector(".notes");

const photo=row.querySelector(".photoInput");

if(row.dataset.visited==="true"){

if(status.value===""){

alert("يجب اختيار حالة الموقع.");

return false;

}

if(start.value===""){

alert("يجب إدخال بداية المجلد.");

return false;

}

if(end.value===""){

alert("يجب إدخال نهاية المجلد.");

return false;

}

if(status.value!=="working"){

if(photo.files.length===0){

alert("يجب إرفاق صورة لهذا الموقع.");

return false;

}

if(notes.value.trim()===""){

alert("يجب كتابة الملاحظات.");

return false;

}

}

}

}

return true;

}


/*=========================================
 تحميل السجلات المحفوظة
=========================================*/

function loadMissionLogs(){

const data=

localStorage.getItem("missionLogs");

if(!data)return;

missionLogs=JSON.parse(data);

}

loadMissionLogs();/*=========================================
 عرض سجلات المسار
=========================================*/

function loadRouteLogs(){

const container=

document.getElementById(

"routeLogsContainer"

);

if(!container)return;

container.innerHTML="";

missionLogs

.filter(log=>log.plan===currentPlan)

.forEach(log=>{

const item=document.createElement("div");

item.className="logItem";

item.innerHTML=`

<div>

<div class="logSite">

${log.route}

</div>

<div class="logDate">

${new Date(log.startTime)

.toLocaleString("ar-SA")}

</div>

</div>

<div class="logStatus statusDone">

مكتملة

</div>

`;

container.appendChild(item);

});

}


/*=========================================
 فتح صفحة السجلات
=========================================*/

routeLogs.onclick=()=>{

routePage.classList.add("hidden");

logsPage.classList.remove("hidden");

logsPage.classList.add("fadeIn");

loadRouteLogs();

};


/*=========================================
 الرجوع من السجلات
=========================================*/

document

.getElementById("backMission")

.onclick=()=>{

logsPage.classList.add("hidden");

routePage.classList.remove("hidden");

routePage.classList.add("fadeIn");

};/*=========================================
 لوحة الإدارة
=========================================*/

function openAdmin(){

routePage.classList.add("hidden");

adminPage.classList.remove("hidden");

adminPage.classList.add("fadeIn");

loadDashboard();

}

adminMenu.onclick=openAdmin;


/*=========================================
 تحميل لوحة المعلومات
=========================================*/

function loadDashboard(){

document.getElementById("todayMissions").textContent=

missionLogs.length;

document.getElementById("completedMissions").textContent=

missionLogs.filter(m=>m.sites.length>0).length;

document.getElementById("faultCount").textContent=

faults.length;

document.getElementById("violationsCount").textContent=

currentViolations.length;

loadFaults();

}


/*=========================================
 عرض الأعطال
=========================================*/

function loadFaults(){

const tbody=

document.getElementById("faultTable");

if(!tbody)return;

tbody.innerHTML="";

faults.forEach(fault=>{

const tr=document.createElement("tr");

tr.innerHTML=`

<td>${fault.site}</td>

<td>${fault.route}</td>

<td>${fault.notes}</td>

<td>${new Date(fault.date).toLocaleString("ar-SA")}</td>

<td>${fault.status}</td>

`;

tbody.appendChild(tr);

});

}/*=========================================
 إدارة الإعلانات
=========================================*/

function sendAnnouncement(

message,

priority,

targetRole,

reference

){

const announcement={

id:Date.now(),

message,

priority,

targetRole,

reference,

date:new Date().toISOString(),

readBy:[]

};

announcements.push(announcement);

localStorage.setItem(

"announcements",

JSON.stringify(announcements)

);

}


/*=========================================
 تحميل الإعلانات
=========================================*/

function loadAnnouncements(){

const data=

localStorage.getItem("announcements");

if(data){

announcements=

JSON.parse(data);

}

}


/*=========================================
 عرض إعلان للمستخدم
=========================================*/

function checkAnnouncements(){

const popup=

document.getElementById("announcementPopup");

const body=

document.getElementById("announcementBody");

const notice=

announcements.find(a=>!

a.readBy.includes(

currentEmployee?.id

));

if(!notice)return;

body.textContent=

notice.message;

popup.classList.remove("hidden");

document

.getElementById("acceptAnnouncement")

.onclick=()=>{

notice.readBy.push(

currentEmployee.id

);

localStorage.setItem(

"announcements",

JSON.stringify(

announcements

)

);

popup.classList.add("hidden");

};

}


/*=========================================
 تحميل الإعلانات عند التشغيل
=========================================*/

loadAnnouncements();/*=========================================
 المرجعيات
=========================================*/

function addReferenceNumber(name,number){

referenceNumbers.push({

id:Date.now(),

name,

number

});

localStorage.setItem(

"referenceNumbers",

JSON.stringify(referenceNumbers)

);

}


function loadReferenceNumbers(){

const data=

localStorage.getItem(

"referenceNumbers"

);

if(data){

referenceNumbers=

JSON.parse(data);

}

}


/*=========================================
 حفظ إعدادات النظام
=========================================*/

function saveSettings(){

localStorage.setItem(

"settings",

JSON.stringify(settings)

);

}


function loadSettings(){

const data=

localStorage.getItem("settings");

if(data){

settings=

JSON.parse(data);

}

}


/*=========================================
 بدء تشغيل النظام
=========================================*/

loadReferenceNumbers();

loadSettings();

loadMissionLogs();

loadAnnouncements();

console.log(

"CCTV FIELD OPERATIONS INITIALIZED"

);/*=========================================
 إنشاء بيانات الخطط
=========================================*/

/*
سيتم في الأجزاء القادمة إدراج جميع البيانات
الحقيقية التي أرسلتها، وتشمل:

- مسار 1 (عنيزة والمذنب)
- مسار 2 (حائل)
- مسار 3 (أم سدرة)
- مسار 4 (البدايع)
- مسار 5 (قبة)
- مسار 6 (شري)

وسيحتوي كل موقع على:

code
name
map
lat
lng
storage
xml

وسيتم تحميلها داخل plans[x].sites
بدلاً من البيانات الفارغة.
*/


/*=========================================
 نهاية الجزء الحالي
=========================================*/

console.log("Core System Ready");// CCTV Field Operations System
