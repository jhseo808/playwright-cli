# qa-autopilot (based on playwright-cli)

이 저장소의 **핵심 목적은 `qa-autopilot` 스킬 개발**입니다.

- 메인: `qa-autopilot`
- 기반: `playwright-cli`

즉, 단순 Playwright 테스트 모음이 아니라,
`playwright-cli` 기능을 내부적으로 활용해 QA 전 과정을 자동화하는 스킬을 설계/개선하기 위한 프로젝트입니다.

## 왜 만들었나

`qa-autopilot`이 아래 사이클을 자동으로 수행하도록 만들기 위함입니다.

1. 페이지 분석 (Page Analysis)
2. 테스트케이스 문서 작성 (Testcase Writing)
3. 테스트 코드 생성 (Code Generation)
4. 테스트 실행 (Test Execution)
5. 변경 감지 및 업데이트 (Change Detection)

## 아키텍처 관점

### 1) Orchestrator: `qa-autopilot`

- 사용자 요청을 받아 전체 QA 파이프라인을 오케스트레이션
- 단계별 문서(reference) 기준으로 결과물을 생성/업데이트

위치:
- `.claude/skills/qa-autopilot/`
- `.agents/skills/qa-autopilot/`

### 2) Execution Foundation: `playwright-cli`

`qa-autopilot`이 내부적으로 필요할 때 아래 기능을 선택 사용:

- 상태 재사용: `state-load`, `state-save`
- 네트워크 분리: `route`, `unroute`
- 고급 제어: `run-code`
- 증거 수집: `tracing-start/stop`, `video-start/stop`
- 세션 격리: `-s=<session>`

## Playwright CLI vs Playwright MCP

이 프로젝트는 `MCP`를 모르는 것이 아니라, **의도적으로 `CLI` 중심 설계**를 선택했습니다.

### 왜 CLI를 선택했나 (핵심)

가장 큰 이유는 **토큰 사용량 절감**입니다.

- `qa-autopilot`은 테스트 자동화 외에도 문서 생성/코드 생성/변경 감지까지 수행하므로 컨텍스트 예산을 많이 사용합니다.
- 이때 실행 레이어까지 토큰 오버헤드가 크면, 전체 파이프라인의 안정성과 처리량이 떨어질 수 있습니다.
- `CLI + SKILL` 방식은 목적형 명령 호출 중심이라, 많은 상황에서 더 짧고 예측 가능한 컨텍스트로 동작합니다.

### 비교 요약

| 항목 | Playwright CLI 기반 | Playwright MCP 기반 |
|------|----------------------|----------------------|
| 주 사용 패턴 | 목적형 명령 실행 (`open`, `snapshot`, `route` 등) | 도구 스키마 + 구조화된 상호작용 루프 |
| 토큰 효율 | 상대적으로 유리 (핵심 명령 위주) | 상황에 따라 컨텍스트 오버헤드 증가 가능 |
| 대규모 코드베이스 병행 작업 | 유리 (브라우저 자동화 외 작업과 토큰 분배 용이) | 가능하지만 컨텍스트 관리 부담이 커질 수 있음 |
| 강점 | 빠른 실행, 단순 운영, 고처리량 자동화 파이프라인 | 풍부한 introspection, 지속적/탐색적 에이전트 루프 |
| 이 프로젝트에서의 선택 | ✅ 기본 채택 | 필요 시 보완 옵션으로 고려 |

### 이 저장소의 설계 원칙

1. 메인은 `qa-autopilot` 오케스트레이션
2. 실행 기반은 `playwright-cli`
3. 선택 기준은 기능 과잉보다 **토큰 효율 + 안정적 반복 실행**
4. 필요 시에만 고급 디버깅(trace/video/mock)을 조건부 활성화

## 주요 폴더

