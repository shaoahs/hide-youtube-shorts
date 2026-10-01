(function() {

//#region src/styles.js
/** 注入全域樣式：隱藏 Shorts 連結與 shelf */
	function injectGlobalStyle() {
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
	}
	/** 注入 watch 頁樣式 */
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
      display: none !important;
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
      display: block !important;
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
      max-height: 260px;
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
		getControlsStyleEl();
	}
	/** 移除 watch 頁樣式 */
	function removeWatchStyle() {
		const el = document.getElementById("yt-overlay-style");
		if (el) el.remove();
		const ctrlEl = document.getElementById("yt-controls-toggle-style");
		if (ctrlEl) ctrlEl.remove();
	}
	/** 取得（或建立）controls toggle 用的 style 元素 */
	function getControlsStyleEl() {
		let el = document.getElementById("yt-controls-toggle-style");
		if (!el) {
			el = document.createElement("style");
			el.id = "yt-controls-toggle-style";
			document.head.appendChild(el);
		}
		return el;
	}

//#endregion
//#region src/config.js
/** 共用狀態 */
	let overlayRoot = null;
	let overlayExpanded = false;
	let titleVisible = false;
	let controlsVisible = false;
	let sidebarVisible = false;
	let disabledMode = false;
	function setOverlayRoot(val) {
		overlayRoot = val;
	}
	function setOverlayExpanded(val) {
		overlayExpanded = val;
	}
	function setTitleVisible(val) {
		titleVisible = val;
	}
	function setControlsVisible(val) {
		controlsVisible = val;
	}
	function setSidebarVisible(val) {
		sidebarVisible = val;
	}
	function setDisabledMode(val) {
		disabledMode = val;
	}

//#endregion
//#region src/filters/title.js
	let titleClone = null;
	let titleObserver = null;
	function toggleTitle() {
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
	function removeClonedTitle() {
		const el = document.getElementById("yt-cloned-title");
		if (el) el.remove();
		titleClone = null;
		setTitleVisible(false);
	}
	function startTitleObserver() {
		if (titleObserver) return;
		const src = document.querySelector("ytd-watch-metadata #title-row #title");
		if (!src) return;
		titleObserver = new MutationObserver(() => {
			const el = document.getElementById("yt-cloned-title");
			if (el && titleVisible) el.textContent = src.textContent.trim();
		});
		titleObserver.observe(src, {
			childList: true,
			subtree: true,
			characterData: true
		});
	}
	function stopTitleObserver() {
		if (titleObserver) {
			titleObserver.disconnect();
			titleObserver = null;
		}
	}

//#endregion
//#region src/filters/controls.js
	const CONTROLS_CSS = `
  #movie_player > .ytp-chrome-bottom { display: block !important; }
  #movie_player .ytp-chrome-controls { display: flex !important; }
  #movie_player .ytp-progress-bar-container { display: block !important; }
`;
	function toggleControls() {
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
	function removeClonedControls() {
		const styleEl = document.getElementById("yt-controls-toggle-style");
		if (styleEl) styleEl.textContent = "";
		setControlsVisible(false);
	}
	function enableControls() {
		const styleEl = getControlsStyleEl();
		styleEl.textContent = CONTROLS_CSS;
		setControlsVisible(true);
		const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(2)");
		if (btn) btn.classList.add("active");
	}

//#endregion
//#region src/filters/sidebar.js
	function toggleSidebar() {
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
	function hideSidebar() {
		const secondary = document.querySelector("ytd-watch-flexy #secondary");
		if (secondary) secondary.classList.remove("yt-side-visible");
		setSidebarVisible(false);
		const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(3)");
		if (btn) btn.classList.remove("active");
	}

//#endregion
//#region src/filters/disable.js
	function toggleDisable() {
		if (disabledMode) enableAllRules();
		else disableAllRules();
	}
	function disableAllRules() {
		const el = document.getElementById("yt-overlay-style");
		if (el) el.disabled = true;
		setDisabledMode(true);
		const root = document.getElementById("yt-overlay-root");
		if (root) root.style.display = "none";
		let origBtn = document.getElementById("yt-orig-btn");
		if (!origBtn) {
			origBtn = document.createElement("button");
			origBtn.id = "yt-orig-btn";
			origBtn.textContent = "orig";
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
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0,0,0,0.6);
    `;
			origBtn.addEventListener("click", toggleDisable);
			document.body.appendChild(origBtn);
		}
		origBtn.style.display = "flex";
		origBtn.style.alignItems = "center";
		origBtn.style.justifyContent = "center";
	}
	function enableAllRules() {
		const el = document.getElementById("yt-overlay-style");
		if (el) el.disabled = false;
		setDisabledMode(false);
		const root = document.getElementById("yt-overlay-root");
		if (root) root.style.display = "";
		const origBtn = document.getElementById("yt-orig-btn");
		if (origBtn) origBtn.style.display = "none";
	}

//#endregion
//#region src/overlay.js
	function buildOverlay() {
		if (document.getElementById("yt-overlay-root")) return;
		const columns = document.getElementById("columns");
		if (!columns) return;
		injectWatchStyle();
		const overlayRoot = document.createElement("div");
		overlayRoot.id = "yt-overlay-root";
		setOverlayRoot(overlayRoot);
		const tileList = document.createElement("div");
		tileList.id = "yt-tile-list";
		const titleBtn = document.createElement("button");
		titleBtn.className = "yt-tile";
		titleBtn.textContent = "title";
		titleBtn.title = "Toggle title";
		titleBtn.addEventListener("click", toggleTitle);
		const controlsBtn = document.createElement("button");
		controlsBtn.className = "yt-tile";
		controlsBtn.textContent = "ctrl";
		controlsBtn.title = "Toggle controls";
		controlsBtn.addEventListener("click", toggleControls);
		const sideBtn = document.createElement("button");
		sideBtn.className = "yt-tile";
		sideBtn.textContent = "side";
		sideBtn.title = "Toggle sidebar";
		sideBtn.addEventListener("click", toggleSidebar);
		const disableBtn = document.createElement("button");
		disableBtn.className = "yt-tile";
		disableBtn.textContent = "orig";
		disableBtn.title = "Disable / Enable all hiding rules";
		disableBtn.addEventListener("click", toggleDisable);
		tileList.appendChild(titleBtn);
		tileList.appendChild(controlsBtn);
		tileList.appendChild(sideBtn);
		tileList.appendChild(disableBtn);
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
	function removeOverlay() {
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

//#endregion
//#region src/index.js
	function isWatchPage() {
		return location.pathname === "/watch";
	}
	function waitForElement(selector, callback, timeout = 5e3) {
		if (document.querySelector(selector)) {
			callback();
			return;
		}
		const observer = new MutationObserver(() => {
			if (document.querySelector(selector)) {
				observer.disconnect();
				callback();
			}
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
		setTimeout(() => observer.disconnect(), timeout);
	}
	function onNavigate() {
		if (isWatchPage()) {
			waitForElement("#columns", () => {
				buildOverlay();
				enableControls();
			});
			waitForElement("ytd-watch-metadata #title-row #title", startTitleObserver);
		} else {
			stopTitleObserver();
			removeOverlay();
		}
	}
	injectGlobalStyle();
	document.addEventListener("yt-navigate-finish", onNavigate);
	onNavigate();

//#endregion
})();