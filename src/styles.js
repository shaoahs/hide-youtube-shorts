/** 注入全域樣式：隱藏 Shorts 連結與 shelf */
export function injectGlobalStyle() {
  const globalStyle = document.createElement("style");
  globalStyle.textContent = `
    /* Hide shorts links and shelves */
    a[href^="/shorts"],
    ytd-rich-shelf-renderer[is-shorts],
    ytd-reel-shelf-renderer,
    ytd-short-shelf-renderer {
      display: none !important;
    }
  `;
  document.head.appendChild(globalStyle);
}

/** 注入 watch 頁樣式 */
export function injectWatchStyle() {
  let el = document.getElementById("yt-overlay-style");
  if (el) return;
  el = document.createElement("style");
  el.id = "yt-overlay-style";
  el.textContent = `
    /* Hide #below on watch page (description, recommendations, etc.) */
    ytd-watch-flexy #below {
      display: none !important;
    }

    /* #secondary: independent scroll, fixed to viewport height */
    ytd-watch-flexy #secondary {
      display: none !important;
      position: fixed !important;
      top: 0;
      right: 0;
      width: 420px;
      height: 100vh;
      overflow-y: auto !important;
      overflow-x: hidden;
      z-index: 9990;
      background: #0f0f0f;
      box-sizing: border-box;
      padding-top: 8px;
    }
    ytd-watch-flexy #secondary.yt-side-visible {
      display: block !important;
    }

    /* Fullscreen: #secondary lives inside #movie_player, overlay on the right */
    #movie_player #secondary[data-yt-fs-sidebar] {
      display: none !important;
      position: absolute !important;
      top: 0;
      right: 0;
      width: 380px;
      height: 100%;
      overflow-y: auto !important;
      overflow-x: hidden;
      z-index: 90;
      background: rgba(10, 10, 10, 0.92);
      box-sizing: border-box;
      padding-top: 8px;
    }
    #movie_player #secondary[data-yt-fs-sidebar].yt-side-visible {
      display: block !important;
    }

    /* Keep the fullscreen-grid expand button above the sidebar */
    #movie_player .ytp-fullscreen-grid {
      z-index: 91 !important;
    }

    /* Hide controls by default; toggled by ctrl button */
    #movie_player .ytp-chrome-controls,
    #movie_player .ytp-progress-bar-container {
      display: none !important;
    }

    /* Always hidden */
    .ytp-overlays-container,
    .ytp-iv-video-content {
      display: none !important;
    }

    /* Overlay root container */
    #yt-overlay-root {
      position: fixed;
      bottom: 32px;
      left: 32px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      pointer-events: none;
      opacity: 1;
      transition: opacity 0.4s ease;
    }
    #yt-overlay-root.yt-overlay-hidden {
      opacity: 0;
      pointer-events: none !important;
    }
    /* pointer-events back on when visible */
    #yt-overlay-root:not(.yt-overlay-hidden) {
      pointer-events: none; /* root itself is passthrough; children opt-in */
    }

    /* Transparent hotzone at bottom-left — always present, catches mouseenter */
    #yt-overlay-hotzone {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 160px;
      height: 100px;
      z-index: 9998;
      pointer-events: all;
    }

    /* When overlay is reparented inside #movie_player during fullscreen,
       it needs to sit above all player UI layers. */
    #movie_player #yt-overlay-root {
      z-index: 99;
    }
    #movie_player #yt-overlay-hotzone {
      z-index: 98;
    }

    /* Tiles (shown above the main button) */
    #yt-overlay-root .yt-tile {
      pointer-events: all;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: none;
      background: rgba(30, 30, 30, 0.85);
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      transition: transform 0.15s, background 0.15s;
      user-select: none;
      padding: 0;
    }
    #yt-overlay-root .yt-tile svg {
      width: 22px;
      height: 22px;
      pointer-events: none;
    }
    #yt-overlay-root .yt-tile:hover {
      background: rgba(60, 60, 60, 0.95);
      transform: scale(1.1);
    }
    #yt-overlay-root .yt-tile.active {
      background: rgba(200, 50, 50, 0.9);
    }

    /* Tile list — hidden by default */
    #yt-tile-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.25s ease;
    }
    #yt-tile-list.expanded {
      max-height: 320px;
    }

    /* Main toggle button */
    #yt-overlay-btn {
      pointer-events: all;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      border: none;
      background: rgba(200, 50, 50, 0.9);
      color: #fff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.6);
      transition: transform 0.2s, background 0.2s;
      user-select: none;
      padding: 0;
    }
    #yt-overlay-btn svg {
      width: 24px;
      height: 24px;
      pointer-events: none;
    }
    #yt-overlay-btn:hover {
      background: rgba(220, 70, 70, 1);
      transform: scale(1.08);
    }

    /* Cloned title */
    #yt-cloned-title {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 9998;
      background: rgba(10, 10, 10, 0.88);
      color: #fff;
      padding: 10px 16px;
      font-size: 16px;
      font-weight: bold;
      pointer-events: none;
    }

    /* Fullscreen: title inside player, position absolute */
    #movie_player #yt-cloned-title {
      position: absolute;
      z-index: 95;
    }
  `;
  document.head.appendChild(el);

  // Insert controls toggle style AFTER yt-overlay-style so it wins
  getControlsStyleEl();
}

/** 移除 watch 頁樣式 */
export function removeWatchStyle() {
  const el = document.getElementById("yt-overlay-style");
  if (el) el.remove();
  const ctrlEl = document.getElementById("yt-controls-toggle-style");
  if (ctrlEl) ctrlEl.remove();
}

/** 取得（或建立）controls toggle 用的 style 元素 */
export function getControlsStyleEl() {
  let el = document.getElementById("yt-controls-toggle-style");
  if (!el) {
    el = document.createElement("style");
    el.id = "yt-controls-toggle-style";
    document.head.appendChild(el);
  }
  return el;
}
