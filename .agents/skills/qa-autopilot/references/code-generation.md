# Code Generation

`testcase/[feature].md`를 읽어 Page Object Model(POM) 구조의 Playwright 테스트 코드를 생성합니다.

---

## POM 파일 구조

```
project/
├── pages/
│   └── [feature]-page.ts     ← Page Object (요소 정의 + 액션 메서드)
└── tests/
    └── [feature].spec.ts     ← 테스트 스펙 (TC 기반 시나리오)
```

---

## Page Object 작성 규칙 (`pages/[feature]-page.ts`)

### 기본 구조

```typescript
import { Page, Locator } from '@playwright/test';

export class [Feature]Page {
  readonly page: Page;

  // ─── Locators ──────────────────────────────────────────────
  readonly [elementName]: Locator;

  constructor(page: Page) {
    this.page = page;
    this.[elementName] = page.getByRole('[role]', { name: '[name]' });
  }

  // ─── Actions ───────────────────────────────────────────────
  async goto() {
    await this.page.goto('[URL]');
  }

  async [actionName]([params]) {
    // 단일 책임: 하나의 메서드는 하나의 액션
  }
}
```

### Locator 정의 원칙
- `getByRole()` 우선 사용 (시맨틱, 변경에 강함)
- `getByLabel()` → `getByText()` → `locator()` 순서로 폴백
- CSS selector, XPath는 최후 수단

### Action 메서드 원칙
- 메서드 하나 = 사용자 행동 하나
- 반환값이 필요하면 `Promise<string | boolean>` 등 명시
- dialog 처리는 Page Object 내부에서 처리

### POM 예시 (로그인)

```typescript
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Locators
  readonly loginButton: Locator;
  readonly melonIdLoginButton: Locator;
  readonly idInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly keepLoginCheckbox: Locator;
  readonly errorMessage: Locator;
  readonly findIdLink: Locator;
  readonly findPasswordLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole('button', { name: '로그인' });
    this.melonIdLoginButton = page.getByRole('button', { name: '멜론아이디 로그인' });
    this.idInput = page.getByRole('textbox', { name: '아이디 입력' });
    this.passwordInput = page.getByRole('textbox', { name: '비밀번호 입력' });
    this.submitButton = page.getByRole('button', { name: '로그인' });
    this.keepLoginCheckbox = page.getByRole('checkbox', { name: '로그인 상태 유지' });
    this.errorMessage = page.getByRole('paragraph').filter({ hasText: '아이디가 등록되어' });
    this.findIdLink = page.getByRole('link', { name: '아이디 찾기' });
    this.findPasswordLink = page.getByRole('link', { name: '비밀번호 찾기' });
  }

  async goto() {
    await this.page.goto('https://www.melon.com/');
  }

  async clickLoginButton() {
    await this.loginButton.click();
  }

  async goToMelonIdLogin() {
    await this.clickLoginButton();
    await this.melonIdLoginButton.click();
  }

  async login(id: string, password: string) {
    await this.idInput.fill(id);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async submitWithDialogCapture(): Promise<string> {
    const dialogPromise = this.page.waitForEvent('dialog');
    await this.submitButton.click();
    const dialog = await dialogPromise;
    const message = dialog.message();
    await dialog.accept();
    return message;
  }
}
```

---

## Spec 파일 작성 규칙 (`tests/[feature].spec.ts`)

### 기본 구조

```typescript
import { test, expect } from '@playwright/test';
import { [Feature]Page } from '../pages/[feature]-page';

test.describe('[기능명] 테스트', () => {
  let [feature]Page: [Feature]Page;

  test.beforeEach(async ({ page }) => {
    [feature]Page = new [Feature]Page(page);
    await [feature]Page.goto();
  });

  test('TC01 - [목적]', async () => {
    // Given / When / Then
  });
});
```

### TC 코드 변환 원칙

| TC 단계 | 코드 패턴 |
|---------|----------|
| 페이지 이동 | `await page.goto()` (beforeEach에서 처리) |
| 버튼 클릭 | `await [page].[clickMethod]()` |
| 입력 | `await [page].[fillMethod](value)` |
| URL 검증 | `await expect(page).toHaveURL(/pattern/)` |
| 요소 노출 확인 | `await expect([page].[locator]).toBeVisible()` |
| alert 검증 | `const msg = await [page].submitWithDialogCapture()` + `expect(msg).toBe(...)` |
| 체크박스 상태 | `await expect([page].[checkbox]).toBeChecked()` |

### beforeEach 활용
- 모든 TC에서 공통되는 초기 이동 단계는 `beforeEach`에서 처리
- TC별로 다른 사전 조건은 각 test 내부에서 처리

---

## 파일 생성 순서

1. `pages/[feature]-page.ts` 먼저 생성
2. `tests/[feature].spec.ts` 생성 (Page Object import)
3. `pages/` 디렉토리 없으면 생성

---

## 업데이트 규칙

- 기능 추가 → Page Object에 Locator/메서드 추가 + spec에 TC 추가
- 기능 변경 → Page Object Locator 수정 (spec은 변경 최소화)
- 기능 삭제 → 해당 메서드/TC 제거
