// تایمر
let studyTime = 25 * 60;
let breakTime = 5 * 60;
let timer;
let isRunning = false;
let onBreak = false;

const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const finishBtn = document.getElementById("finishBtn");

function updateDisplay(time) {
  let m = Math.floor(time / 60);
  let s = time % 60;
  minutesEl.textContent = m.toString().padStart(2,"0");
  secondsEl.textContent = s.toString().padStart(2,"0");
}

function startTimer() {
  if(isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    if(onBreak){
      breakTime--;
      updateDisplay(breakTime);
      if(breakTime <= 0){
        clearInterval(timer);
        isRunning = false;
      }
    } else {
      studyTime--;
      updateDisplay(studyTime);
      if(studyTime <= 0){
        clearInterval(timer);
        isRunning = false;
      }
    }
  },1000);
}

function pauseTimer(){
  clearInterval(timer);
  isRunning = false;
}

function resetTimer(){
  clearInterval(timer);
  studyTime = 25*60;
  breakTime = 5*60;
  updateDisplay(studyTime);
  isRunning = false;
}

startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
finishBtn.addEventListener("click", resetTimer);

// مودال‌ها
const settingsBtn = document.getElementById("settingsBtn");
const timeModal = document.getElementById("timeModal");
const reportModal = document.getElementById("reportModal");
const closeTime = document.getElementById("closeTime");
const closeReport = document.getElementById("closeReport");
const saveTimeBtn = document.getElementById("saveTimeBtn");
const showReportBtn = document.getElementById("showReportBtn");

settingsBtn.onclick = () => {
  timeModal.style.display = "flex";
}

closeTime.onclick = () => { timeModal.style.display = "none"; }
closeReport.onclick = () => { reportModal.style.display = "none"; }

window.onclick = (e) => {
  if(e.target === timeModal) timeModal.style.display = "none";
  if(e.target === reportModal) reportModal.style.display = "none";
}

// ذخیره زمان مطالعه
saveTimeBtn.onclick = () => {
  let newStudy = parseInt(document.getElementById("studyTimeInput").value);
  let newBreak = parseInt(document.getElementById("breakTimeInput").value);
  if(!isNaN(newStudy) && !isNaN(newBreak)){
    studyTime = newStudy*60;
    breakTime = newBreak*60;
    updateDisplay(studyTime);
    timeModal.style.display = "none";
  }
}

// گزارش‌گیری شمسی
showReportBtn.onclick = () => {
  let start = document.getElementById("startDate").value;
  let end = document.getElementById("endDate").value;
  if(!start || !end) return;
  let startJ = moment(start).format('jYYYY/jMM/jDD');
  let endJ = moment(end).format('jYYYY/jMM/jDD');
  document.getElementById("reportResult").innerHTML = `📊 از ${startJ} تا ${endJ} مطالعه شما: ۰ دقیقه ⏱`;
  reportModal.style.display = "flex";
}

// نمایش اولیه
updateDisplay(studyTime);
