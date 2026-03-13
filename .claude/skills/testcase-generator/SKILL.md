---
name: testcase-generator
description: Generate test case documentation from Playwright spec files. Reads tests/*.spec.ts files and creates human-readable testcase/*.md documents organized by feature. Use when the user wants to document test cases, generate a testcase report, or create QA documentation from existing playwright tests.
allowed-tools: Read, Write, Glob
---

# Testcase Generator

Reads Playwright spec files from `tests/` and generates structured test case documentation in `testcase/`.

## Workflow

### 1. Scan spec files
```
Glob: tests/*.spec.ts
```
- If a specific feature is given, target that file only
- Otherwise, process all spec files

### 2. Parse each spec file

From each `tests/[feature].spec.ts`, extract:
- `test.describe(...)` → 기능명 (Feature name)
- Each `test('TCxx - ...', ...)` → 개별 테스트케이스
  - TC ID (e.g. TC01)
  - 테스트 목적 (purpose from the test name)
  - 사전 조건 (precondition: `page.goto(...)` calls)
  - 테스트 단계 (steps: actions — `click`, `fill`, `goto`, etc.)
  - 기대 결과 (expected: `expect(...)` assertions)

### 3. Generate documentation

Output file: `testcase/[feature].md`

Use this format for each test case:

```markdown
# [기능명] 테스트케이스

| 항목 | 내용 |
|------|------|
| 대상 URL | [URL] |
| 작성일 | [YYYY-MM-DD] |
| 작성자 | - |

---

## TC01 - [테스트 목적]

| 항목 | 내용 |
|------|------|
| 테스트 유형 | [Happy Path / 에러 케이스 / UI 확인] |
| 우선순위 | [High / Medium / Low] |

**사전 조건**
- [preconditions]

**테스트 단계**
1. [step 1]
2. [step 2]
3. ...

**기대 결과**
- [expected result 1]
- [expected result 2]

---
```

### 4. Priority rules

| TC 범위 | 테스트 유형 | 우선순위 |
|---------|-----------|---------|
| Happy path (정상 흐름) | Happy Path | High |
| 에러/예외/미입력 | 에러 케이스 | High |
| UI 노출/링크 확인 | UI 확인 | Medium |
| 기타 동작 확인 | 동작 확인 | Low |

### 5. Save & confirm

- Create `testcase/` directory if it doesn't exist
- Write `testcase/[feature].md`
- Report: feature name, file path, number of TCs documented

## Feature naming

The output file name matches the spec file name:
- `tests/melon-login.spec.ts` → `testcase/melon-login.md`
- `tests/melon-signup.spec.ts` → `testcase/melon-signup.md`
- `tests/checkout.spec.ts` → `testcase/checkout.md`

## Notes

- Write all documentation in **Korean**
- Translate code-level steps into natural language (e.g. `await page.getByRole('button', { name: '로그인' }).click()` → "로그인 버튼 클릭")
- Do NOT include raw TypeScript code in the output document
- Each TC section must be self-contained (reader should not need to see the code)
