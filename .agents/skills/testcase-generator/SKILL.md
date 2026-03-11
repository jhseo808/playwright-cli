---
name: testcase-generator
description: Generate structured Playwright test cases by exploring a website with playwright-cli. Use when the user wants to create test cases for a URL or feature, write automated tests, generate a spec file, or document test scenarios.
allowed-tools: Bash(playwright-cli:*), Write, Read, Glob
---

# Testcase Generator

Explore a website using `playwright-cli` and generate structured Playwright TypeScript test cases saved to `tests/`.

## Workflow

### 1. Understand the scope
Ask (or infer from context):
- **Target URL** — what page to test
- **Feature name** — used for the file name (e.g. `login`, `signup`, `checkout`)
- **Scenarios** — what test cases to cover (if not given, discover them by exploring)

### 2. Explore with playwright-cli
```bash
playwright-cli open [URL]
playwright-cli snapshot
# navigate through key flows and take snapshots
playwright-cli click e[N]
playwright-cli snapshot
playwright-cli close
```

Focus on:
- Happy path (normal user flow)
- Validation / error cases (empty fields, wrong input)
- UI element visibility (buttons, links, forms)
- Navigation / URL changes

### 3. Write test cases

Use the template at [templates/testcase.spec.ts](templates/testcase.spec.ts).

Rules:
- File name: `tests/[feature-name].spec.ts`
- Group tests under `test.describe('[기능명] 테스트', ...)`
- Number each test: `TC01`, `TC02`, ... in order
- Each test must be **independent** (no shared state between tests)
- Use **role-based locators** (`getByRole`, `getByLabel`, `getByText`) — avoid CSS selectors
- Add `expect` assertions for every meaningful outcome
- Write comments in Korean (Given / When / Then pattern)

### 4. Save the file

Write the completed spec to `tests/[feature-name].spec.ts`.

Confirm the file path and test count to the user when done.

---

## TC naming convention

| Pattern | Description |
|---------|-------------|
| `TC01 - [목적]` | Happy path / 정상 케이스 |
| `TC02~` | 에러/예외 케이스 |
| Last TCs | UI 노출 확인, 링크 확인 등 |

## Assertion cheatsheet

```typescript
await expect(page).toHaveURL(/pattern/);
await expect(page).toHaveTitle(/title/);
await expect(locator).toBeVisible();
await expect(locator).toHaveText('text');
await expect(locator).toBeEnabled();
await expect(locator).toBeDisabled();
await expect(locator).toHaveValue('value');
```

## Locator cheatsheet

```typescript
page.getByRole('button', { name: '로그인' })
page.getByRole('textbox', { name: '아이디 입력' })
page.getByRole('link', { name: '회원가입' })
page.getByLabel('이메일')
page.getByText('오류 메시지')
page.locator('text=직접 텍스트')
```
