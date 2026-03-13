# Page Analysis

playwright-cli로 URL에 접속하여 페이지의 모든 기능과 구조를 체계적으로 분석합니다.

---

## 분석 순서

### 1. 초기 접속 및 기본 정보 수집
```bash
playwright-cli open [URL]
playwright-cli snapshot
```
수집 항목:
- Page URL (최종 리다이렉트 URL 포함)
- Page Title
- 주요 UI 영역 (header, nav, main, footer)

### 2. 인터랙티브 요소 식별

스냅샷에서 아래 요소들을 모두 추출:

| 요소 타입 | 수집 항목 |
|----------|----------|
| `button` | 이름, 활성화 여부 |
| `textbox` / `input` | 라벨, placeholder, 필수 여부 |
| `link` | 텍스트, href (이동 여부) |
| `checkbox` / `radio` | 라벨, 기본값 |
| `select` | 라벨, 옵션 목록 |
| `form` | 구성 요소, 제출 방식 |

### 3. 상태별 탐색

주요 액션을 수행하며 상태 변화 캡처:

```bash
# 버튼/링크 클릭 후 상태 변화 확인
playwright-cli click e[N]
playwright-cli snapshot

# 폼 입력 후 상태 변화 확인
playwright-cli fill e[N] "[값]"
playwright-cli snapshot

# 에러 상태 유발 (빈 값 제출 등)
playwright-cli click e[submit버튼]
playwright-cli snapshot
```

### 4. 모달 / 다이얼로그 탐색

```bash
# alert/confirm 발생 시
playwright-cli dialog-accept
# 또는
playwright-cli dialog-dismiss
playwright-cli snapshot
```

### 5. 네비게이션 탐색

```bash
# 페이지 내 주요 링크 이동 후 확인
playwright-cli click e[N]
playwright-cli snapshot
playwright-cli go-back
```

---

## 기능 분류 기준

분석한 요소들을 아래 기준으로 분류:

| 분류 | 설명 | 예시 |
|------|------|------|
| 인증 | 로그인/로그아웃/회원가입 | 로그인 폼, 소셜 로그인 |
| 검색 | 검색창, 필터, 결과 | 검색 입력, 자동완성 |
| 폼 입력 | 데이터 입력/제출 | 회원정보 수정, 댓글 |
| 내비게이션 | 메뉴, 링크 이동 | GNB, 탭, 페이지네이션 |
| UI 노출 | 요소 표시 여부 | 버튼, 배너, 모달 |
| 데이터 표시 | 목록, 상세 정보 | 상품 목록, 차트 |

---

## 분석 결과 정리 형식

분석 완료 후 아래 형식으로 정리하여 다음 단계(TC 작성)에 전달:

```
[페이지 기본 정보]
- URL: [최종 URL]
- Title: [페이지 타이틀]
- Feature: [기능명]

[발견된 기능 목록]
1. [기능명]: [설명] → 테스트 가능 여부: Y/N
2. ...

[주요 상태 변화]
- [액션] → [결과]
- ...

[에러/예외 케이스]
- [조건] → [alert/메시지 내용]
- ...
```

---

## 주의사항

- 로그인이 필요한 페이지는 미인증 상태와 인증 상태를 모두 분석
- 동적 콘텐츠(무한 스크롤, 로딩)는 `playwright-cli snapshot` 타이밍에 주의
- 분석 중 발견된 모든 URL 변경은 기록

---

## playwright-cli 통합 분석 확장

### 1) 세션 분리 분석 (권한/역할 비교)

동일 URL을 서로 다른 상태로 비교할 때 세션을 분리:

```bash
playwright-cli -s=guest open [URL]
playwright-cli -s=member open [URL]
playwright-cli -s=guest snapshot
playwright-cli -s=member snapshot
```

### 2) 인증 상태 재사용

로그인 반복을 줄이기 위해 인증 상태를 로드:

```bash
playwright-cli state-load auth.json
playwright-cli open [URL]
playwright-cli snapshot
```

### 3) 고급 대기/프레임 처리 (`run-code`)

기본 snapshot으로 안정적 분석이 어려우면 `run-code` 사용:

```bash
playwright-cli run-code "async page => {
	await page.waitForLoadState('networkidle');
	await page.waitForSelector('main', { timeout: 10000 });
}"
```

iframe 기반 UI 분석:

```bash
playwright-cli run-code "async page => {
	const frame = page.locator('iframe').first().contentFrame();
	return await frame.locator('button').allTextContents();
}"
```

### 4) 외부 API 변동 억제 (선택)

초기 분석 단계에서 API 응답 변동이 심하면 최소 mock으로 구조만 고정:

```bash
playwright-cli route "**/api/*" --status=200 --body='{"ok":true}' --content-type=application/json
playwright-cli open [URL]
playwright-cli snapshot
playwright-cli unroute "**/api/*"
```
