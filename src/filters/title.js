import { titleVisible, setTitleVisible } from "src/config";

let titleClone = null;
export let titleObserver = null;

export function toggleTitle() {
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(1)");
  if (titleVisible) {
    removeClonedTitle();
    if (btn) btn.classList.remove("active");
  } else {
    const src = document.querySelector("ytd-watch-metadata #title-row #title");
    if (!src) return;
    titleClone = document.createElement("div");
    titleClone.id = "yt-cloned-title";
    titleClone.textContent = src.textContent.trim();
    document.body.appendChild(titleClone);
    setTitleVisible(true);
    if (btn) btn.classList.add("active");
  }
}

export function removeClonedTitle() {
  const el = document.getElementById("yt-cloned-title");
  if (el) el.remove();
  titleClone = null;
  setTitleVisible(false);
}

export function startTitleObserver() {
  if (titleObserver) return;
  const src = document.querySelector("ytd-watch-metadata #title-row #title");
  if (!src) return;

  titleObserver = new MutationObserver(() => {
    const el = document.getElementById("yt-cloned-title");
    if (el && titleVisible) el.textContent = src.textContent.trim();
  });
  titleObserver.observe(src, { childList: true, subtree: true, characterData: true });
}

export function stopTitleObserver() {
  if (titleObserver) { titleObserver.disconnect(); titleObserver = null; }
}
