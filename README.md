# Hide YouTube Shorts

隱藏 YouTube 上所有短影音（Shorts）相關元素，並在影片頁面提供懸浮控制 Overlay，支援 Firefox 與 Chrome。

## 功能

### 全域（所有頁面）
- 隱藏側邊欄 Shorts 連結
- 隱藏首頁 Shorts 區塊
- 隱藏搜尋結果中的 Shorts 區塊
- 隱藏 Shorts 影片卡片

### 影片頁面（`/watch`）
- 隱藏 `#primary`（說明、推薦影片等），只保留播放器
- `#movie_player` 內預設只顯示純影片畫面，其餘元素（廣告遮罩、漸層、控制列等）全部隱藏
- 控制列與進度條預設隱藏，避免觀看體育賽事時不小心看到時間軸而預測比賽結果

### Overlay 懸浮按鈕
影片頁面右下角固定顯示一個圓形主按鈕，點擊展開兩個 tile：

| Tile | 功能 |
|------|------|
| **title** | 顯示／隱藏影片標題（貼於頁面頂端） |
| **ctrl** | 顯示／隱藏播放控制列（含進度條、音量、全螢幕等） |

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

## 打包

```bash
zip -r ../hide-youtube-shorts.xpi manifest.json content.js icons/icon-48.png icons/icon-96.png
```

## 檔案結構

```
hide-youtube-shorts/
  manifest.json      # 擴充套件設定（Manifest v3）
  content.js         # Shorts 隱藏 + 影片頁面 Overlay 邏輯
  icons/
    icon-48.png
    icon-96.png
    icon.svg
  README.md
  CHANGELOG.md
```

## 注意

YouTube 的 DOM 結構可能會更新，若某元素未被隱藏或按鈕失效，用瀏覽器開發工具檢查元素，更新 `content.js` 中對應的 CSS selector 即可。
