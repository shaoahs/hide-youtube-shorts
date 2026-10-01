import { overlayExpanded, setOverlayRoot, setOverlayExpanded } from "src/config";
import { injectWatchStyle, removeWatchStyle } from "src/styles";
import { toggleTitle, removeClonedTitle } from "filters/title";
import { toggleControls, removeClonedControls, enableControls } from "filters/controls";
import { toggleSidebar, hideSidebar } from "filters/sidebar";
import { toggleDisable, enableAllRules } from "filters/disable";

export function buildOverlay() {
  if (document.getElementById("yt-overlay-root")) return;

  const columns = document.getElementById("columns");
  if (!columns) return;

  injectWatchStyle();

  // Root container
  const overlayRoot = document.createElement("div");
  overlayRoot.id = "yt-overlay-root";
  setOverlayRoot(overlayRoot);

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

  // Disable tile
  const disableBtn = document.createElement("button");
  disableBtn.className = "yt-tile";
  disableBtn.textContent = "orig";
  disableBtn.title = "Disable / Enable all hiding rules";
  disableBtn.addEventListener("click", toggleDisable);

  tileList.appendChild(titleBtn);
  tileList.appendChild(controlsBtn);
  tileList.appendChild(sideBtn);
  tileList.appendChild(disableBtn);

  // Main button
  const mainBtn = document.createElement("button");
  mainBtn.id = "yt-overlay-btn";
  mainBtn.textContent = "▶";
  mainBtn.title = "YouTube overlay";
  mainBtn.addEventListener("click", () => {
    const expanded = !overlayExpanded;
    setOverlayExpanded(expanded);
    tileList.classList.toggle("expanded", expanded);
    mainBtn.textContent = expanded ? "✕" : "▶";
  });

  overlayRoot.appendChild(tileList);
  overlayRoot.appendChild(mainBtn);
  columns.appendChild(overlayRoot);
}

export function removeOverlay() {
  const el = document.getElementById("yt-overlay-root");
  if (el) el.remove();
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
