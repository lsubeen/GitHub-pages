/* ============================================
   RunWith Timer — timer.js
   워밍업 & 러닝 타이머 + 체크리스트 (v4.1)
   ============================================ */

const RunWithTimer = (() => {

  /* ══ WARMUP TIMER ══ */
  let warmupInterval = null;
  let warmupSeconds  = 45;

  // 체크리스트 단계 (v4.1)
  const checklistSteps = [
    { id: 'check-gps',   label: 'GPS 연결 확인 중',        delay: 800  },
    { id: 'check-group', label: '비슷한 레벨 러너 매칭 중', delay: 2200 },
    { id: 'check-coach', label: '오늘 코치 데이터 로딩 중', delay: 4000 },
  ];

  function startWarmup(onComplete) {
    warmupSeconds = 45;
    _resetWarmupRing();
    _runChecklist();

    warmupInterval = setInterval(() => {
      warmupSeconds--;

      // 타이머 UI 업데이트
      const el = document.getElementById('wtime');
      if (el) {
        const m = Math.floor(warmupSeconds / 60);
        const s = warmupSeconds % 60;
        el.textContent = `${m}:${String(s).padStart(2, '0')}`;
      }

      // 링 애니메이션
      const ring = document.getElementById('wring');
      if (ring) {
        const circ = 2 * Math.PI * 62;
        ring.setAttribute('stroke-dashoffset', circ * (1 - warmupSeconds / 45));
      }

      if (warmupSeconds <= 0) {
        stopWarmup();
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  function stopWarmup() {
    if (warmupInterval) {
      clearInterval(warmupInterval);
      warmupInterval = null;
    }
  }

  function _resetWarmupRing() {
    const ring = document.getElementById('wring');
    if (ring) ring.setAttribute('stroke-dashoffset', '97');
    const el = document.getElementById('wtime');
    if (el) el.textContent = '0:45';
  }

  // 체크리스트 순차 완료 애니메이션 (v4.1)
  function _runChecklist() {
    // 초기화
    checklistSteps.forEach(step => {
      const el = document.getElementById(step.id);
      if (el) el.classList.remove('done');
    });

    checklistSteps.forEach(step => {
      setTimeout(() => {
        const el = document.getElementById(step.id);
        if (el) el.classList.add('done');
      }, step.delay);
    });
  }

  /* ══ RUNNING TIMER ══ */
  let runningInterval = null;
  let runSeconds      = 892;    // 초기값 (시뮬레이션)
  let runDistance     = 2.3;
  let rankPosition    = 12;
  let messageIdx      = 0;
  let lastRankChange  = false;

  function startRunning() {
    runningInterval = setInterval(() => {
      runSeconds++;
      runDistance = Math.round((runDistance + 0.002) * 1000) / 1000;

      // 시간
      const m = Math.floor(runSeconds / 60);
      const s = runSeconds % 60;
      _updateEl('run-time', `${m}:${String(s).padStart(2, '0')}`);

      // 거리
      _updateEl('run-dist', runDistance.toFixed(1));

      // 페이스 (랜덤 변동)
      const ps = 42 + Math.round(Math.random() * 6 - 3);
      const paceStr = `6'${String(ps).padStart(2, '"')}`;
      _updateEl('run-pace', `6'${String(ps).padStart(2, '0')}"`);
      _updateEl('pc-pace',  `6'${String(ps).padStart(2, '0')}"`);

      // 케이던스
      const cad = 162 + Math.round(Math.random() * 6 - 3);
      _updateEl('run-cad', cad);

      // 순위 변동 (5% 확률로 상승)
      lastRankChange = false;
      if (Math.random() < 0.05 && rankPosition > 1) {
        rankPosition--;
        lastRankChange = true;
      }
      const rankBar = document.getElementById('rank-bar');
      if (rankBar) rankBar.style.width = `${((124 - rankPosition) / 124) * 100}%`;

      // 코칭 메시지 갱신 (4% 확률)
      if (Math.random() < 0.04) {
        const coachData = {
          paceDiff: (ps - 30) / 30,  // 목표 페이스 대비 차이 (시뮬레이션)
          cadence: cad,
          rankChanged: lastRankChange,
          rankDiff: lastRankChange ? 1 : 0,
        };
        const msg = CoachingSystem.getRunningMessage(coachData);
        CoachingSystem.updateCoachingBanner(msg);
      }

    }, 1000);
  }

  function stopRunning() {
    if (runningInterval) {
      clearInterval(runningInterval);
      runningInterval = null;
    }
  }

  function _updateEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  /* ══ SPLASH TIMER ══ */
  function startSplash(onComplete, delay = 2500) {
    setTimeout(onComplete, delay);
  }

  /* ══ MutationObserver 기반 화면 감지 자동 연결 ══ */
  function bindToRouter() {
    RunWithRouter.on((screen, prev) => {
      // 워밍업 시작/종료
      if (screen === 's-warmup') {
        startWarmup(() => RunWithRouter.go('s-running'));
      } else if (prev === 's-warmup') {
        stopWarmup();
      }

      // 러닝 시작/종료
      if (screen === 's-running') {
        startRunning();
      } else if (prev === 's-running') {
        stopRunning();
      }

      // 스플래시 자동 전환
      if (screen === 's-splash') {
        startSplash(() => RunWithRouter.go('s-login'));
      }

      // 홈 코칭 초기화
      if (screen === 's-home') {
        CoachingSystem.initHome();
      }
    });
  }

  return {
    startWarmup,
    stopWarmup,
    startRunning,
    stopRunning,
    startSplash,
    bindToRouter,
  };

})();

window.RunWithTimer = RunWithTimer;
