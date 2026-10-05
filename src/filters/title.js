import { titleVisible, setTitleVisible } from "src/config";

let titleClone = null;
export let titleObserver = null;

function getSourceEl() {
  return document.querySelector("ytd-watch-metadata #title-row #title");
}

function showTitle() {
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(1)");
  const src = getSourceEl();
  if (!src) return;
  // Remove any stale clone first
  const old = document.getElementById("yt-cloned-title");
  if (old) old.remove();

  titleClone = document.createElement("div");
  titleClone.id = "yt-cloned-title";
  titleClone.textContent = src.textContent.trim();
  document.body.appendChild(titleClone);
  setTitleVisible(true);
  if (btn) btn.classList.add("active");
}

export function toggleTitle() {
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(1)");
  if (titleVisible) {
    removeClonedTitle();
    if (btn) btn.classList.remove("active");
  } else {
    showTitle();
  }
}

export function showTitleDefault() {
  // Always show regardless of current titleVisible state
  showTitle();
}

export function removeClonedTitle() {
  const el = document.getElementById("yt-cloned-title");
  if (el) el.remove();
  titleClone = null;
  setTitleVisible(false);
}

export function startTitleObserver() {
  if (titleObserver) titleObserver.disconnect();
  const src = getSourceEl();
  if (!src) return;

  titleObserver = new MutationObserver(() => {
    const el = document.getElementById("yt-cloned-title");
    if (el) el.textContent = src.textContent.trim();
  });
  titleObserver.observe(src, { childList: true, subtree: true, characterData: true });
}

export function stopTitleObserver() {
  if (titleObserver) { titleObserver.disconnect(); titleObserver = null; }
}
