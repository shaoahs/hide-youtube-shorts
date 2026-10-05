import { sidebarVisible, setSidebarVisible } from "src/config";

// ── Fullscreen reparenting ────────────────────────────────────────────────────
// #secondary is position:fixed normally. In fullscreen the player covers the
// viewport, so we move #secondary inside #movie_player and switch to
// position:absolute so it overlays the video on the right side.

let _fsHandler = null;

function getSecondary() {
  return document.querySelector("#secondary");
}

function getOriginalParent() {
  // ytd-watch-flexy keeps #primary and #secondary as siblings inside #columns
  return document.querySelector("ytd-watch-flexy #columns #primary")?.parentElement
    ?? document.querySelector("ytd-watch-flexy #columns")
    ?? document.querySelector("ytd-watch-flexy");
}

function applyFullscreenSidebarStyle(secondary) {
  secondary.setAttribute("data-yt-fs-sidebar", "1");
  // Prevent wheel events from bubbling to the player (which interprets
  // scroll as seek) while the user is scrolling the sidebar content.
  secondary.addEventListener("wheel", _stopWheel, { passive: false });
}

function removeFullscreenSidebarStyle(secondary) {
  secondary.removeAttribute("data-yt-fs-sidebar");
  secondary.removeEventListener("wheel", _stopWheel);
}

function _stopWheel(e) {
  e.stopPropagation();
}

function setupFullscreenHandler() {
  if (_fsHandler) return; // already registered

  _fsHandler = () => {
    const secondary = getSecondary();
    if (!secondary) return;

    if (document.fullscreenElement) {
      // Enter fullscreen — move into player
      const player = document.getElementById("movie_player");
      if (!player) return;
      // Remember where it came from
      secondary.dataset.ytFsOrigParent = "ytd-watch-flexy";
      applyFullscreenSidebarStyle(secondary);
      player.appendChild(secondary);
    } else {
      // Leave fullscreen — move back
      removeFullscreenSidebarStyle(secondary);
      delete secondary.dataset.ytFsOrigParent;
      const orig = getOriginalParent();
      if (orig) orig.appendChild(secondary);
    }
  };

  document.addEventListener("fullscreenchange", _fsHandler);
}

function teardownFullscreenHandler() {
  if (_fsHandler) {
    document.removeEventListener("fullscreenchange", _fsHandler);
    _fsHandler = null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────────

export function toggleSidebar() {
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(3)");
  const secondary = getSecondary();
  if (!secondary) return;

  if (sidebarVisible) {
    secondary.classList.remove("yt-side-visible");
    setSidebarVisible(false);
    if (btn) btn.classList.remove("active");
    teardownFullscreenHandler();
  } else {
    secondary.classList.add("yt-side-visible");
    setSidebarVisible(true);
    if (btn) btn.classList.add("active");
    setupFullscreenHandler();
    // If we're already in fullscreen when the user clicks side, move it now
    if (document.fullscreenElement) {
      const player = document.getElementById("movie_player");
      if (player) {
        secondary.dataset.ytFsOrigParent = "ytd-watch-flexy";
        applyFullscreenSidebarStyle(secondary);
        player.appendChild(secondary);
      }
    }
  }
}

export function hideSidebar() {
  const secondary = getSecondary();
  if (secondary) {
    secondary.classList.remove("yt-side-visible");
    // If it was moved into the player, put it back
    if (secondary.dataset.ytFsOrigParent) {
      removeFullscreenSidebarStyle(secondary);
      delete secondary.dataset.ytFsOrigParent;
      const orig = getOriginalParent();
      if (orig) orig.appendChild(secondary);
    }
  }
  setSidebarVisible(false);
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(3)");
  if (btn) btn.classList.remove("active");
  teardownFullscreenHandler();
}
