# Hide YouTube Shorts

隱藏 YouTube 上所有短影音（Shorts）相關元素，並在影片頁面提供懸浮控制 Overlay，支援 Firefox 與 Chrome。

## 功能

### 全域（所有頁面）
- 隱藏側邊欄 Shorts 連結
- 隱藏首頁 Shorts 區塊
- 隱藏搜尋結果中的 Shorts 區塊
- 隱藏 Shorts 影片卡片

### 影片頁面（`/watch`）
- 隱藏 `#below`（說明、推薦影片等），只保留播放器
- 固定隱藏 overlays（`.ytp-overlays-container`）與 annotations（`.ytp-iv-video-content`）
- 控制列（`.ytp-chrome-controls`）與進度條（`.ytp-progress-bar-container`）預設隱藏，避免觀看體育賽事時不小心看到時間軸而預測比賽結果

### Overlay 懸浮介面
影片頁面左下角固定顯示一個圓形主按鈕，點擊展開五個 tile，全部使用 SVG 圖示：

| Tile | 圖示 | 功能 |
|------|------|------|
| **title** | 橫向長方形色塊 | 顯示／隱藏影片標題（貼於頁面頂端），預設開啟 |
| **ctrl** | 播放鍵 + 進度條 | 顯示／隱藏播放控制列與進度條 |
| **side** | 側邊欄版型 | 顯示／隱藏推薦影片側邊欄（固定於右側，可獨立捲動） |
| **orig** | Toggle switch | 停用／啟用所有隱藏規則（圓點右＝啟用，圓點左＝停用） |
| **fs** | 展開／收縮四角 | 切換全螢幕，圖示隨狀態同步 |

### 自動隱藏
- 頁面載入後 6 秒自動淡出
- 滑鼠移入左下角熱區後重新顯示，4 秒無操作再次隱藏
- 滑鼠停留於介面上時暫停計時

### 全螢幕支援
- 進入全螢幕時，overlay 介面、標題列與 side 側邊欄自動移入播放器內，維持各自位置
- 全螢幕時 overlay 按鈕顯示於左側垂直中間偏下，不與 YouTube 控制列重疊
- 側邊欄捲動不影響播放器（不誤觸快進／快退）
- 全螢幕中切換影片，標題列自動更新並持續顯示
- 離開全螢幕時自動恢復至原始 DOM 位置

## 安裝

### Firefox

**方法一：AMO 自簽（推薦，永久有效）**

1. 前往 [addons.mozilla.org/developers](https://addons.mozilla.org/developers/) 登入
2. Submit → 選「On your own」
3. 上傳 `.xpi` 檔案
4. 下載回已簽名的 `.xpi`，拖進 Firefox 安裝

**方法二：暫時載入（開發用）**

1. 開啟 `about:debugging` → 此 Firefox
2. 「載入暫時性附加元件」→ 選 `manifest.json`
3. 關閉瀏覽器後失效，需重新載入

### Chrome / Edge

1. 開啟 `chrome://extensions`
2. 右上角開啟「開發人員模式」
3. 「載入未封裝項目」→ 選擇此資料夾

## 開發

```bash
# 安裝依賴
bun install

# 打包（輸出至 content.js）
bun run build

# 監聽檔案變更自動重新打包
bun run watch
```

import 路徑使用兩個 alias：

```js
import { ... } from "src/config";    // src/ 下的主模組
import { ... } from "filters/title"; // src/filters/ 下的子模組
```

alias 定義於 `rolldown.config.js` 的 `resolve.alias`。

## 打包

```bash
zip -r ../hide-youtube-shorts.xpi manifest.json content.js icons/icon-48.png icons/icon-96.png
```

## 檔案結構

```
hide-youtube-shorts/
├── src/
│   ├── index.js          # 入口、導航事件
│   ├── config.js         # 共用狀態
│   ├── styles.js         # 所有 CSS 注入
│   ├── overlay.js        # buildOverlay、removeOverlay
│   └── filters/
│       ├── title.js      # 標題 clone 與 observer
│       ├── controls.js   # 播放控制列開關
│       ├── sidebar.js    # 側邊欄開關（含全螢幕 reparent）
│       └── disable.js    # 全部規則停用／啟用
├── manifest.json         # 擴充套件設定（Manifest v3）
├── content.js            # 打包輸出（勿手動編輯）
├── rolldown.config.js    # 打包設定（含 alias）
├── package.json
├── icons/
│   ├── icon-48.png
│   ├── icon-96.png
│   └── icon.svg
├── README.md
└── CHANGELOG.md
```

## 注意

YouTube 的 DOM 結構可能會更新，若某元素未被隱藏或按鈕失效，用瀏覽器開發工具檢查元素，更新 `src/` 下對應檔案的 CSS selector 即可，重新執行 `bun run build` 後重新載入擴充套件。
