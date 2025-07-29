"use strict";
let config = {
    colors: {
      primary: "#BB2B2E",
      secondary: "#6d788d",
      success: "#72e128",
      info: "#26c6f9",
      warning: "#fdb528",
      danger: "#ff4d49",
      dark: "#4b4b4b",
      black: "#000",
      white: "#fff",
      cardColor: "#fff",
      bodyBg: "#f7f7f9",
      bodyColor: "#828393",
      headingColor: "#636578",
      textMuted: "#bbbcc4",
      borderColor: "#eaeaec",
    },
    colors_label: {
      primary: "#BB2B2E",
      secondary: "#6d788d29",
      success: "#72e12829",
      info: "#26c6f929",
      warning: "#fdb52829",
      danger: "#ff4d4929",
      dark: "#4b4b4b29",
    },
    enableMenuLocalStorage: 0,
  },
  assetsPath = document.documentElement.getAttribute("data-assets-path"),
  templateName = document.documentElement.getAttribute("data-template"),
  rtlSupport = 0;
"undefined" != typeof TemplateCustomizer &&
  (window.templateCustomizer = new TemplateCustomizer({
    cssPath: assetsPath + "vendor/css" + (!rtlSupport ? "/rtl" : "") + "/",
    themesPath: assetsPath + "vendor/css" + (!rtlSupport ? "/rtl" : "") + "/",
    displayCustomizer: 0,
    defaultShowDropdownOnHover: !0,
  }));
