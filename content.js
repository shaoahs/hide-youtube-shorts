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

    /* Fullscreen: #secondary lives inside #movie_player, overlay on the right */
    #movie_player #secondary[data-yt-fs-sidebar] {
      display: none !important;
      position: absolute !important;
      top: 0;
      right: 0;
      width: 380px;
      height: 100%;
      overflow-y: auto !important;
      overflow-x: hidden;
      z-index: 90;
      background: rgba(10, 10, 10, 0.92);
      box-sizing: border-box;
      padding-top: 8px;
    }
    #movie_player #secondary[data-yt-fs-sidebar].yt-side-visible {
      display: block !important;
    }

    /* Keep the fullscreen-grid expand button above the sidebar */
    #movie_player .ytp-fullscreen-grid {
      z-index: 91 !important;
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
      opacity: 1;
      transition: opacity 0.4s ease;
    }
    #yt-overlay-root.yt-overlay-hidden {
      opacity: 0;
      pointer-events: none !important;
    }
    /* pointer-events back on when visible */
    #yt-overlay-root:not(.yt-overlay-hidden) {
      pointer-events: none; /* root itself is passthrough; children opt-in */
    }

    /* Transparent hotzone at bottom-left — always present, catches mouseenter */
    #yt-overlay-hotzone {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 160px;
      height: 100px;
      z-index: 9998;
      pointer-events: all;
    }

    /* When overlay is reparented inside #movie_player during fullscreen,
       it needs to sit above all player UI layers. */
    #movie_player #yt-overlay-root {
      z-index: 99;
    }
    #movie_player #yt-overlay-hotzone {
      z-index: 98;
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
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5);
      transition: transform 0.15s, background 0.15s;
      user-select: none;
      padding: 0;
    }
    #yt-overlay-root .yt-tile svg {
      width: 22px;
      height: 22px;
      pointer-events: none;
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
      max-height: 320px;
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
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.6);
      transition: transform 0.2s, background 0.2s;
      user-select: none;
      padding: 0;
    }
    #yt-overlay-btn svg {
      width: 24px;
      height: 24px;
      pointer-events: none;
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

    /* Fullscreen: title inside player, position absolute */
    #movie_player #yt-cloned-title {
      position: absolute;
      z-index: 95;
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
	function getSourceEl() {
		return document.querySelector("ytd-watch-metadata #title-row #title");
	}
	function showTitle() {
		const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(1)");
		const src = getSourceEl();
		if (!src) return;
		const old = document.getElementById("yt-cloned-title");
		if (old) old.remove();
		titleClone = document.createElement("div");
		titleClone.id = "yt-cloned-title";
		titleClone.textContent = src.textContent.trim();
		const player = document.getElementById("movie_player");
		if (document.fullscreenElement && player) player.appendChild(titleClone);
		else document.body.appendChild(titleClone);
		setTitleVisible(true);
		if (btn) btn.classList.add("active");
	}
	function toggleTitle() {
		const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(1)");
		if (titleVisible) {
			removeClonedTitle();
			if (btn) btn.classList.remove("active");
		} else showTitle();
	}
	function showTitleDefault() {
		showTitle();
	}
	function removeClonedTitle() {
		const el = document.getElementById("yt-cloned-title");
		if (el) el.remove();
		titleClone = null;
		setTitleVisible(false);
	}
	function startTitleObserver() {
		if (titleObserver) titleObserver.disconnect();
		const src = getSourceEl();
		if (!src) return;
		titleObserver = new MutationObserver(() => {
			const el = document.getElementById("yt-cloned-title");
			if (el) el.textContent = src.textContent.trim();
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
	let _fsHandler = null;
	function getSecondary() {
		return document.querySelector("#secondary");
	}
	function getOriginalParent() {
		return document.querySelector("ytd-watch-flexy #columns #primary")?.parentElement ?? document.querySelector("ytd-watch-flexy #columns") ?? document.querySelector("ytd-watch-flexy");
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
	function toggleSidebar() {
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
	function hideSidebar() {
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
		setSidebarVisible(false);
		const btn = document.querySelector("#yt-tile-list .yt-tile:nth-child(3)");
		if (btn) btn.classList.remove("active");
		teardownFullscreenHandler();
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
		const svg = origBtn.querySelector("svg");
		if (svg) {
			svg.style.width = "28px";
			svg.style.height = "28px";
		}
		origBtn.style.display = "flex";
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
	const INITIAL_HIDE_DELAY = 6e3;
	const IDLE_HIDE_DELAY = 4e3;
	const ICONS = {
		title: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect x="2" y="8" width="20" height="8" rx="2" fill="currentColor"/>
  </svg>`,
		ctrl: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="3,5 3,19 12,12" fill="currentColor" stroke="none"/>
    <line x1="14" y1="12" x2="22" y2="12"/>
    <circle cx="18" cy="12" r="2" fill="currentColor" stroke="none"/>
  </svg>`,
		side: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="2" y="3" width="20" height="18" rx="2"/>
    <line x1="15" y1="3" x2="15" y2="21"/>
  </svg>`,
		orig: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect x="2" y="8" width="20" height="8" rx="4" fill="currentColor" opacity="0.4"/>
    <circle cx="16" cy="12" r="4" fill="currentColor"/>
  </svg>`,
		origOff: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect x="2" y="8" width="20" height="8" rx="4" fill="currentColor" opacity="0.4"/>
    <circle cx="8" cy="12" r="4" fill="currentColor"/>
  </svg>`,
		fullscreen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="15,3 21,3 21,9"/>
    <polyline points="9,21 3,21 3,15"/>
    <line x1="21" y1="3" x2="14" y2="10"/>
    <line x1="3" y1="21" x2="10" y2="14"/>
  </svg>`,
		exitFullscreen: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="4,14 10,14 10,20"/>
    <polyline points="20,10 14,10 14,4"/>
    <line x1="10" y1="14" x2="3" y2="21"/>
    <line x1="14" y1="10" x2="21" y2="3"/>
  </svg>`,
		menu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <line x1="4" y1="7"  x2="20" y2="7"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <line x1="4" y1="17" x2="20" y2="17"/>
  </svg>`,
		close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
    <line x1="5" y1="5" x2="19" y2="19"/>
    <line x1="19" y1="5" x2="5" y2="19"/>
  </svg>`
	};
	function makeBtn({ id, cls, icon, title: tipText, onClick }) {
		const btn = document.createElement("button");
		if (id) btn.id = id;
		if (cls) btn.className = cls;
		btn.title = tipText;
		btn.innerHTML = icon;
		btn.addEventListener("click", onClick);
		return btn;
	}
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
		const titleBtn = makeBtn({
			cls: "yt-tile",
			icon: ICONS.title,
			title: "Toggle title",
			onClick: toggleTitle
		});
		const controlsBtn = makeBtn({
			cls: "yt-tile",
			icon: ICONS.ctrl,
			title: "Toggle controls",
			onClick: toggleControls
		});
		const sideBtn = makeBtn({
			cls: "yt-tile",
			icon: ICONS.side,
			title: "Toggle sidebar",
			onClick: toggleSidebar
		});
		const disableBtn = makeBtn({
			cls: "yt-tile",
			icon: ICONS.orig,
			title: "Disable / Enable all hiding rules",
			onClick: toggleDisable
		});
		const fsBtn = makeBtn({
			cls: "yt-tile",
			icon: document.fullscreenElement ? ICONS.exitFullscreen : ICONS.fullscreen,
			title: "Toggle fullscreen",
			onClick: () => {
				if (document.fullscreenElement) document.exitFullscreen();
				else (document.getElementById("movie_player") ?? document.documentElement).requestFullscreen();
			}
		});
		tileList.appendChild(titleBtn);
		tileList.appendChild(controlsBtn);
		tileList.appendChild(sideBtn);
		tileList.appendChild(disableBtn);
		tileList.appendChild(fsBtn);
		const mainBtn = makeBtn({
			id: "yt-overlay-btn",
			icon: ICONS.menu,
			title: "YouTube overlay",
			onClick: () => {
				const expanded = !overlayExpanded;
				setOverlayExpanded(expanded);
				tileList.classList.toggle("expanded", expanded);
				mainBtn.innerHTML = expanded ? ICONS.close : ICONS.menu;
			}
		});
		overlayRoot.appendChild(tileList);
		overlayRoot.appendChild(mainBtn);
		const hotzone = document.createElement("div");
		hotzone.id = "yt-overlay-hotzone";
		let hideTimer = null;
		const showOverlay = () => {
			overlayRoot.classList.remove("yt-overlay-hidden");
		};
		const hideOverlay = () => {
			overlayRoot.classList.add("yt-overlay-hidden");
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
		hotzone.addEventListener("mouseenter", resetIdleTimer);
		overlayRoot.addEventListener("mouseenter", () => {
			showOverlay();
			clearTimeout(hideTimer);
		});
		overlayRoot.addEventListener("mouseleave", () => scheduleHide(IDLE_HIDE_DELAY));
		overlayRoot.addEventListener("click", () => scheduleHide(IDLE_HIDE_DELAY));
		scheduleHide(INITIAL_HIDE_DELAY);
		columns.appendChild(hotzone);
		columns.appendChild(overlayRoot);
		overlayRoot._hideTimer = () => clearTimeout(hideTimer);
		const onFullscreenChange = () => {
			const root = document.getElementById("yt-overlay-root");
			const hz = document.getElementById("yt-overlay-hotzone");
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
			fsBtn.innerHTML = document.fullscreenElement ? ICONS.exitFullscreen : ICONS.fullscreen;
		};
		document.addEventListener("fullscreenchange", onFullscreenChange);
		overlayRoot._fullscreenHandler = onFullscreenChange;
	}
	function removeOverlay() {
		const el = document.getElementById("yt-overlay-root");
		if (el) {
			if (el._hideTimer) el._hideTimer();
			if (el._fullscreenHandler) document.removeEventListener("fullscreenchange", el._fullscreenHandler);
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
			waitForElement("ytd-watch-metadata #title-row #title", () => {
				startTitleObserver();
				showTitleDefault();
			});
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