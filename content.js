function hideShorts() {
  const selectors = [
    // 側邊欄 Shorts 連結
    'a[href^="/shorts"]',
    // 首頁 Shorts 區塊
    'ytd-rich-shelf-renderer[is-shorts]',
    // 搜尋結果中的 Shorts 區塊
    'ytd-reel-shelf-renderer',
    // Shorts 影片卡片
    'ytd-short-shelf-renderer',
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.style.display = 'none';
    });
  });
}

// 初次執行
hideShorts();

// YouTube 是 SPA，需要監控 DOM 變化
const observer = new MutationObserver(hideShorts);
observer.observe(document.body, { childList: true, subtree: true });
