# qa-autopilot

Melon 웹페이지를 대상으로 Playwright 테스트를 작성/실행하고, `qa-autopilot` 스킬로
분석 → 테스트케이스 문서화 → 코드 생성 → 실행 → 변경 감지까지 자동화하는 워크스페이스입니다.

## 핵심 구성

- `tests/`: Playwright 스펙 파일
  - `melon-login.spec.ts`
  - `melon-chart.spec.ts`
- `pages/`: Page Object Model
  - `melon-chart-page.ts`
- `testcase/`: 사람이 읽는 테스트케이스 문서
  - `melon-login.md`
  - `melon-chart.md`
- `reports/`: 실행 결과 요약 리포트
  - `melon-chart-result.md`
- `.claude/skills/qa-autopilot/`: QA 자동화 스킬 본문 및 references
- `.claude/skills/playwright-cli/`: playwright-cli 레퍼런스 문서

## 실행 환경

- Node.js 18+ 권장
- npm
- Google Chrome (Playwright 설정에서 `channel: 'chrome'` 사용)

## 설치

```bash
npm install
npx playwright install
```

## 테스트 실행

### 전체 테스트

```bash
npx playwright test
```

### 개별 테스트

```bash
npx playwright test tests/melon-login.spec.ts
npx playwright test tests/melon-chart.spec.ts
```

### 리포트 확인

```bash
npx playwright show-report
```

## 현재 Playwright 설정 요약

`playwright.config.ts` 기준:

- `testDir`: `./tests`
- `baseURL`: `https://www.melon.com`
- 브라우저: Desktop Chrome (`channel: chrome`)
- 실행 모드: headed (`headless: false`)
- 아티팩트: screenshot/video/trace 모두 활성화
- 리포터: HTML (`playwright-report`)

## QA Autopilot 사용 흐름

`qa-autopilot`은 아래 순서로 동작합니다.

1. Page Analysis
2. Testcase Writing
3. Code Generation
4. Test Execution
5. Change Detection

필요 시 내부적으로 `playwright-cli` 기능(`state-load`, `route`, `run-code`, `tracing`, `video`)을
조건부로 사용합니다.

## 결과물/아티팩트

- 테스트 실행 중 생성되는 파일:
  - `test-results/` (케이스별 screenshot/trace/video)
  - `playwright-report/` (HTML 리포트)
- QA 산출물:
  - `testcase/*.md`
  - `tests/*.spec.ts`
  - `reports/*-result.md`

## 주의사항

- `test-results/`, trace/video 파일은 용량이 커질 수 있으므로 주기적으로 정리하세요.
- 로그인 상태 파일이나 민감 정보가 포함된 산출물은 원격 저장소에 커밋하지 않도록 관리하세요.
- `package.json`의 기본 `npm test` 스크립트는 미사용이며, Playwright 실행은 `npx playwright test`를 사용합니다.
