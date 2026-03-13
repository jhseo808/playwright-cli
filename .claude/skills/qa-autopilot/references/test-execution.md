# Test Execution

테스트를 실행하고 결과를 수집하여 `reports/[feature]-result.md`에 저장합니다.

---

## 실행 명령

### 특정 기능만 실행
```bash
npx playwright test tests/[feature].spec.ts
```

### 전체 실행
```bash
npx playwright test
```

### 리포터 옵션 포함
```bash
npx playwright test tests/[feature].spec.ts --reporter=json > reports/[feature]-raw.json
```

---

## 결과 수집

실행 후 아래 정보를 수집:

| 항목 | 수집 방법 |
|------|----------|
| 총 TC 수 | 실행된 test 수 |
| 통과 | passed 수 |
| 실패 | failed 수 |
| 스킵 | skipped 수 |
| 실행 시간 | duration |
| 실패 원인 | error message + 위치 |

---

## 결과 리포트 형식 (`reports/[feature]-result.md`)

```markdown
# [기능명] 테스트 결과

| 항목 | 내용 |
|------|------|
| 실행일시 | [YYYY-MM-DD HH:mm] |
| 대상 파일 | tests/[feature].spec.ts |
| 총 TC 수 | [N]개 |
| 통과 | ✅ [N]개 |
| 실패 | ❌ [N]개 |
| 스킵 | ⏭ [N]개 |
| 실행 시간 | [N]s |

---

## 결과 상세

### ✅ 통과
- TC01 - [테스트명]
- TC02 - [테스트명]

### ❌ 실패
- TC03 - [테스트명]
  - **원인**: [에러 메시지]
  - **위치**: [파일명:라인번호]
  - **조치 필요**: [분석 내용]

### ⏭ 스킵
- TC04 - [테스트명] (사유: [이유])

---

## 종합 의견

[전체 결과에 대한 AI 분석 및 권고사항]
```

---

## 실패 분석 기준

| 실패 유형 | 원인 추정 | 권고 조치 |
|----------|----------|----------|
| `locator not found` | 페이지 UI 변경 | change-detection 실행 |
| `timeout` | 네트워크 지연 또는 요소 미노출 | 대기 시간 조정 또는 TC 재검토 |
| `expect failed` | 기대값 불일치 | 실제 동작 확인 후 TC/코드 수정 |
| `dialog not triggered` | 서비스 동작 변경 | change-detection 실행 |
| `URL mismatch` | 리다이렉트 변경 | 실제 URL 확인 후 코드 수정 |

---

## reports/ 폴더 관리

- 매 실행마다 결과 파일 덮어쓰기 (최신 결과 유지)
- 이력이 필요한 경우: `[feature]-result-[YYYY-MM-DD].md` 형식으로 날짜 포함

---

## playwright-cli 기반 실패 재현 모드

`npx playwright test` 실패 시, 같은 시나리오를 `playwright-cli`로 재현하여 원인을 분리합니다.

### 1) Trace + Video 동시 수집

```bash
playwright-cli tracing-start
playwright-cli video-start

playwright-cli open [URL]
playwright-cli snapshot
# 실패 지점 액션 재현
playwright-cli click e[N]

playwright-cli tracing-stop
playwright-cli video-stop reports/[feature]-failure.webm
```

### 2) 네트워크 원인 분리 (선택)

API 불안정이 의심되면 mock 재현:

```bash
playwright-cli route "**/api/*" --status=200 --body='{"ok":true}' --content-type=application/json
playwright-cli open [URL]
playwright-cli snapshot
playwright-cli unroute "**/api/*"
```

mock에서만 통과하면 외부 의존성 이슈로 분류하고, 실제 환경에서도 실패하면 UI/Locator/로직 변경으로 분류.
