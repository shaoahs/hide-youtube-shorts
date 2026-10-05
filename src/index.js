import { injectGlobalStyle } from "src/styles";
import { buildOverlay, removeOverlay, enableControls } from "src/overlay";
import { showTitleDefault, startTitleObserver, stopTitleObserver } from "filters/title";

function isWatchPage() {
  return location.pathname === "/watch";
}

function waitForElement(selector, callback, timeout = 5000) {
  const el = document.querySelector(selector);
  if (el) { callback(); return; }

  const observer = new MutationObserver(() => {
    if (document.querySelector(selector)) {
      observer.disconnect();
      callback();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), timeout);
}

function onNavigate() {
  if (isWatchPage()) {
    waitForElement("#columns", () => {
      buildOverlay();
      enableControls();
    });
    waitForElement("ytd-watch-metadata #title-row #title", () => {
      startTitleObserver();
      showTitleDefault(); // show title by default
    });
  } else {
    stopTitleObserver();
    removeOverlay();
  }
}

// 注入全域 Shorts 隱藏樣式
injectGlobalStyle();

// YouTube 是 SPA，監聽導航事件
document.addEventListener("yt-navigate-finish", onNavigate);

// 初始載入
onNavigate();
