# Playwright-CLI Embedding Guide

qa-autopilot이 내부적으로 사용하는 playwright-cli 기능을 단계별로 정리한 운영 가이드입니다.

---

## 단계별 매핑

| QA Autopilot 단계 | 기본 명령 | 확장 명령 | 목적 |
|-------------------|----------|----------|------|
| ① Page Analysis | `open`, `snapshot`, `click`, `fill` | `run-code`, `-s=<session>`, `state-load` | 구조/상태/역할 분석 |
| ② Testcase Writing | snapshot 기반 요소 추출 | 실행 로그 기반 문장화 | TC 정확도 향상 |
| ③ Code Generation | 액션 로그 코드 반영 | semantic locator 정제, `test.use({ storageState })` | 유지보수성 높은 코드 생성 |
| ④ Test Execution | `npx playwright test` | `tracing-start/stop`, `video-start/stop`, `route/unroute` | 실패 원인 추적, 증거 수집 |
| ⑤ Change Detection | 재분석 + diff | 세션 비교, mock 비교, trace 분석 | 원인 분리 정확도 향상 |

---

## 기능별 사용 기준

### Session Management

- 사용 시점: 역할별(guest/member/admin) 비교, 동시성 검증
- 핵심 명령: `-s=<name>`, `list`, `close`, `close-all`

### Storage State

- 사용 시점: 로그인 상태 재사용, 반복 실행 단축
- 핵심 명령: `state-save`, `state-load`, `cookie-*`, `localstorage-*`

### Request Mocking

- 사용 시점: 외부 API 불안정/미구현 환경, 재현성 강화
- 핵심 명령: `route`, `route-list`, `unroute`

### Running Code

- 사용 시점: iframe, 고급 wait, 권한, geolocation, media emulation
- 핵심 명령: `run-code "async page => { ... }"`

### Tracing / Video

- 사용 시점: 실패 재현, 원인 분석, 리포트 증거
- 핵심 명령: `tracing-start`, `tracing-stop`, `video-start`, `video-stop`

---

## 자동 선택 매트릭스

| 문제/요구사항 | 우선 기능 | 보조 기능 | 비고 |
|--------------|----------|----------|------|
| 로그인 후 화면만 테스트하면 됨 | Storage State | Session Management | 반복 로그인 제거 |
| 역할별 UI 차이를 비교해야 함 | Session Management | Storage State | guest/member/admin 분리 |
| 무한 로딩, iframe, 권한 팝업 존재 | Running Code | Session Management | 기본 CLI만으로 분석 어려운 경우 |
| API 응답에 따라 UI가 자주 달라짐 | Request Mocking | Tracing | flaky 원인 분리 |
| 실패 장면을 사람에게 공유해야 함 | Video | Tracing | 설명용은 video, 분석용은 trace |
| 실패의 근본 원인을 분석해야 함 | Tracing | Request Mocking | DOM/Network/Console 확인 |

---

## 대표 실행 시나리오

### 1) 신규 페이지 자동화

1. `open` + `snapshot`으로 구조 파악
2. 필요한 경우 `run-code`로 대기/iframe 처리
3. testcase 문서 생성
4. action 로그와 분석 결과로 spec 생성
5. `npx playwright test` 실행
6. 실패 시 trace 수집 후 결과 리포트 반영

### 2) 로그인 필요한 페이지 자동화

1. 로그인 수행 또는 기존 `auth.json` 존재 여부 확인
2. `state-load` 후 핵심 기능 분석
3. 생성 코드에는 `storageState` 사용 여부 반영
4. 인증 상태 파일은 임시 사용 후 정리

### 3) 변경 감지와 회귀 확인

1. 기존 testcase/spec 읽기
2. 재분석 후 변경점 비교
3. locator 변경이면 Page Object 우선 수정
4. URL/문구 변경이면 testcase와 assertion 동시 수정
5. 재실행 후 결과 리포트 업데이트

---

## 아티팩트 관리 기준

| 아티팩트 | 생성 조건 | 보관 기준 |
|----------|----------|----------|
| `testcase/[feature].md` | 항상 | 최신본 유지 |
| `tests/[feature].spec.ts` | 항상 | 최신본 유지 |
| `reports/[feature]-result.md` | 테스트 실행 시 | 최신본 유지 |
| trace 파일 | 실패 원인 분석 필요 시 | 문제 해결 후 정리 가능 |
| video 파일 | 시각 증거 필요 시 | 공유 완료 후 정리 가능 |
| auth/state 파일 | 인증 재사용 필요 시 | 민감 정보이므로 최소 보관 |

---

## Windows 환경 메모

이 스킬은 Windows에서도 동일하게 동작해야 하므로, 운영 가이드에서는 bash 전용 정리 명령에 의존하지 않습니다.

- 세션 정리: `playwright-cli close-all`
- stale 프로세스 정리: `playwright-cli kill-all`
- route 정리: `playwright-cli unroute`
- 상태 파일 정리: 필요 시 작업 디렉터리에서 수동 삭제

---

## 권장 운영 플로우

1. 기본 파이프라인은 단순 명령으로 빠르게 수행
2. 실패하거나 불안정한 단계만 확장 기능 선택 적용
3. 확장 기능 적용 시 결과 아티팩트(trace/video/report)와 함께 원인 분류
4. 실행 종료 후 `unroute`, `close-all`로 환경 정리

---

## 보안 및 정리 원칙

- auth/state 파일은 저장소 커밋 금지
- trace/video 결과는 보관 주기 정책으로 정리
- mock은 필요한 범위에서만 활성화하고 즉시 해제
