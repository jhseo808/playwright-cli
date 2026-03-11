import { test, expect } from '@playwright/test';

/**
 * [기능명] 테스트
 * URL: [대상 URL]
 * 작성일: [YYYY-MM-DD]
 */
test.describe('[기능명] 테스트', () => {

  // ─── Happy Path ────────────────────────────────────────────

  test('TC01 - [정상 케이스 목적]', async ({ page }) => {
    // Given: 초기 조건
    await page.goto('[URL]');

    // When: 사용자 액션
    await page.getByRole('button', { name: '[버튼명]' }).click();

    // Then: 결과 검증
    await expect(page).toHaveURL(/[expected-url-pattern]/);
    await expect(page.getByRole('heading', { name: '[제목]' })).toBeVisible();
  });

  // ─── 에러 / 예외 케이스 ────────────────────────────────────

  test('TC02 - [에러 케이스 목적]', async ({ page }) => {
    // Given
    await page.goto('[URL]');

    // When: 잘못된 입력
    await page.getByRole('textbox', { name: '[필드명]' }).fill('[잘못된 값]');
    await page.getByRole('button', { name: '[제출 버튼]' }).click();

    // Then: 오류 메시지 확인
    await expect(page.getByText('[오류 메시지]')).toBeVisible();
    await expect(page).toHaveURL(/[current-url-pattern]/);
  });

  test('TC03 - [필수값 미입력 케이스]', async ({ page }) => {
    // Given
    await page.goto('[URL]');

    // When: 필수값 비워두고 제출
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      await dialog.accept();
    });
    await page.getByRole('button', { name: '[제출 버튼]' }).click();

    // Then: 페이지 이동 없음 확인
    await expect(page).toHaveURL(/[current-url-pattern]/);
  });

  // ─── UI 노출 확인 ──────────────────────────────────────────

  test('TC04 - [UI 요소 노출 확인]', async ({ page }) => {
    // Given
    await page.goto('[URL]');

    // Then: 주요 UI 요소 노출 확인
    await expect(page.getByRole('button', { name: '[버튼1]' })).toBeVisible();
    await expect(page.getByRole('button', { name: '[버튼2]' })).toBeVisible();
    await expect(page.getByRole('link', { name: '[링크명]' })).toBeVisible();
  });

  test('TC05 - [링크 / 네비게이션 확인]', async ({ page }) => {
    // Given
    await page.goto('[URL]');

    // Then: 링크 존재 확인
    await expect(page.getByRole('link', { name: '[링크1]' })).toBeVisible();
    await expect(page.getByRole('link', { name: '[링크2]' })).toBeVisible();
  });

});
