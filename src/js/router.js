/* ============================================
   RunWith Router — router.js
   화면 전환 라우터 시스템
   ============================================ */

const RunWithRouter = (() => {

  let currentScreen = null;
  const listeners = [];

  /**
   * 화면 전환
   * @param {string} screenId - 이동할 화면 ID (e.g. 's-home')
   */
  function go(screenId) {
    const prev = currentScreen;

    // 모든 화면 비활성화
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // 사이드바 버튼 비활성화
    document.querySelectorAll('.sbb').forEach(b => b.classList.remove('active'));

    // 대상 화면 활성화
    const target = document.getElementById(screenId);
    if (!target) {
      console.warn(`[Router] 화면을 찾을 수 없음: ${screenId}`);
      return;
    }
    target.classList.add('active');
    currentScreen = screenId;

    // 사이드바 버튼 활성화
    const navBtn = document.getElementById('nav-' + screenId);
    if (navBtn) navBtn.classList.add('active');

    // 리스너 실행
    listeners.forEach(fn => fn(screenId, prev));

    // URL 해시 업데이트 (북마크용)
    if (history.replaceState) {
      history.replaceState(null, '', '#' + screenId);
    }
  }

  /**
   * 화면 전환 이벤트 리스너 등록
   * @param {Function} fn - (nextScreen, prevScreen) => void
   */
  function on(fn) {
    listeners.push(fn);
  }

  /**
   * 현재 화면 반환
   */
  function current() {
    return currentScreen;
  }

  /**
   * URL 해시로 초기 화면 설정
   */
  function init() {
    const hash = location.hash.replace('#', '');
    const startScreen = hash && document.getElementById(hash) ? hash : 's-splash';
    go(startScreen);
  }

  // 브라우저 뒤로가기 처리
  window.addEventListener('popstate', () => {
    const hash = location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) go(hash);
  });

  return { go, on, current, init };

})();

// 전역 노출 (HTML onclick 속성 호환)
window.go = RunWithRouter.go.bind(RunWithRouter);
