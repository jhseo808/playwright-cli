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
① Page Analysis       → 페이지 구조 및 기능 파악
    │                    (references/page-analysis.md)
    ▼
② Testcase Writing    → testcase/[feature].md 생성 또는 업데이트
    │                    (references/testcase-writing.md)
    ▼
③ Code Generation     → tests/[feature].spec.ts 생성 또는 업데이트
    │                    (references/code-generation.md)
    ▼
④ Test Execution      → npx playwright test 실행 + 결과 수집
    │                    (references/test-execution.md)
    ▼
⑤ Change Detection    → 기존 TC/코드와 비교 후 수정·추가
                         (references/change-detection.md)
```

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
