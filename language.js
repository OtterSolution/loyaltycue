(() => {
  "use strict";

  const STORAGE_KEY = "loyaltycue-language";
  const SUPPORTED = ["hu", "en"];

  function getInitialLanguage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.includes(saved)) return saved;
    } catch (_) {}

    const languages = navigator.languages && navigator.languages.length
      ? navigator.languages
      : [navigator.language || "en"];

    return languages.some(lang =>
      String(lang).toLowerCase().startsWith("hu")
    ) ? "hu" : "en";
  }

  function applyLanguage(lang, remember = false) {
    if (!SUPPORTED.includes(lang)) lang = "en";

    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-language", lang);

    document.querySelectorAll("[data-lang-button]").forEach(button => {
      const active = button.getAttribute("data-lang-button") === lang;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    const titles = {
      home: {
        hu: "LoyaltyCue",
        en: "LoyaltyCue"
      },
      privacy: {
        hu: "Adatvédelmi tájékoztató — LoyaltyCue",
        en: "Privacy Policy — LoyaltyCue"
      },
      support: {
        hu: "Támogatás — LoyaltyCue",
        en: "Support — LoyaltyCue"
      }
    };

    const page = document.body?.dataset.page || "home";
    if (titles[page]) document.title = titles[page][lang];

    if (remember) {
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
    }
  }

  window.setSiteLanguage = function (lang) {
    applyLanguage(lang, true);
  };

  function init() {
    applyLanguage(getInitialLanguage(), false);

    document.querySelectorAll("[data-lang-button]").forEach(button => {
      button.addEventListener("click", () => {
        applyLanguage(button.getAttribute("data-lang-button"), true);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();