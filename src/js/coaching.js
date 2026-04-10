/* ============================================
   RunWith Coaching System — coaching.js
   코칭 메시지 시스템 v4.1
   "현재 상태 + 행동 제안" 2줄 구조
   ============================================ */

const CoachingSystem = (() => {

  /* ── 메시지 데이터베이스 ── */
  const messages = {
    // 러닝 진행 화면 코칭 메시지
    running: [
      {
        id: 'pace_low',
        priority: 1,
        trigger: (data) => data.paceDiff > 0.15,  // 목표보다 15% 이상 느림
        state:  '지금 리듬이 목표보다 느려요',
        action: '케이던스를 조금만 올려보세요',
      },
      {
        id: 'cadence_low',
        priority: 2,
        trigger: (data) => data.cadence < 155,
        state:  '보폭이 조금 크게 느껴져요',
        action: '발걸음을 짧고 빠르게 가져가보세요',
      },
      {
        id: 'rank_up',
        priority: 3,
        trigger: (data) => data.rankChanged && data.rankDiff > 0,
        state:  `그룹 순위가 올라가고 있어요`,
        action: '이 리듬 그대로 유지해보세요 💪',
      },
      {
        id: 'stable',
        priority: 4,
        trigger: (data) => Math.abs(data.paceDiff) <= 0.05,
        state:  '안정적인 리듬이에요',
        action: '이대로 유지하면 충분해요',
      },
      {
        id: 'pace_high',
        priority: 5,
        trigger: (data) => data.paceDiff < -0.1,  // 목표보다 10% 이상 빠름
        state:  '초반 리듬이 조금 빠른 편이에요',
        action: '후반을 위해 지금 페이스를 아껴두세요',
      },
    ],

    // 페이서(코치 리듬) 비교 화면
    pacer: {
      behind: {
        state:  '현재 구간 목표보다 약간 느려요',
        action: '지금은 속도보다 리듬 유지가 중요해요',
      },
      even: {
        state:  '목표 리듬과 잘 맞고 있어요',
        action: '완벽한 페이스입니다. 이대로 유지하세요!',
      },
      ahead: {
        state:  '목표 리듬을 앞서고 있어요',
        action: '훌륭해요! 후반까지 이 흐름을 이어가세요 👏',
      },
    },

    // 홈 화면 코치 가이드 (오늘의 포인트)
    homeGuide: [
      '초반 3km는 페이스보다 리듬 유지에 집중하세요',
      '오늘은 케이던스 165 이상을 목표로 달려보세요',
      '호흡이 먼저 흐트러지면 속도를 줄여도 괜찮아요',
      '후반 2km에서 리듬을 올리는 네거티브 스플릿에 도전해보세요',
      '오늘 러닝의 핵심은 끝까지 일정한 리듬을 유지하는 것이에요',
    ],

    // 지난 러닝 요약 (홈)
    lastSummary: [
      { text: '후반 페이스 유지력이 좋아졌어요', metric: '목표 일치율 92%' },
      { text: '케이던스가 안정적으로 높아졌어요', metric: '평균 167 spm' },
      { text: '초반 리듬이 더 차분해졌어요', metric: '전반 6\'30" 유지' },
    ],

    // 달력 날짜 상세 코치 피드백
    calendarFeedback: [
      '리듬 유지가 안정적이었어요',
      '초반 리듬이 조금 빨랐지만 잘 조절했어요',
      '후반 가속이 인상적이었어요',
      '케이던스가 목표치에 잘 맞았어요',
      '전반적으로 균형 잡힌 러닝이었어요',
    ],

    // 결과 분석 코치 카드
    analysis: {
      summary: '초반 1km는 목표보다 느렸지만\n3km 이후 안정적으로 리듬을 회복했습니다\n\n후반 가속으로 그룹 순위가 상승했습니다',
      next: '다음 러닝에서는\n초반 리듬 유지에 조금 더 집중해보세요',
    },

    // 결과 공유 카드 코치 한줄
    shareCoach: '후반 페이스 유지력이 좋았습니다',
  };

  /* ── 우선순위 기반 메시지 선택 ── */
  let lastMessageId = null;
  let lastMessageTime = 0;
  const MIN_INTERVAL_MS = 30 * 1000; // 30초

  function getRunningMessage(data) {
    const now = Date.now();
    const sorted = [...messages.running].sort((a, b) => a.priority - b.priority);

    for (const msg of sorted) {
      if (msg.trigger(data)) {
        // 같은 메시지 30초 내 재노출 방지
        if (msg.id === lastMessageId && (now - lastMessageTime) < MIN_INTERVAL_MS) {
          continue;
        }
        lastMessageId = msg.id;
        lastMessageTime = now;
        return msg;
      }
    }
    // 기본 메시지
    return messages.running.find(m => m.id === 'stable');
  }

  /* ── 페이서 메시지 선택 ── */
  function getPacerMessage(gapSec) {
    if (gapSec > 2) return messages.pacer.ahead;
    if (gapSec < -2) return messages.pacer.behind;
    return messages.pacer.even;
  }

  /* ── 홈 코치 가이드 (오늘 날짜 기반 순환) ── */
  function getTodayGuide() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return messages.homeGuide[dayOfYear % messages.homeGuide.length];
  }

  /* ── 지난 러닝 요약 ── */
  function getLastSummary() {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return messages.lastSummary[dayOfYear % messages.lastSummary.length];
  }

  /* ── 달력 피드백 (날짜 인덱스 기반) ── */
  function getCalendarFeedback(dateIdx) {
    return messages.calendarFeedback[dateIdx % messages.calendarFeedback.length];
  }

  /* ── DOM 업데이트 헬퍼 ── */
  function updateCoachingBanner(msg) {
    const stateEl  = document.getElementById('coaching-state');
    const actionEl = document.getElementById('coaching-action');
    if (stateEl)  stateEl.textContent  = msg.state;
    if (actionEl) actionEl.textContent = msg.action;
  }

  function updatePacerMessage(gapSec) {
    const msg = getPacerMessage(gapSec);
    const stateEl  = document.getElementById('pacer-state');
    const actionEl = document.getElementById('pacer-action');
    if (stateEl)  stateEl.textContent  = msg.state;
    if (actionEl) actionEl.textContent = msg.action;
  }

  /* ── 홈 코칭 초기화 ── */
  function initHome() {
    const guideEl = document.getElementById('coach-guide-text');
    const summaryTextEl = document.getElementById('last-summary-text');
    const summaryMetricEl = document.getElementById('last-summary-metric');

    if (guideEl) guideEl.textContent = getTodayGuide();
    const summary = getLastSummary();
    if (summaryTextEl) summaryTextEl.textContent = summary.text;
    if (summaryMetricEl) summaryMetricEl.textContent = summary.metric;
  }

  return {
    getRunningMessage,
    getPacerMessage,
    getTodayGuide,
    getLastSummary,
    getCalendarFeedback,
    updateCoachingBanner,
    updatePacerMessage,
    initHome,
    messages,
  };

})();

window.CoachingSystem = CoachingSystem;
