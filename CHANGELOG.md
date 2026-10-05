# Changelog

## [1.6.0] - 2026-10-05

### Added
- 全螢幕支援：進入全螢幕時，overlay 控制介面與側邊欄自動移入 `#movie_player`，離開時恢復原位
- Overlay 自動隱藏：載入後 6 秒自動淡出；滑鼠移入左下角熱區後重新顯示，4 秒無操作再次隱藏
- 新增 `fs` tile：切換全螢幕，圖示隨狀態同步（展開／收縮四角）
- 所有 tile 與主按鈕改為 inline SVG 圖示，移除文字標籤
- `orig` tile 改為 toggle switch 圖示：規則啟用時圓點在右（ON），停用時圓點在左（OFF）
- `title` tile 改為橫向長方形色塊圖示
- `ctrl` tile 改為播放三角 + 單行進度條圖示
- 進入影片頁面預設自動顯示標題（title tile 預設 active）

### Changed
- 全螢幕時 side 側邊欄改用 `position: absolute` 覆蓋於播放器右側（半透明黑底）
- 全螢幕時側邊欄捲動不再冒泡至播放器（修正誤觸快進／快退問題）
- `.ytp-fullscreen-grid`（含 expand button）z-index 拉高至 91，確保不被側邊欄遮蓋

### Fixed
- 切換影片時 title clone 消失問題：改用 `showTitleDefault()` 強制重建，不依賴 `titleVisible` 狀態
- `startTitleObserver()` 每次重新 disconnect 再綁定，確保追蹤新影片的 title 元素

---

## [1.5.0] - 2026-10-01

### Changed
- 將單一 `content.js` 重構為多模組架構（`src/`）
- 加入 rolldown 打包設定（`rolldown.config.js`）
- 加入 `package.json`，使用 bun 管理開發依賴
- import 路徑使用 `src/` 與 `filters/` alias

### Added
- `src/index.js` — 入口、導航事件、waitForElement
- `src/config.js` — 共用狀態與 setter
- `src/styles.js` — 所有 CSS 注入（globalStyle、watchStyle、controlsStyle）
- `src/overlay.js` — buildOverlay、removeOverlay
- `src/filters/title.js` — 標題 clone 與 MutationObserver
- `src/filters/controls.js` — 播放控制列開關
- `src/filters/sidebar.js` — 側邊欄開關
- `src/filters/disable.js` — 全部規則停用／啟用

---

## [1.4.0] - 2026-09-21

### Fixed
- 修正一般模式（非劇院）下影片完全不顯示的問題
  - 原因：`ytd-player` 位於 `#primary > #primary-inner > #player` 內，隱藏整個 `#primary` 導致播放器一併消失
  - 改為只隱藏 `#below`（說明、推薦等），播放器不受影響
- 修正 ctrl tile 無法 toggle 控制列的問題
  - 原因：selector 使用 `#ytp-chrome-controls`（id），實際 DOM 只有 class，改為 `.ytp-chrome-controls`
- 修正 SPA 來回導航後 ctrl tile 失效的問題
  - 原因：`yt-controls-toggle-style` 插入順序早於 `yt-overlay-style`，specificity 相同時隱藏規則永遠蓋過顯示規則
  - 修正：離開 `/watch` 時同時移除兩個 style element，重新進入時依序插入確保順序正確

### Changed
- 移除 `#movie_player > *:not(.html5-video-container)` 全隱藏規則，避免影響播放器內部元素正常運作
- 進度條（`.ytp-progress-bar-container`）納入 ctrl tile toggle 控制，預設隱藏
- 固定隱藏 `.ytp-overlays-container`、`.ytp-iv-video-content`（overlays、annotations）
- Overlay 主按鈕位置從右下角改為左下角

### Added
- 新增 `side` tile：toggle 顯示／隱藏 `#secondary`（推薦影片側邊欄），固定於右側並可獨立捲動

## [1.3.0] - 2026-09-20

### Added
- 影片頁面（`/watch`）新增懸浮 Overlay 系統
  - 在 `#columns` 內插入固定圓形主按鈕，點擊展開兩個 tile
  - **title tile**：toggle 顯示影片標題（貼於頁面頂端）
  - **ctrl tile**：toggle 顯示播放控制列（含進度條）
- 影片頁面隱藏 `#primary`，移除側邊推薦、說明等干擾元素
- `#movie_player` 內預設只顯示 `.html5-video-container`（純影片畫面），其餘全部隱藏
- 控制列（含進度條）預設隱藏，避免觀看體育賽事時不小心看到時間軸而預測結果
- 監聽 `yt-navigate-finish` 事件，支援 YouTube SPA 頁面切換，離開影片頁面自動清除 overlay

### Changed
- 移除原有的 `#primary-inner` 隱藏規則，改為隱藏整個 `#primary`

## [1.2.0] - 2026-09-20

### Added
- 影片頁面隱藏 `#primary-inner`，只保留播放器與標題區（`#above-the-fold`）

## [1.1.0] - 2026-09-19

### Changed
- `content.js` 改用 CSS 注入取代 JavaScript DOM 操作，移除 `MutationObserver`
- 效能提升：由瀏覽器原生 CSS 引擎處理元素隱藏，不再需要 JS polling
- `manifest.json` 升級至 Manifest v3，同時相容 Firefox 與 Chrome / Edge

## [1.0.0] - 2026-09-15

### Added
- 初始版本，使用 JavaScript `MutationObserver` 監控 DOM 變化並隱藏 Shorts 元素
- 支援隱藏：側邊欄連結、首頁區塊、搜尋結果區塊、影片卡片
- Manifest v2，僅支援 Firefox
