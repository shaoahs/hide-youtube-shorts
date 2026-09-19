# Changelog

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
