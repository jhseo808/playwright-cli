import { test, expect } from '@playwright/test';

test.describe('멜론 로그인 테스트', () => {

  test('TC01 - 멜론아이디 로그인 페이지 진입', async ({ page }) => {
    // 멜론 메인 접속
    await page.goto('https://www.melon.com/');
    await expect(page).toHaveTitle(/Melon/);

    // 로그인 버튼 클릭
    await page.getByRole('button', { name: '로그인' }).click();
    await expect(page).toHaveURL(/accounts\.melon\.com\/login\/login/);

    // 멜론아이디 로그인 버튼 클릭
    await page.getByRole('button', { name: '멜론아이디 로그인' }).click();
    await expect(page).toHaveURL(/accounts\.melon\.com\/login\/loginm/);

    // 아이디/비밀번호 입력란 노출 확인
    await expect(page.getByRole('textbox', { name: '아이디 입력' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: '비밀번호 입력' })).toBeVisible();
    await expect(page.getByRole('button', { name: '로그인' })).toBeVisible();
  });

  test('TC02 - 잘못된 아이디/비밀번호로 로그인 시 오류 메시지 출력', async ({ page }) => {
    await page.goto('https://www.melon.com/');
    await page.getByRole('button', { name: '로그인' }).click();
    await page.getByRole('button', { name: '멜론아이디 로그인' }).click();

    // 잘못된 계정 정보 입력
    await page.getByRole('textbox', { name: '아이디 입력' }).fill('test');
    await page.getByRole('textbox', { name: '비밀번호 입력' }).fill('test123');
    await page.getByRole('button', { name: '로그인' }).click();

    // 오류 메시지 확인
    await expect(page.locator('text=아이디가 등록되어 있지 않거나, 아이디 또는 비밀번호를 잘못 입력하셨습니다')).toBeVisible();

    // URL이 로그인 페이지에 머물러 있는지 확인
    await expect(page).toHaveURL(/accounts\.melon\.com\/login\/loginm/);
  });

  test('TC03 - 아이디 미입력 상태에서 로그인 시도', async ({ page }) => {
    await page.goto('https://www.melon.com/');
    await page.getByRole('button', { name: '로그인' }).click();
    await page.getByRole('button', { name: '멜론아이디 로그인' }).click();

    // 아이디 비워두고 비밀번호만 입력
    await page.getByRole('textbox', { name: '비밀번호 입력' }).fill('test123');

    // alert 다이얼로그 처리 (멜론은 미입력 시 alert를 띄움)
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      await dialog.accept();
    });

    await page.getByRole('button', { name: '로그인' }).click();

    // 로그인 페이지에 머물러 있는지 확인
    await expect(page).toHaveURL(/accounts\.melon\.com\/login\/loginm/);
  });

  test('TC04 - 비밀번호 미입력 상태에서 로그인 시도', async ({ page }) => {
    await page.goto('https://www.melon.com/');
    await page.getByRole('button', { name: '로그인' }).click();
    await page.getByRole('button', { name: '멜론아이디 로그인' }).click();

    // 아이디만 입력하고 비밀번호 비워두기
    await page.getByRole('textbox', { name: '아이디 입력' }).fill('test');
    await page.getByRole('button', { name: '로그인' }).click();

    // 로그인 페이지에 머물러 있는지 확인
    await expect(page).toHaveURL(/accounts\.melon\.com\/login\/loginm/);
  });

  test('TC05 - 카카오계정 로그인 버튼 노출 확인', async ({ page }) => {
    await page.goto('https://www.melon.com/');
    await page.getByRole('button', { name: '로그인' }).click();

    // 로그인 옵션 3가지 모두 노출 확인
    await expect(page.getByRole('button', { name: '카카오계정 로그인' })).toBeVisible();
    await expect(page.getByRole('button', { name: '멜론아이디 로그인' })).toBeVisible();
    await expect(page.getByRole('link', { name: '회원가입' })).toBeVisible();
  });

  test('TC06 - 아이디 찾기 / 비밀번호 찾기 링크 확인', async ({ page }) => {
    await page.goto('https://www.melon.com/');
    await page.getByRole('button', { name: '로그인' }).click();
    await page.getByRole('button', { name: '멜론아이디 로그인' }).click();

    await expect(page.getByRole('link', { name: '아이디 찾기' })).toBeVisible();
    await expect(page.getByRole('link', { name: '비밀번호 찾기' })).toBeVisible();
  });

});
