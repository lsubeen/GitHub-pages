# RunWith — 그룹 레이스 기반 러닝 플랫폼

> **Run Together, Win Together**

[![Deploy Status](https://img.shields.io/badge/deploy-live-brightgreen)](https://runwith-app.github.io)
[![Version](https://img.shields.io/badge/version-v4.1-blue)](https://github.com/runwith/prototype)
[![License](https://img.shields.io/badge/license-MIT-yellow)](LICENSE)

---

## 📱 프로젝트 소개

RunWith는 **실시간 그룹 레이스 매칭 + 코치 기반 러닝 경험**을 제공하는 모바일 러닝 플랫폼의 인터랙티브 프로토타입입니다.

혼자 달리던 시대는 끝났습니다. 같은 레벨·목표를 가진 러너들을 실시간으로 연결해 경쟁의 짜릿함과 함께 달리는 즐거움을 동시에 선사합니다.

---

## 🚀 라이브 데모

👉 **[https://runwith-app.github.io](https://runwith-app.github.io)**

---

## 📂 프로젝트 구조

```
runwith/
├── index.html              # 메인 진입점 (프로토타입)
├── landing.html            # 서비스 소개 랜딩페이지
├── src/
│   ├── styles/
│   │   ├── variables.css   # 브랜드 CSS 변수 (컬러·폰트)
│   │   ├── base.css        # 리셋 & 공통 스타일
│   │   ├── components.css  # 재사용 컴포넌트
│   │   └── screens.css     # 화면별 스타일
│   ├── js/
│   │   ├── router.js       # 화면 전환 라우터
│   │   ├── navigation.js   # 사이드바 & 탭 네비게이션
│   │   ├── timer.js        # 워밍업·러닝 타이머
│   │   ├── simulation.js   # 러닝 데이터 시뮬레이션
│   │   ├── pacer.js        # 코치 리듬 비교 로직
│   │   ├── calendar.js     # 달력 렌더링 & 바텀시트
│   │   └── coaching.js     # 코칭 메시지 시스템 (v4.1)
│   └── screens/
│       ├── splash.html     # 로딩 스플래시
│       ├── auth.html       # 로그인·회원가입
│       ├── home.html       # 홈 대시보드 (v4.1)
│       ├── warmup.html     # 워밍업 & 그룹 매칭 (v4.1)
│       ├── running.html    # 러닝 진행 (v4.1)
│       ├── pacer.html      # 코치 리듬 비교 (v4.1)
│       ├── share.html      # 결과 공유
│       ├── ranking.html    # 순위 & 보상
│       ├── analysis.html   # 결과 분석 (v4.1)
│       ├── calendar.html   # 달력
│       └── mypage.html     # 마이페이지
├── public/
│   └── favicon.svg
├── docs/
│   ├── wireframe-v4.0.md   # 화면정의서 요약
│   └── changelog.md        # 버전 변경 이력
└── README.md
```

---

## ✨ 주요 기능 (v4.1)

| 기능 | 설명 |
|------|------|
| 🏃 그룹 레이스 매칭 | 레벨 + 목표 거리 기반 실시간 자동 매칭 |
| 🎙️ 코치 리듬 비교 | 가이드 페이서 vs 내 위치 실시간 비교 |
| ⚡ AI 코칭 메시지 | 현재 상태 + 행동 제안 2줄 구조 |
| 📊 레이스 결과 분석 | 페이스 오버레이 그래프 + 코치 해석 카드 |
| 📱 완주 인증 카드 | 그룹 순위 포함 SNS 공유 카드 |
| 🗓️ 달력 & 기록 | 코칭 피드백 포함 성장 히스토리 |

---

## 🎨 브랜드 시스템

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--navy` | `#1E3A8A` | Primary — 헤더·CTA·강조 |
| `--gold` | `#F59E0B` | Accent — 카운트다운·뱃지·성취 |
| `--success` | `#10B981` | 완료·달성 상태 |
| `--danger` | `#EF4444` | 종료·경고 |
| `--font-display` | Bebas Neue | 숫자·타이머·순위 |
| `--font-body` | Noto Sans KR | 전체 UI 텍스트 |

---

## 🗺️ 화면 플로우 (14개 화면)

```
[스플래시] → [로그인 / 회원가입]
     ↓
  [홈] ──────────────────────────┐
     ↓                          │
[워밍업 & 매칭]                  ↑
     ↓                          │
[러닝 진행] ←→ [코치 리듬 비교]  │
     ↓                          │
[일시정지] ──→ [러닝 진행]        │
     ↓                          │
[레이스 완주]                    │
     ↓                          │
[결과 공유] ──→ [순위 & 보상] ───┘
     ↓
[결과 분석]

[달력]  [마이페이지]  ← 하단 탭 항상 접근 가능
```

---

## 🛠️ 설치 & 실행

### 로컬 실행

```bash
# 1. 레포 클론
git clone https://github.com/runwith/prototype.git
cd prototype

# 2. 로컬 서버 실행 (Python)
python3 -m http.server 3000

# 3. 브라우저에서 열기
open http://localhost:3000
```

### VS Code Live Server

1. VS Code에서 프로젝트 폴더 열기
2. Live Server 익스텐션 설치
3. `index.html` 우클릭 → "Open with Live Server"

---

## 🚢 GitHub Pages 배포

```bash
# 1. 레포 Settings → Pages → Source: Deploy from branch
# 2. Branch: main / (root) 선택
# 3. Save 클릭 후 https://{username}.github.io/{repo} 에서 접근
```

**또는 GitHub Actions 자동 배포:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/deploy-pages@v4
```

---

## 📋 버전 이력

| 버전 | 날짜 | 주요 변경 |
|------|------|----------|
| v4.1 | 2026-03-27 | 코칭 메시지 2줄 구조, 코치 리듬 비교, 분석 해석 카드, 홈 코치 가이드 |
| v4.0 | 2026-03-27 | 스플래시·로그인·회원가입·페이서·결과분석 추가 (14개 화면 완전판) |
| v3.0 | 2026-03-26 | 그룹 레이스 플로우·결과공유·순위보상 추가, 브랜드 아이콘셋 적용 |
| v2.0 | 2026-03-26 | 홈·달력·마이페이지·하단탭 추가 |
| v1.0 | 2026-03-25 | 온보딩 5단계·러닝 플로우 최초 구현 |

---

## 📄 라이선스

MIT License © 2026 RunWith Team
