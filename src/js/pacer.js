/* ============================================
   RunWith Pacer — pacer.js
   코치 리듬 비교 시스템 v4.1
   "속도 비교" → "리듬/구간 기반 비교"
   ============================================ */

const RunWithPacer = (() => {

  let pacerInterval = null;
  let guidePos  = 55;   // 0~88 범위 (트랙 퍼센트)
  let mePos     = 48;
  let gapSec    = -12;  // 음수: 뒤처짐, 양수: 앞섬

  /* ── 임계값 ── */
  const AHEAD_THRESHOLD  =  2;   // +2초 이상: 앞섬
  const BEHIND_THRESHOLD = -2;   // -2초 이하: 뒤처짐

  function start() {
    pacerInterval = setInterval(_tick, 1000);
  }

  function stop() {
    if (pacerInterval) {
      clearInterval(pacerInterval);
      pacerInterval = null;
    }
  }

  function _tick() {
    // 갭 변동 시뮬레이션
    const rand = Math.random();
    if (rand < 0.35) gapSec++;
    else if (rand < 0.6) gapSec--;
    gapSec = Math.max(-20, Math.min(15, gapSec));

    // 위치 이동
    guidePos = Math.min(88, guidePos + 0.3);
    const meSpeed = gapSec > 0 ? 0.35 : gapSec < -5 ? 0.2 : 0.3;
    mePos = Math.min(88, mePos + meSpeed);

    _render();
    CoachingSystem.updatePacerMessage(gapSec);
  }

  function _render() {
    // 가이드 아이콘
    const guideEl = document.getElementById('track-guide');
    if (guideEl) guideEl.style.left = guidePos + '%';

    // 내 아이콘 + 색상
    const meEl = document.getElementById('track-me');
    if (meEl) {
      meEl.style.left = mePos + '%';
      meEl.className = 'track-icon track-me ' + _meClass();
    }

    // 갭 숫자 표시 (v4.1: "리듬 차이" 레이블)
    const gapNumEl = document.getElementById('gap-num');
    const gapLblEl = document.getElementById('gap-lbl');

    if (gapNumEl) {
      const abs  = Math.abs(gapSec);
      const sign = gapSec >= 0 ? '+' : '-';
      gapNumEl.textContent = `${sign}00:${String(abs).padStart(2, '0')}`;
      gapNumEl.className   = 'gap-num ' + _gapClass();
    }

    if (gapLblEl) {
      if (gapSec > AHEAD_THRESHOLD)        gapLblEl.textContent = '목표 리듬을 앞서고 있어요';
      else if (gapSec < BEHIND_THRESHOLD)  gapLblEl.textContent = '현재 구간 목표 리듬보다 느림';
      else                                 gapLblEl.textContent = '목표 리듬과 잘 맞고 있어요';
    }
  }

  function _meClass() {
    if (gapSec > AHEAD_THRESHOLD)  return 'ahead';
    if (gapSec < BEHIND_THRESHOLD) return 'behind';
    return '';
  }

  function _gapClass() {
    if (gapSec > AHEAD_THRESHOLD)  return 'ahead';
    if (gapSec < BEHIND_THRESHOLD) return 'behind';
    return 'even';
  }

  /* ── 탭 전환 ── */
  function switchTab(tab) {
    const dataView  = document.getElementById('run-data-view');
    const pacerView = document.getElementById('run-pacer-view');
    const tabData   = document.getElementById('tab-data');
    const tabPacer  = document.getElementById('tab-pacer');

    if (!dataView || !pacerView) return;

    const isData  = (tab === 'data');
    dataView.style.display  = isData  ? 'flex' : 'none';
    pacerView.style.display = !isData ? 'flex' : 'none';

    if (tabData)  tabData.classList.toggle('active',  isData);
    if (tabPacer) tabPacer.classList.toggle('active', !isData);

    if (!isData) pacerView.style.flexDirection = 'column';
  }

  return { start, stop, switchTab };

})();

// 전역 노출
window.RunWithPacer = RunWithPacer;
window.switchRunTab = RunWithPacer.switchTab.bind(RunWithPacer);
