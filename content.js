const style = document.createElement("style");
style.textContent = `
  /* Hide shorts */
  a[href^="/shorts"],
  ytd-rich-shelf-renderer[is-shorts],
  ytd-reel-shelf-renderer,
  ytd-short-shelf-renderer {
    display: none !important;
  }

  /* primary: hide #primary-inner */
  #primary-inner {
    display: none !important;
  }

  /* secondary: wrap horizontally */
  #secondary {
    display: flex !important;
    flex-wrap: wrap !important;
    gap: 8px !important;
  }
`;
document.head.appendChild(style);
