/* ============================================
   RunWith Calendar — calendar.js
   달력 렌더링 & 날짜 상세 바텀시트 (v4.1)
   코치 피드백 포함
   ============================================ */

const RunWithCalendar = (() => {

  let calYear  = 2026;
  let calMonth = 2; // 0-indexed (2 = March)

  // 러닝 완료 / 예정 날짜 데이터 (시뮬레이션)
  const runDays  = [3, 5, 8, 10, 12, 15, 17, 19, 22, 24];
  const planDays = [27, 29, 31];

  // 기록 데이터 (시뮬레이션)
  const paces  = ["6'24\"", "6'30\"", "6'18\"", "6'42\"", "6'27\""];
  const dists  = [5.0, 4.8, 5.2, 5.0, 5.1];

  /* ── 달력 렌더링 ── */
  function render() {
    const label = document.getElementById('cal-label');
    if (label) label.textContent = `${calYear}.${String(calMonth + 1).padStart(2, '0')}`;

    const grid = document.getElementById('cal-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const firstDay    = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const prevDays    = new Date(calYear, calMonth, 0).getDate();
    const today       = new Date();
    const isCurMonth  = today.getFullYear() === calYear && today.getMonth() === calMonth;
    const todayDate   = today.getDate();

    // 이전달 날짜
    for (let i = 0; i < firstDay; i++) {
      const d = prevDays - firstDay + 1 + i;
      grid.innerHTML += `<div class="cc other"><span class="cn">${d}</span></div>`;
    }

    // 이번달 날짜
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = isCurMonth && d === todayDate;
      const isPast  = new Date(calYear, calMonth, d) < new Date(today.getFullYear(), today.getMonth(), todayDate);
      const isRun   = runDays.includes(d);
      const isPlan  = planDays.includes(d);

      let dot = '';
      if (isPast || isToday) {
        dot = isRun
          ? '<div class="cdot cdot-r"></div>'
          : '<div class="cdot cdot-m"></div>';
      } else if (isPlan) {
        dot = '<div class="cdot cdot-p"></div>';
      }

      grid.innerHTML += `
        <div class="cc${isToday ? ' today' : ''}"
             onclick="RunWithCalendar.openDay(${d}, ${isPast || isToday}, ${isRun}, ${isPlan})">
          <span class="cn">${d}</span>${dot}
        </div>`;
    }

    // 다음달 날짜 (6행 채우기)
    const remaining = 42 - firstDay - daysInMonth;
    for (let d = 1; d <= remaining && remaining < 7; d++) {
      grid.innerHTML += `<div class="cc other"><span class="cn">${d}</span></div>`;
    }
  }

  /* ── 월 이동 ── */
  function changeMonth(dir) {
    calMonth += dir;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    else if (calMonth < 0) { calMonth = 11; calYear--; }
    render();
  }

  /* ── 날짜 상세 바텀시트 (v4.1: 코치 피드백 포함) ── */
  function openDay(d, isPast, isRun, isPlan) {
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const wd = weekdays[new Date(calYear, calMonth, d).getDay()];

    const dateEl = document.getElementById('dm-date');
    if (dateEl) dateEl.textContent = `${calMonth + 1}월 ${d}일 (${wd})`;

    const tagEl  = document.getElementById('dm-tag');
    const gridEl = document.getElementById('dm-grid');
    const coachEl = document.getElementById('dm-coach');

    if (isPast && isRun) {
      if (tagEl) { tagEl.textContent = '과거 기록'; tagEl.className = 'dm-tag dm-past'; }
      const i = d % 5;
      if (gridEl) {
        gridEl.innerHTML = `
          <div class="dm-cell"><div class="dcl">거리</div><div class="dcv">${dists[i]} km</div></div>
          <div class="dm-cell"><div class="dcl">시간</div><div class="dcv">${28 + i * 2}분</div></div>
          <div class="dm-cell"><div class="dcl">Pace</div><div class="dcv">${paces[i]}</div></div>
          <div class="dm-cell"><div class="dcl">그룹 순위</div><div class="dcv">#${8 + i}위</div></div>`;
      }
      // v4.1: 코치 피드백
      if (coachEl) {
        coachEl.style.display = 'block';
        const feedbackEl = document.getElementById('dm-coach-text');
        if (feedbackEl) feedbackEl.textContent = CoachingSystem.getCalendarFeedback(i);
      }

    } else if (isPast && !isRun) {
      if (tagEl) { tagEl.textContent = '미달성'; tagEl.className = 'dm-tag dm-miss'; }
      if (gridEl) {
        gridEl.innerHTML = `
          <div class="dm-cell" style="grid-column:span 2">
            <div class="dcl">메모</div>
            <div class="dcv" style="font-size:13px;color:#64748B">이날은 러닝을 건너뛰었어요</div>
          </div>`;
      }
      if (coachEl) coachEl.style.display = 'none';

    } else {
      if (tagEl) { tagEl.textContent = '예정된 러닝'; tagEl.className = 'dm-tag dm-future'; }
      if (gridEl) {
        gridEl.innerHTML = `
          <div class="dm-cell"><div class="dcl">목표 거리</div><div class="dcv">5.0 km</div></div>
          <div class="dm-cell"><div class="dcl">세션 타입</div><div class="dcv">그룹 레이스</div></div>
          <div class="dm-cell"><div class="dcl">목표 Pace</div><div class="dcv">6'30"</div></div>
          <div class="dm-cell"><div class="dcl">참가 예정</div><div class="dcv">~124명</div></div>`;
      }
      if (coachEl) coachEl.style.display = 'none';
    }

    const modalBg = document.getElementById('dmod-bg');
    if (modalBg) modalBg.classList.add('open');
  }

  /* ── 바텀시트 닫기 ── */
  function closeDay(event) {
    const bg = document.getElementById('dmod-bg');
    if (!event || event.target === bg) {
      if (bg) bg.classList.remove('open');
    }
  }

  /* ── 초기화 ── */
  function init() {
    render();
  }

  return { init, render, changeMonth, openDay, closeDay };

})();

// 전역 노출
window.RunWithCalendar = RunWithCalendar;
window.changeMonth = RunWithCalendar.changeMonth.bind(RunWithCalendar);
