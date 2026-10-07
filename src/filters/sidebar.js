import { sidebarVisible, setSidebarVisible } from "src/config";

// ── Body overflow fix ─────────────────────────────────────────────────────────
// YouTube sets body overflow-x via inline style which can't be overridden by
// CSS !important. We intercept the style property setter so any attempt to set
// overflow or overflowX on body is forced to "visible".

(function patchBodyOverflow() {
  const bodyStyle = document.body.style;
  const proto = Object.getPrototypeOf(bodyStyle);

  function interceptOverflow(propName) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, propName);
    if (!descriptor || descriptor._patched) return;
    const originalSet = descriptor.set;
    Object.defineProperty(proto, propName, {
      ...descriptor,
      _patched: true,
      set(value) {
        // Only force on body, leave other elements alone
        if (this === bodyStyle && (propName === "overflow" || propName === "overflowX")) {
          originalSet.call(this, "visible");
        } else {
          originalSet.call(this, value);
        }
      }
    });
  }

  interceptOverflow("overflow");
  interceptOverflow("overflowX");
  // Force current value
  bodyStyle.setProperty("overflow-x", "visible", "important");
})();

// ── Fullscreen reparenting ────────────────────────────────────────────────────
// In fullscreen the player covers the viewport, so we move #secondary inside
// #movie_player and switch to position:absolute so it overlays the video.

let _fsHandler = null;
let _layoutObserver = null;

function getSecondary() {
  return (
    document.querySelector("ytd-watch-flexy #columns #secondary") ??
    document.querySelector("ytd-watch-flexy #secondary") ??
    document.querySelector("#secondary")
  );
}

// Get ytd-watch-next-secondary-results-renderer regardless of where YouTube put it
function getSecondaryResults() {
  return document.querySelector("ytd-watch-next-secondary-results-renderer");
}

// When zoomed in, YouTube moves ytd-watch-next-secondary-results-renderer into
// #below which is display:none. Move it into #secondary so it's visible in the
// fixed overlay. Remember its original parent so we can restore it on close.
function moveRendererToSecondary() {
  const secondary = getSecondary();
  if (!secondary) return;
  const renderer = getSecondaryResults();
  if (!renderer) return;
  if (secondary.contains(renderer)) return; // already there
  // Remember where it came from
  renderer._ytOrigParent = renderer.parentElement;
  renderer._ytOrigNextSibling = renderer.nextSibling;
  secondary.appendChild(renderer);
}

function restoreRenderer() {
  const renderer = getSecondaryResults();
  if (!renderer) return;
  const origParent = renderer._ytOrigParent;
  if (!origParent) return;
  // Put it back where it was
  origParent.insertBefore(renderer, renderer._ytOrigNextSibling ?? null);
  delete renderer._ytOrigParent;
  delete renderer._ytOrigNextSibling;
}

// Toggle yt-sidebar-active on ytd-watch-flexy so CSS can un-hide the renderer
// inside #below when YouTube uses the zoomed-in layout.
function setWatchFlexyActive(active) {
  const flexy = document.querySelector("ytd-watch-flexy");
  if (!flexy) return;
  flexy.classList.toggle("yt-sidebar-active", active);
}

function getOriginalParent() {
  return document.querySelector("ytd-watch-flexy #columns #primary")?.parentElement
    ?? document.querySelector("ytd-watch-flexy #columns")
    ?? document.querySelector("ytd-watch-flexy");
}

function applyFullscreenSidebarStyle(secondary) {
  secondary.setAttribute("data-yt-fs-sidebar", "1");
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
  if (_fsHandler) return;

  _fsHandler = () => {
    const secondary = getSecondary();
    if (!secondary) return;

    if (document.fullscreenElement) {
      const player = document.getElementById("movie_player");
      if (!player) return;
      secondary.dataset.ytFsOrigParent = "ytd-watch-flexy";
      applyFullscreenSidebarStyle(secondary);
      player.appendChild(secondary);
    } else {
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

// ── Layout change observer ────────────────────────────────────────────────────
// YouTube re-arranges the DOM (position 1 ↔ position 2) when the viewport
// width changes (window resize or browser zoom). Two observers work together:
//   1. ResizeObserver on #primary — catches window resize and CSS zoom changes
//   2. MutationObserver on ytd-watch-flexy top-level childList only (no subtree)
//      — catches the case where YouTube replaces #secondary with a new element
// Both share a 200 ms debounce before re-applying yt-side-visible.

let _resizeTimer = null;
let _mutationObserver = null;

function _reapplySidebarDebounced() {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => {
    if (!sidebarVisible) return;
    moveRendererToSecondary();
    const secondary = getSecondary();
    if (secondary && !secondary.classList.contains("yt-side-visible")) {
      secondary.classList.add("yt-side-visible");
    }
  }, 200);
}

function setupLayoutObserver() {
  if (_layoutObserver) return;

  // 1. ResizeObserver on #primary
  const primaryTarget = document.querySelector("#primary") ?? document.querySelector("ytd-watch-flexy");
  if (primaryTarget) {
    _layoutObserver = new ResizeObserver(_reapplySidebarDebounced);
    _layoutObserver.observe(primaryTarget);
  }

  // 2. MutationObserver on ytd-watch-flexy top-level only (no subtree)
  const flexy = document.querySelector("ytd-watch-flexy");
  if (flexy) {
    _mutationObserver = new MutationObserver(_reapplySidebarDebounced);
    _mutationObserver.observe(flexy, { childList: true });
  }
}

function teardownLayoutObserver() {
  if (_layoutObserver) {
    _layoutObserver.disconnect();
    _layoutObserver = null;
  }
  if (_mutationObserver) {
    _mutationObserver.disconnect();
    _mutationObserver = null;
  }
  clearTimeout(_resizeTimer);
  _resizeTimer = null;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function toggleSidebar() {
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(3)");
  const secondary = getSecondary();
  if (!secondary) return;

  if (sidebarVisible) {
    secondary.classList.remove("yt-side-visible");
    restoreRenderer();
    setSidebarVisible(false);
    if (btn) btn.classList.remove("active");
    teardownFullscreenHandler();
    teardownLayoutObserver();
  } else {
    moveRendererToSecondary();
    secondary.classList.add("yt-side-visible");
    setSidebarVisible(true);
    if (btn) btn.classList.add("active");
    setupFullscreenHandler();
    setupLayoutObserver();
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
    if (secondary.dataset.ytFsOrigParent) {
      removeFullscreenSidebarStyle(secondary);
      delete secondary.dataset.ytFsOrigParent;
      const orig = getOriginalParent();
      if (orig) orig.appendChild(secondary);
    }
  }
  restoreRenderer();
  setSidebarVisible(false);
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(3)");
  if (btn) btn.classList.remove("active");
  teardownFullscreenHandler();
  teardownLayoutObserver();
}
