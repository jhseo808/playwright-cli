import { test, expect } from '@playwright/test';
import { MelonChartPage } from '../pages/melon-chart-page';

test.describe('멜론 차트 테스트', () => {

  let chartPage: MelonChartPage;

  test.beforeEach(async ({ page }) => {
    chartPage = new MelonChartPage(page);
  });

  // ─── TOP100 ────────────────────────────────────────────────

  test('TC01 - TOP100 페이지 정상 진입 확인', async ({ page }) => {
    // Given / When
    await chartPage.gotoTop100();

    // Then
    await expect(page).toHaveURL(/chart\/index\.htm/);
    await expect(page).toHaveTitle(/TOP100/);
    await expect(page.getByRole('heading', { name: 'TOP100' })).toBeVisible();
  });

  test('TC02 - 차트 서브메뉴 UI 노출 확인', async ({ page }) => {
    // Given
    await chartPage.gotoTop100();

    // Then
    await expect(chartPage.top100Link).toBeVisible();
    await expect(chartPage.hot100Link).toBeVisible();
    await expect(chartPage.dailyLink).toBeVisible();
    await expect(chartPage.weeklyLink).toBeVisible();
    await expect(chartPage.monthlyLink).toBeVisible();
    await expect(chartPage.eraLink).toBeVisible();
    await expect(chartPage.chartFinderButton).toBeVisible();
  });

  test('TC03 - TOP100 차트 테이블 컬럼 UI 확인', async ({ page }) => {
    // Given
    await chartPage.gotoTop100();

    // Then
    await expect(chartPage.chartTable).toBeVisible();
    await expect(chartPage.rankHeader).toBeVisible();
    await expect(chartPage.songInfoHeader).toBeVisible();
    await expect(chartPage.albumHeader).toBeVisible();
    await expect(chartPage.likeHeader).toBeVisible();
  });

  test('TC04 - TOP100 액션 버튼 노출 확인', async ({ page }) => {
    // Given
    await chartPage.gotoTop100();

    // Then
    await expect(chartPage.shufflePlayButton).toBeVisible();
    await expect(chartPage.playAllButton).toBeVisible();
    await expect(chartPage.addButton).toBeVisible();
    await expect(chartPage.downloadButton).toBeVisible();
    await expect(chartPage.flacButton).toBeVisible();
    await expect(chartPage.giftButton).toBeVisible();
  });

  test('TC05 - TOP100 시간선택 및 새로고침 버튼 노출 확인', async ({ page }) => {
    // Given
    await chartPage.gotoTop100();

    // Then
    await expect(chartPage.timeSelectButton).toBeVisible();
    await expect(chartPage.refreshButton).toBeVisible();
  });

  test('TC06 - TOP100 전체선택 체크박스 동작 확인', async ({ page }) => {
    // Given
    await chartPage.gotoTop100();

    // Then: 기본값 미체크
    await expect(chartPage.selectAllCheckbox).not.toBeChecked();

    // When: 체크박스 클릭
    await chartPage.toggleSelectAll();

    // Then: 체크 활성화
    await expect(chartPage.selectAllCheckbox).toBeChecked();
  });

  // ─── HOT100 ───────────────────────────────────────────────

  test('TC07 - HOT100 탭 클릭 시 페이지 이동 확인', async ({ page }) => {
    // Given
    await chartPage.gotoTop100();

    // When
    await chartPage.clickHot100Tab();

    // Then
    await expect(page).toHaveURL(/chart\/hot100\/index\.htm/);
    await expect(page).toHaveTitle(/HOT100/);
  });

  test('TC08 - HOT100 페이지 정상 진입 확인', async ({ page }) => {
    // Given / When
    await chartPage.gotoHot100();

    // Then
    await expect(page).toHaveURL(/chart\/hot100\/index\.htm/);
    await expect(page).toHaveTitle(/HOT100/);
  });

  test('TC09 - HOT100 전용 필터 탭 노출 확인', async ({ page }) => {
    // Given
    await chartPage.gotoHot100();

    // Then: HOT100 전용 필터 노출
    await expect(chartPage.hot100Filter100Days).toBeVisible();
    await expect(chartPage.hot100Filter30Days).toBeVisible();
  });

  test('TC10 - HOT100 차트 테이블 및 액션 버튼 노출 확인', async ({ page }) => {
    // Given
    await chartPage.gotoHot100();

    // Then
    await expect(chartPage.chartTable).toBeVisible();
    await expect(chartPage.shufflePlayButton).toBeVisible();
    await expect(chartPage.playAllButton).toBeVisible();
    await expect(chartPage.addButton).toBeVisible();
    await expect(chartPage.downloadButton).toBeVisible();
  });

  test('TC11 - TOP100에서 HOT100으로 이동 후 뒤로가기', async ({ page }) => {
    // Given
    await chartPage.gotoTop100();

    // When: HOT100 이동
    await chartPage.clickHot100Tab();
    await expect(page).toHaveURL(/chart\/hot100\/index\.htm/);

    // When: 뒤로가기
    await chartPage.goBack();

    // Then: TOP100 복귀
    await expect(page).toHaveURL(/chart\/index\.htm/);
  });

  test('TC12 - 툴팁 버튼 노출 확인', async ({ page }) => {
    // Given
    await chartPage.gotoTop100();

    // Then
    await expect(chartPage.tooltipButton).toBeVisible();
  });

});
