# Hide YouTube Shorts

Firefox 擴充套件，隱藏 YouTube 上所有短影音（Shorts）相關元素。

## 檔案結構

```
hide-youtube-shorts/
  manifest.json   # 擴充套件設定
  content.js      # 隱藏 Shorts 的邏輯
  README.md
```

## 安裝

### 暫時載入（開發用）

1. 開啟 `about:debugging` → 此 Firefox
2. 「載入暫時性附加元件」→ 選 `manifest.json`
3. 關閉瀏覽器後失效，需重新載入

### 永久安裝（不上架）

需要 Firefox Developer Edition 或 Nightly：

1. 開啟 `about:config`，將 `xpinstall.signatures.required` 設為 `false`
2. 打包擴充套件：
   ```bash
   zip -r ../hide-youtube-shorts.xpi .
   ```
3. 將 `hide-youtube-shorts.xpi` 拖進 Firefox 安裝

## 隱藏的元素

- 側邊欄 Shorts 連結
- 首頁 Shorts 區塊
- 搜尋結果中的 Shorts 區塊
- Shorts 影片卡片

## 注意

YouTube 的 DOM 結構可能會更新，若某元素未被隱藏，用瀏覽器開發工具檢查元素，更新 `content.js` 中對應的 selector 即可。
