import { test, expect } from '@playwright/test';

/**
 * 멜론 로그인 테스트
 * URL: https://www.melon.com/
 * 작성일: 2026-03-11
 */
test.describe('멜론 로그인 테스트', () => {

  // ─── Happy Path ────────────────────────────────────────────

  test('TC01 - 멜론 메인에서 로그인 선택 화면 진입', async ({ page }) => {
    // Given: 멜론 메인 접속
    await page.goto('https://www.melon.com/');
    await expect(page).toHaveTitle(/Melon/);

    // When: 로그인 버튼 클릭
    await page.getByRole('button', { name: '로그인' }).click();

    // Then: 로그인 선택 화면으로 이동
    await expect(page).toHaveURL(/accounts\.melon\.com\/login\/login/);
  });

  test('TC02 - 로그인 선택 화면 UI 요소 노출 확인', async ({ page }) => {
    // Given: 로그인 선택 화면 접속
    await page.goto('https://www.melon.com/');
    await page.getByRole('button', { name: '로그인' }).click();
    await expect(page).toHaveURL(/accounts\.melon\.com\/login\/login/);

    // Then: 3가지 로그인 옵션 및 회원가입 링크 노출 확인
    await expect(page.getByRole('link', { name: '카카오 QR코드 로그인' })).toBeVisible();
    await expect(page.getByRole('button', { name: '카카오계정 로그인' })).toBeVisible();
    await expect(page.getByRole('button', { name: '멜론아이디 로그인' })).toBeVisible();
    await expect(page.getByRole('link', { name: '회원가입' })).toBeVisible();
  });

  test('TC03 - 멜론아이디 로그인 폼 진입 및 UI 확인', async ({ page }) => {
    // Given: 로그인 선택 화면
    await page.goto('https://www.melon.com/');
    await page.getByRole('button', { name: '로그인' }).click();

    // When: 멜론아이디 로그인 클릭
    await page.getByRole('button', { name: '멜론아이디 로그인' }).click();

    // Then: 로그인 폼 URL 및 입력 요소 확인
    await expect(page).toHaveURL(/accounts\.melon\.com\/login\/loginm/);
    await expect(page.getByRole('textbox', { name: '아이디 입력' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '비밀번호 입력' })).toBeVisible();
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: '로그인 상태 유지' })).toBeVisible();
  });

  // ─── 에러 / 예외 케이스 ────────────────────────────────────

  test('TC04 - 잘못된 아이디/비밀번호로 로그인 시 오류 메시지 출력', async ({ page }) => {
    // Given: 멜론아이디 로그인 폼
    await page.goto('https://www.melon.com/');
    await page.getByRole('button', { name: '로그인' }).click();
    await page.getByRole('button', { name: '멜론아이디 로그인' }).click();

    // When: 잘못된 계정 정보 입력
    await page.getByRole('textbox', { name: '아이디 입력' }).fill('testuser_invalid');
    await page.getByRole('textbox', { name: '비밀번호 입력' }).fill('wrongpass123');
    await page.getByRole('button', { name: '로그인' }).click();

    // Then: 정확한 오류 메시지 노출 및 로그인 페이지 유지
    await expect(page.getByText('현재 입력하신 아이디가 등록되어 있지 않거나, 아이디 또는 비밀번호를 잘못 입력하셨습니다.')).toBeVisible();
    await expect(page).toHaveURL(/accounts\.melon\.com\/login\/loginm/);
  });

  test('TC05 - 아이디 미입력 상태에서 로그인 시도 시 alert 확인', async ({ page }) => {
    // Given: 멜론아이디 로그인 폼
    await page.goto('https://www.melon.com/');
    await page.getByRole('button', { name: '로그인' }).click();
    await page.getByRole('button', { name: '멜론아이디 로그인' }).click();

    // When: 아이디 비워두고 비밀번호만 입력 후 제출
    await page.getByRole('textbox', { name: '비밀번호 입력' }).fill('testpass123');

    const dialogPromise = page.waitForEvent('dialog');
    await page.getByRole('button', { name: '로그인' }).click();
    const dialog = await dialogPromise;

    // Then: alert 메시지 및 로그인 페이지 유지
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toBe('아이디를 입력하세요');
    await dialog.accept();
    await expect(page).toHaveURL(/accounts\.melon\.com\/login\/loginm/);
  });

  test('TC06 - 비밀번호 미입력 상태에서 로그인 시도 시 alert 확인', async ({ page }) => {
    // Given: 멜론아이디 로그인 폼
    await page.goto('https://www.melon.com/');
    await page.getByRole('button', { name: '로그인' }).click();
    await page.getByRole('button', { name: '멜론아이디 로그인' }).click();

    // When: 아이디만 입력하고 비밀번호 비워둔 채 제출
    await page.getByRole('textbox', { name: '아이디 입력' }).fill('testuser');

    const dialogPromise = page.waitForEvent('dialog');
    await page.getByRole('button', { name: '로그인' }).click();
    const dialog = await dialogPromise;

    // Then: alert 메시지 및 로그인 페이지 유지
    expect(dialog.type()).toBe('alert');
    expect(dialog.message()).toBe('비밀번호를 입력하세요');
    await dialog.accept();
    await expect(page).toHaveURL(/accounts\.melon\.com\/login\/loginm/);
  });

  // ─── UI 노출 확인 ──────────────────────────────────────────

  test('TC07 - 아이디 찾기 / 비밀번호 찾기 링크 확인', async ({ page }) => {
    // Given: 멜론아이디 로그인 폼
    await page.goto('https://www.melon.com/');
    await page.getByRole('button', { name: '로그인' }).click();
    await page.getByRole('button', { name: '멜론아이디 로그인' }).click();

    // Then: 링크 노출 확인
    await expect(page.getByRole('link', { name: '아이디 찾기' })).toBeVisible();
    await expect(page.getByRole('link', { name: '비밀번호 찾기' })).toBeVisible();
  });

  test('TC08 - 로그인 상태 유지 체크박스 기본값 및 클릭 동작 확인', async ({ page }) => {
    // Given: 멜론아이디 로그인 폼
    await page.goto('https://www.melon.com/');
    await page.getByRole('button', { name: '로그인' }).click();
    await page.getByRole('button', { name: '멜론아이디 로그인' }).click();

    const checkbox = page.getByRole('checkbox', { name: '로그인 상태 유지' });

    // Then: 기본값 미체크 확인
    await expect(checkbox).not.toBeChecked();

    // When: 체크박스 클릭
    await checkbox.click();

    // Then: 체크 상태 변경 확인
    await expect(checkbox).toBeChecked();
  });

  test('TC09 - 로그인 폼 하단 약관 링크 노출 확인', async ({ page }) => {
    // Given: 멜론아이디 로그인 폼
    await page.goto('https://www.melon.com/');
    await page.getByRole('button', { name: '로그인' }).click();
    await page.getByRole('button', { name: '멜론아이디 로그인' }).click();

    // Then: 하단 서비스 이용 약관 링크 노출 확인
    await expect(page.getByRole('link', { name: '이용약관' })).toBeVisible();
    await expect(page.getByRole('link', { name: '위치기반서비스이용약관' })).toBeVisible();
    await expect(page.getByRole('link', { name: '개인정보처리방침' })).toBeVisible();
  });

});
