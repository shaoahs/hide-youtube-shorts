/** 共用狀態 */
export let overlayRoot = null;
export let overlayExpanded = false;
export let titleVisible = false;
export let controlsVisible = false;
export let sidebarVisible = false;
export let disabledMode = false;

export function setOverlayRoot(val) { overlayRoot = val; }
export function setOverlayExpanded(val) { overlayExpanded = val; }
export function setTitleVisible(val) { titleVisible = val; }
export function setControlsVisible(val) { controlsVisible = val; }
export function setSidebarVisible(val) { sidebarVisible = val; }
export function setDisabledMode(val) { disabledMode = val; }
