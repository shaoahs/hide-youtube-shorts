# Changelog

## [1.3.0] - 2026-09-20

### Added
- 影片頁面（`/watch`）新增懸浮 Overlay 系統
  - 在 `#columns` 內插入固定圓形主按鈕，點擊展開兩個 tile
  - **title tile**：toggle 顯示影片標題（貼於頁面頂端）
  - **ctrl tile**：toggle 顯示 `.ytp-chrome-bottom`（播放控制列含進度條）
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

### Changed
- `manifest.json` 升級至 Manifest v3，同時相容 Firefox 與 Chrome / Edge

## [1.0.0] - 2026-09-15

### Added
- 初始版本，使用 JavaScript `MutationObserver` 監控 DOM 變化並隱藏 Shorts 元素
- 支援隱藏：側邊欄連結、首頁區塊、搜尋結果區塊、影片卡片
- Manifest v2，僅支援 Firefox


### Added
- 影片頁面隱藏 `#primary-inner`，只保留播放器與標題區（`#above-the-fold`）

## [1.1.0] - 2026-09-19

### Changed
- `content.js` 改用 CSS 注入取代 JavaScript DOM 操作，移除 `MutationObserver`
- 效能提升：由瀏覽器原生 CSS 引擎處理元素隱藏，不再需要 JS polling

### Changed
- `manifest.json` 升級至 Manifest v3，同時相容 Firefox 與 Chrome / Edge

## [1.0.0] - 2026-09-15

### Added
- 初始版本，使用 JavaScript `MutationObserver` 監控 DOM 變化並隱藏 Shorts 元素
- 支援隱藏：側邊欄連結、首頁區塊、搜尋結果區塊、影片卡片
- Manifest v2，僅支援 Firefox
