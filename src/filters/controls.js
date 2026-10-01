import { controlsVisible, setControlsVisible } from "src/config";
import { getControlsStyleEl } from "src/styles";

const CONTROLS_CSS = `
  #movie_player > .ytp-chrome-bottom { display: block !important; }
  #movie_player .ytp-chrome-controls { display: flex !important; }
  #movie_player .ytp-progress-bar-container { display: block !important; }
`;

export function toggleControls() {
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(2)");
  const styleEl = getControlsStyleEl();
  if (controlsVisible) {
    styleEl.textContent = "";
    setControlsVisible(false);
    if (btn) btn.classList.remove("active");
  } else {
    styleEl.textContent = CONTROLS_CSS;
    setControlsVisible(true);
    if (btn) btn.classList.add("active");
  }
}

export function removeClonedControls() {
  const styleEl = document.getElementById("yt-controls-toggle-style");
  if (styleEl) styleEl.textContent = "";
  setControlsVisible(false);
}

export function enableControls() {
  const styleEl = getControlsStyleEl();
  styleEl.textContent = CONTROLS_CSS;
  setControlsVisible(true);
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(2)");
  if (btn) btn.classList.add("active");
}
