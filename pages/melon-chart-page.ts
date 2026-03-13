import { Page, Locator } from '@playwright/test';

export class MelonChartPage {
  readonly page: Page;

  // ─── URLs ──────────────────────────────────────────────────
  static readonly TOP100_URL = 'https://www.melon.com/chart/index.htm';
  static readonly HOT100_URL = 'https://www.melon.com/chart/hot100/index.htm';

  // ─── Sub Navigation ────────────────────────────────────────
  readonly top100Link: Locator;
  readonly hot100Link: Locator;
  readonly dailyLink: Locator;
  readonly weeklyLink: Locator;
  readonly monthlyLink: Locator;
  readonly eraLink: Locator;
  readonly chartFinderButton: Locator;

  // ─── Chart Controls ────────────────────────────────────────
  readonly timeSelectButton: Locator;
  readonly refreshButton: Locator;
  readonly tooltipButton: Locator;

  // ─── Action Buttons ────────────────────────────────────────
  readonly shufflePlayButton: Locator;
  readonly playAllButton: Locator;
  readonly addButton: Locator;
  readonly downloadButton: Locator;
  readonly flacButton: Locator;
  readonly giftButton: Locator;

  // ─── Chart Table ───────────────────────────────────────────
  readonly chartTable: Locator;
  readonly selectAllCheckbox: Locator;
  readonly rankHeader: Locator;
  readonly songInfoHeader: Locator;
  readonly albumHeader: Locator;
  readonly likeHeader: Locator;

  // ─── HOT100 전용 ───────────────────────────────────────────
  readonly hot100Filter100Days: Locator;
  readonly hot100Filter30Days: Locator;

  constructor(page: Page) {
    this.page = page;

    // Sub Navigation
    this.top100Link = page.getByRole('link', { name: 'TOP100' });
    this.hot100Link = page.getByRole('link', { name: 'HOT100' });
    this.dailyLink = page.getByRole('link', { name: '일간' });
    this.weeklyLink = page.getByRole('link', { name: '주간' });
    this.monthlyLink = page.getByRole('link', { name: '월간' });
    this.eraLink = page.getByRole('link', { name: '시대' });
    this.chartFinderButton = page.getByRole('button', { name: '차트 파인더' });

    // Chart Controls
    this.timeSelectButton = page.getByRole('button', { name: '시간선택' });
    this.refreshButton = page.getByRole('button', { name: '새로고침' });
    this.tooltipButton = page.getByRole('button', { name: '툴팁보기' });

    // Action Buttons
    this.shufflePlayButton = page.getByRole('button', { name: '셔플듣기' });
    this.playAllButton = page.getByRole('button', { name: '전체듣기' });
    this.addButton = page.getByRole('button', { name: '담기' }).first();
    this.downloadButton = page.getByRole('button', { name: '다운' }).first();
    this.flacButton = page.getByRole('button', { name: 'FLAC' });
    this.giftButton = page.getByRole('button', { name: '선물' }).first();

    // Chart Table
    this.chartTable = page.getByRole('table');
    this.selectAllCheckbox = page.getByRole('checkbox', { name: '곡 목록 전체 선택' });
    this.rankHeader = page.getByRole('columnheader', { name: '순위', exact: true });
    this.songInfoHeader = page.getByRole('columnheader', { name: '곡정보' });
    this.albumHeader = page.getByRole('columnheader', { name: '앨범', exact: true });
    this.likeHeader = page.getByRole('columnheader', { name: '좋아요' });

    // HOT100 전용 필터
    this.hot100Filter100Days = page.getByText('발매100일');
    this.hot100Filter30Days = page.getByText('발매30일');
  }

  // ─── Actions ───────────────────────────────────────────────

  async gotoTop100() {
    await this.page.goto(MelonChartPage.TOP100_URL);
  }

  async gotoHot100() {
    await this.page.goto(MelonChartPage.HOT100_URL);
  }

  async clickHot100Tab() {
    await this.hot100Link.click();
  }

  async clickTop100Tab() {
    await this.top100Link.click();
  }

  async toggleSelectAll() {
    await this.selectAllCheckbox.click();
  }

  async goBack() {
    await this.page.goBack();
  }
}
