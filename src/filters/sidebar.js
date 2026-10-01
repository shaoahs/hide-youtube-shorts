import { sidebarVisible, setSidebarVisible } from "src/config";

export function toggleSidebar() {
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(3)");
  const secondary = document.querySelector("ytd-watch-flexy #secondary");
  if (!secondary) return;
  if (sidebarVisible) {
    secondary.classList.remove("yt-side-visible");
    setSidebarVisible(false);
    if (btn) btn.classList.remove("active");
  } else {
    secondary.classList.add("yt-side-visible");
    setSidebarVisible(true);
    if (btn) btn.classList.add("active");
  }
}

export function hideSidebar() {
  const secondary = document.querySelector("ytd-watch-flexy #secondary");
  if (secondary) secondary.classList.remove("yt-side-visible");
  setSidebarVisible(false);
  const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(3)");
  if (btn) btn.classList.remove("active");
}
