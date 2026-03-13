---
name: qa-autopilot
description: >
  Full-cycle AI QA automation. Given a URL, automatically analyzes the page,
  writes test case documents, generates Playwright test code, executes tests,
  and detects changes to keep everything up to date.
  Use when the user provides a URL to test, wants to add/update test cases,
  run automated tests, or maintain existing test suites.
allowed-tools: Bash(playwright-cli:*), Bash(npx playwright*), Read, Write, Glob
---

# QA Autopilot

> URL 하나로 페이지 분석 → TC 문서 작성 → 테스트 코드 생성 → 자동 실행 → 변경 감지까지 AI가 전 과정을 수행합니다.

---

## Pipeline

```
[URL 입력]
    │
    ▼
① Page Analysis
    │  페이지 구조 및 기능 파악
    │  (references/page-analysis.md)
    │
    ├─ [로그인 필요] ───────────────► state-load / state-save
    │
    ├─ [역할 비교 필요] ───────────► -s=<session>
    │
    ├─ [동적 로딩 / iframe / 권한] ─► run-code
    │
    ▼
② Testcase Writing
    │  testcase/[feature].md 생성 또는 업데이트
    │  (references/testcase-writing.md)
    ▼
③ Code Generation
    │  tests/[feature].spec.ts 생성 또는 업데이트
    │  (references/code-generation.md)
    │
    ├─ [인증 재사용 필요] ─────────► storageState 반영
    └─ [외부 API 불안정] ─────────► 최소 범위 mock 훅 반영
    ▼
④ Test Execution
    │  npx playwright test 실행 + 결과 수집
    │  (references/test-execution.md)
    │
    ├─ [실패 원인 불명] ───────────► tracing-start / tracing-stop
    ├─ [시각 증거 필요] ───────────► video-start / video-stop
    └─ [API 원인 의심] ───────────► route / unroute 재현
    ▼
⑤ Change Detection
    │  기존 TC/코드와 비교 후 수정·추가
    │  (references/change-detection.md)
    │
    ├─ [UI 변경] ─────────────────► locator / TC / assertion 업데이트
    ├─ [URL/문구 변경] ───────────► spec + testcase 동시 수정
    └─ [신규 기능 발견] ─────────► ② → ③ → ④ 재진입
```

### 실행 예시

1. 신규 공개 페이지 자동화
    - 프롬프트: `https://example.com/search 페이지 QA 자동화해줘`
    - 흐름: `① Page Analysis → ② Testcase Writing → ③ Code Generation → ④ Test Execution`
    - 내부 기능: 기본적으로 `open`, `snapshot`, `click`, `fill` 중심

2. 로그인 필요한 페이지 자동화
    - 프롬프트: `https://example.com/mypage 페이지 QA 자동화해줘`
    - 흐름: `① Page Analysis`에서 인증 필요 판단 → `state-load/state-save` 사용 → `② → ③ → ④`
    - 내부 기능: 인증 상태 재사용, 필요 시 생성 코드에 `storageState` 반영

3. 실패 테스트 재분석 및 업데이트
    - 프롬프트: `melon-search 테스트가 실패하는데 변경된 부분 반영해서 업데이트해줘`
    - 흐름: `④ Test Execution` 실패 → `trace/mock`로 원인 분리 → `⑤ Change Detection` → `② → ③ → ④`
    - 내부 기능: `tracing-start/stop`, 필요 시 `route/unroute`, 이후 TC/spec 최신화

---

## 실행 모드

### 🆕 신규 (New)
URL이 처음 주어졌을 때 전체 파이프라인 실행
```
① → ② → ③ → ④
```

### 🔄 업데이트 (Update)
URL은 동일하지만 페이지가 변경되었을 때
```
① → ⑤ → ② → ③ → ④
```

### ▶ 실행만 (Run Only)
TC와 코드는 있고 테스트만 재실행
```
④
```

---

## 파일 구조 규칙

```
project/
├── testcase/
│   └── [feature].md          ← TC 문서 (사람이 읽는 문서)
├── tests/
│   └── [feature].spec.ts     ← Playwright 테스트 코드
└── reports/
    └── [feature]-result.md   ← 테스트 결과 리포트
```

### feature 네이밍
URL 경로에서 기능명을 추출:
- `https://melon.com/` → `melon-main`
- `https://melon.com/search` → `melon-search`
- `https://melon.com/login` → `melon-login`

---

