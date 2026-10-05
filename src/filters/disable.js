import { disabledMode, setDisabledMode } from "src/config";
import { ICONS } from "src/overlay";

export function toggleDisable() {
  if (disabledMode) {
    enableAllRules();
  } else {
    disableAllRules();
  }
}

export function disableAllRules() {
  const el = document.getElementById("yt-overlay-style");
  if (el) el.disabled = true;
  setDisabledMode(true);

  // 隱藏主 overlay，顯示獨立 orig 按鈕
  const root = document.getElementById("yt-overlay-root");
  if (root) root.style.display = "none";

  let origBtn = document.getElementById("yt-orig-btn");
  if (!origBtn) {
    origBtn = document.createElement("button");
    origBtn.id = "yt-orig-btn";
    origBtn.title = "Enable all hiding rules";
    origBtn.style.cssText = `
      position: fixed;
      bottom: 32px;
      left: 32px;
      z-index: 9999;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: none;
      background: rgba(200, 50, 50, 0.9);
      color: #fff;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    `;
    origBtn.addEventListener("click", toggleDisable);
    document.body.appendChild(origBtn);
  }
  origBtn.innerHTML = ICONS.origOff;
  // size the SVG inside
  const svg = origBtn.querySelector("svg");
  if (svg) { svg.style.width = "28px"; svg.style.height = "28px"; }
  origBtn.style.display = "flex";
}

export function enableAllRules() {
  const el = document.getElementById("yt-overlay-style");
  if (el) el.disabled = false;
  setDisabledMode(false);

  const root = document.getElementById("yt-overlay-root");
  if (root) root.style.display = "";
  const origBtn = document.getElementById("yt-orig-btn");
  if (origBtn) origBtn.style.display = "none";
}
