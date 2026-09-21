// ── Global: Hide Shorts ──────────────────────────────────────────────────────
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

// ── Watch page only ──────────────────────────────────────────────────────────
function isWatchPage() {
  return location.pathname === "/watch";
}

// ── Overlay state ────────────────────────────────────────────────────────────
let overlayRoot = null;
let overlayExpanded = false;
let titleClone = null;
let controlsClone = null;
let titleVisible = false;
let controlsVisible = false;
let sidebarVisible = false;

function injectWatchStyle() {
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
      display: none;
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
      display: block;
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
      font-size: 11px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      transition: transform 0.15s, background 0.15s;
      user-select: none;
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
      max-height: 200px;
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
      font-size: 22px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.6);
      transition: transform 0.2s, background 0.2s;
      user-select: none;
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

  `;
  document.head.appendChild(el);

  // Insert controls toggle style AFTER yt-overlay-style so it wins
  getControlsStyleEl();
}

function removeWatchStyle() {
  const el = document.getElementById("yt-overlay-style");
  if (el) el.remove();
  const ctrlEl = document.getElementById("yt-controls-toggle-style");
  if (ctrlEl) ctrlEl.remove();
}

function buildOverlay() {
  if (document.getElementById("yt-overlay-root")) return;

  const columns = document.getElementById("columns");
  if (!columns) return;

  injectWatchStyle();

  // Root container
  overlayRoot = document.createElement("div");
  overlayRoot.id = "yt-overlay-root";

  // Tile list
  const tileList = document.createElement("div");
  tileList.id = "yt-tile-list";

  // Title tile
  const titleBtn = document.createElement("button");
  titleBtn.className = "yt-tile";
  titleBtn.textContent = "title";
  titleBtn.title = "Toggle title";
  titleBtn.addEventListener("click", toggleTitle);

  // Controls tile
  const controlsBtn = document.createElement("button");
  controlsBtn.className = "yt-tile";
  controlsBtn.textContent = "ctrl";
  controlsBtn.title = "Toggle controls";
  controlsBtn.addEventListener("click", toggleControls);

  // Side tile
  const sideBtn = document.createElement("button");
  sideBtn.className = "yt-tile";
  sideBtn.textContent = "side";
  sideBtn.title = "Toggle sidebar";
  sideBtn.addEventListener("click", toggleSidebar);

  tileList.appendChild(titleBtn);
  tileList.appendChild(controlsBtn);
  tileList.appendChild(sideBtn);

  // Main button
  const mainBtn = document.createElement("button");
  mainBtn.id = "yt-overlay-btn";
  mainBtn.textContent = "▶";
  mainBtn.title = "YouTube overlay";
  mainBtn.addEventListener("click", () => {
    overlayExpanded = !overlayExpanded;
    tileList.classList.toggle("expanded", overlayExpanded);
    mainBtn.textContent = overlayExpanded ? "✕" : "▶";
  });

  overlayRoot.appendChild(tileList);
  overlayRoot.appendChild(mainBtn);
  columns.appendChild(overlayRoot);
}

function removeOverlay() {
  const el = document.getElementById("yt-overlay-root");
  if (el) el.remove();
  overlayRoot = null;
  overlayExpanded = false;

  removeClonedTitle();
  removeClonedControls();
  removeSidebar();
  removeWatchStyle();
}

// ── Title clone ──────────────────────────────────────────────────────────────
function toggleTitle() {
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(1)");
  if (titleVisible) {
    removeClonedTitle();
    titleVisible = false;
    if (btn) btn.classList.remove("active");
  } else {
    const src = document.querySelector("ytd-watch-metadata #title-row #title");
    if (!src) return;
    titleClone = document.createElement("div");
    titleClone.id = "yt-cloned-title";
    titleClone.textContent = src.textContent.trim();
    document.body.appendChild(titleClone);
    titleVisible = true;
    if (btn) btn.classList.add("active");
  }
}

function removeClonedTitle() {
  const el = document.getElementById("yt-cloned-title");
  if (el) el.remove();
  titleClone = null;
  titleVisible = false;
}

// ── Controls toggle ──────────────────────────────────────────────────────────
// #ytp-chrome-controls is inside a same-origin iframe; CSS from the main
// document can target it, but JS getElementById cannot. Use a separate
// <style> tag to toggle: empty = hidden (base rule), filled = override show.
function getControlsStyleEl() {
  let el = document.getElementById("yt-controls-toggle-style");
  if (!el) {
    el = document.createElement("style");
    el.id = "yt-controls-toggle-style";
    document.head.appendChild(el);
  }
  return el;
}

function toggleControls() {
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(2)");
  const styleEl = getControlsStyleEl();
  if (controlsVisible) {
    styleEl.textContent = "";
    controlsVisible = false;
    if (btn) btn.classList.remove("active");
  } else {
    styleEl.textContent = `
      #movie_player > .ytp-chrome-bottom { display: block !important; }
      #movie_player .ytp-chrome-controls { display: flex !important; }
      #movie_player .ytp-progress-bar-container { display: block !important; }
    `;
    controlsVisible = true;
    if (btn) btn.classList.add("active");
  }
}

function removeClonedControls() {
  const styleEl = document.getElementById("yt-controls-toggle-style");
  if (styleEl) styleEl.textContent = "";
  controlsClone = null;
  controlsVisible = false;
}

// ── Sidebar toggle ───────────────────────────────────────────────────────────
function toggleSidebar() {
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(3)");
  const secondary = document.querySelector("ytd-watch-flexy #secondary");
  if (!secondary) return;
  if (sidebarVisible) {
    secondary.classList.remove("yt-side-visible");
    sidebarVisible = false;
    if (btn) btn.classList.remove("active");
  } else {
    secondary.classList.add("yt-side-visible");
    sidebarVisible = true;
    if (btn) btn.classList.add("active");
  }
}

function removeSidebar() {
  const secondary = document.querySelector("ytd-watch-flexy #secondary");
  if (secondary) secondary.classList.remove("yt-side-visible");
  sidebarVisible = false;
}

// ── SPA navigation observer ──────────────────────────────────────────────────
function onNavigate() {
  if (isWatchPage()) {
    // Wait for #columns to appear
    waitForElement("#columns", buildOverlay);
  } else {
    removeOverlay();
  }
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

// YouTube is a SPA — watch for URL changes via yt-navigate-finish
document.addEventListener("yt-navigate-finish", onNavigate);

// Initial load
onNavigate();