## 각 단계 참조 문서

| 단계 | 문서 | 역할 |
|------|------|------|
| ① 페이지 분석 | [references/page-analysis.md](references/page-analysis.md) | playwright-cli로 페이지 구조·기능 파악 |
| ② TC 작성 | [references/testcase-writing.md](references/testcase-writing.md) | 분석 결과 → testcase/*.md |
| ③ 코드 생성 | [references/code-generation.md](references/code-generation.md) | TC → tests/*.spec.ts |
| ④ 테스트 실행 | [references/test-execution.md](references/test-execution.md) | 실행 + 결과 → reports/*.md |
| ⑤ 변경 감지 | [references/change-detection.md](references/change-detection.md) | 변경점 분석 → TC/코드 업데이트 |

추가 통합 가이드:
- [references/playwright-cli-embedding.md](references/playwright-cli-embedding.md)

---

## Playwright-CLI 내장 운영 규칙

qa-autopilot은 아래 상황에서 playwright-cli 기능을 내부적으로 사용합니다.

| 상황 | 우선 적용 기능 | 목적 |
|------|---------------|------|
| 인증이 필요한 페이지 | `state-load` / `state-save` | 로그인 반복 제거, 재현성 확보 |
| 네트워크 변동이 큰 페이지 | `route`, `unroute` | 외부 API 의존성 분리, flaky 감소 |
| 실패 원인 분석 필요 | `tracing-start/stop`, `video-start/stop` | 근본 원인 분석 + 시각 증거 확보 |
| 다중 사용자/역할 비교 | `-s=<session>` | 세션 완전 격리로 병렬 검증 |
| CLI 기본 명령으로 부족 | `run-code` | 고급 Playwright API 즉시 확장 |

운영 원칙:
1. 기본 실행은 단순 명령(`open`, `snapshot`, `click`, `fill`) 우선
2. 불안정 케이스에서만 mock/trace/video를 선택적으로 활성화
3. 분석 종료 후 `unroute`, `close-all`로 상태 정리
4. 인증 상태 파일은 커밋 금지, 임시 사용 후 삭제

### 자동 판단 규칙

| 관찰된 상황 | qa-autopilot 판단 | 내부 실행 |
|-------------|-------------------|-----------|
| 로그인 없이는 핵심 기능 접근 불가 | 인증 상태 재사용 필요 | `state-load` 우선, 없으면 로그인 후 `state-save` |
| 동일 기능을 guest/member/admin으로 비교해야 함 | 세션 격리 필요 | `-s=<session>` 기반으로 분리 실행 |
| 분석 중 로딩/동적 렌더링으로 snapshot이 불안정 | 고급 제어 필요 | `run-code`로 wait/iframe/permission 처리 |
| 테스트가 외부 API 실패로 흔들림 | 네트워크 원인 분리 필요 | 최소 범위 `route` 적용 후 재검증 |
| 실패 원인이 불명확함 | 증거 수집 필요 | `tracing-start/stop` 우선, 필요 시 `video-start/stop` 추가 |

### 실행 후 산출물 계약

qa-autopilot 실행 후 기본적으로 아래 파일 상태를 보장합니다.

| 산출물 | 경로 | 상태 |
|--------|------|------|
| 테스트케이스 문서 | `testcase/[feature].md` | 신규 생성 또는 최신화 |
| Playwright 테스트 코드 | `tests/[feature].spec.ts` | 신규 생성 또는 최신화 |
| 실행 결과 리포트 | `reports/[feature]-result.md` | 실행 후 최신 결과 반영 |
| 디버깅 아티팩트 | trace/video 파일 | 실패 분석이 필요할 때만 선택 생성 |

### 실패 시 재시도 전략

1. 1차 실패: locator, URL, assertion, timeout 유형 분류
2. 2차 확인: `playwright-cli`로 동일 시나리오 최소 재현
3. 원인 불명 시: trace 수집
4. API 의심 시: mock 재현으로 UI 문제와 외부 의존성 분리
5. 변경이 확인되면 `⑤ Change Detection`으로 되돌아가 문서와 코드를 업데이트

---

## 시작 방법

```
# 신규 페이지 전체 자동화
"https://example.com/search 페이지 QA 자동화해줘"

# 기존 페이지 업데이트 확인
"https://example.com/search 페이지 변경됐는지 확인하고 업데이트해줘"

# 테스트만 재실행
"melon-search 테스트 실행해줘"
```
