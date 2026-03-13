# Change Detection

기존에 분석했던 페이지를 재분석하여 변경된 부분을 감지하고, TC 문서와 테스트 코드를 자동으로 업데이트합니다.

---

## 변경 감지 트리거

아래 상황에서 change-detection을 실행:

1. 테스트 실패 발생 시 (`locator not found`, `URL mismatch` 등)
2. 사용자가 명시적으로 "업데이트해줘" 요청 시
3. 정기 점검 시

---

## 변경 감지 프로세스

### 1. 현재 TC 문서 읽기
```
Read: testcase/[feature].md
```
기존 TC 목록, 사전 조건, 기대 결과를 파악

### 2. 현재 코드 읽기
```
Read: pages/[feature]-page.ts
Read: tests/[feature].spec.ts
```
기존 Locator, 메서드, URL 패턴 파악

### 3. 페이지 재분석
page-analysis.md 절차에 따라 현재 페이지 상태 분석

### 4. 변경점 비교

| 비교 항목 | 기존 | 현재 | 판정 |
|----------|------|------|------|
| URL | [old] | [new] | 변경됨 / 동일 |
| 버튼명 | [old] | [new] | 변경됨 / 동일 |
| 에러 메시지 | [old] | [new] | 변경됨 / 동일 |
| 새 기능 | - | [new feature] | 추가됨 |
| 삭제 기능 | [old feature] | - | 삭제됨 |

---

## 변경 유형별 처리

### 🔵 Locator 변경 (요소명, 역할 변경)
- `pages/[feature]-page.ts`의 해당 Locator 수정
- spec 파일은 수정 불필요 (Page Object가 캡슐화하므로)
- TC 문서의 단계 설명이 달라진 경우 수정

### 🟡 URL 변경
- Page Object의 `goto()` URL 수정
- TC 문서의 기대 결과 URL 패턴 수정
- spec의 `toHaveURL()` 패턴 수정

### 🟠 에러 메시지 변경
- spec의 `expect(...).toBe()` 값 수정
- TC 문서의 기대 결과 텍스트 수정

### 🟢 기능 추가
- page-analysis → testcase-writing → code-generation 순서로 신규 TC 추가
- TC 번호는 마지막 번호 이후로 부여
- TC 문서의 `총 TC 수` 및 `최종 수정일`, `버전` 업데이트

### 🔴 기능 삭제
- TC 문서: 해당 TC의 상태를 `Deprecated`로 변경
- Page Object: 해당 Locator/메서드 제거
- Spec: 해당 test 블록 제거
- TC 문서의 `총 TC 수` 및 버전 업데이트

---

## 변경 감지 결과 보고 형식

```
## 변경 감지 결과 - [feature] ([날짜])

### 변경된 항목
- 🔵 [요소명] Locator 변경: "[old]" → "[new]"
- 🟡 URL 변경: [old] → [new]
- 🟠 에러 메시지 변경: "[old]" → "[new]"

### 추가된 기능
- 🟢 [기능명]: TC[NN] 추가

### 삭제된 기능
- 🔴 [기능명]: TC[NN] Deprecated 처리

### 업데이트된 파일
- testcase/[feature].md (v[N] → v[N+1])
- pages/[feature]-page.ts
- tests/[feature].spec.ts
```

---

## 수정 후 처리

변경 감지 및 업데이트 완료 후 반드시:
1. 테스트 재실행 (`test-execution.md` 참조)
2. 결과 확인 및 `reports/[feature]-result.md` 업데이트

---

## playwright-cli 기반 원인 분리 절차

변경 감지 정확도를 높이기 위해 아래 순서로 원인을 분리:

### 1) 상태 차이 분리 (세션/인증)

```bash
playwright-cli -s=old-state state-load old-auth.json
playwright-cli -s=new-state state-load new-auth.json
playwright-cli -s=old-state open [URL]
playwright-cli -s=new-state open [URL]
```

같은 액션에서 결과가 다르면 인증/권한/세션 상태 차이를 우선 의심.

### 2) 네트워크 차이 분리 (request mocking)

```bash
playwright-cli route "**/api/*" --status=200 --body='{"ok":true}' --content-type=application/json
playwright-cli open [URL]
playwright-cli snapshot
playwright-cli unroute "**/api/*"
```

mock 적용 후 정상화되면 API 변경 또는 외부 시스템 변동으로 분류.

### 3) 증거 수집 (trace)

```bash
playwright-cli tracing-start
playwright-cli open [URL]
playwright-cli click e[N]
playwright-cli tracing-stop
```

trace로 DOM/네트워크/콘솔을 확인해 Locator 변경인지, 렌더 타이밍 문제인지 판별.
