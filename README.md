# Hide YouTube Shorts

隱藏 YouTube 上所有短影音（Shorts）相關元素，支援 Firefox 與 Chrome。

## 隱藏的元素

- 側邊欄 Shorts 連結
- 首頁 Shorts 區塊
- 搜尋結果中的 Shorts 區塊
- Shorts 影片卡片
- 影片頁面 `#primary-inner`（留下播放器與標題，隱藏下方說明、推薦等）

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
  content.js         # 注入 CSS 隱藏 Shorts 元素
  icons/
    icon-48.png
    icon-96.png
    icon.svg
  README.md
  CHANGELOG.md
```

## 注意

YouTube 的 DOM 結構可能會更新，若某元素未被隱藏，用瀏覽器開發工具檢查元素，更新 `content.js` 中對應的 CSS selector 即可。