- `tests/`: 생성/유지되는 Playwright spec
- `pages/`: Page Object Model
- `testcase/`: 사람이 읽는 테스트케이스 문서
- `reports/`: 실행 결과 요약 리포트
- `test-results/`: 실행 아티팩트(screenshot/trace/video)
- `.claude/skills/qa-autopilot/`: 메인 스킬 정의 + references
- `.claude/skills/playwright-cli/`: 기반 기능 레퍼런스

## References 요약 (qa-autopilot)

`qa-autopilot`의 실제 동작 기준은 아래 reference 문서들에 정의되어 있습니다.

- `page-analysis.md`
	- 역할: 대상 URL의 UI 구조, 인터랙션 요소, 상태 변화를 체계적으로 분석
	- 핵심: 기본 분석(`open/snapshot`) + 필요 시 세션 분리, state 재사용, `run-code`, 선택적 mock
	- 파일: `.claude/skills/qa-autopilot/references/page-analysis.md`

- `testcase-writing.md`
	- 역할: 분석 결과를 `testcase/[feature].md` 형식으로 문서화
	- 핵심: TC 우선순위/유형/독립성 원칙, 액션 로그를 사용자 관점 테스트 단계로 변환
	- 파일: `.claude/skills/qa-autopilot/references/testcase-writing.md`

- `code-generation.md`
	- 역할: TC 문서를 기반으로 POM(`pages/`) + spec(`tests/`) 생성/업데이트
	- 핵심: semantic locator 우선, 액션 코드의 Page Object 승격, 필요 시 `storageState`/mock 훅 반영
	- 파일: `.claude/skills/qa-autopilot/references/code-generation.md`

- `test-execution.md`
	- 역할: `npx playwright test` 실행 및 결과 리포트화
	- 핵심: pass/fail/skip 집계, 실패 유형 분류, 필요 시 trace/video/mock 재현으로 원인 분리
	- 파일: `.claude/skills/qa-autopilot/references/test-execution.md`

- `change-detection.md`
	- 역할: 기존 TC/코드와 현재 페이지를 비교해 변경점 반영
	- 핵심: locator/URL/문구/기능 추가·삭제 유형별 업데이트 규칙 + 재실행 루프
	- 파일: `.claude/skills/qa-autopilot/references/change-detection.md`

- `playwright-cli-embedding.md`
	- 역할: `qa-autopilot` 단계별로 `playwright-cli`를 어떻게 내장 사용하는지 정의
	- 핵심: 자동 선택 매트릭스, 실행 시나리오, 아티팩트 관리, Windows 운영 메모
	- 파일: `.claude/skills/qa-autopilot/references/playwright-cli-embedding.md`

### 정리

이 저장소에서 README는 방향성과 설계 원칙을 설명하고,
reference 문서는 실제 실행 규칙(동작 계약)을 정의합니다.

## 실행 환경

- Node.js 18+
- npm
- Chrome (현재 설정은 `channel: 'chrome'`)

## 빠른 시작

```bash
npm install
npx playwright install
npx playwright test
```

## 실행 명령

### 전체 테스트

```bash
npx playwright test
```

### 개별 테스트

```bash
npx playwright test tests/melon-login.spec.ts
npx playwright test tests/melon-chart.spec.ts
```

### HTML 리포트

```bash
npx playwright show-report
```

## 산출물 계약 (qa-autopilot 기준)

실행 후 기본적으로 아래 산출물을 갱신합니다.

- `testcase/[feature].md`
- `tests/[feature].spec.ts`
- `reports/[feature]-result.md`

필요 시 선택적으로 생성:

- trace/video 아티팩트 (`test-results/`)

## 주의사항

- 이 저장소의 메인은 테스트 파일 자체가 아니라 **`qa-autopilot` 스킬 품질**입니다.
- trace/video/state 파일은 용량 및 민감 정보 이슈가 있으므로 관리 정책을 두고 운영하세요.
- `npm test` 기본 스크립트는 미사용이며, 실제 실행은 `npx playwright test`를 사용합니다.
