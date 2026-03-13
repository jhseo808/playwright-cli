# Testcase Writing

page-analysis 결과를 바탕으로 `testcase/[feature].md` 문서를 작성합니다.

---

## 파일 생성 규칙

- 경로: `testcase/[feature].md`
- 신규: 전체 문서 생성
- 업데이트: 변경된 TC만 수정, 새 TC 추가, 삭제된 기능은 `[deprecated]` 표기

---

## 문서 헤더 형식

```markdown
# [기능명] 테스트케이스

| 항목 | 내용 |
|------|------|
| 대상 URL | [URL] |
| 최초 작성일 | [YYYY-MM-DD] |
| 최종 수정일 | [YYYY-MM-DD] |
| 작성자 | QA Autopilot |
| 총 TC 수 | [N]개 |
| 버전 | v[N] |
```

---

## TC 작성 형식

```markdown
## TC[NN] - [테스트 목적]

| 항목 | 내용 |
|------|------|
| 테스트 유형 | [Happy Path / 에러 케이스 / UI 확인 / 동작 확인] |
| 우선순위 | [High / Medium / Low] |
| 상태 | [Active / Deprecated] |

**사전 조건**
- [조건 1]
- [조건 2]

**테스트 단계**
1. [단계 1]
2. [단계 2]
3. [단계 3]

**기대 결과**
- [기대 결과 1]
- [기대 결과 2]

---
```

---

## TC 구성 전략

### 순서 원칙
1. **TC01~**: Happy Path (정상 흐름) — 핵심 기능부터
2. **TC중간~**: 에러/예외 케이스 — 빈값, 잘못된 입력, 권한 없음
3. **TC후반~**: UI 확인 — 요소 노출, 링크, 레이아웃
4. **TC마지막~**: 동작 확인 — 체크박스, 토글, 상태 변화

### 우선순위 기준

| 유형 | 우선순위 | 이유 |
|------|---------|------|
| 핵심 기능 정상 흐름 | High | 서비스 핵심 가치 |
| 에러/예외 처리 | High | 사용자 경험 보호 |
| UI 요소 노출 | Medium | 브랜드/UX 일관성 |
| 부가 동작 확인 | Low | 편의 기능 |

### TC 독립성 원칙
- 각 TC는 반드시 독립적으로 실행 가능해야 함
- 이전 TC의 상태에 의존하지 않음
- 각 TC는 자체 사전 조건(URL 접속)부터 시작

---

## 자연어 변환 규칙

코드 액션을 사람이 읽는 단계로 변환:

| 코드 | 자연어 |
|------|--------|
| `page.goto(url)` | [URL] 접속 |
| `getByRole('button').click()` | [버튼명] 버튼 클릭 |
| `getByRole('textbox').fill(v)` | [필드명] 입력란에 [값] 입력 |
| `getByRole('checkbox').click()` | [체크박스명] 체크박스 클릭 |
| `waitForEvent('dialog')` | 팝업(alert) 발생 대기 |
| `dialog.accept()` | 팝업 확인 클릭 |
| `expect(page).toHaveURL()` | URL이 [패턴]으로 이동 확인 |
| `expect(locator).toBeVisible()` | [요소명] 화면에 노출 확인 |
| `expect(locator).toBeChecked()` | [체크박스] 체크 상태 확인 |
| `expect(dialog.message())` | 팝업 메시지 [내용] 확인 |

---

## 버전 관리

- 최초 작성: `v1`
- 기능 추가: 마이너 버전 업 (`v1` → `v1.1`)
- 대규모 변경: 메이저 버전 업 (`v1` → `v2`)
- deprecated TC는 삭제하지 않고 상태만 변경 (이력 보존)
