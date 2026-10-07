import { overlayExpanded, setOverlayRoot, setOverlayExpanded } from "src/config";
import { injectWatchStyle, removeWatchStyle } from "src/styles";
import { toggleTitle, removeClonedTitle } from "filters/title";
import { toggleControls, removeClonedControls, enableControls } from "filters/controls";
import { toggleSidebar, hideSidebar } from "filters/sidebar";
import { toggleDisable, enableAllRules } from "filters/disable";
import { mydebug } from "utils/debug.js";

// Auto-hide delays
const INITIAL_HIDE_DELAY = 6000; // 6 s after first show
const IDLE_HIDE_DELAY    = 4000; // 4 s after last interaction

// ── SVG icons ─────────────────────────────────────────────────────────────────
const ICONS = {
  // Title: horizontal bar representing the title strip at top of page
  title: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect x="2" y="8" width="20" height="8" rx="2" fill="currentColor"/>
  </svg>`,

  // Controls: play button left + single progress bar with scrubber dot
  ctrl: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="3,5 3,19 12,12" fill="currentColor" stroke="none"/>
    <line x1="14" y1="12" x2="22" y2="12"/>
    <circle cx="18" cy="12" r="2" fill="currentColor" stroke="none"/>
  </svg>`,

  // Sidebar: main content area on left, panel on right
  side: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2"/>
    <line x1="15" y1="3" x2="15" y2="21"/>
  </svg>`,

  // Orig / disable: toggle switch ON (rules active)
  orig: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect x="2" y="8" width="20" height="8" rx="4" fill="currentColor" opacity="0.4"/>
    <circle cx="16" cy="12" r="4" fill="currentColor"/>
  </svg>`,

  // Orig / disable: toggle switch OFF (rules disabled)
  origOff: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect x="2" y="8" width="20" height="8" rx="4" fill="currentColor" opacity="0.4"/>
    <circle cx="8" cy="12" r="4" fill="currentColor"/>
  </svg>`,

  // Fullscreen: expand arrows
  fullscreen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="15,3 21,3 21,9"/>
    <polyline points="9,21 3,21 3,15"/>
    <line x1="21" y1="3" x2="14" y2="10"/>
    <line x1="3" y1="21" x2="10" y2="14"/>
  </svg>`,

  // Exit fullscreen: collapse arrows
  exitFullscreen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="4,14 10,14 10,20"/>
    <polyline points="20,10 14,10 14,4"/>
    <line x1="10" y1="14" x2="3" y2="21"/>
    <line x1="14" y1="10" x2="21" y2="3"/>
  </svg>`,

  // Main button: menu / close (toggled via CSS class)
  menu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <line x1="4" y1="7"  x2="20" y2="7"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <line x1="4" y1="17" x2="20" y2="17"/>
  </svg>`,

  close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <line x1="5" y1="5" x2="19" y2="19"/>
    <line x1="19" y1="5" x2="5" y2="19"/>
  </svg>`,
};

function makeBtn({ id, cls, icon, title: tipText, onClick }) {
  const btn = document.createElement("button");
  if (id)  btn.id = id;
  if (cls) btn.className = cls;
  btn.title = tipText;
  btn.innerHTML = icon;
  btn.addEventListener("click", onClick);
  return btn;
}

export { ICONS, makeBtn };

export function buildOverlay() {
  if (document.getElementById("yt-overlay-root")) return;

  const columns = document.getElementById("columns");
  if (!columns) return;

  injectWatchStyle();

  // ── Overlay root ──────────────────────────────────────────────────────────
  const overlayRoot = document.createElement("div");
  overlayRoot.id = "yt-overlay-root";
  setOverlayRoot(overlayRoot);

  // ── Tile list ─────────────────────────────────────────────────────────────
  const tileList = document.createElement("div");
  tileList.id = "yt-tile-list";

  const titleBtn    = makeBtn({ cls: "yt-tile", icon: ICONS.title, title: "Toggle title", onClick: () => {
    mydebug.log("titleBtn clicked", { url: location.href });
    mydebug.selector("ytd-watch-metadata #title-row #title");
    toggleTitle();
  } });
  const controlsBtn = makeBtn({ cls: "yt-tile", icon: ICONS.ctrl,  title: "Toggle controls",                 onClick: toggleControls });
  const sideBtn     = makeBtn({ cls: "yt-tile", icon: ICONS.side,  title: "Toggle sidebar",                  onClick: toggleSidebar });
  const disableBtn  = makeBtn({ cls: "yt-tile", icon: ICONS.orig,  title: "Disable / Enable all hiding rules", onClick: toggleDisable });

  // Fullscreen toggle tile
  const fsBtn = makeBtn({
    cls: "yt-tile",
    icon: document.fullscreenElement ? ICONS.exitFullscreen : ICONS.fullscreen,
    title: "Toggle fullscreen",
    onClick: () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        // Request fullscreen on the player element for best compatibility
        const player = document.getElementById("movie_player");
        (player ?? document.documentElement).requestFullscreen();
      }
    },
  });

  tileList.appendChild(titleBtn);
  tileList.appendChild(controlsBtn);
  tileList.appendChild(sideBtn);
  tileList.appendChild(disableBtn);
  tileList.appendChild(fsBtn);

  // ── Main button ───────────────────────────────────────────────────────────
  const mainBtn = makeBtn({
    id: "yt-overlay-btn",
    icon: ICONS.menu,
    title: "YouTube overlay",
    onClick: () => {
      const expanded = !overlayExpanded;
      setOverlayExpanded(expanded);
      tileList.classList.toggle("expanded", expanded);
      mainBtn.innerHTML = expanded ? ICONS.close : ICONS.menu;
    },
  });

  overlayRoot.appendChild(tileList);
  overlayRoot.appendChild(mainBtn);

  // ── Hotzone (transparent hit area at bottom-left) ─────────────────────────
  // Sits behind the overlay; mouse entering it wakes the overlay back up.
  const hotzone = document.createElement("div");
  hotzone.id = "yt-overlay-hotzone";

  // ── Auto-hide logic ───────────────────────────────────────────────────────
  let hideTimer = null;

  const showOverlay = () => {
    overlayRoot.classList.remove("yt-overlay-hidden");
  };

  const hideOverlay = () => {
    overlayRoot.classList.add("yt-overlay-hidden");
    // Collapse tiles when hiding so next wake-up is always the main button
    setOverlayExpanded(false);
    tileList.classList.remove("expanded");
    mainBtn.innerHTML = ICONS.menu;
  };

  const scheduleHide = (delay) => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideOverlay, delay);
  };

  const resetIdleTimer = () => {
    showOverlay();
    scheduleHide(IDLE_HIDE_DELAY);
  };

  // Hotzone: show overlay when mouse enters the bottom-left corner
  hotzone.addEventListener("mouseenter", resetIdleTimer);

  // Keep overlay visible while mouse is over it
  overlayRoot.addEventListener("mouseenter", () => {
    showOverlay();
    clearTimeout(hideTimer);
  });
  overlayRoot.addEventListener("mouseleave", () => scheduleHide(IDLE_HIDE_DELAY));

  // Reset timer on any click inside overlay (button interactions count)
  overlayRoot.addEventListener("click", () => scheduleHide(IDLE_HIDE_DELAY));

  // Initial show: visible for 6 s then hide
  scheduleHide(INITIAL_HIDE_DELAY);

  // ── Append to DOM ─────────────────────────────────────────────────────────
  columns.appendChild(hotzone);
  columns.appendChild(overlayRoot);

  // Store timer ref for cleanup
  overlayRoot._hideTimer = () => clearTimeout(hideTimer);

  // ── Fullscreen: reparent overlay + hotzone into the player ────────────────
  const onFullscreenChange = () => {
    const root = document.getElementById("yt-overlay-root");
    const hz   = document.getElementById("yt-overlay-hotzone");
    const titleEl = document.getElementById("yt-cloned-title");
    if (!root) return;
    const player = document.getElementById("movie_player");
    if (document.fullscreenElement && player) {
      player.appendChild(hz);
      player.appendChild(root);
      if (titleEl) player.appendChild(titleEl);
    } else {
      const cols = document.getElementById("columns");
      if (cols) {
        cols.appendChild(hz);
        cols.appendChild(root);
      }
      if (titleEl) document.body.appendChild(titleEl);
    }
    // Sync fullscreen button icon
    fsBtn.innerHTML = document.fullscreenElement ? ICONS.exitFullscreen : ICONS.fullscreen;
  };
  document.addEventListener("fullscreenchange", onFullscreenChange);
  overlayRoot._fullscreenHandler = onFullscreenChange;
}

export function removeOverlay() {
  const el = document.getElementById("yt-overlay-root");
  if (el) {
    if (el._hideTimer) el._hideTimer();
    if (el._fullscreenHandler) {
      document.removeEventListener("fullscreenchange", el._fullscreenHandler);
    }
    el.remove();
  }
  const hz = document.getElementById("yt-overlay-hotzone");
  if (hz) hz.remove();
  const origBtn = document.getElementById("yt-orig-btn");
  if (origBtn) origBtn.remove();
  setOverlayRoot(null);
  setOverlayExpanded(false);

  removeClonedTitle();
  removeClonedControls();
  hideSidebar();
  enableAllRules();
  removeWatchStyle();
}

export { enableControls };
